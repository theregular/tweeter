import { StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async function (event: any) {
  const service = new StatusService();
  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    const status: StatusDto = JSON.parse(body).status;
    const followers: string[] = JSON.parse(body).followers;
    console.log("STATUS RECEIVED:", status);
    console.log("FOLLOWERS RECEIVED:", followers);
    await service.updateFeeds(status, followers);
  }
  return null;
};
