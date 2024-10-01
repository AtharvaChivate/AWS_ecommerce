# Backend Architecture using AWS

This project demonstrates a serverless architecture for an e-commerce platform deployed on AWS. It utilizes several AWS services, including Lambda, API Gateway, SQS, ECS, DynamoDB, and S3 to create a scalable and efficient solution. The system is designed to handle order processing, invoice generation, and email notifications automatically.

## Table of Contents
- [System Workflow](#system-workflow)
- [AWS Services Used](#aws-services-used)
  - [Amazon API Gateway](#amazon-api-gateway)
  - [AWS Lambda](#aws-lambda)
  - [Amazon SQS](#amazon-sqs)
  - [Amazon S3](#amazon-s3)
  - [Amazon DynamoDB](#amazon-dynamodb)
  - [Amazon ECS and ECR](#amazon-ecs-and-ecr)
  - [Amazon CloudWatch](#amazon-cloudwatch)
- [Deployment](#deployment)
- [Testing](#testing)
  
## System Workflow

The system follows a simple workflow from the checkout process to email notification:

1. **Checkout Process**: 
   - A user selects an item and proceeds to checkout.
   - The checkout process triggers an API call to the backend through **Amazon API Gateway**.

2. **Order Processing**: 
   - API Gateway routes the request to an **Order Processing Lambda Function**, which collects user details, order data, and payment information.
   - The Lambda function places the order data in an **Amazon SQS Queue** for further processing.

3. **Invoice Generation**: 
   - An **Invoice Generator Microservice** running on **Amazon ECS** pulls messages from the SQS queue, processes the order, generates an invoice, and stores it in **Amazon S3**.
   - Invoice metadata (order details, invoice link) is saved in **Amazon DynamoDB**.

4. **Email Notification**:
   - Once the invoice is generated, another Lambda function is triggered to send an email notification to the user, including the invoice link.

The entire architecture is designed to be scalable, highly available, and fully serverless, ensuring that resources are efficiently managed.

## AWS Services Used

### Amazon API Gateway
API Gateway acts as the entry point for the e-commerce platform, exposing REST API endpoints to external clients. The API is used for handling user requests such as placing orders. It provides:
- **Authentication** using Cognito.
- **Proxy integration** to pass data directly to Lambda functions.
- **Multiple deployment stages** (dev, testing, production) for smooth development workflows.

### AWS Lambda
Lambda functions handle critical operations in the architecture. These include:
- **Order Processing**: Collects user details and stores order data in SQS.
- **Email Notification**: Sends a confirmation email to users once an order is processed and the invoice is ready.

Lambda is used for its cost-efficiency and ability to handle short-lived tasks.

### Amazon SQS
SQS (Simple Queue Service) decouples the order processing and invoice generation services:
- **Queue-based communication** ensures reliable message passing between the Lambda functions and ECS tasks.
- **Scaling**: The system can scale based on the number of messages in the queue.

### Amazon S3
S3 is used for storing the generated invoices:
- **Durable storage** for long-term access to invoice PDFs.
- **Event-driven**: Triggers email notification Lambda function when a new invoice is uploaded.

### Amazon DynamoDB
DynamoDB is used for storing metadata related to the orders and invoices:
- **High-speed NoSQL database** for storing order statuses and links to invoices.
- **Interacts with Lambda functions** for fast retrieval of order information.

### Amazon ECS and ECR
**Amazon ECS (Elastic Container Service)** is used to deploy the invoice generation service:
- **ECS with Fargate** allows serverless container deployment, which eliminates the need to manage EC2 instances.
- **ECR (Elastic Container Registry)** is used to store Docker images for the invoice generator microservice.

### Amazon CloudWatch
CloudWatch is used to monitor and scale services:
- **Alarms** monitor the number of messages in the SQS queue and trigger automatic scaling for the ECS services.
- **Logs** allow detailed monitoring of Lambda function executions and ECS tasks.

## Deployment

### Prerequisites
1. AWS account with access to Lambda, API Gateway, SQS, ECS, S3, DynamoDB, and CloudWatch.
2. AWS CLI configured on your local machine.

### Steps
1. **API Gateway**: Create the API endpoints to trigger Lambda functions.
2. **Lambda Functions**: Deploy the order processing and email notification Lambda functions.
3. **SQS Queue**: Set up the SQS queue to handle order messages.
4. **ECS & ECR**: Build the Docker image for the invoice generator microservice, push it to ECR, and deploy the service in ECS.
5. **S3 & DynamoDB**: Create an S3 bucket for storing invoices and a DynamoDB table for storing metadata.
6. **CloudWatch Alarms**: Set up auto-scaling alarms based on the SQS queue.

## Testing

### API Testing
1. Use **Postman** to trigger the checkout process via the API Gateway endpoint.
2. Verify that the order is being processed and added to the SQS queue.

### ECS Testing
1. Monitor the ECS task logs to ensure the invoice generator is working correctly.
2. Verify that invoices are being generated and stored in the S3 bucket.

### Email Notification Testing
1. Check if the email notification Lambda function is triggered upon invoice creation.
2. Confirm that the email contains the correct invoice link.

---

By following this structure, you will have a fully operational serverless architecture for an e-commerce platform on AWS. Each service has been optimized for scalability and efficiency.
