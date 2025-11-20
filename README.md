# serverless-devops-automation-kit

Production-style serverless automation patterns for AWS, focused on:

- **Developer Experience (DX)**
- **Serverless architectures**
- **Infrastructure-as-Code**
- **AI-assisted operations**

This repo showcases how I design, build, and operate event-driven systems with the **Serverless Framework**, **AWS Lambda**, **Step Functions**, **CloudWatch**, **GuardDuty**, and **Amazon Bedrock**.

---

## Why I Built This Repo

I built this repo to demonstrate how I think and work as an engineer for teams that:

- Care deeply about **developer experience**
- Prefer **serverless, event-driven architectures**
- Use **Infrastructure-as-Code** for everything
- Value **automation, observability, and security**

Most of the patterns here come from real-world problems I’ve solved as an AWS Solutions Architect and Cloud Infrastructure engineer: threat detection, automated summarisation, cost analytics, and DevOps workflows.

This repo is intentionally structured to reflect the kind of work I’d like to do more of:  
**building tools and frameworks that make other developers faster, safer, and happier.**

---

## Projects

### 1. `serverless-threat-summary-pipeline/`

> GuardDuty → EventBridge → Lambda → Step Functions → Amazon Bedrock → SNS  
> Automatically summarises high-severity threats in plain English and emails them to humans.

**Highlights:**

- Serverless Framework deployment
- Step Functions orchestration
- Amazon Bedrock integration from Lambda
- DX-focused: clear logging, local dev hints, and test scaffolding

### 2. [cost-per-transaction-pipeline](./cost-per-transaction-pipeline)

> Uses CloudWatch Logs + Lambda + Glue to compute cost-per-transaction metrics for database workloads.

**Highlights:**

- Pattern for cost observability
- Good candidate for CloudWatch Logs Insights + ETL

### 3. [cost-per-transaction-pipeline](./devops-utility-lambdas)

> Small, focused Lambdas that automate operational work (tag enforcement, drift detection, notifications).

### 4. `cli-tools/` (skeleton)

> CLI utilities (Node.js/TypeScript) to improve workflows around IAM policies, log queries, and project bootstrapping.

### 5. `iac-examples/` (skeleton)

> Shows the same simple stack expressed in **Serverless Framework**, **CloudFormation**, **Terraform**, or **CDK**.

---

## Tech Stack

- **Languages**: Node.js, JavaScript, Python
- **AWS**: Lambda, Step Functions, EventBridge, SNS, GuardDuty, CloudWatch, Bedrock
- **IaC**: Serverless Framework, CloudFormation, Terraform (planned), CDK (planned)
- **CI/CD**: GitHub Actions

---

## Local Development

Each sub-project includes its own README and instructions.

At a high level:

```bash
# Example: threat summary pipeline
cd serverless-threat-summary-pipeline
npm install
npm test            # run tests (once you add more)
serverless deploy   # deploy to your AWS account
