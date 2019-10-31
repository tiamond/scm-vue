<template>
  <div v-loading="divLoading">
    <!-- 添加明细 与 保存 -->
    <el-form :inline="true" class="demo-form-inline add-btn" size="mini">
      <el-form-item>
        <el-button type="primary" @click="addDetail"> <i class="el-icon-circle-plus"></i> 添加明细</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit"> <i class="el-icon-s-claim"></i> 保存</el-button>
      </el-form-item>
    </el-form>

    <!-- 采购订单 -->
    <el-form :inline="true" :model="purchaseForm" class="demo-form-inline pomianForm" size="mini">
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
      <el-form-item label="附加费用" label-width="120px">
        <el-input v-model="purchaseForm.tipFee" placeholder="附加费用"></el-input>
      </el-form-item>
      <el-form-item label="采购总价" label-width="120px" >
        <el-input :value="Number(purchaseForm.productTotal) + Number(purchaseForm.tipFee)" disabled placeholder="自动生成"></el-input>
      </el-form-item>
      <el-form-item label="供应商编号" label-width="120px">
        <el-select v-model="purchaseForm.venderCode" placeholder="请选择供应商">
          <el-option 
            v-for="item in supplierCateList"
            :key="item.venderCode"
            :label="item.name" 
            :value="item.venderCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="付款方式" label-width="105px">
        <el-select v-model="purchaseForm.payType" placeholder="请选择付款方式">
          <el-option label="货到付款" value="1"></el-option>
          <el-option label="款到发货" value="2"></el-option>
          <el-option label="预付款到发货" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采购单状态" label-width="105px">
        <el-select v-model="purchaseForm.status" placeholder="请选择采购单状态">
          <el-option label="新增" value="1"></el-option>
          <el-option label="已发货" value="2"></el-option>
          <el-option label="已付款" value="3"></el-option>
          <el-option label="已了结" value="4"></el-option>
          <el-option label="已预付" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最低预付款金额" label-width="120px">
        <el-input v-model="purchaseForm.prePayFee" placeholder="最低预付款金额"></el-input>
      </el-form-item>
      <el-form-item label="备注" label-width="120px">
        <el-input v-model="purchaseForm.remark" placeholder="备注"></el-input>
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
          <el-input v-model="scope.row.unitPrice" placeholder="" @change="getProTotal"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="产品数量">
        <template slot-scope="scope">
          <el-input v-model="scope.row.num" placeholder="" @change="getProTotal"></el-input>
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

    <!-- 选择产品 -->
    <el-dialog title="产品分类" :visible.sync="dialogProCateVisible">
      <el-table
        :data="ProList"
        height="250"
        border
        size="mini"
        style="width: 100%">
        <el-table-column
          label="产品编号"
          width="100">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index">{{scope.row.productCode}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          label="名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="unitName"
          label="计量单位">
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
    return {
      /* purchaseForm: {
        poId: '',
        venderCode: '',
        account: '',
        createTime: '',
        tipFee: 0,
        productTotal: '',
        poTotal: '',
        payType: '',
        prePayFee: 0,
        status: '',
        remark: '',
        poitems: [
          // {
          //   productCode: '',
          //   unitPrice: '',
          //   num: '',
          //   unitName: '',
          //   itemPrice: ''
          // }
        ], 
      },*/
      acount: 1,
      ProAcount: 1,
      supplierCateList: [],
      ProList: [],
      centerDialogVisible: false,
      titMsg: '',
      radio: '',
      poitemsIndex: '',
      dialogProCateVisible: false,
      divLoading: true,
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
            let arr = result.list.reduce((prev, cur) => {
              prev.push({venderCode: cur.venderCode,name: cur.name})
              return prev
            }, [])
            this.supplierCateList = this.supplierCateList.concat(arr)
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
      this.dialogProCateVisible = true
      this.poitemsIndex = index
    },
    // 确认选择
    comfirmChose () {
      const seleted = this.ProList[this.radio]
      this.purchaseForm.poitems[this.poitemsIndex].productCode = seleted.productCode
      this.purchaseForm.poitems[this.poitemsIndex].productName = seleted.productName
      this.purchaseForm.poitems[this.poitemsIndex].unitName = seleted.unitName
      this.dialogProCateVisible = false
    },
    // 删除一条明细
    deleteOne (index) {
       this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.purchaseForm.poitems.splice(index, 1)
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
    onSubmit () {
      this.divLoading = true
      this.purchaseForm.poTotal = this.purchaseForm.productTotal + this.purchaseForm.tipFee
      console.log(this.purchaseForm)
      if (this.purchaseForm.poitems.length) {
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
</style>
