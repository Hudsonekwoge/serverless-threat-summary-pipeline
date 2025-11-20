// tests/smoke-test.js
import { handler as routerHandler } from "../src/handlers/guarddutyRouter.js";

(async () => {
  console.log("Running smoke test for guarddutyRouter…");

  const fakeEvent = {
    detail: {
      title: "Test finding",
      description: "This is a test finding",
      severity: 7,
      resource: { instanceDetails: { instanceId: "i-1234567890" } }
    }
  };

  process.env.STATE_MACHINE_ARN = "arn:aws:states:us-east-1:111122223333:stateMachine:fake";

  try {
    const result = await routerHandler(fakeEvent);
    console.log("Smoke test passed:", result);
  } catch (err) {
    console.error("Smoke test failed (expected in local without AWS):", err.message);
  }
})();
