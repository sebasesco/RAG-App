FROM public.ecr.aws/lambda/python:3.11

COPY requirements.txt ${LAMBDA_TASK_ROOT}

RUN pip install pysqlite3-binary

RUN pip install -r requirements.txt --upgrade

EXPOSE 8000

ENV IS_USING_IMAGE_RUNTIME=True

COPY src/* ${LAMBDA_TASK_ROOT}
COPY src/rag ${LAMBDA_TASK_ROOT}/rag
COPY src/data/chroma ${LAMBDA_TASK_ROOT}/data/chroma
