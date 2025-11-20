# serverless-threat-summary-pipeline

GuardDuty → EventBridge → Lambda → Step Functions → Amazon Bedrock → SNS  
Automatically summarises high-severity AWS GuardDuty findings with an LLM and emails a human-readable summary.

This project is designed to showcase:

- Practical use of the **Serverless Framework**
- **Event-driven** serverless architectures on AWS
- **Step Functions** orchestration
- Integration with **Amazon Bedrock** (LLM) from Lambda
- Focus on **Developer Experience (DX)** and clear operational flows

---

## Architecture Overview

At a high level:

1. **GuardDuty** detects a high-severity threat and emits a **finding**.  
2. **EventBridge** routes the finding to a **Lambda** function (`guarddutyRouter`).  
3. `guarddutyRouter` starts an **AWS Step Functions** state machine execution.  
4. The state machine invokes another **Lambda** function (`bedrockSummarizer`).  
5. `bedrockSummarizer` calls **Amazon Bedrock** to generate a plain-English summary.  
6. The summary is published to an **SNS topic**, which sends an **email** to subscribers.

---

## Sequence Diagram (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    participant GD as GuardDuty
    participant EB as EventBridge
    participant LR as Lambda<br/>(guarddutyRouter)
    participant SFN as Step Functions
    participant LS as Lambda<br/>(bedrockSummarizer)
    participant BR as Amazon Bedrock
    participant SNS as Amazon SNS
    participant U as Email Recipient

    GD->>EB: Emit finding (severity ≥ 7)
    EB->>LR: Invoke with finding event
    LR->>SFN: StartExecution(input: finding)
    SFN->>LS: Invoke task with finding
    LS->>BR: InvokeModel(prompt with finding details)
    BR-->>LS: Return LLM-generated summary
    LS->>SNS: Publish(summary as email message)
    SNS-->>U: Deliver email notification
