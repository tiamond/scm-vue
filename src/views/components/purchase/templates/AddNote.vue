<template>
  <div v-loading="divLoading">
    <!-- 添加明细 与 保存 -->
    <el-form :inline="true" class="demo-form-inline add-btn" size="mini">
      <el-form-item>
        <el-button type="primary" @click="addDetail"> <i class="el-icon-circle-plus"></i> 添加明细</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('purchaseForm')"> <i class="el-icon-s-claim"></i> 保存</el-button>
      </el-form-item>
    </el-form>

    <!-- 采购订单 -->
    <el-form 
      :inline="true" 
      ref="purchaseForm"
      :model="purchaseForm" 
      class="demo-form-inline pomianForm" 
      size="mini"
      :rules="checkPurchase">
      <el-form-item label="采购单编号" label-width="120px">
        <el-input v-model="purchaseForm.poId" placeholder="采购单编号" disabled></el-input>
      </el-form-item>
      <el-form-item label="创建用户" label-width="120px">
        <el-input v-model="purchaseForm.account" placeholder="创建用户" disabled></el-input>
      </el-form-item>
      <el-form-item label="创建时间" label-width="120px">
        <el-input v-model="purchaseForm.createTime" placeholder="创建时间" disabled></el-input>
      </el-form-item>
      <el-form-item label="产品总价" label-width="120px">
        <el-input v-model="purchaseForm.productTotal" placeholder="自动生成" disabled></el-input>
      </el-form-item>
      <el-form-item 
        label="附加费用" 
        label-width="120px" 
        prop="tipFee">
        <el-input oninput="value = value.replace(/[^\d\.]/g, '')" v-model="purchaseForm.tipFee" placeholder="附加费用"></el-input>
      </el-form-item>
      <el-form-item label="采购总价" label-width="120px" >
        <el-input :value="Number(purchaseForm.productTotal) + Number(purchaseForm.tipFee)" disabled placeholder="自动生成"></el-input>
      </el-form-item>
      <el-form-item label="供应商编号" label-width="120px" prop="venderCode">
          <el-input placeholder="选择" v-model="purchaseForm.venderCode" class="input-vender" disabled>
            <el-button slot="append" icon="el-icon-edit-outline" @click="choseVender">
            </el-button>
          </el-input>
      </el-form-item>
      <el-form-item label="付款方式" label-width="105px" prop="payType">
        <el-select v-model="purchaseForm.payType" placeholder="请选择付款方式">
          <el-option label="货到付款" :value="1"></el-option>
          <el-option label="款到发货" :value="2"></el-option>
          <el-option label="预付款到发货" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采购单状态" label-width="105px">
        <el-select v-model="purchaseForm.status" placeholder="请选择采购单状态" disabled>
          <el-option label="新增" :value="1"></el-option>
          <el-option label="已发货" :value="2"></el-option>
          <el-option label="已付款" :value="3"></el-option>
          <el-option label="已了结" :value="4"></el-option>
          <el-option label="已预付" :value="5"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="备注" label-width="120px">
        <el-input v-model="purchaseForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="最低预付款金额" label-width="120px" prop="prePayFee" v-if="purchaseForm.payType == 3">
        <el-input oninput="value = value.replace(/[^\d\.]/g, '')" v-model="purchaseForm.prePayFee" placeholder="最低预付款金额"></el-input>
      </el-form-item>
     
    </el-form>

    <!-- 明细表格 -->
    <el-table
      :data="purchaseForm.poitems"
      style="width: 93%"
      size="mini"
      border
      max-height="850">
      <el-table-column
        label="序号"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column label="产品编号">
        <template slot-scope="scope">
          <el-input placeholder="选择" v-model="scope.row.productCode" class="input-with-select" disabled>
            <el-button slot="append" icon="el-icon-edit-outline" @click="choseProCate(scope.$index)">
            </el-button>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="产品名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.productName" placeholder="" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column label="产品单价">
        <template slot-scope="scope">
          <el-input  oninput="value = value.replace(/[^\d\.]/, '')" v-model="scope.row.unitPrice" placeholder="" @change="getProTotal"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="产品数量">
        <template slot-scope="scope">
          <el-input  oninput="value = value.replace(/[^\d]/, '')" v-model="scope.row.num" placeholder="" @change="getProTotal"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="数量单位">
        <template slot-scope="scope">
          <el-input v-model="scope.row.unitName" placeholder="" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column label="明细总价">
        <template slot-scope="scope">
          <el-input :value="scope.row.num * scope.row.unitPrice" placeholder="" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
        class="cmondBtn">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteOne(scope.$index)"
            type="danger"
            size="mini">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <!-- 选择产品 供应商 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogProCateVisible">
      <el-table
        :data="dialogTable"
        height="250"
        border
        size="mini"
        style="width: 100%">
        <el-table-column
          v-if="isPro"
          label="商品编号"
          width="100">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index">{{scope.row.productCode}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          label="供应商编号">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index">{{scope.row.venderCode}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          v-for="col in dialogColumns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label">
        </el-table-column>
      </el-table>
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-button type="primary" @click="comfirmChose">确定</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogProCateVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
import qs from 'querystring'
import cookie from 'js-cookie'
import {mapState} from 'vuex'
export default {
  data () {
    const checkTipFee = (rule, value, callback) => {
      if (value == '') {
        this.purchaseForm.tipFee = 0
        callback()
      } else {
        callback()
      }
    }
    return {
      comfirmChose: this.comfirmPro,
      dialogTitle: '',
      acount: 1,
      ProAcount: 1,
      dialogTable: [],
      supplierCateList: [],
      ProList: [],
      isPro: true,
      centerDialogVisible: false,
      titMsg: '',
      radio: '',
      poitemsIndex: '',
      dialogProCateVisible: false,
      divLoading: true,
      checkPurchase: {
        tipFee: [
          {pattern: /^[0-9]+(.[0-9]{1,2})?$/, message: '请输入正数，最多保留2位小数', trigger: 'blur'},
          {validator: checkTipFee, trigger: 'blur'}
        ],
        prePayFee: [
          {pattern: /^[0-9]+(.[0-9]{1,2})?$/, message: '请输入正数，最多保留2位小数', trigger: 'blur'},
          {validator: checkTipFee, trigger: 'blur'}
        ],
        venderCode: [
          {required: true, message: '请选择供应商', trigger: 'change'}
        ],
        payType: [
          {required: true, message: '请选择付款方式', trigger: 'change'}
        ]
      },
      dialogColumns: [],
      ProColumns: [
        {prop: 'productCode', label: '产品编号'},
        {prop: 'unitName', label: '计量单位'}
      ],
      VenColumns: [
        {prop: 'venderCode', label: '供应商编号'},
        {prop: 'name', label: '供应商名称'},
        {prop: 'contactor', label: '联系人'},
        {prop: 'tel', label: '联系电话'},
      ],
    }
  },
  created () {
    this.getProCaseList()
    this.getProductList()
    this.divLoading = false
  },
  computed: {
    ...mapState(['purchaseForm', 'noteIsUpdOrDel'])
  },
  methods: {
    // 添加明细
    addDetail () {
      this.purchaseForm.poitems.push(
        {
          productCode: '',
          num: '',
          unitName: '',
          unitPrice: '',
          itemPrice: ''
        }
      )
    },
    // 选择供应商
    choseVender () {
      this.dialogTitle = '选择供应商'
      this.comfirmChose = this.confirmVender
      this.dialogTable = this.supplierCateList;
      this.isPro = false
      this.dialogProCateVisible = true
      this.dialogColumns = this.VenColumns
    },
    // 确认选择
    confirmVender () {
      const vender = this.supplierCateList[this.radio]
      this.purchaseForm.venderCode = vender.venderCode
      this.dialogProCateVisible = false
    },
    // 获取商品分类
    getProductList (page = 1, categoryId) {
      axios({
        method: 'GET',
        url: '/api/main/sell/product/show',
        params: {
          page,
          categoryId
        }
      }).then(
        resp => {
          const result = resp.data
          if (result.code == 1) {
            this.centerDialogVisible = true
            this.titMsg = result.message+'， 3秒后跳转登录页面'
            setTimeout(() => {
              this.$router.push('/sys-manage/login')
            }, 3000);
          }
          if (result.list.length != 0) {
            let arr = result.list.reduce((prev, cur) => {
              prev.push({productCode: cur.productCode,productName: cur.name, unitName: cur.unitName})
              return prev
            }, [])
            this.ProList = this.ProList.concat(arr)
          } 
          if (result.list.length == 10) {
            this.ProAcount++
            this.getProCaseList(this.ProAcount)
          }
        }
      )
    },
    // 获取供应商列表
    getProCaseList (page = 1) {
      axios({
        method: 'GET',
        url: '/api/main/purchase/vender/show',
        params: {
          page
        }
      }).then(
        resp => {
          const result = resp.data
          if (result.code == 1) {
            this.centerDialogVisible = true
            this.titMsg = result.message+'， 3秒后跳转登录页面'
            setTimeout(() => {
              this.$router.push('/sys-manage/login')
            }, 3000);
          }
          if (result.list.length != 0) {
            this.supplierCateList = this.supplierCateList.concat(result.list)
          }
          if (result.list.length == 10) {
            this.acount++
            this.getProCaseList(this.acount)
          }
        }
      )
    },
    // 选择商品分类
    choseProCate (index) {
      this.dialogTitle = '选择产品'
      this.comfirmChose = this.comfirmPro
      this.dialogTable = this.ProList
      this.dialogColumns = this.ProColumns
      this.isPro = true
      this.dialogProCateVisible = true
      this.poitemsIndex = index
    },
    // 确认商品选择
    comfirmPro () {
      const seleted = this.ProList[this.radio]
      const poitems = Array.from(this.purchaseForm.poitems)
      const bool = poitems.some(item => {
        return item.productCode === seleted.productCode
      })
      if (bool) {
        this.centerDialogVisible = true
        this.titMsg = '明细中存在该商品'
      } else {
        this.purchaseForm.poitems[this.poitemsIndex].productCode = seleted.productCode
        this.purchaseForm.poitems[this.poitemsIndex].productName = seleted.productName
        this.purchaseForm.poitems[this.poitemsIndex].unitName = seleted.unitName
        this.dialogProCateVisible = false
      }
    },
    // 删除一条明细
    deleteOne (index) {
       this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.purchaseForm.poitems.splice(index, 1)
        this.getProTotal()
        this.$message({
          type: 'success',
          message: '删除成功'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除失败'
        });  
      });
    },
    // 获得产品总价
    getProTotal () {
      this.purchaseForm.poitems.map(item => {
        item.itemPrice = item.num * item.unitPrice
      })
      this.purchaseForm.productTotal = this.purchaseForm.poitems.reduce((prev, cur) => {
        prev += cur.itemPrice
        return prev
      }, 0)
    },
    // 提交采购单
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.purchaseForm.poTotal = this.purchaseForm.productTotal + this.purchaseForm.tipFee
          console.log(this.purchaseForm)
          if (this.purchaseForm.poitems.length && this.purchaseForm.poitems.every(item => item.productCode!=''&&item.num!=''&&item.unitPrice!='')) {
            this.divLoading = true
            axios({
              method: 'POST',
              url: `/api/main/purchase/pomain/${this.noteIsUpdOrDel}`,
              headers: {'Content-Type': 'application/json'},
              data: JSON.stringify(this.purchaseForm)
            }).then(
              resp => {
                const result = resp.data
                console.log(result)
                if (result.code === 2) {
                  this.divLoading = false
                  this.centerDialogVisible = true
                  this.titMsg = result.message+'3秒后自动返回'
                  setTimeout(() => {
                    this.$router.push('/purchase/add-purchase-note')
                  }, 3000);
                } else {
                  this.divLoading = false
                  this.centerDialogVisible = true
                  this.titMsg = result.message
                }
              }
            )
          } else {
            this.centerDialogVisible = true
            this.titMsg = '采购明细不能为空！'
          }
        } else {
          console.log('error submit!!');
          return false
        }
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.add-btn
  margin-top 10px 
i 
  font-size 16px
.demo-form-inline
  margin-left 10px
.pomianForm
  width 90%
  padding-top 10px 
  background-color #F5F8FA
  border-radius 15px
  box-shadow 0px 0px 5px 1px #ccc
.el-table
  margin 10px
.input-vender
  width 180px
</style>
