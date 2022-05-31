<script lang="ts">
export default { name: "ContentEdit" };
</script>
<script setup lang="ts">
import { PropType, reactive, ref, toRef } from "vue";
import { ElForm, ElMessageBox } from "element-plus";
import type { ElDrawer } from "element-plus";
import { CourseContent } from "/@/api/model/course/course_content_model";
import { warnMessage } from "/@/utils/message";
import Vue3Tinymce from "@jsdawn/vue3-tinymce";

const emit = defineEmits<{
  (e: "refresh"): void;
}>();

const postForm = ref<InstanceType<typeof ElForm>>();
const drawerRef = ref<InstanceType<typeof ElDrawer>>();
const postRules = reactive({
  publishType: [{ required: true, message: "请选择发布设置", trigger: "blur" }],
  content: [{ required: true, message: "请输入课程内容", trigger: "blur" }]
});

const props = defineProps({
  contentInfo: Object as PropType<CourseContent>,
  dialogVisible: {
    require: true,
    default: false,
    type: Boolean
  }
});

const dialogVisible = toRef(props, "dialogVisible");
const contentInfo = toRef(props, "contentInfo");
const loading = ref(false);

const state = reactive({
  // editor 配置项
  setting: {
    language: "zh_CN",
    language_url: "../../../../assets/tinymce/langs/zh_CN.js",
    width: "100%",
    height: document.body.clientHeight - 230,
    menubar: false,
    toolbar:
      "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |",
    toolbar_drawer: "sliding",
    quickbars_selection_toolbar:
      "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
    plugins: "link image media table lists fullscreen quickbars",
    fontsize_formats: "12px 14px 16px 18px",
    default_link_target: "_blank",
    link_title: false,
    nonbreaking_force_tab: true,
    // 自定义 图片上传模式
    custom_images_upload: true,
    images_upload_url: "your_upload_api_url...",
    custom_images_upload_callback: res => res.url,
    custom_images_upload_param: { id: "xxxx01", age: 18 }
  }
});

const handlerSave = () => {
  postForm.value!.validate(isValid => {
    if (isValid) {
      loading.value = true;
      console.log(contentInfo.value);
      doClose();
    } else {
      warnMessage("表单校验失败");
    }
  });
};
const handleClose = () => {
  if (loading.value) {
    return;
  }
  ElMessageBox.confirm("离开页面会丢失当前编辑的内容，确定要离开吗？")
    .then(() => {
      doClose();
    })
    .catch(() => {});
};

const doClose = () => {
  drawerRef.value!.close();
  postForm.value!.clearValidate();
  loading.value = false;
  emit("refresh");
};
</script>

<template>
  <el-drawer
    ref="drawerRef"
    v-model="dialogVisible"
    title="课程内容编辑"
    :before-close="handleClose"
    direction="rtl"
    custom-class="demo-drawer"
    size="80%"
  >
    <div class="demo-drawer__content">
      <el-form
        ref="postForm"
        :model="contentInfo"
        :rules="postRules"
        label-width="auto"
        required-asterisk
        center
      >
        <el-form-item label="发布设置" required prop="publishType">
          <el-radio-group v-model="contentInfo.publishType">
            <el-radio :key="0" :label="0"> 暂不发布 </el-radio>
            <el-radio :key="1" :label="1"> 立即发布 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程内容" required prop="content">
          <vue3-tinymce
            v-model="contentInfo.content"
            :setting="state.setting"
          />
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handlerSave">{{
          loading ? "提交中" : "保存"
        }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped></style>
