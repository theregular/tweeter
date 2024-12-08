import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { ISQSDAO } from "./ISQSDAO";
import { StatusDto } from "tweeter-shared";

export class SQSDAOAWS implements ISQSDAO {
  private readonly client = new SQSClient({ region: "us-west-2" });
  private readonly statusQueueUrl =
    "https://sqs.us-west-2.amazonaws.com/615299743391/tweeter-post-status";
  private readonly feedQueueUrl = "";

  async postStatus(status: StatusDto): Promise<void> {
    const messageBody = JSON.stringify({
      status: status,
    });
    await this.sendMessage(messageBody, this.statusQueueUrl);
  }

  async updateFeed(status: StatusDto, followers: string[]): Promise<void> {
    const messageBody = JSON.stringify({
      status: status,
      followers: followers,
    });
    await this.sendMessage(messageBody, this.feedQueueUrl);
  }

  private async sendMessage(body: string, url: string) {
    const params = {
      DelaySeconds: 10,
      MessageBody: body,
      QueueUrl: url,
    };

    try {
      const data = await this.client.send(new SendMessageCommand(params));
    } catch (err) {
      throw err;
    }
  }
}
