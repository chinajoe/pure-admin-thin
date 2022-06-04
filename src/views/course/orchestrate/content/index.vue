<script lang="ts">
export default { name: "ContentEdit" };
</script>
<script setup lang="ts">
import { PropType, reactive, ref, toRef } from "vue";
import { ElForm, ElMessageBox } from "element-plus";
import type { ElDrawer } from "element-plus";
import { CourseContent } from "/@/api/model/course/course_content_model";
import { errorMessage, successMessage, warnMessage } from "/@/utils/message";
import Vue3Tinymce from "@jsdawn/vue3-tinymce";
import { loadEnv } from "@build/index";
import { courseContentApi } from "/@/api/course/course_content";
import { courseApi } from "/@/api/course/course_list";

const { VITE_API_SERVER } = loadEnv();
const emit = defineEmits<{
  (e: "refresh"): void;
}>();

const postForm = ref<InstanceType<typeof ElForm>>();
const drawerRef = ref<InstanceType<typeof ElDrawer>>();
const postRules = reactive({
  publishType: [{ required: true, message: "请选择发布设置", trigger: "blur" }],
  htmlContent: [{ required: true, message: "请输入课程内容", trigger: "blur" }]
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
    width: "100%",
    height: document.body.clientHeight - 280,
    language: "zh_CN",
    language_url:
      "https://unpkg.com/@jsdawn/vue3-tinymce@1.1.6/dist/tinymce/langs/zh_CN.js",
    plugins:
      " preview paste importcss searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template  table  hr pagebreak nonbreaking advlist lists wordcount  textpattern noneditable help  quickbars emoticons let",
    imagetools_cors_hosts: ["10086hx.com:8848", "hxclouda.com"],
    menubar: "file edit view insert format tools table help",
    toolbar:
      "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | forecolor  | fontselect fontsizeselect formatselect |template insertfile image let media link | backcolor removeformat |  numlist bullist | outdent indent |  emoticons | fullscreen pagebreak preview",
    fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
    font_formats:
      "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
    toolbar_sticky: true,
    image_advtab: true,
    link_list: [
      { title: "My page 1", value: "https://www.tiny.cloud" },
      { title: "My page 2", value: "http://www.moxiecode.com" }
    ],
    image_list: [
      { title: "My page 1", value: "https://www.tiny.cloud" },
      { title: "My page 2", value: "http://www.moxiecode.com" }
    ],
    image_class_list: [
      { title: "None", value: "" },
      { title: "Some class", value: "class-name" }
    ],
    importcss_append: true,
    file_picker_callback: function (callback, value, meta) {
      let inputElem = document.createElement("input"); //创建文件选择
      inputElem.setAttribute("type", "file");
      inputElem.click();
      inputElem.onchange = async () => {
        let file = inputElem.files[0]; //获取文件信息
        console.log(file.type.slice(0, 5));
        if (file.type.slice(0, 5) == "image" && file.size / 1024 / 1024 > 2) {
          errorMessage("上传失败，图片大小请控制在2M以内");
        } else if (
          file.type.slice(0, 5) == "video" &&
          file.size / 1024 / 1024 > 500
        ) {
          errorMessage("上传失败，视频大小请控制在 500M 以内");
        } else {
          const fileData: File[] = [file];
          const uploadResult = await courseApi.uploadFile(fileData);
          if (uploadResult.length > 0) {
            //上传成功，在回调函数里填入文件路径
            callback(uploadResult[0].url, { text: uploadResult[0].name });
          } else {
            errorMessage("上传失败");
          }
        }
      };
    },
    templates: [
      {
        title: "New Table",
        description: "creates a new table",
        content:
          '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>'
      },
      {
        title: "Starting my story",
        description: "A cure for writers block",
        content: "Once upon a time..."
      },
      {
        title: "New list with dates",
        description: "New List with dates",
        content:
          '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>'
      }
    ],
    template_cdate_format: "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
    template_mdate_format: "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
    image_caption: true,
    quickbars_selection_toolbar:
      "bold italic alignjustify forecolor | fontselect fontsizeselect ",
    noneditable_noneditable_class: "mceNonEditable",
    toolbar_mode: "sliding",
    contextmenu: "link image imagetools table",
    content_style:
      "body { font-family:Microsoft YaHei,PingFang SC,sans-serif; font-size:14px }",
    // 自定义 图片上传模式
    custom_images_upload: true,
    custom_images_upload_header: {
      authorization:
        "Bearer eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleToiOiJkODk2YzNhNC04MTY4LTQ1Y2QtODg1MS04ZGJiMmYyYmNiNzkifQ.mpq3Td_S0OmtckZ4XzpkNPCKl5tkPVHZg_TTVo-4ig2wSV8g3qGpjfk7Q_ynZmkbYL5wAsRTUiR4ratT6V9gkQ"
    },
    images_upload_url: VITE_API_SERVER + "/course/orchestrate/upload",
    custom_images_upload_callback: res => res.data[0].url,
    custom_images_upload_param: { id: "xxxx01", age: 18 }
  }
});

const save = async () => {
  await courseContentApi.save(contentInfo.value);
  successMessage("保存成功");
};
const update = async () => {
  await courseContentApi.updateById(contentInfo.value.id, contentInfo.value);
  successMessage("保存成功");
};

const handlerSave = () => {
  postForm.value!.validate(isValid => {
    if (isValid) {
      loading.value = true;
      if (contentInfo.value && contentInfo.value.id) {
        update();
      } else {
        save();
      }
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
    :z-index="1024"
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
        <el-form-item label="课程名称" prop="id">
          <el-input v-model="contentInfo.id" v-show="false" />
          <el-input v-model="contentInfo.fkCourseId" v-show="false" />
          <el-input v-model="contentInfo.courseName" :disabled="true" />
        </el-form-item>
        <el-form-item label="发布设置" required prop="publishType">
          <el-radio-group v-model="contentInfo.publishType">
            <el-radio :key="0" :label="0"> 暂不发布 </el-radio>
            <el-radio :key="1" :label="1"> 立即发布 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程内容" required prop="htmlContent">
          <vue3-tinymce
            v-model="contentInfo.htmlContent"
            :setting="state.setting"
          />
          <!--          <MiniMCE v-model="contentInfo.htmlContent" />-->
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
