export interface View {
  displayErrorMessage: (message: string) => void;
}

export class Presenter<V extends View> {
  private _view: V;
  public _isLoading = false;

  protected constructor(view: V) {
    this._view = view;
  }

  public get isLoading() {
    return this._isLoading;
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;
  }

  protected get view(): V {
    return this._view;
  }

  async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    finallyOperation?: () => void
  ) {
    try {
      //console.log("****DOING OPERATION: ", operation);
      await operation();
    } catch (error) {
      //console.log("****ERROR STACK: ", (error as Error).stack);
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${
          (error as Error).message
        }`
      );
    } finally {
      this._isLoading = false;
      if (!!finallyOperation) {
        finallyOperation();
      }
    }
  }
}
