import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import {
  DockerImageFunction,
  DockerImageCode,
  FunctionUrlAuthType,
  Architecture,
} from "aws-cdk-lib/aws-lambda";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";

export class RagCdkInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a DynamoDB table for storing query results.
    const ragQueryTable = new Table(this, "RagQueryTable", {
      partitionKey: { name: "query_id", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    // Define the Docker image for the worker Lambda function.
    // This Lambda will handle background tasks, such as processing queries asynchronously.
    const workerImageCode = DockerImageCode.fromImageAsset("../server", {
      cmd: ["app_work_handler.handler"],
      buildArgs: {
        platform: "linux/amd64",
      },
    });

    // Define the worker Lambda function that uses the Docker image.
    const workerFunction = new DockerImageFunction(this, "RagWorkerFunction", {
      code: workerImageCode,
      memorySize: 512,
      timeout: cdk.Duration.seconds(60),
      architecture: Architecture.X86_64,
      environment: {
        TABLE_NAME: ragQueryTable.tableName,
      },
    });

    // Define the Docker image for the API Lambda function.
    // This function will handle API requests from external clients.
    const apiImageCode = DockerImageCode.fromImageAsset("../server", {
      cmd: ["app_api_handler.handler"],
      buildArgs: {
        platform: "linux/amd64",
      },
    });
    
    // Define the API Lambda function that uses the Docker image.
    const apiFunction = new DockerImageFunction(this, "ApiFunc", {
      code: apiImageCode,
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      architecture: Architecture.X86_64,
      environment: {
        TABLE_NAME: ragQueryTable.tableName,
        WORKER_LAMBDA_NAME: workerFunction.functionName,
      },
    });

    // Create a Function URL for the API Lambda function to allow it to be accessed via HTTP.
    const functionUrl = apiFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    // Grants accesses to the functions
    ragQueryTable.grantReadWriteData(workerFunction);
    ragQueryTable.grantReadWriteData(apiFunction);
    workerFunction.grantInvoke(apiFunction);
    // Add an IAM policy to the worker Lambda to grant access to Amazon Bedrock (AI service).
    workerFunction.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonBedrockFullAccess")
    );

    // Output the API function URL in the CloudFormation stack outputs for easy access.
    new cdk.CfnOutput(this, "FunctionUrl", {
      value: functionUrl.url,
    });
  }
}
