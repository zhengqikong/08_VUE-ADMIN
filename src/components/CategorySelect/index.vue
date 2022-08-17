<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="categoryFrom">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="categoryFrom.category1Id"
          @change="handler1"
          :disabled="isShowCate"
        >
          <el-option
            :label="item1.name"
            :value="item1.id"
            v-for="(item1, index) in category1"
            :key="item1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="categoryFrom.category2Id"
          @change="handler2"
          :disabled="isShowCate"
        >
          <el-option
            :label="item2.name"
            :value="item2.id"
            v-for="(item2, index) in category2"
            :key="item2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="categoryFrom.category3Id"
          @change="handler3"
          :disabled="isShowCate"
        >
          <el-option
            v-for="(item3, index) in category3"
            :key="item3.id"
            :value="item3.id"
            :label="item3.name"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["isShowCate"],
  data() {
    return {
      // 服务器请求的各级分类进行展示
      category1: [],
      category2: [],
      category3: [],
      // 存储当前点击分类Id
      categoryFrom: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategory1();
  },
  methods: {
    // 获取一级分类
    async getCategory1() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.category1 = result.data;
      }
    },
    // 一级分类变化获取二级分类
    async handler1() {
      // 一级change置空二三级
      this.category2 = [];
      this.category3 = [];
      this.categoryFrom.category2Id = "";
      this.categoryFrom.category3Id = "";
      const { category1Id } = this.categoryFrom;
      // 自定义事件传给父id
      this.$emit("setcategoryId", { categoryId: category1Id, level: 1 });
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.category2 = result.data;
      }
    },
    // 二级分类变化获取三级分类
    async handler2() {
      // 二级change置空三级
      this.category3 = [];
      this.categoryFrom.category3Id = "";
      const { category2Id } = this.categoryFrom;
      // 自定义事件传给父id
      this.$emit("setcategoryId", { categoryId: category2Id, level: 2 });
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.category3 = result.data;
      }
    },
    handler3() {
      // 自定义事件传给父id
      const { category3Id } = this.categoryFrom;
      this.$emit("setcategoryId", { categoryId: category3Id, level: 3 });
    },
  },
};
</script>

<style>
</style>
