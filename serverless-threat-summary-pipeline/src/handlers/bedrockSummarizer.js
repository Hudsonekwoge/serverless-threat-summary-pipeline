// src/handlers/bedrockSummarizer.js

import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const snsClient = new SNSClient({});
const bedrockClient = new BedrockRuntimeClient({});

/**
 * Step Functions Task Lambda:
 * - Receives { finding, metadata }
 * - Calls Amazon Bedrock to summarise the finding in plain English
 * - Publishes the summary to SNS
 */
export const handler = async (event) => {
  console.log("Summariser received event:", JSON.stringify(event, null, 2));

  const snsTopicArn = process.env.SNS_TOPIC_ARN;
  const modelId = process.env.BEDROCK_MODEL_ID;
  const region = process.env.AWS_REGION;

  if (!snsTopicArn || !modelId || !region) {
    throw new Error("SNS_TOPIC_ARN, BEDROCK_MODEL_ID, and AWS_REGION must be set");
  }

  const finding = event.finding || {};
  const title = finding.title || "GuardDuty Finding";
  const description = finding.description || "No description provided.";
  const severity = finding.severity || "N/A";
  const resource = finding.resource || {};

  const prompt = buildPrompt({ title, description, severity, resource });

  const bedrockResponse = await callBedrock(modelId, prompt);
  const summary = extractTextFromBedrockResponse(bedrockResponse);

  console.log("Generated summary:", summary);

  await publishToSns(snsTopicArn, {
    subject: `AI Summary – GuardDuty Finding (Severity ${severity})`,
    message: summary,
  });

  return {
    status: "ok",
    summary,
  };
};

function buildPrompt({ title, description, severity, resource }) {
  return `
You are a cybersecurity assistant.

Summarise the following AWS GuardDuty finding in clear, concise language suitable for a busy executive.
Explain:
- What happened
- Why it matters
- Potential business impact
- Recommended next steps (3–5 bullet points)

Finding:
Title: ${title}
Severity: ${severity}
Description: ${description}
Resource: ${JSON.stringify(resource)}
`;
}

async function callBedrock(modelId, prompt) {
  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 500,
    temperature: 0.2,
    messages: [
      { role: "user", content: [{ type: "text", text: prompt }] }
    ],
  });

  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body,
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody;
}

function extractTextFromBedrockResponse(responseBody) {
  // Simple helper for Anthropic-style responses
  const content = responseBody?.content || [];
  const textPart = content.find((c) => c.type === "text");
  return textPart?.text || "No summary generated.";
}

async function publishToSns(topicArn, { subject, message }) {
  const command = new PublishCommand({
    TopicArn: topicArn,
    Subject: subject,
    Message: message,
  });

  const result = await snsClient.send(command);
  console.log("Published to SNS:", result.MessageId);
}