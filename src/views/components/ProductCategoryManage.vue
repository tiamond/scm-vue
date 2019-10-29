<template>
  <div>
    <!-- 添加分类 -->
    <el-button 
      class="addUser"
      type="primary" 
      @click="addCate" 
      style="margin: 0 20px"
      size="small">
      添加分类
    </el-button>

    <!-- 产品分类列表 -->
    <el-table
      :data="proCateList"
      style="width: 93%"
      size="mini"
      border
      v-loading="loading"
      max-height="850">
      <el-table-column
        label="序号"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        v-for="col in ProCateListColumns" :key="col.id"
        :prop="col.id"
        :label="col.label"
        :width="col.width">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
        class="cmondBtn">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="showDialog(scope.$index, proCateList)"
            type="primary"
            size="mini">
            修改
          </el-button>
          <el-button
            @click.native.prevent="deleteSupplier(scope.$index, proCateList)"
            type="danger"
            size="mini">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加分类 -->
    <el-dialog :title="dialogMsg" :visible.sync="dialogFormVisible" class="add-supplier">
      <el-form size="mini" :model="dialogForm" :rules="dialogRules" :inline="true" class="demo-form-inline">
        <el-form-item label="分类编号" label-width="95px">
          <el-input v-model="dialogForm.categoryId" autocomplete="off" disabled placeholder="自动生成"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" label-width="95px" prop="name">
          <el-input v-model="dialogForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="95px">
          <el-input v-model="dialogForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelOpration">取 消</el-button>
        <el-button type="primary" @click="updateProCate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="total">
    </el-pagination>

    <!-- 提示弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>{{titMsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 是否删除对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="logoutDialogVisible"
      width="30%"
      class="deleteTip">
      <span>确认删除该供应商吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logoutDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'querystring'
export default {
  name: 'ProductCategoryManage',
  data () {
    return {
      page: 1,
      total: 0,
      loading: true,
      proCateList: [],
      ProCateListColumns: [
        { id: 'categoryId', label: '分类编号', width: 185 },
        { id: 'name', label: '分类名称', width: 290 },
        { id: 'remark', label: '标记', width: 270 },
      ],
      dialogRules: {
        name: [
          { required: true }
        ]
      },
      dialogForm: {
        name: '',
        remark: '',
        categoryId: ''
      },
      dialogFormVisible: false,
      dialogMsg: '',
      centerDialogVisible: false,
      titMsg: '',
      logoutDialogVisible: false,
      willBeDelete: '',
      isAddOrUpd: ''
    }
  },
  created () {
    this.getProCateList ()
  },
  methods: {
    getProCateList (page = 1, categoryId) {
      this.loading = true
      axios({
        method: 'GET',
        url: '/api/main/sell/category/show',
        params: {
          page,
          categoryId
        }
      }).then(
        resp => {
          console.log(resp.data)
          this.proCateList = resp.data.list
          this.total = resp.data.total
          this.loading = false
        }
      )
    },
    // 添加分类
    addCate () {
      this.dialogFormVisible = true
      this.isAddOrUpd = 'add'
    },
    // 分页
    pageChange (page) {
      this.page = page
      this.getProCateList (page)
    },
    // 确认添加 修改
    updateProCate () {
      axios({
        method: 'POST',
        url: `/api/main/sell/category/${this.isAddOrUpd}`,
        data: qs.stringify(this.dialogForm)
      }).then(
        resp => {
          console.log(resp.data)
          const result = resp.data
          this.dialogFormVisible = false
          this.centerDialogVisible = true
          this.titMsg = result.message
          if (result.code == 2) {
            this.getProCateList(this.page)
            this.initDialogForm()
          }
        }
      )
    },
    // 删除分裂
    deleteSupplier (index, data) {
      const res = data[index]
      this.logoutDialogVisible = true
      this.willBeDelete = res.categoryId
    },
    // 确认删除
    confirmDelete () {
      this.logoutDialogVisible = false
      axios({
        method: 'POST',
        url: '/api/main/sell/category/delete',
        data: qs.stringify({
          categoryId: this.willBeDelete
        })
      }).then(
        resp => {
          console.log(resp.data)
          const result = resp.data
          this.dialogFormVisible = false
          this.centerDialogVisible = true
          this.titMsg = result.message
          if (result.code == 2) {
            this.getProCateList(this.page)
          }
        }
      )
    },
    // 改
    showDialog (index, data) {
      const res = data[index]
      this.dialogForm = res
      this.isAddOrUpd = 'update'
      console.log(this.dialogForm)
      this.dialogFormVisible = true
    },
    // 初始化数据
    initDialogForm () {
      this.dialogForm.name = ''
      this.dialogForm.remark = ''
      this.dialogForm.categoryId = ''
    },
    // 取消
    cancelOpration () {
      this.dialogFormVisible = false
      this.initDialogForm()
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-table
  margin 20px
</style>