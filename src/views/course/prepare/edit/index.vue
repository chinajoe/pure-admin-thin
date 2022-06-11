<script lang="ts">
export default { name: "PrepareEdit" };
</script>
<script setup lang="ts">
import { toRef, PropType } from "vue";
import { CourseContent } from "/@/api/model/course/course_content_model";

const emit = defineEmits<{
  (e: "refresh"): void;
}>();

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

const handleDialogClose = () => {
  emit("refresh");
};
</script>

<template>
  <div>
    <el-dialog
      title="图片信息"
      width="340px"
      destroy-on-close
      v-model="dialogVisible"
      :before-close="handleDialogClose"
    >
      <img
        src="https://qk-cosole-1309456451.cos.ap-hongkong.myqcloud.com/bg/head.png"
        alt=""
      />
      <div class="box" v-html="contentInfo.htmlContent" />
      <img
        src="https://qk-cosole-1309456451.cos.ap-hongkong.myqcloud.com/bg/footer.png"
        alt=""
      />
    </el-dialog>
  </div>
</template>

<style scoped>
body {
  margin: 0 0;
  padding: 0 0;
}

img {
  max-width: 300px;
}

.box {
  background-image: url("https://qk-cosole-1309456451.cos.ap-hongkong.myqcloud.com/bg/body.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  max-width: 300px;
  margin-top: -47px;
  padding: 20px 30px;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
}

.box img {
  max-width: 300px;
}
</style>
