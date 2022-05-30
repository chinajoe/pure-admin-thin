<script lang="ts">
export default { name: "PostList" };
</script>
<script setup lang="ts">
import { toRef, PropType, reactive, Ref, ref } from "vue";
import { Course, CourseQuery } from "/@/api/model/course/course_list_model";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import PostEdit from "../edit/index.vue";
import { ElTable } from "element-plus";
import { warnMessage } from "/@/utils/message";
import { confirm } from "/@/utils/message/box";
import { courseApi } from "/@/api/course/course_list";
import { DictEntryCache } from "/@/api/model/system/dict_model";

const postListRef = ref<InstanceType<typeof ElTable>>();
const permission = reactive({
  add: ["post:save"],
  edit: ["post:update"],
  delete: ["post:delete"]
});
const emit = defineEmits<{
  (e: "handlerRefresh"): void;
}>();
const pageData = reactive<{
  dialogTableVisible: boolean;
  selection: Course[];
  postInfo: Course;
  isUpdate: boolean;
}>({
  dialogTableVisible: false,
  selection: [],
  isUpdate: false,
  postInfo: {
    id: "",
    courseName: "",
    courseCover: {
      id: "",
      name: "",
      url: ""
    },
    courseAudio: {
      id: "",
      name: "",
      url: ""
    },
    publishStatus: 0,
    courseDescription: "",
    sort: 999,
    publishTime: ""
  }
});
const props = defineProps({
  postList: Array as PropType<Course[]>,
  searchModel: Object as PropType<CourseQuery>,
  isEnabledOptions: Object as PropType<DictEntryCache[]>
});
const postList = toRef(props, "postList");
const searchModel: Ref<CourseQuery> = toRef(props, "searchModel");
const isEnabledOptions: Ref<DictEntryCache[]> = toRef(
  props,
  "isEnabledOptions"
);

const sizeChange = () => {
  handlerRefresh();
};
const currentChange = () => {
  handlerRefresh();
};
const handleSelectionChange = val => {
  pageData.selection = val;
};
const initPostInfo = (data: Course) => {
  if (data) {
    pageData.postInfo = data;
  } else {
    pageData.postInfo = {
      id: "",
      courseName: "",
      courseCover: {
        id: "",
        name: "",
        url: ""
      },
      courseAudio: {
        id: "",
        name: "",
        url: ""
      },
      publishStatus: 0,
      courseDescription: "",
      sort: 999,
      publishTime: ""
    };
  }
};
const handlerUpdate = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
  } else if (pageData.selection.length > 1) {
    warnMessage("请选择(有且只有一个)");
  } else {
    handlerEdit(pageData.selection[0]);
  }
};
const handlerEdit = (data: Course) => {
  initPostInfo(data);
  pageData.isUpdate = true;
  pageData.dialogTableVisible = true;
};
const handlerDelete = (data: Course) => {
  confirm("是否删除当前数据")
    .then(() => {
      let ids: string[] = [data.id];
      postDelete(ids);
    })
    .catch(() => {});
};
const handlerDeleteBatch = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
    return;
  }
  confirm("是否删除已选择数据")
    .then(() => {
      let ids: string[] = [];
      pageData.selection.forEach(item => {
        ids.push(item.id);
      });
      postDelete(ids);
    })
    .catch(() => {});
};
const handlerRefresh = () => {
  pageData.dialogTableVisible = false;
  emit("handlerRefresh");
};
const handlerAddNew = () => {
  initPostInfo(null);
  pageData.isUpdate = false;
  pageData.dialogTableVisible = true;
};
const postDelete = async (ids: string[]) => {
  if (ids.length <= 0) {
    return;
  }
  await courseApi.deleteBatch(ids);
  handlerRefresh();
};
const publishStatusLabelRender = (publishStatus: number) => {
  if (publishStatus === 0) {
    return "未发布";
  } else if (publishStatus === 1) {
    return "发布中";
  } else if (publishStatus === 2) {
    return "已发布";
  }
};
const publishStatusStyleRender = (publishStatus: number) => {
  if (publishStatus === 0) {
    return "danger";
  } else if (publishStatus === 1) {
    return "warning";
  } else if (publishStatus === 2) {
    return "success";
  }
};
</script>
<template>
  <div>
    <el-row>
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <el-button
            type="success"
            size="default"
            :icon="useRenderIcon('iconify-plus')"
            @click="handlerAddNew"
            v-auth="permission.add"
            >新增</el-button
          >
          <el-button
            type="primary"
            size="default"
            :icon="useRenderIcon('iconify-edit')"
            @click="handlerUpdate"
            v-auth="permission.edit"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="default"
            :icon="useRenderIcon('iconify-fa-trash')"
            @click="handlerDeleteBatch"
            v-auth="permission.delete"
            >删除</el-button
          >
        </div>
        <div class="avue-crud__right">
          <el-button
            size="default"
            title="刷新"
            circle
            :icon="useRenderIcon('iconify-fa-refresh')"
            @click="handlerRefresh"
          />
        </div>
      </div>
      <el-table
        :data="postList"
        style="width: 100%"
        ref="postListRef"
        size="large"
        border
        :fit="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
          type="selection"
        />
        <el-table-column
          prop="courseName"
          label="课程名称"
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
        />
        <!--        <el-table-column-->
        <!--          prop="courseCover"-->
        <!--          label="课程封面"-->
        <!--          sortable-->
        <!--          resizable-->
        <!--          :show-overflow-tooltip="true"-->
        <!--          align="center"-->
        <!--        >-->
        <!--          <template #default="scope">-->
        <!--            <el-image-->
        <!--              style="width: 80px; height: 80px"-->
        <!--              :src="scope.row.courseCover"-->
        <!--              fit="cover"-->
        <!--            />-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column
          prop="courseDescription"
          label="课程描述"
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="publishStatus"
          label="发布状态"
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
        >
          <template #default="scope">
            <el-tag
              :type="publishStatusStyleRender(scope.row.publishStatus)"
              disable-transitions
              >{{ publishStatusLabelRender(scope.row.publishStatus) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          label="操作"
          sortable
          resizable
          :show-overflow-tooltip="true"
          align="center"
        >
          <template #default="scope">
            <el-button
              title="修改"
              type="primary"
              :icon="useRenderIcon('iconify-fa-edit')"
              @click="handlerEdit(scope.row)"
              v-auth="permission.edit"
              size="small"
            />
            <el-button
              title="删除"
              type="danger"
              :icon="useRenderIcon('iconify-fa-trash')"
              @click="handlerDelete(scope.row)"
              v-auth="permission.delete"
              size="small"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="searchModel.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchModel.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="searchModel.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </el-row>

    <post-edit
      :post-info="pageData.postInfo"
      :dialog-visible="pageData.dialogTableVisible"
      :is-update="pageData.isUpdate"
      :is-enabled-options="isEnabledOptions"
      @refresh="handlerRefresh"
    />
  </div>
</template>

<style scoped></style>
