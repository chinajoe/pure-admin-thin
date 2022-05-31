import { BaseClass, BaseQuery } from "../domain";
import { UploadFileInfo } from "/@/api/model/upload_file_info";

export interface CourseQuery extends BaseQuery {
  publishStatus?: number;
  courseName?: string;
}
export interface Course extends BaseClass {
  id: string;
  // 课程名称
  courseName: string;
  // 课程封面
  courseCover: UploadFileInfo;
  newCourseCover: UploadFileInfo;
  // 课程音频
  courseAudio: UploadFileInfo;
  newCourseAudio: UploadFileInfo;
  // 课程描述
  courseDescription: string;
  // 发布状态: 未发布，已发布
  publishStatus: number;
  // 发布时间
  publishTime: string;
  /**
   * 排序
   */
  sort: number;
}
