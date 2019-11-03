<template>
  <div>
   <!-- 添加供应商 与 模糊查找 -->
    <el-form :inline="true" :form="queryForm" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-button 
          class="addUser"
          type="primary" 
          @click="addCustomer" 
          style="margin: 0 20px"
          size="small">
          添加客户
        </el-button>
      </el-form-item>
      <el-form-item label="客户编号">
        <el-input v-model="queryForm.customerCode" placeholder="请输入供应商编号"></el-input>
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input v-model="queryForm.name" placeholder="请输入供应商名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryC">查找</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 供应商列表 -->
    <el-table
      :data="customerList"
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
        v-for="col in customerListColumns" :key="col.id"
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
            @click.native.prevent="showDialog(scope.row)"
            type="primary"
            size="mini">
            修改
          </el-button>
          <el-button
            @click.native.prevent="deleteSCustomer(scope.row)"
            type="danger"
            size="mini">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或者修改供应商对话框 -->
    <el-dialog :title="dialogMsg" :visible.sync="dialogFormVisible" class="add-supplier">
      <el-form size="mini" :model="customerForm" :rules="CustomerRules" :inline="true" class="demo-form-inline">
        <el-form-item label="客户编号" label-width="95px" prop="customerCode">
          <el-input v-model="customerForm.customerCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="客户名称" label-width="95px" prop="name">
          <el-input v-model="customerForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="95px">
          <el-input v-model="customerForm.passWord" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="联系人" label-width="95px" prop="contactor">
          <el-input v-model="customerForm.contactor" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="地址" label-width="95px" prop="address">
          <el-input v-model="customerForm.address" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" label-width="95px">
          <el-input v-model="customerForm.postCode" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item :label="creOrUpdMsg" label-width="95px">
          <el-input v-model="customerForm.createDate" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="95px" prop="tel">
          <el-input v-model="customerForm.tel" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="传真" label-width="95px">
          <el-input v-model="customerForm.fax" autocomplete="off" type="text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCustomer">确 定</el-button>
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
  data () {
    return {
      page: 1,
      total: 0,
      centerDialogVisible: false,
      titMsg: '',
      loading: true,
      customerForm: {
        customerCode: '',
        name: '',
        passWord: '',
        contactor: '',
        address: '',
        postCode: '',
        createDate: '',
        tel: '',
        fax: '',
      },
      customerList: [],
      customerListColumns: [
        { id: 'customerCode', label: '客户编号', width: 85 },
        { id: 'name', label: '客户名称', width: 90 },
        { id: 'passWord', label: '密码', width: 90 },
        { id: 'contactor', label: '联系人', width: 70 },
        { id: 'address', label: '地址', width: 185 },
        { id: 'postCode', label: '邮政编码', width: 85 },
        { id: 'createDate', label: '注册日期', width: 140 },
        { id: 'tel', label: '电话', width: 120 },
        { id: 'fax', label: '传真', width: 90 }
      ],
      queryForm: {
        createCode: '',
        name: '',
      },
      dialogMsg: '添加客户',
      dialogFormVisible: false,
      creOrUpdMsg: '创建日期',
      isAUD: 'add',
      CustomerRules: {
        customerCode: [
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
    } 
  },
  created () {
    this.queryCustomer()
  },
  methods: {
    setNowTime() {
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth()+1
      let d = date.getDate()
      let h = date.getHours()
      let mm = date.getMinutes()
      let s = date.getSeconds()
      return `${y}-${m < 10 ? '0'+m : m}-${d < 10 ? '0'+d : d}`
    },
    // 添加客户
    addCustomer () {
      this.dialogFormVisible = true
      this.isAUD = 'add'
      this.customerForm.createDate = this.setNowTime()
    },  
    queryC() {
      this.queryCustomer()
    },
    // 查询请求
    queryCustomer (page=1) {
      this.loading = true
      axios({
        url: '/api/main/sell/customer/show',
        method: 'GET',
        params: {
          page,
          customerCode: this.queryForm.customerCode,
          name: this.queryForm.name,
        }
      }).then(({data}) => {
        console.log('查询结果', data)
        this.customerList = data.list
        this.loading = false
      })
    },
    // 添加或者更新顾客
    updateCustomer () {
      this.dialogFormVisible = false
      this.loading = true
      this.customerAUD().then(({data}) => {
        console.log(data)
        if (data.code === 2) {
          this.centerDialogVisible = true
          this.titMsg = data.message
          this.queryCustomer(this.page)
        } else {
          this.centerDialogVisible = true
          this.titMsg = data.message
        }
      }).catch((data) => {
        console.log(data)
      })
    },
    // 发送客户增的请求
    customerAUD () {
      return new Promise((resolve, reject) => {
        axios({  
          method: 'POST',
          url: `api/main/sell/customer/${this.isAUD}`,
          data: qs.stringify(this.customerForm)
        }).then(resp => resolve(resp)).catch(err => reject(err))
      })
    },
    // 分页
    pageChange (page) {
      this.page = page
      this.queryCustomer(page)
    },
    // 修改
    showDialog (data) {
      this.customerForm = data
      this.dialogFormVisible = true
      this.isAUD = 'update'
    },
    // 删除
    deleteSCustomer ({customerCode}) {
      console.log(customerCode)
      this.isAUD = 'delete'
      this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'POST',
          url: '/api/main/sell/customer/delete',
          data: qs.stringify({customerCode})
        }).then(({data}) => {
          if (data.code === 2) {
            this.$message({
              type: 'success',
              message: data.message
            })
            this.queryCustomer(this.page)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 初始化数据
    initCustommerForm () {
      this.customerForm.createCode = ''
      this.customerForm.name = ''
      this.customerForm.passWord = ''
      this.customerForm.contactor = ''
      this.customerForm.address = ''
      this.customerForm.postCode = ''
      this.customerForm.createDate = ''
      this.customerForm.tel = ''
      this.customerForm.fax = ''
    },
  }
}
</script>

<style>

</style>