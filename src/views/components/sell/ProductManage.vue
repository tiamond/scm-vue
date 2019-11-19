<template>
  <div>
    <!-- 添加 -->
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-button 
          class="addUser"
          type="primary" 
          @click="addPoduct" 
          style="margin: 0 20px"
          size="small">
          添加产品
        </el-button>
      </el-form-item>
      <el-form-item label="查找产品">
        <el-input v-model="searchKey" placeholder="请输入供应商名称或者编号"></el-input>
      </el-form-item>
    </el-form>

    <!-- 产品分类列表 -->
    <el-table
      :data="productList"
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
        v-for="col in ProductListColumns" :key="col.id"
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
            @click.native.prevent="updateOne(scope.$index, productList)"
            type="primary"
            size="mini">
            修改
          </el-button>
          <el-button
            @click.native.prevent="deleteOne(scope.$index, productList)"
            type="danger"
            size="mini">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加和更改产品 -->
    <el-dialog :title="dialogMsg" :visible.sync="dialogFormVisible" class="add-supplier">
      <el-form 
        ref="proForm" 
        size="mini" 
        :model="productForm" 
        :rules="productRules" 
        :inline="true" 
        class="demo-form-inline">
        <el-form-item label="产品编号" label-width="95px" prop="productCode">
          <el-input v-model="productForm.productCode" autocomplete="off" :disabled="proIdISDis"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" label-width="95px" prop="name">
          <el-input v-model="productForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量单位" label-width="95px" prop="unitName">
          <el-input v-model="productForm.unitName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类编号" label-width="95px" prop="categoryId">
          <el-select v-model="productForm.categoryId" placeholder="请选择产品类型">
            <el-option
              v-for="(item, index) in proCateList"
              :key="index"
              :label="item.name" 
              :value="item.categoryId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售价" label-width="95px" prop="price">
          <el-input v-model="productForm.price" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item :label="creOrUpdMsg" label-width="95px">
          <el-input v-model="productForm.createDate" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="95px" prop="remark">
          <el-input v-model="productForm.remark" autocomplete="off" type="text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="total">
    </el-pagination>

    <!-- 提示框 -->
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
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'querystring'
export default {
  name: 'ProductManage',
  data () {
    return {
      searchKey: '',
      page: 1,
      total: 0,
      loading: true,
      productList: [],
      ProductListColumns: [
        { id: 'productCode', label: '产品编号', width: 70 },
        { id: 'name', label: '产品名称', width: 110 },
        { id: 'num', label: '数量', width: 70 },
        { id: 'unitName', label: '数量单位', width: 70 },
        { id: 'categoryName', label: '分类名称', width: 70 },
        { id: 'createDate', label: '添加日期', width: 150 },
        { id: 'price', label: '销售价', width: 70 },
        { id: 'remark', label: '产品描述', width: 250 },
      ],
      dialogFormVisible: false,
      dialogMsg: '',
      centerDialogVisible: false,
      titMsg: '',
      logoutDialogVisible: false,
      willBeDelete: '',
      isAddOrUpd: '',
      dialogMsg: '添加产品',
      productForm: {
        productCode: '',
        name: '',
        unitName: '',
        categoryId: '',
        price: '',
        createDate: '',
        remark: '',
      },
      creOrUpdMsg: '添加日期',
      productRules: {
        productCode: [
          { required: true, message: '请输入产品编号', trrigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入产品名称', trrigger: 'blur' }
        ],
        unitName: [
          { required: true, message: '请输入计量单位', trrigger: 'blur' }
        ]
      },
      proCateList: [],
      acount: 1,
      proIdISDis: false,
    }
  },
  watch: {
    dialogFormVisible: {
      handler (val) {
        val || this.$refs['proForm'].resetFields()
        val || this.initProForm()
      }
    }
  },
  created () {
    this.getProList()
  },
  methods: {
    // 获取产品分类类表
    getProCaseList (page = 1, categoryId) {
      axios({
        method: 'GET',
        url: '/api/main/sell/category/show',
        params: {
          page,
          categoryId
        }
      }).then(
        resp => {
          if (resp.data.list.length != 0) {
            let arr = resp.data.list.reduce((prev, cur) => {
              prev.push({categoryId: cur.categoryId,name: cur.name})
              return prev
            }, [])
            this.proCateList = this.proCateList.concat(arr)
            console.log(this.proCateList)
            this.acount++
            this.getProCaseList(this.acount)
          }
        }
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
    // 获取列表
    getProList (page = 1, productCode, name, categoryId) {
      this.loading = true
      axios({
        method: 'GET',
        url: '/api/main/sell/product/show',
        params: {
          page,
          productCode,
          name,
          categoryId
        }
      }).then(
        resp => {
          this.productList = resp.data.list
          this.total = resp.data.total
          this.loading = false
          if (resp.data.code === 1) {
            this.centerDialogVisible = true
            this.titMsg = resp.data.message+'， 3秒后跳转登录页面'
            setTimeout(() => {
              this.$router.push('/sys-manage/login')
            }, 3000);
          }
        }
      )
    },
    // 添加产品
    addPoduct () {
      this.dialogFormVisible = true
      this.initProForm()
      // this.$refs['proForm'].resetFields()
      this.proIdISDis = false
      this.dialogMsg = '添加商品'
      this.isAddOrUpd = 'add'
      this.productForm.createDate = this.setNowTime()
      this.proCateList = []
      this.getProCaseList()
    },
    // 确认修改或添加
    update () {
      this.$refs['proForm'].validate(valid => {
        if (valid) {
          axios({
            method: 'POST',
            url: `api/main/sell/product/${this.isAddOrUpd}`,
            data: qs.stringify(this.productForm)
          }).then(
            resp => {
              const result = resp.data
              this.dialogFormVisible = false
              this.centerDialogVisible = true
              this.titMsg = result.message
              if (result.code == 2) {
                this.getProList()
              }
            }
          )
        } else {
          return false
        }
      })
    },
    // 分页
    pageChange (page) {
      this.page = page
      this.getProList (page)
    },
    // 删除一行
    deleteOne (index, data) {
      const productCode = data[index].productCode
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'POST',
          url: '/api/main/sell/product/delete',
          data: qs.stringify({
            productCode,
          })
        }).then(
          resp => {
            if (resp.data.code === 2) {
              this.$message({
                type: 'success',
                message: resp.data.message
              });
              this.getProList(this.page)
            } else {
              this.$message({
                type: 'info',
                message: resp.data.message
              }); 
            }
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除失败'
        });  
      });
    },
    // 修改一行
    updateOne (index, data) {
      this.getProCaseList()
      const res = data[index]
      this.productForm = {...res}
      this.dialogFormVisible = true
      this.dialogMsg = '修改商品'
      this.proIdISDis = true
      this.isAddOrUpd = 'update'
    },
    // 数据初始化
    initProForm () {
      this.productForm.productCode = ''
      this.productForm.name = ''
      this.productForm.unitName = ''
      this.productForm.categoryId = ''
      this.productForm.price = ''
      this.productForm.createDate = ''
      this.productForm.remark = ''
    }
  }
}
</script>

<style>

</style>