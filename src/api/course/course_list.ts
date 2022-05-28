import BaseRequest from "../base";
enum API {
  BASE_URL = "/course/orchestrate",
  list = "/list",
  add = "/add"
}
class PostAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }
}

export const courseApi = new PostAPI();
