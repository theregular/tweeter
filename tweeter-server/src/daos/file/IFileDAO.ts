export interface IFileDAO {
  putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
}
