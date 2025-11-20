#!/bin/bash

# --- Create Main Directories ---

echo "Creating main directories..."
mkdir -p serverless-threat-summary-pipeline/stateMachines
mkdir -p serverless-threat-summary-pipeline/src/handlers
mkdir -p cost-per-transaction-pipeline
mkdir -p devops-utility-lambdas
mkdir -p cli-tools
mkdir -p iac-examples
mkdir -p .github/workflows

# --- Create Files ---

echo "Creating files..."
# Top level README
touch README.md

# serverless-threat-summary-pipeline files
touch serverless-threat-summary-pipeline/serverless.yml
touch serverless-threat-summary-pipeline/stateMachines/threatSummaryWorkflow.asl.json
touch serverless-threat-summary-pipeline/src/handlers/guarddutyRouter.js
touch serverless-threat-summary-pipeline/src/handlers/bedrockSummarizer.js

# Sub-repository README files
touch cost-per-transaction-pipeline/README.md
touch devops-utility-lambdas/README.md
touch cli-tools/README.md
touch iac-examples/README.md

# GitHub workflow file
touch .github/workflows/ci.yml

echo "Directory structure created successfully!"
