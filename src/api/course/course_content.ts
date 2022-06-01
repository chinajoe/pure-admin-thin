import BaseRequest from "../base";

enum API {
  BASE_URL = "/course/content",
  detail = "/detail",
  upload = "/upload"
}

class PostAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }

  detail<T>(params?: any): Promise<T> {
    return this.get<T>(API.detail, params);
  }

  uploadFile(files: any[]): Promise<string> {
    return this.uploadFileRequest<string>(API.upload, files);
  }
}

export const courseContentApi = new PostAPI();
