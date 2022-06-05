import BaseRequest from "../base";

enum API {
  BASE_URL = "/course/file"
}

class PostAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
}

export const courseFileApi = new PostAPI();
