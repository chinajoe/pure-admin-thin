import { BaseClass, BaseQuery } from "../domain";

export interface CourseFileQuery extends BaseQuery {
  latestDays?: number;
}

export interface CourseFileInfo extends BaseClass {
  id: string;
  title: string;
  description: string;
  content: string;
  /**
   * 排序
   */
  sort: number;
}
