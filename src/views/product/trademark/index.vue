<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="addTrademark"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column label="序号" width="80px" align="center" type="index">
      </el-table-column>
      <el-table-column label="品牌名称" align="center" prop="tmName">
      </el-table-column>
      <el-table-column label="品牌Logo" align="center">
        <template slot-scope="scope">
          <!-- {{ scope.row }} -->
          <img :src="scope.row.logoUrl" style="height: 100px; width: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- {{scope.row.status}} -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="modifyTrademark(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-count="5"
      :page-sizes="[3, 5, 10]"
      @current-change="getPageList"
      @size-change="changePagesize"
      layout="prev,pager,next,jumper,->,sizes,total"
    >
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog
      :title="form.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" style="width: 80%" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="120px" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="120px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              请上传jpg、png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdataTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      // getPageList参数：第几页
      page: 1,
      // getPageList参数：当前页显示数据条数
      limit: 3,
      // 服务器：数据总数
      total: 20,
      // 服务器：列表展示的数据
      list: [],
      // 对话框显示与隐藏
      dialogTableVisible: false,
      dialogFormVisible: false,
      // 搜集数据
      form: {
        // key不能瞎写，与接口文档保持一致
        // id: "",
        tmName: "",
        logoUrl: "",
      },
      // 表单验证
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 1,
            max: 8,
            message: "长度在 1 到 8 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请上传图片" }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.limit);
    },
  },
  methods: {
    // 获取品牌管理分页列表
    async getPageList(p = 1) {
      this.page = p;
      let { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 点击修改每页条数
    changePagesize(pagesize) {
      this.limit = pagesize;
      this.getPageList();
    },
    // 点击按钮添加品牌
    addTrademark() {
      this.dialogFormVisible = true;
      this.form = {
        tmName: "",
        logoUrl: "",
      };
    },
    // 点击按钮修改品牌
    modifyTrademark(row) {
      this.dialogFormVisible = true;
      this.form = { ...row };
    },
    // 添加或修改后点击确定
    saveOrUpdataTradeMark() {
      this.$refs.ruleForm.validate(async (valid) => {
        // 表单验证成功
        if (valid) {
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqSaveOrUpdataTradeMark(
            this.form
          );
          if (result.code == 200) {
            this.$message({
              message: this.form.id ? "修改成功" : "添加成功",
              type: "success",
            });
          }
          // 添加跳转至最后一页，修改跳转至当前页
          this.getPageList(
            this.form.id ? this.page : this.totalPage,
            this.limit
          );
        } else {
          console.log("提交品牌信息失败!!");
          return false;
        }
      });
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      // res,file：上传图片成功返回给前端的数据
      this.form.logoUrl = URL.createObjectURL(file.raw);
    },
    // 上传图片之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 点击删除按钮
    deleteTrademark(row) {
      this.$confirm(`此操作将删除"${row.tmName}", 是否继续?`, "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.trademark.reqDeleteMarkList(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
          }
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "取消删除",
          });
        });
    },
  },
};
</script>

<style>
/* Upload */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
