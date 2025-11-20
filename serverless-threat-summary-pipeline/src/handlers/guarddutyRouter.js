// src/handlers/guarddutyRouter.js

import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";

const sfnClient = new SFNClient({});

/**
 * EventBridge handler for GuardDuty findings.
 * - Filters high-severity findings (handled at EventBridge pattern level too)
 * - Starts a Step Functions state machine execution with the finding as input
 */
export const handler = async (event) => {
  console.log("Received GuardDuty event:", JSON.stringify(event, null, 2));

  const stateMachineArn = process.env.STATE_MACHINE_ARN;
  if (!stateMachineArn) {
    console.error("STATE_MACHINE_ARN not set");
    throw new Error("STATE_MACHINE_ARN environment variable is required");
  }

  // GuardDuty findings are in event.detail
  const finding = event.detail || {};

  const input = {
    finding,
    metadata: {
      receivedAt: new Date().toISOString(),
      source: "guarddutyRouter",
    },
  };

  const command = new StartExecutionCommand({
    stateMachineArn,
    input: JSON.stringify(input),
  });

  try {
    const response = await sfnClient.send(command);
    console.log("Started Step Functions execution:", response.executionArn);
    return {
      statusCode: 200,
      body: JSON.stringify({ executionArn: response.executionArn }),
    };
  } catch (err) {
    console.error("Failed to start execution:", err);
    throw err;
  }
};