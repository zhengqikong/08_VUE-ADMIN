<template>
  <div>
    <!-- 三级分类 -->
    <el-card style="margin: 20px 0">
      <CategorySelect @setcategoryId="getcategoryId" :isShowCate="!isShowTable">
      </CategorySelect>
    </el-card>
    <!-- 属性管理 -->
    <el-card>
      <!-- 属性展示 -->
      <div v-show="isShowTable">
        <el-button
          style="margin-bottom: 10px"
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加</el-button
        >
        <el-table border :data="attrList">
          <el-table-column
            type="index"
            label="序号"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column label="属性名称" prop="attrName" width="200">
          </el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, index) in scope.row.attrValueList"
                :key="item.id"
                style="margin: 0 5px"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <!-- {{scope.row.status}} -->
              <el-button
                type="primary "
                icon="el-icon-edit"
                size="mini"
                @click="modifyAttr(scope.row)"
                >修改</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="mini"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 点击添加或修改后显示 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrPram.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addItem"
          :disabled="!attrPram.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>

        <el-table
          style="width: 60%; margin: 28px 0"
          border
          :data="attrPram.attrValueList"
        >
          <el-table-column prop="prop" type="index" label="序号" width="100px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值" width="width">
            <template slot-scope="{ row, $index }">
              <!-- span和input互相切换 -->
              <el-input
                placeholder="请输入属性值"
                v-model="row.valueName"
                v-if="row.flag"
                @blur="changeView(row)"
                @keyup.native.enter="changeView(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="100px">
            <template slot-scope="scope">
              <el-popconfirm
                :title="`确定删除${scope.row.valueName}吗？`"
                @onConfirm="deleteItem(scope.$index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button
          type="primary"
          @click="saveAttrInfo"
          :disabled="attrPram.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      // 子组件传的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 服务器请求展示属性
      attrList: [],
      // 控制table显示隐藏
      isShowTable: true,
      // 搜集的属性
      attrPram: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
        id: 0,
      },
    };
  },
  methods: {
    // 自定义事件子传id并区分存储
    getcategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category2Id = "";
        this.category3Id = "";
        this.category1Id = categoryId;
      } else if (level == 2) {
        this.category3Id = "";
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        // 三级有了就发请求
        this.getAttrList();
      }
    },
    // 发请求获取平台属性数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 点击添加属性值按钮(添加|修改属性界面)
    addItem() {
      this.attrPram.attrValueList.push({
        attrId: this.attrPram.id,
        id: 0,
        valueName: "",
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrPram.attrValueList.length - 1].focus();
      });
    },
    // 点击添加按钮(属性Table展示界面)
    addAttr() {
      this.isShowTable = false;
      // 清除数据;
      this.attrPram = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id, // 搜集三级分类id
        categoryLevel: 3,
      };
    },
    // 点击修改按钮
    modifyAttr(row) {
      this.isShowTable = false;
      // 深拷贝展示数据
      this.attrPram = cloneDeep(row);
      this.attrPram.attrValueList.forEach((element) => {
        this.$set(element, "flag", false);
      });
    },
    // 切换input(编辑)和span(查看)
    changeView(row) {
      // 输入为空
      if (row.valueName.trim() == "") {
        this.$message({ message: "输入为空", type: "warning" });
        return;
      }
      // 输入重复值
      let isRepeat = this.attrPram.attrValueList.some((element) => {
        // 遍历除row以外的元素
        if (row !== element) {
          return row.valueName == element.valueName;
        }
      });
      if (isRepeat) return;
      row.flag = false;
    },
    // 点击span变编辑模式
    toEdit(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 点击删除属性名(添加|修改属性界面)
    deleteItem(index) {
      this.attrPram.attrValueList.splice(index, 1);
    },
    // 点击保存按钮提交属性信息
    async saveAttrInfo() {
      this.attrPram.attrValueList = this.attrPram.attrValueList.filter(
        (element) => {
          if (element.valueName !== "") {
            delete element.flag;
            return true;
          }
        }
      );
      try {
        await this.$API.attr.reqSaveAttrInfo(this.attrPram);
        this.isShowTable = true;
        this.$message({
          type: "success",
          message: this.attrPram.id ? "修改成功" : "添加成功",
        });
        this.getAttrList();
      } catch (error) {}
    },
  },
};
</script>

<style>
</style>
