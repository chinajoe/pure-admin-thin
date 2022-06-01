import { BaseClass } from "/@/api/model/domain";

export interface CourseContent extends BaseClass {
  id: string;
  // 课程id
  fkCourseId: string;
  // 课程名称
  courseName: string;
  // 课程内容
  content: string;
  // 课程html内容
  htmlContent: string;
  // 发布设置: 立即发布，暂不发布
  publishType: number;
}
