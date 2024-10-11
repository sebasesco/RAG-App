from dataclasses import dataclass
from typing import List
from langchain.prompts import ChatPromptTemplate
from langchain_aws import ChatBedrock
from rag.get_chroma_db import get_chroma_db

# This is the template for how prompts are structured when querying the language model.
# It includes the context (retrieved from the Chroma DB) and the question the model needs to answer.
PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

BEDROCK_MODEL_ID = "mistral.mistral-7b-instruct-v0:2"

#Define a data structure for the response from the RAG (Retrieval-Augmented Generation) query.
@dataclass
class QueryResponse:
    query_text: str
    response_text: str
    sources: List[str]

#This function handles querying the Retrieval-Augmented Generation (RAG) system.
def query_rag(query_text: str) -> QueryResponse:
    #Retrieve the Chroma database.
    db = get_chroma_db()

    #Perform a similarity search on the database to retrieve the top 3 most relevant documents based on the query.
    results = db.similarity_search_with_score(query_text, k=3)
    #Combine the content of the top 3 retrieved documents into a single context for the model prompt.
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    #Use a template to structure the prompt that will be sent to the language model.
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    #Format the prompt with the retrieved context and the original query.
    prompt = prompt_template.format(context=context_text, question=query_text)
    print(prompt)

    model = ChatBedrock(model_id=BEDROCK_MODEL_ID)
    #Invoke the model using the constructed prompt and retrieve the response.
    response = model.invoke(prompt)
    response_text = response.content

    #Extract the sources (document IDs) from the results to include in the response.
    sources = [doc.metadata.get("id", None) for doc, _score in results]
    print(f"Response: {response_text}\nSources: {sources}")

    return QueryResponse(
        query_text=query_text, response_text=response_text, sources=sources
    )

#For local testing purposes
if __name__ == "__main__":
    query_rag("What is an option?")