<template>
  <div>

    <!--查询 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline queryForm" size="mini">
      <el-form-item label="销售单编号" class="ipt">
        <el-input v-model="queryForm.soId" placeholder="销售单编号"></el-input>
      </el-form-item>
      <el-form-item label="客户编号" class="iptvender">
        <el-input placeholder="选择" v-model="queryForm.customerCode" class="input-with-select" readonly>
          <el-button slot="append" icon="el-icon-edit-outline" @click="choseSupplier"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择开始日期" v-model="queryForm.startDate" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">—</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择结束日期" v-model="queryForm.endDate" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="付款方式" class="select">
        <el-select v-model="queryForm.payType" placeholder="请选择">
          <el-option label="货到付款" value="1"></el-option>
          <el-option label="款到发货" value="2"></el-option>
          <el-option label="预付款到发货" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态" class="select">
        <el-select v-model="queryForm.status" placeholder="请选择">
          <el-option label="新增" value="1"></el-option>
          <el-option label="已收货" value="2"></el-option>
          <el-option label="已付款" value="3"></el-option>
          <el-option label="已了结" value="4"></el-option>
          <el-option label="已预付" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryItem">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 销售单表格 -->
    <el-table
      :data="tableData"
      size="mini"
      border
      v-loading="loading"
      height="400px"
      style="width: 100%">
      <el-table-column
        v-for="col in tableColumns"
        :key="col.productCode"
        :prop="col.prop"
        :label="col.label"
        :width="col.width">
      </el-table-column>
      <el-table-column
        label="付款方式"
        width="100">
        <template slot-scope="scope">
          <span>{{scope.row.payType == 1 ? '货到付款' : (scope.row.payType == 2 ? '款到发货' : '预付款到发货')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="处理状态"
        width="100">
        <template slot-scope="scope">
          <span>{{scope.row.status == 1 ? '新增' : (scope.row.status == 2 ? '已收货' : (scope.row.status == 3 ? '已付款' : scope.row.status == 4 ? '已了结' : '已预付'))}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="showPoitem(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      @current-change="pageChange"
      layout="prev, pager, next"
      :total="total">
    </el-pagination>

    <!-- 选择客户的弹框-->
    <el-dialog
      title="选择需要查找客户"
      :visible.sync="dialogVisible"
      width="80%">
      <el-table
        :data="customerList"
        size="mini"
        fit
        border
        v-loading="customerLoading"
        height="400px"
        style="width: 100%">
        <el-table-column
          label="客户编号"
          width="100">
          <template slot-scope="scope">
            <el-radio v-model="queryForm.customerCode" :label="scope.row.customerCode">{{scope.row.customerCode}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          v-for="col in customerColumns"
          :key="col.customerCode"
          :prop="col.id"
          :label="col.label">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="customerPageChange"
        layout="prev, pager, next"
        :total="customerTotal">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false; queryForm.customerCode = ''">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看销售单弹框 -->
    <el-dialog class="poItem-dialog" title="订单细节" :visible.sync="dialogNoteDetailVisible" v-loading="detailLoading">
      <el-form :inline="true" :model="somainForm" class="demo-form-inline" size="mini" readonly>
        <p>销售单主信息</p>
        <el-form-item label="销售单编号" label-width="120px">
          <el-input v-model="somainForm.soId" placeholder="销售单编号" readonly></el-input>
        </el-form-item>
        <el-form-item label="创建用户" label-width="120px">
          <el-input v-model="somainForm.account" placeholder="创建用户" readonly></el-input>
        </el-form-item>
        <el-form-item label="创建时间" label-width="120px">
          <el-input v-model="somainForm.createTime" placeholder="创建时间" readonly></el-input>
        </el-form-item>
        <el-form-item label="产品总价" label-width="120px">
          <el-input v-model="somainForm.productTotal" placeholder="自动生成" readonly></el-input>
        </el-form-item>
        <el-form-item label="附加费用" label-width="120px">
          <el-input v-model="somainForm.tipFee" placeholder="附加费用" readonly></el-input>
        </el-form-item>
        <el-form-item label="销售总价" label-width="120px" >
          <el-input readonly :value="Number(somainForm.productTotal) + Number(somainForm.tipFee)" readonly placeholder="自动生成"></el-input>
        </el-form-item>
        <el-form-item label="客户名称" label-width="120px">
          <el-input v-model="somainForm.customerName" placeholder="请选择客户" readonly></el-input>
        </el-form-item>
        <el-form-item label="付款方式" label-width="105px">
          <el-input readonly :value="somainForm.payType == 1 ? '货到付款' : (somainForm.payType == 2 ? '款到发货' : '预付款到发货')" placeholder="请选择付款方式"></el-input>
        </el-form-item>
        <el-form-item label="销售单状态" label-width="105px">
          <el-input readonly :value="somainForm.status == 1 ? '新增' : (somainForm.status == 2 ? '已收货' : (somainForm.status == 3 ? '已付款' : somainForm.status == 4 ? '已了结' : '已预付'))" placeholder="请选择销售单状态"></el-input>
        </el-form-item>
        <el-form-item label="最低预付款金额" label-width="120px">
          <el-input v-model="somainForm.prePayFee" placeholder="最低预付款金额" readonly></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="120px">
          <el-input v-model="somainForm.remark" placeholder="备注" readonly></el-input>
        </el-form-item>
        <p>销售单入库信息</p><hr>
        <el-form-item label="入库时间" label-width="120px">
          <el-input v-model="somainForm.stockTime" placeholder="未入库" readonly></el-input>
        </el-form-item>
        <el-form-item label="入库操作用户" label-width="120px">
          <el-input v-model="somainForm.stockUser" placeholder="未入库" readonly></el-input>
        </el-form-item>
        <div v-if="somainForm.payType == 3">
          <p>销售单预付信息</p><hr>
          <el-form-item label="预付时间" label-width="120px">
            <el-input v-model="somainForm.prePayTime" placeholder="未入库" readonly></el-input>
          </el-form-item>
          <el-form-item label="预付操作用户" label-width="120px">
            <el-input v-model="somainForm.prePayUser" placeholder="未入库" readonly></el-input>
          </el-form-item>
        </div>
        <p>销售单付款信息</p><hr>
        <el-form-item label="付款时间" label-width="120px">
          <el-input v-model="somainForm.payTime" placeholder="未付款" readonly></el-input>
        </el-form-item>
        <el-form-item label="付款操作用户" label-width="120px">
          <el-input v-model="somainForm.payUser" placeholder="未付款" readonly></el-input>
        </el-form-item>
      </el-form>
      <hr>
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
            <el-input placeholder="请输入内容" v-model="scope.row.productCode" readonly></el-input>
          </template>
        </el-table-column>
        <el-table-column label="产品名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.productName" placeholder="" readonly></el-input>
          </template>
        </el-table-column>
        <el-table-column label="产品单价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.unitPrice" placeholder="" readonly></el-input>
          </template>
        </el-table-column>
        <el-table-column label="产品数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.num" placeholder="" readonly></el-input>
          </template>
        </el-table-column>
        <el-table-column label="数量单位">
          <template slot-scope="scope">
            <el-input v-model="scope.row.unitName" placeholder="" readonly></el-input>
          </template>
        </el-table-column>
        <el-table-column label="明细总价">
          <template slot-scope="scope">
            <el-input :value="scope.row.itemPrice" placeholder="" readonly></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'SomainQuery',
  data () {
    return {
      tableData: [],
      loading: true,
      tableColumns: [
        {prop: 'soId', label: '销售单编号', width: '130'},
        {prop: 'createTime', label: '创建时间', width: '140'},
        {prop: 'customerName', label: '客户名称', width: '90'},
        {prop: 'account', label: '创建用户', width: '90'},
        {prop: 'tipFee', label: '附加费用', width: '90'},
        {prop: 'productTotal', label: '销售产品总价', width: '95'},
        {prop: 'soTotal', label: '销售单总价格', width: '95'},
        {prop: 'prePayFee', label: '最低预付款金额', width: '105'},
      ],
      noteColumns: [
        {id: 'productCode', label: '产品编号', width: '80px'},
        {id: 'productName', label: '产品名称', width: '80px'},
        {id: 'num', label: '产品数量', width: '80px'},
        {id: 'unitName', label: '数列单位', width: '80px'},
        {id: 'unitPrice', label: '产品单价', width: '80px'},
      ],
      customerColumns: [
        {id: 'name', label: '客户名称', width: '80px'},
        {id: 'contactor', label: '联系人', width: '80px'},
        {id: 'createDate', label: '创建日期', width: '80px'},
        {id: 'tel', label: '电话', width: '80px'},
        {id: 'postCode', label: '邮政编码', width: '80px'},
        {id: 'fax', label: '传真', width: '80px'},
      ],
      total: 0,
      queryForm: {
        soId: '',
        customerCode: '',
        startDate: '',
        endDate: '',
        payType: '',
        status: '',
      },
      dialogVisible: false,
      dialogNoteDetailVisible: false,
      detailLoading: true,
      somainForm: {
        soitems: []
      },
      page: 1,
      customerList: [],
      customerTotal: 0,
      customerLoading: true,
    }
  },
  created () {
    this.sendAxios('query').then(({data}) => {
      this.tableData = data.list
      this.loading = false
      this.total = data.total
    })
    
  },
  methods: {
    // 分页
    pageChange (page) {
      this.page = page
      this.loading = true
      this.sendAxios('query', this.queryForm.soId, this.queryForm.customerCode, this.queryForm.payType, this.queryForm.startDate, this.queryForm.endDate, this.queryForm.status, page).then(({data}) => {
        this.tableData = data.list
        this.loading = false
        this.total = data.total
      })
    },
    // 展示销售单细节
    showPoitem ({soId}) {
      this.detailLoading = true
      this.dialogNoteDetailVisible = true
      this.sendAxios('query', soId).then(({data}) => {
        this.somainForm = data.list[0]
        this.detailLoading = false
        this.sendAxios('queryItem', soId).then(({data}) => {
          this.somainForm.soitems = data
        })
      })
    },
    // 发送请求
    sendAxios (url, soId, customerCode ,payType, startDate, endDate, status, page = 1) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: `api/main/sell/somain/${url}`,
          params: {
            soId,
            customerCode,
            payType, 
            startDate,
            endDate, 
            status,
            page,
          }
        }).then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 查询
    queryItem () {
      console.log('查询')
      this.sendAxios('query', this.queryForm.soId, this.queryForm.customerCode, this.queryForm.payType, this.queryForm.startDate, this.queryForm.endDate, this.queryForm.status).then(({data}) => {
        this.tableData = data.list
        this.total = data.total
        console.log(data)
      })
    },
    // 选择客户查找
    choseSupplier () {
      this.dialogVisible = true
      this.customerLoading = true
      axios({
        method: 'GET',
        url: '/api/main/sell/customer/show'
      }).then(({data}) => {
        console.log(data)
        this.customerList = data.list
        this.customerTotal = data.total
        this.customerLoading = false
      })
    },
    // 客户翻页
    customerPageChange (page) {
      this.customerLoading = true
      axios({
        method: 'GET',
        url: '/api/main/sell/customer/show',
        params: {
          page,
        }
      }).then(({data}) => {
        console.log(data)
        this.customerList = data.list
        this.customerTotal = data.total
        this.customerLoading = false
      })
    }
  },
}
</script>

<style lang="stylus", scoped>
.queryForm
  margin-top 10px
.el-form >>> .el-input__inner
  width 135px
.poItem-dialog >>> .el-dialog
  width 80%
  >>>.el-dialog__body
    padding-top 0
    padding-bottom 20px
  p
    font-weight 700
    margin 0
  .el-table
    margin-bottom 20px
.select
  >>>.el-input__inner
    width 85px
.ipt>>>.el-input__inner
  width 95px
.iptvender>>>.el-input__inner
  width 65px
</style>