<script setup lang="ts">
import { onMounted, reactive } from "vue";
import PostList from "./list/index.vue";
import { Page } from "/@/api/model/domain";
import { DictEntryCache } from "/@/api/model/system/dict_model";
import { Course, CourseQuery } from "/@/api/model/course/course_list_model";
import { courseApi } from "/@/api/course/course_list";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

const pageData = reactive<{
  position: string;
  isEnabledOptions: DictEntryCache[];
  postList: Course[];
  searchInfo: CourseQuery;
}>({
  position: "left",
  isEnabledOptions: [],
  postList: [],
  searchInfo: {
    sortColumn: [],
    groupColumn: [],
    pageSize: 10,
    pageNum: 1,
    total: 0,
    courseName: "",
    publishStatus: null
  }
});
const getPage = async () => {
  const result: Page<Course[]> = await courseApi.page(pageData.searchInfo);
  pageData.postList = result.records;
  pageData.searchInfo.total = Number(result.total);
};
const handlerRefresh = () => {
  getPage();
};
const handlerSearch = () => {
  getPage();
};
const getDict = () => {
  pageData.isEnabledOptions = [
    {
      label: "未发布",
      value: "0"
    },
    {
      label: "发布中",
      value: "1"
    },
    {
      label: "已发布",
      value: "2"
    }
  ];
};
onMounted(() => {
  getPage();
  getDict();
});
</script>

<template>
  <div>
    <el-form
      ref="searchForm"
      :model="pageData.searchInfo"
      size="large"
      :inline="true"
      :label-position="pageData.position"
    >
      <el-form-item>
        <el-input
          v-model="pageData.searchInfo.courseName"
          placeholder="课程名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="pageData.searchInfo.publishStatus"
          placeholder="发布状态"
          clearable
        >
          <el-option
            v-for="item in pageData.isEnabledOptions"
            :key="Number(item.value)"
            :label="item.label"
            :value="Number(item.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          plain
          size="large"
          :icon="useRenderIcon('iconify-fa-search')"
          @click="handlerSearch"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <post-list
      :post-list="pageData.postList"
      :search-model="pageData.searchInfo"
      :is-enabled-options="pageData.isEnabledOptions"
      @handler-refresh="handlerRefresh"
    />
  </div>
</template>

<style scoped></style>
