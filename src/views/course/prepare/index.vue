<template>
  <div class="demo-drawer__content">
    <div class="avue-crud__menu">
      <div class="avue-crud__left">
        <el-button
          type="success"
          size="default"
          :icon="useRenderIcon('iconify-plus')"
          @click="handlerAddNew"
          >生成图片
        </el-button>
      </div>
    </div>

    <el-form
      ref="postForm"
      :model="formData.contentInfo"
      label-width="auto"
      required-asterisk
      center
    >
      <el-form-item required prop="htmlContent">
        <vue3-tinymce
          v-model="formData.contentInfo.htmlContent"
          :setting="state.setting"
          @change="save()"
        />
      </el-form-item>
    </el-form>

    <prepare-edit
      :content-info="formData.contentInfo"
      :dialog-visible="formData.dialogTableVisible"
      @refresh="handlerRefresh"
    />
  </div>
</template>

<script lang="ts">
export default { name: "ContentEdit" };
</script>
<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { ElForm } from "element-plus";
import { errorMessage } from "/@/utils/message";
import Vue3Tinymce from "@jsdawn/vue3-tinymce";
import { courseApi } from "/@/api/course/course_list";
import { courseFileApi } from "/@/api/course/file_info_list";
import { courseContentApi } from "/@/api/course/course_content";
import { CourseFileInfo } from "/@/api/model/course/course_file_model";
import { Page } from "/@/api/model/domain";
import { CourseContent } from "/@/api/model/course/course_content_model";
import _ from "lodash";
import PrepareEdit from "/@/views/course/prepare/edit/index.vue";

const postForm = ref<InstanceType<typeof ElForm>>();

const formData = reactive<{
  dialogTableVisible: boolean;
  contentInfo: CourseContent;
}>({
  dialogTableVisible: false,
  contentInfo: {
    id: "",
    fkCourseId: "",
    courseName: "",
    content: "",
    htmlContent: "",
    publishType: 0
  }
});

const state = reactive({
  // editor 配置项
  setting: {
    width: "100%",
    height: document.body.clientHeight - 180,
    language: "zh_CN",
    language_url:
      "https://unpkg.com/@jsdawn/vue3-tinymce@1.1.6/dist/tinymce/langs/zh_CN.js",
    plugins:
      " preview paste importcss searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template  table  hr pagebreak nonbreaking advlist lists wordcount  textpattern noneditable help  quickbars emoticons",
    imagetools_cors_hosts: ["10086hx.com", "hxclouda.com"],
    menubar: "file edit view insert format tools table help",
    toolbar:
      "undo redo | bold italic underline | alignleft alignjustify alignright | forecolor backcolor removeformat |lineheight fontselect fontsizeselect formatselect |template insertfile image media link |  numlist bullist | pagebreak preview |  emoticons | fullscreen ",
    fontsize_formats:
      "12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px",
    font_formats:
      "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
    toolbar_sticky: true,
    image_advtab: true,
    link_list: [],
    image_list: [],
    image_class_list: [],
    importcss_append: true,
    images_upload_handler: function (blobInfo, succFun, failFun) {
      let file = blobInfo.blob();
      const fileData: File[] = [file];
      // 上传图片
      courseApi.uploadFile(fileData);
    },
    file_picker_callback: function (callback, value, meta) {
      let inputElem = document.createElement("input"); //创建文件选择
      inputElem.setAttribute("type", "file");
      inputElem.click();
      inputElem.onchange = async () => {
        let file = inputElem.files[0]; //获取文件信息
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
    templates: [],
    template_cdate_format: "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
    template_mdate_format: "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
    image_caption: true,
    quickbars_selection_toolbar:
      "bold italic alignjustify forecolor |lineheight fontselect fontsizeselect ",
    noneditable_noneditable_class: "mceNonEditable",
    toolbar_mode: "sliding",
    contextmenu: "link image imagetools table",
    content_style:
      "body { font-family:PingFang SC; font-size:14px } img {max-width:100%;}"
  }
});

const templates = async () => {
  const result: Page<CourseFileInfo[]> = await courseFileApi.page({
    latestDays: 10,
    sortColumn: [],
    groupColumn: [],
    pageSize: 1000,
    pageNum: 1,
    total: 0
  });
  if (result.records && result.records.length > 0) {
    state.setting.templates = result.records;
  } else {
    state.setting.templates = [];
  }
};

const handlerAddNew = () => {
  formData.dialogTableVisible = true;
};
const handlerRefresh = () => {
  formData.dialogTableVisible = false;
};

const contentId = "6296f4e734c0474186cebffb";
const getContentInfo = async () => {
  const result = await courseContentApi.detail<CourseContent>({
    id: contentId
  });
  if (result) {
    formData.contentInfo = result;
  } else {
    formData.contentInfo = {
      id: "",
      fkCourseId: "",
      courseName: "",
      content: "",
      htmlContent: "",
      publishType: 0
    };
  }
};

const save = () => {
  debounceSave();
};
const debounceSave = _.debounce(() => {
  formData.contentInfo.id = contentId;
  courseContentApi.save(formData.contentInfo);
  postForm.value!.clearValidate();
}, 200);

onBeforeMount(() => {
  templates();
});

onMounted(() => {
  templates();
  getContentInfo();
});
</script>

<style scoped></style>
