import BaseRequest from "../base";
import { UploadFileInfo } from "/@/api/model/upload_file_info";

enum API {
  BASE_URL = "/course/orchestrate",
  list = "/list",
  add = "/add",
  upload = "/upload"
}

class PostAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }

  uploadFile(files: any[]): Promise<Array<UploadFileInfo>> {
    return this.uploadFileRequest<Array<UploadFileInfo>>(API.upload, files);
  }
}

export const courseApi = new PostAPI();
