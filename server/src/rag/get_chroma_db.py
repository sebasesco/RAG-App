import sys
import os
import shutil
from langchain_community.vectorstores import Chroma
from rag.get_embedding_function import get_embedding_function

#The path where the Chroma database is stored locally.
CHROMA_PATH = "data/chroma"
# If `IS_USING_IMAGE_RUNTIME` is set to true (in the environment variables), it means the code is running in a Docker image or AWS Lambda container.
IS_USING_IMAGE_RUNTIME = bool(os.environ.get("IS_USING_IMAGE_RUNTIME", False))
CHROMA_DB_INSTANCE = None

# Function to get the Chroma database instance.
def get_chroma_db():
    global CHROMA_DB_INSTANCE
    if not CHROMA_DB_INSTANCE:

        if IS_USING_IMAGE_RUNTIME:
            __import__("pysqlite3") # Dynamically import `pysqlite3` to replace `sqlite3`.
            sys.modules["sqlite3"] = sys.modules.pop("pysqlite3")
            # Copy the Chroma database to the `/tmp` directory (required in AWS Lambda environments).
            copy_chroma_to_tmp()

        CHROMA_DB_INSTANCE = Chroma(
            persist_directory=get_runtime_chroma_path(),
            embedding_function=get_embedding_function(),
        )
        print(f"Initialized {CHROMA_DB_INSTANCE} from {get_runtime_chroma_path()}")
    
    return CHROMA_DB_INSTANCE

# This function handles copying the Chroma database files from the local directory to `/tmp`.
# AWS Lambda only allows writing to the `/tmp` directory, so files need to be copied there for read/write access.
def copy_chroma_to_tmp():
    dst_chroma_path = get_runtime_chroma_path() # Get the destination path for the Chroma DB.

    # Check if the destination directory exists. If not, create it.
    if not os.path.exists(dst_chroma_path):
        os.makedirs(dst_chroma_path)

     # Check if the destination directory is empty.
    tmp_contents = os.listdir(dst_chroma_path)
    if len(tmp_contents) == 0:
        print(f"Copying ChromaDB from {CHROMA_PATH} to {dst_chroma_path}")
        os.makedirs(dst_chroma_path, exist_ok=True)
        #Recursively copy the Chroma database files.
        shutil.copytree(CHROMA_PATH, dst_chroma_path, dirs_exist_ok=True)
    else:
        print(f"ChromaDB already exists in {dst_chroma_path}")

# This function returns the correct path to use for the Chroma DB depending on the environment.
def get_runtime_chroma_path():
    if IS_USING_IMAGE_RUNTIME:
        return f"/tmp/{CHROMA_PATH}"
    else:
        return CHROMA_PATH