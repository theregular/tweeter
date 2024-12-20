import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
  setPost: (post: string) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined
  ) => void;
  clearLastInfoMessage: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private service: StatusService | null = null;
  // public post: string = "";

  constructor(view: PostStatusView) {
    super(view);
  }

  public get statusService() {
    if (this.service == null) {
      this.service = new StatusService();
    }
    return this.service;
  }

  async submitPost(
    event: React.MouseEvent,
    authToken: AuthToken,
    currentUser: User,
    post: string
  ) {
    event.preventDefault();
    await this.doFailureReportingOperation(
      async () => {
        this.isLoading = true;
        this.view.displayInfoMessage("Posting status...", 0);

        const status = new Status(post, currentUser!, Date.now());

        await this.statusService.postStatus(authToken!, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      this.view.clearLastInfoMessage
    );
  }

  clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    this.view.setPost("");
  };
}
