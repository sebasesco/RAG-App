from query_model import QueryModel
from rag.query_rag import query_rag

# The handler function serves as the entry point for AWS Lambda when an event is triggered.
# It receives the event (which contains the data), and the context (metadata about the Lambda invocation).
def handler(event, context):
    # This converts the event data into a structured format that the application can work with.
    query_item = QueryModel(**event)
    invoke_rag(query_item)

# This function handles the core logic of processing a query through the RAG model.
# It takes a `QueryModel` object, invokes the RAG model, and updates the query with the result.
def invoke_rag(query_item: QueryModel):
    rag_response = query_rag(query_item.query_text)
    query_item.answer_text = rag_response.response_text
    query_item.sources = rag_response.sources
    query_item.is_complete = True
    query_item.put_item()
    print(f"Item updated: {query_item}")
    return query_item

