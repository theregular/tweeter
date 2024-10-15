import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
import { ChangeEvent } from "react";

export interface RegisterProfile {
  firstName: string;
  lastName: string;
  alias: string;
  password: string;
  imageBytes: Uint8Array;
  imageFileExtension: string;
}

export interface RegisterView {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  navigate: (path: string) => void;
  displayErrorMessage: (message: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
}

export class RegisterPresenter {
  public isLoading = false;
  private service: UserService;
  private view: RegisterView;
  public imageUrl: string = "";
  public imageFileExtension: string = "";

  public constructor(view: RegisterView) {
    this.service = new UserService();
    this.view = view;
  }

  handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    this.handleImageFile(file);
  }

  handleImageFile(file: File | undefined) {
    if (file) {
      this.imageUrl = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.imageFileExtension = fileExtension;
      }
    } else {
      this.imageUrl = "";
      this.view.setImageBytes(new Uint8Array());
    }
  }

  getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };

  async doRegister(userProfile: RegisterProfile, rememberMe: boolean) {
    try {
      this.isLoading = true;

      const [user, authToken] = await this.service.register(
        userProfile.firstName,
        userProfile.lastName,
        userProfile.alias,
        userProfile.password,
        userProfile.imageBytes,
        userProfile.imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this.isLoading = false;
    }
  }
}
