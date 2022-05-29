import BaseRequest from "../base";

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

  uploadFile(files: any[]): Promise<string> {
    return this.uploadFileRequest<string>(API.upload, files);
  }
}

export const courseApi = new PostAPI();
