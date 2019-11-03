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

    <!-- 销售订单 -->
    <el-form :inline="true" :model="somainForm" class="demo-form-inline pomianForm" size="mini">
      <el-form-item label="销售单编号" label-width="120px">
        <el-input v-model="somainForm.soId" placeholder="销售单编号" disabled></el-input>
      </el-form-item>
      <el-form-item label="创建用户" label-width="120px">
        <el-input v-model="somainForm.account" placeholder="创建用户" disabled></el-input>
      </el-form-item>
      <el-form-item label="创建时间" label-width="120px">
        <el-input v-model="somainForm.createTime" placeholder="创建时间" disabled></el-input>
      </el-form-item>
      <el-form-item label="采购产品总价" label-width="120px">
        <el-input v-model="somainForm.productTotal" placeholder="自动生成" disabled></el-input>
      </el-form-item>
      <el-form-item label="附加费用" label-width="120px">
        <el-input v-model="somainForm.tipFee" placeholder="附加费用"></el-input>
      </el-form-item>
      <el-form-item label="采购总价" label-width="120px" >
        <el-input :value="Number(somainForm.productTotal) + Number(somainForm.tipFee)" disabled placeholder="自动生成"></el-input>
      </el-form-item>
      <!-- 需要弹框 -->
      <el-form-item label="客户编号" label-width="120px">
        <el-input class="cusIpt" placeholder="请点击选择" v-model="somainForm.customerCode" disabled>
          <template slot="append"><i class="el-icon-edit-outline" @click="chooseCustommer"></i></template>
        </el-input>
      </el-form-item>
      <el-form-item label="付款方式" label-width="120px">
        <el-select v-model="somainForm.payType" placeholder="请选择付款方式">
          <el-option label="货到付款" :value="1"></el-option>
          <el-option label="款到发货" :value="2"></el-option>
          <el-option label="预付款到发货" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采购单状态" label-width="105px">
        <el-select v-model="somainForm.status" placeholder="请选择采购单状态">
          <el-option label="新增" :value="1"></el-option>
          <el-option label="已发货" :value="2"></el-option>
          <el-option label="已付款" :value="3"></el-option>
          <el-option label="已了结" :value="4"></el-option>
          <el-option label="已预付" :value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最低预付款金额" label-width="120px">
        <el-input v-model="somainForm.prePayFee" placeholder="最低预付款金额"></el-input>
      </el-form-item>
      <el-form-item label="备注" label-width="120px">
        <el-input v-model="somainForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>

    <!-- 明细表格 -->
    <el-table
      :data="somainForm.soitems"
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
          prop="name"
          label="名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="unitName"
          label="计量单位">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="proPageChange"
        :total="proPageTotal">
      </el-pagination>
      <el-form :inline="true" class="demo-form-inline customer-confirm" size="mini">
        <el-form-item>
          <el-button type="primary" @click="comfirmChose">确定</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="dialogProCateVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 选择客户 -->
    <el-dialog title="客户选择" :visible.sync="dialogChooseCustomerVisible">
      <el-table
        :data="customerList"
        height="250"
        border
        size="mini"
        style="width: 100%">
        <el-table-column
          label="客户编号"
          width="100">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index">{{scope.row.customerCode}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="contactor"
          label="联系人">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="CustomerPageChange"
        :total="customerTotal">
      </el-pagination>
      <el-form :inline="true" class="demo-form-inline customer-confirm" size="mini">
        <el-form-item>
          <el-button type="info" @click="dialogChooseCustomerVisible=false;somainForm.customerCode=''">取消</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="comfirmCustomerChose">确定</el-button>
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
      proPageTotal: '',
      acount: 1,
      ProAcount: 1,
      customerList: [],
      ProList: [],
      centerDialogVisible: false,
      titMsg: '',
      radio: '',
      poitemsIndex: '',
      dialogProCateVisible: false,
      divLoading: true,
      dialogChooseCustomerVisible: false,
      customerTotal: 0
    }
  },
  created () {
    this.getCustomerList()
    this.getProList()
    this.divLoading = false
    console.log(this.somainForm);
  },
  computed: {
    ...mapState(['somainForm', 'noteIsUpdOrDel'])
  },
  methods: {
    // 添加明细
    addDetail () {
      this.somainForm.soitems.push(
        {
          productCode: '',
          num: 1,
          unitName: '',
          unitPrice: '',
          itemPrice: ''
        }
      )
    },
    // 选择销售对象客户
    chooseCustommer () {
      this.dialogChooseCustomerVisible = true
    },
    // 获取对象列表
    getCustomerList (page = 1) {
      axios({
        method: 'GET',
        url: '/api/main/sell/customer/show',
        params: {
          page,
        }
      }).then(({data}) => {
        this.customerList = data.list
        this.customerTotal = data.total
      })
    },
    // 选择商品分类
    choseProCate (index) {
      this.dialogProCateVisible = true
      this.poitemsIndex = index
    },
    // 确认产品选择
    comfirmChose () {
      const seleted = this.ProList[this.radio]
      this.somainForm.soitems[this.poitemsIndex].productCode = seleted.productCode
      this.somainForm.soitems[this.poitemsIndex].productName = seleted.name
      this.somainForm.soitems[this.poitemsIndex].unitName = seleted.unitName
      this.dialogProCateVisible = false
    },
    // 确认客户选择
    comfirmCustomerChose () {
      const seleted = this.customerList[this.radio]
      this.somainForm.customerCode = seleted.customerCode
      this.dialogChooseCustomerVisible = false
    },
    // 删除一条明细
    deleteOne (index) {
       this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.somainForm.soitems.splice(index, 1)
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
      this.somainForm.soitems.map(item => {
        item.itemPrice = item.num * item.unitPrice
      })
      this.somainForm.productTotal = this.somainForm.soitems.reduce((prev, cur) => {
        prev += cur.itemPrice
        return prev
      }, 0)
    },
    // 提交销售单
    onSubmit () {
      this.divLoading = true
      this.somainForm.soTotal = this.somainForm.productTotal + this.somainForm.tipFee
      console.log(this.somainForm)
      if (this.somainForm.soitems.length) {
        axios({
          method: 'POST',
          url: `/api/main/sell/somain/${this.noteIsUpdOrDel}`,
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify(this.somainForm)
        }).then(
          resp => {
            const result = resp.data
            console.log(result)
            if (result.code === 2) {
              this.divLoading = false
              this.centerDialogVisible = true
              this.titMsg = result.message+'3秒后自动返回'
              setTimeout(() => {
                this.$router.push('/sell-manage/add-somain')
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
    // 选择客户时候的分页
    CustomerPageChange (page) {
      this.getCustomerList(page)
    },
    // 获取商品列表
    getProList (page = 1) {
      axios({
        method: 'GET',
        url: '/api/main/sell/product/show',
        params: {
          page,
        }
      }).then(({data}) => {
        console.log(data)
        this.ProList = data.list
        this.proPageTotal = data.total
      })
    },
    // 选择产品时的分页
    proPageChange (page) {
      this.getProList(page)
    }
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
.cusIpt
  width 180px
.customer-confirm
  text-align right
</style>
