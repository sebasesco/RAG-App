import uvicorn
import boto3
import json
import os
from fastapi import FastAPI
from mangum import Mangum
from pydantic import BaseModel
from query_model import QueryModel
from rag.query_rag import QueryResponse, query_rag

# Retrieves the name of the Lambda function from the environment variables.
WORKER_LAMBDA_NAME = os.environ.get("WORKER_LAMBDA_NAME", None)

app = FastAPI()
handler = Mangum(app) #Makes the app compatible with AWS API Gateway + Lambda

# Pydantic model that defines the structure of the input request for the /submit_query endpoint.
class SubmitQueryRequest(BaseModel):
    query_text: str

#Test endpoint for basic sanity check.
@app.get("/")
def index():
    return {"Hello": "World"}

# Get query details based on a query ID.
@app.get("/get_query")
def get_query_endpoint(query_id: str) -> QueryModel:
    query = QueryModel.get_item(query_id)
    return query

# Endpoint to submit a query.
# This handles both synchronous and asynchronous processing of queries, depending on whether the worker Lambda is set.
@app.post("/submit_query")
def submit_query_endpoint(request: SubmitQueryRequest) -> QueryModel:
    # Create a new query model with the text provided in the request
    new_query = QueryModel(query_text=request.query_text)

    # If a worker Lambda function is defined, use it for asynchronous processing.
    if WORKER_LAMBDA_NAME:
        new_query.put_item() # Save the new query in the database
        invoke_worker(new_query) # Trigger the worker Lambda to process the query asynchronously
    else:
        # If no worker Lambda is defined, process the query synchronously.
        query_response = query_rag(request.query_text)
        new_query.answer_text = query_response.response_text
        new_query.sources = query_response.sources
        new_query.is_complete = True
        new_query.put_item()
    
    return new_query

# Function to invoke the worker Lambda for asynchronous query processing.
# The worker will process the query in the background.
def invoke_worker(query: QueryModel):
    lambda_client = boto3.client("lambda")

    payload = query.model_dump()

    response = lambda_client.invoke(
        FunctionName=WORKER_LAMBDA_NAME,
        InvocationType="Event",
        Payload=json.dumps(payload),
    )

    print(f"Worker Lambda Invoked: {response}")

if __name__ == "__main__":
    port = 8000
    print(f"Running server on port {port}")
    uvicorn.run("app_api_handler:app", host="0.0.0.0", port=port)