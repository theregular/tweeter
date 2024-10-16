export interface View {
  displayErrorMessage: (message: string) => void;
}

export class Presenter<V extends View> {
  private _view: V;
  public isLoading = false;

  protected constructor(view: V) {
    this._view = view;
  }

  protected get view(): V {
    return this._view;
  }

  async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    } finally {
      this.isLoading = false;
    }
  }
}
