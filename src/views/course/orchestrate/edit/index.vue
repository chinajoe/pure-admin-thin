<script lang="ts">
export default { name: "PostEdit" };
</script>
<script setup lang="ts">
import { toRef, PropType, reactive, ref, Ref } from "vue";
import { Course } from "/@/api/model/course/course_list_model";
import { ElForm } from "element-plus";
import { successMessage, warnMessage } from "/@/utils/message";
import { courseApi } from "/@/api/course/course_list";
import { DictEntryCache } from "/@/api/model/system/dict_model";
const postForm = ref<InstanceType<typeof ElForm>>();
const emit = defineEmits<{
  (e: "refresh"): void;
}>();
const postRules = reactive({
  courseName: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
  courseCover: [{ required: true, message: "请上传课程封面", trigger: "blur" }],
  courseAudio: [{ required: true, message: "请上传课程音频", trigger: "blur" }],
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
const isEnabledOptions: Ref<DictEntryCache[]> = toRef(
  props,
  "isEnabledOptions"
);
const handleDialogClose = () => {
  postForm.value!.clearValidate();
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
          <el-input v-model="postInfo.courseCover" clearable />
        </el-form-item>
        <el-form-item required label="课程音频" prop="courseAudio">
          <el-radio-group v-model="postInfo.courseAudio">
            <el-radio
              v-for="item in isEnabledOptions"
              :key="Number(item.value)"
              :label="Number(item.value)"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
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
