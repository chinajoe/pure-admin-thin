<script lang="ts">
export default { name: "PostEdit" };
</script>
<script setup lang="ts">
import { toRef, PropType, reactive, ref } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { Course } from "/@/api/model/course/course_list_model";
import { ElForm, ElUpload } from "element-plus";
import { successMessage, warnMessage } from "/@/utils/message";
import { courseApi } from "/@/api/course/course_list";
import { DictEntryCache } from "/@/api/model/system/dict_model";

const postForm = ref<InstanceType<typeof ElForm>>();
const uploadRef = ref<InstanceType<typeof ElUpload>>();
const emit = defineEmits<{
  (e: "refresh"): void;
}>();
const postRules = reactive({
  courseName: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
  courseCover: [{ required: true, message: "请上传课程封面", trigger: "blur" }],
  fkCourseAudioId: [
    { required: true, message: "请上传课程音频", trigger: "blur" }
  ],
  courseDescription: [
    { required: true, message: "请输入课程简介", trigger: "blur" }
  ]
});
const props = defineProps({
  position: {
    require: false,
    default: "left",
    type: String
  },
  isUpdate: {
    require: true,
    default: false,
    type: Boolean
  },
  postInfo: Object as PropType<Course>,
  dialogVisible: {
    require: true,
    default: false,
    type: Boolean
  },
  isEnabledOptions: Object as PropType<DictEntryCache[]>
});
const position = toRef(props, "position");
const dialogVisible = toRef(props, "dialogVisible");
const postInfo = toRef(props, "postInfo");
const isUpdate = toRef(props, "isUpdate");
const courseCoverFileList = (postInfo: Course) => {
  return [
    {
      name: postInfo.courseCoverName,
      url: postInfo.courseCoverUrl
    }
  ];
};
const courseAudioFileList = (postInfo: Course) => {
  return [
    {
      name: postInfo.courseAudioName,
      url: postInfo.courseAudioUrl
    }
  ];
};
const handleDialogClose = () => {
  postForm.value!.clearValidate();
  uploadRef.value.clearFiles();
  emit("refresh");
};
const handlerSave = () => {
  postForm.value!.validate(isValid => {
    if (isValid) {
      if (isUpdate.value) {
        update();
      } else {
        save();
      }
    } else {
      warnMessage("表单校验失败");
    }
  });
};
const save = async () => {
  await courseApi.save(postInfo.value);
  successMessage("保存成功");
  handleDialogClose();
};
const update = async () => {
  await courseApi.updateById(postInfo.value.id, postInfo.value);
  successMessage("保存成功");
  handleDialogClose();
};
const handlerCourseAudioUpload = async val => {
  const fileData: File[] = [val.file];
  const uuids = await courseApi.uploadFile(fileData);
  postInfo.value.fkCourseAudioId = uuids.toString();
  successMessage("上传成功");
};
const handlerCourseCoverUpload = async val => {
  const fileData: File[] = [val.file];
  const uuids = await courseApi.uploadFile(fileData);
  postInfo.value.courseCover = uuids.toString();
  successMessage("上传成功");
};
</script>

<template>
  <div>
    <el-dialog
      title="课程信息"
      destroy-on-close
      v-model="dialogVisible"
      :before-close="handleDialogClose"
    >
      <el-form
        label-width="auto"
        :model="postInfo"
        :label-position="position"
        ref="postForm"
        required-asterisk
        :rules="postRules"
        center
      >
        <el-form-item required label="课程名称" prop="courseName">
          <el-input v-model="postInfo.courseName" clearable />
        </el-form-item>
        <el-form-item required label="课程封面" prop="courseCover">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            :multiple="false"
            :file-list="courseCoverFileList(postInfo)"
            :show-file-list="true"
            list-type="picture"
            accept="image/*"
            :limit="1"
            action=""
            :http-request="handlerCourseCoverUpload"
          >
            <el-button
              type="info"
              size="default"
              :icon="useRenderIcon('iconify-fa-upload')"
              >上传封面</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item required label="课程音频" prop="fkCourseAudioId">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            :multiple="false"
            :file-list="courseAudioFileList(postInfo)"
            :show-file-list="true"
            accept="audio/*"
            :limit="1"
            action=""
            :http-request="handlerCourseAudioUpload"
          >
            <el-button
              type="info"
              size="default"
              :icon="useRenderIcon('iconify-fa-upload')"
              >上传音频</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item required label="课程简介" prop="courseDescription">
          <el-input
            type="textarea"
            v-model="postInfo.courseDescription"
            placeholder="课程简介"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handlerSave">保存</el-button>
          <el-button size="default" @click="handleDialogClose" plain
            >取 消</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
