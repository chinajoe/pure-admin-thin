import BaseRequest from "../base";

enum API {
  BASE_URL = "/course/prepare",
  export = "/export"
}

class PostAPI extends BaseRequest {
  getBaseUrl(): string {
    return API.BASE_URL;
  }

  export<T>(params?: any): Promise<T> {
    return this.post<T>(API.export, params);
  }
}

export const coursePrepareApi = new PostAPI();
