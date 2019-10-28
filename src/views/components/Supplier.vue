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
          创建用户
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
            @click.native.prevent="showDialog(scope.$index, userList)"
            type="primary"
            size="mini">
            修改
          </el-button>
          <el-button
            @click.native.prevent="deleteUser(scope.$index, userList)"
            type="danger"
            size="mini">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加供应商对话框 -->
    <el-dialog :title="dialogMsg" :visible.sync="dialogFormVisible">
      <el-form size="mini" :model="supplierForm" :rules="supplierRules" :inline="true" class="demo-form-inline">
        <el-form-item label="供应商编号" label-width="95px" prop="venderCode">
          <el-input v-model="supplierForm.venderCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称" label-width="95px" prop="name">
          <el-input v-model="supplierForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="95px" prop="passWord">
          <el-input v-model="supplierForm.passWord" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="联系人" label-width="95px" prop="contactor">
          <el-input v-model="supplierForm.contactor" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="地址" label-width="95px">
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
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'querystring'
export default {
  name: 'Supplier',
  data () {
    return {
      loading: true,
      SupplierList: [],
      searchKey: '',
      SupplierListColumns: [
        { id: 'venderCode', label: '供应商编号', width: 85 },
        { id: 'name', label: '供应商名称', width: 100 },
        { id: 'contactor', label: '联系人', width: 85 },
        { id: 'address', label: '地址', width: 185 },
        { id: 'postCode', label: '邮政编码', width: 85 },
        { id: 'createDate', label: '注册日期', width: 110 },
        { id: 'tel', label: '电话', width: 120 },
        { id: 'fax', label: '传真', width: 95 }
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
        passWord: [
          { required: true }
        ]

      },
      dialogMsg: '添加供应商',
      dialogFormVisible: false,
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
      }
    }
  },
  created (page = 1, venderCode, name) {
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
        this.loading = false
      }
    ).catch(
      err => console.log(err)
    )
  },
  methods: {
    // 添加供应商
    addSupplier () {
      console.log('添加供应商')
      this.dialogFormVisible = true
    },
    updateSupplier () {
      console.log('更新供应商信息')
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
>>>.el-dialog .el-dialog__body
  height 180px
</style>