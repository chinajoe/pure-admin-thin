export interface CourseContent {
  id: string;
  // 课程名称
  fkCourseId: string;
  // 课程封面
  content: string;
  // 发布设置: 立即发布，暂不发布
  publishType: number;
}
