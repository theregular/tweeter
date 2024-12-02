import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

export class FileDAOS3 {
  readonly BUCKET = "ben340bucket";
  readonly REGION = "us-west-2";
  readonly FOLDER = "image/";

  private client = new S3Client({ region: this.REGION });

  async putImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );
    const s3Params = {
      Bucket: this.BUCKET,
      Key: this.FOLDER + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);

    try {
      await this.client.send(c);
      return `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }

  async deleteAll() {
    try {
      // Step 1: List all objects in the folder
      const listParams = {
        Bucket: this.BUCKET,
        Prefix: this.FOLDER, // Prefix filters objects within the folder
      };

      const listedObjects = await this.client.send(
        new ListObjectsV2Command(listParams)
      );

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        console.log("No objects found in the specified folder.");
        return;
      }

      // Step 2: Delete all objects in the folder
      const deleteParams = {
        Bucket: this.BUCKET,
        Delete: {
          Objects: listedObjects.Contents.map((object) => ({
            Key: object.Key,
          })),
        },
      };

      await this.client.send(new DeleteObjectsCommand(deleteParams));
      console.log(
        "All files in the" + this.FOLDER + " folder have been deleted."
      );
    } catch (error) {
      throw new Error("S3 delete all failed with: " + error);
    }
  }
}
