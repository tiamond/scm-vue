<template>
  <div>
    <!-- 添加供应商 与 模糊查找 -->
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-button 
          class="addUser"
          type="primary" 
          @click="addSupplier" 
          style="margin: 0 20px"
          size="small">
          添加供应商
        </el-button>
      <el-form-item label="查找供应商">
        <el-input v-model="searchKey" placeholder="请输入供应商名称或者编号"></el-input>
      </el-form-item>
      </el-form-item>
    </el-form>
    
    <!-- 供应商列表 -->
    <el-table
      :data="SupplierListData"
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
        v-for="col in SupplierListColumns" :key="col.id"
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
            @click.native.prevent="showDialog(scope.$index, SupplierListData)"
            type="primary"
            size="mini">
            修改
          </el-button>
          <el-button
            @click.native.prevent="deleteSupplier(scope.$index, SupplierListData)"
            type="danger"
            size="mini">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或者修改供应商对话框 -->
    <el-dialog :title="dialogMsg" :visible.sync="dialogFormVisible" class="add-supplier">
      <el-form size="mini" :model="supplierForm" :rules="supplierRules" :inline="true" class="demo-form-inline">
        <el-form-item label="供应商编号" label-width="95px" prop="venderCode">
          <el-input v-model="supplierForm.venderCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称" label-width="95px" prop="name">
          <el-input v-model="supplierForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="95px">
          <el-input v-model="supplierForm.passWord" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="联系人" label-width="95px" prop="contactor">
          <el-input v-model="supplierForm.contactor" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="地址" label-width="95px" prop="address">
          <el-input v-model="supplierForm.address" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" label-width="95px">
          <el-input v-model="supplierForm.postCode" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item :label="creOrUpdMsg" label-width="95px">
          <el-input v-model="supplierForm.createDate" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="95px" prop="tel">
          <el-input v-model="supplierForm.tel" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="传真" label-width="95px">
          <el-input v-model="supplierForm.fax" autocomplete="off" type="text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateSupplier">确 定</el-button>
      </div>
    </el-dialog>

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
        <el-button @click="logoutDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'querystring'
export default {
  name: 'Supplier',
  data () {
    return {
      total: 0,
      isAddOrUpd: '',
      loading: true,
      SupplierList: [],
      searchKey: '',
      SupplierListColumns: [
        { id: 'venderCode', label: '供应商编号', width: 85 },
        { id: 'name', label: '供应商名称', width: 90 },
        { id: 'contactor', label: '联系人', width: 70 },
        { id: 'address', label: '地址', width: 185 },
        { id: 'postCode', label: '邮政编码', width: 85 },
        { id: 'createDate', label: '注册日期', width: 140 },
        { id: 'tel', label: '电话', width: 120 },
        { id: 'fax', label: '传真', width: 90 }
      ],
      supplierRules: {
        venderCode: [
          { required: true, message: '请输入供应商编号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]+$/, message: '必须是数字或者字母', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' },
          { max: 100, message: '名字长度不能超过100个字符', trigger: 'blur' }
        ],
        contactor: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        address: [
          { required: true }
        ]

      },
      dialogMsg: '添加供应商',
      dialogFormVisible: false,
      logoutDialogVisible: false,
      creOrUpdMsg: '注册日期',
      supplierForm: {
        venderCode: '',
        name: '',
        passWord: '',
        contactor: '',
        address: '',
        postCode: '',
        createDate: '',
        tel: '',
        fax: ''
      },
      centerDialogVisible: false,
      titMsg: '',
      willbeDelete: ''
    }
  },
  created () {
    this.getSupplierList()
  },
  methods: {
    // 获取供应商列表
    getSupplierList (page = 1, venderCode, name) {
      axios({
        method: 'GET',
        url: '/api/main/purchase/vender/show',
        params: {
          page,
          venderCode,
          name,
        }
      }).then(
        resp => {
          console.log(resp.data)
          this.SupplierList = resp.data.list
          this.total = resp.data.total
          this.loading = false
        }
      ).catch(
        err => console.log(err)
      )
    },
    // 获取当前时间
    setNowTime() {
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth()+1
      let d = date.getDate()
      let h = date.getHours()
      let mm = date.getMinutes()
      let s = date.getSeconds()
      return `${y}-${m < 10 ? '0'+m : m}-${d < 10 ? '0'+d : d} ${h < 10 ? '0'+h : h}:${mm < 10 ? '0'+mm : mm}:${s < 10 ? '0'+s : s}`
    },
    // 添加供应商
    addSupplier () {
      this.isAddOrUpd = 'add'
      this.dialogMsg = '添加供应商'
      this.creOrUpdMsg = '注册日期'
      console.log('添加供应商')
      this.dialogFormVisible = true
      this.supplierForm.createDate = this.setNowTime()
    },
    // 删除供应商
    deleteSupplier (index, data) {
      const supplier = data[index]
      this.logoutDialogVisible = true
      this.willbeDelete = supplier.venderCode
    },
    // 确认删除
    confirmDelete () {
      axios({
        method: 'POST',
        url: 'api/main/purchase/vender/delete',
        data: qs.stringify({
          venderCode: this.willbeDelete
        })
      }).then(
        resp => {
          console.log(resp.data)
          if (resp.data.code === 2) {
            this.logoutDialogVisible = false
            this.centerDialogVisible = true
            this.titMsg = resp.data.message
            this.getSupplierList()
          }
        }
      )
    },
    // 修改供应商信息
    showDialog (index, data) {
      this.isAddOrUpd = 'update'
      const supplier = data[index]
      this.dialogFormVisible = true
      this.supplierForm = supplier
    },
    // 更新或者创建供应商
    updateSupplier () {
      if (this.supplierForm.passWord == '') {
        this.supplierForm.passWord = this.supplierForm.venderCode
      }
      axios({
        method: 'POST',
        url: `/api/main/purchase/vender/${this.isAddOrUpd}`,
        data: qs.stringify(this.supplierForm)
      }).then(
        resp => {
          console.log(resp)
          const result = resp.data
          if (result.code == 2) {
            this.dialogFormVisible = false
            this.centerDialogVisible = true
            this.titMsg = result.message
            this.getSupplierList()
          }
        }
      )
    },
    // 分页
    pageChange (page) {
      this.getSupplierList(page)
    }
  },
  // filters: {
  //   searchSuppiler (val) {
  //     let res = this.SupplierList.filter(item => {
  //       if (this.searchKey == '' || item.venderCode.indexOf(this.searchKey) != -1 || item.name.indexOf(this.searchKey) != -1) {
  //         return item
  //       }
  //     })
  //     return res
  //   }
  // },
  computed: {
    SupplierListData: {
      get () {
        let res = this.SupplierList.filter(item => {
          if (this.searchKey == '' || item.venderCode.indexOf(this.searchKey) != -1 || item.name.indexOf(this.searchKey) != -1) {
            return item
          }
        })
        return res
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-form
  height 40px
.el-table
  margin-left 20px
.add-supplier >>> .el-dialog .el-dialog__body
  height 180px
</style>