<template>
  <div>

    <!--查询 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline queryForm" size="mini">
      <el-form-item label="采购单编号" class="ipt">
        <el-input v-model="queryForm.poId" placeholder="采购单编号"></el-input>
      </el-form-item>
      <el-form-item label="供应商编号" class="iptvender">
        <el-input placeholder="选择" v-model="queryForm.venderCode" class="input-with-select" disabled>
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

    <!-- 采购单表格 -->
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
      :current-page="curpage"
      :total="total">
    </el-pagination>

    <!-- 选择供应商的弹框-->
    <el-dialog
      title="选择需要查找供应商"
      :visible.sync="dialogVisible"
      width="80%">
      <el-table
        :data="venderList"
        size="mini"
        fit
        border
        v-loading="venderLoading"
        height="400px"
        style="width: 100%">
        <el-table-column
          label="供应商编号"
          width="100">
          <template slot-scope="scope">
            <el-radio v-model="queryForm.venderCode" :label="scope.row.venderCode">{{scope.row.venderCode}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          v-for="col in venderColumns"
          :key="col.venderCode"
          :prop="col.id"
          :label="col.label">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="venderPageChange"
        layout="prev, pager, next"
        :total="venderTotal">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false; queryForm.venderCode = ''">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看采购单弹框 -->
    <el-dialog class="poItem-dialog" title="订单细节" :visible.sync="dialogNoteDetailVisible">
      <el-form :inline="true" :model="purchaseForm" class="demo-form-inline" size="mini" disabled>
        <p>采购单主信息</p>
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
        <el-form-item label="供应商名称" label-width="120px">
          <el-input v-model="purchaseForm.venderName" placeholder="请选择供应商"></el-input>
        </el-form-item>
        <el-form-item label="付款方式" label-width="105px">
          <el-input :value="purchaseForm.payType == 1 ? '货到付款' : (purchaseForm.payType == 2 ? '款到发货' : '预付款到发货')" placeholder="请选择付款方式"></el-input>
        </el-form-item>
        <el-form-item label="采购单状态" label-width="105px">
          <el-input :value="purchaseForm.status == 1 ? '新增' : (purchaseForm.status == 2 ? '已收货' : (purchaseForm.status == 3 ? '已付款' : purchaseForm.status == 4 ? '已了结' : '已预付'))" placeholder="请选择采购单状态"></el-input>
        </el-form-item>
        <el-form-item label="最低预付款金额" label-width="120px">
          <el-input v-model="purchaseForm.prePayFee" placeholder="最低预付款金额"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="120px">
          <el-input v-model="purchaseForm.remark" placeholder="备注"></el-input>
        </el-form-item>
        <p>采购单入库信息</p><hr>
        <el-form-item label="入库时间" label-width="120px">
          <el-input v-model="purchaseForm.stockTime" placeholder="未入库" disabled></el-input>
        </el-form-item>
        <el-form-item label="入库操作用户" label-width="120px">
          <el-input v-model="purchaseForm.stockUser" placeholder="未入库" disabled></el-input>
        </el-form-item>
        <div v-if="purchaseForm.payType == 3">
          <p>采购单预付信息</p><hr>
          <el-form-item label="预付时间" label-width="120px">
            <el-input v-model="purchaseForm.prePayTime" placeholder="未入库" disabled></el-input>
          </el-form-item>
          <el-form-item label="预付操作用户" label-width="120px">
            <el-input v-model="purchaseForm.prePayUser" placeholder="未入库" disabled></el-input>
          </el-form-item>
        </div>
        <p>采购单付款信息</p><hr>
        <el-form-item label="付款时间" label-width="120px">
          <el-input v-model="purchaseForm.payTime" placeholder="未付款" disabled></el-input>
        </el-form-item>
        <el-form-item label="付款操作用户" label-width="120px">
          <el-input v-model="purchaseForm.payUser" placeholder="未付款" disabled></el-input>
        </el-form-item>
      </el-form>
      <hr>
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
            <el-input placeholder="请输入内容" v-model="scope.row.productCode" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column label="产品名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.productName" placeholder="" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column label="产品单价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.unitPrice" placeholder="" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column label="产品数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.num" placeholder="" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column label="数量单位">
          <template slot-scope="scope">
            <el-input v-model="scope.row.unitName" placeholder="" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column label="明细总价">
          <template slot-scope="scope">
            <el-input :value="scope.row.itemPrice" placeholder="" disabled></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'PurchaseQuery',
  data () {
    return {
      curpage: 1,
      tableData: [],
      loading: true,
      tableColumns: [
        {prop: 'poId', label: '采购单编号', width: '130'},
        {prop: 'createTime', label: '创建时间', width: '140'},
        {prop: 'venderName', label: '供应商名称', width: '90'},
        {prop: 'account', label: '创建用户', width: '90'},
        {prop: 'tipFee', label: '附加费用', width: '90'},
        {prop: 'productTotal', label: '采购产品总价', width: '95'},
        {prop: 'poTotal', label: '采购单总价格', width: '95'},
        {prop: 'prePayFee', label: '最低预付款金额', width: '105'},
      ],
      noteColumns: [
        {id: 'productCode', label: '产品编号', width: '80px'},
        {id: 'productName', label: '产品名称', width: '80px'},
        {id: 'num', label: '产品数量', width: '80px'},
        {id: 'unitName', label: '数列单位', width: '80px'},
        {id: 'unitPrice', label: '产品单价', width: '80px'},
      ],
      venderColumns: [
        {id: 'name', label: '供应商名称', width: '80px'},
        {id: 'contactor', label: '联系人', width: '80px'},
        {id: 'createDate', label: '创建日期', width: '80px'},
        {id: 'tel', label: '电话', width: '80px'},
        {id: 'postCode', label: '邮政编码', width: '80px'},
        {id: 'fax', label: '传真', width: '80px'},
      ],
      total: 0,
      queryForm: {
        poId: '',
        venderCode: '',
        startDate: '',
        endDate: '',
        payType: '',
        status: '',
      },
      dialogVisible: false,
      dialogNoteDetailVisible: false,
      detailLoading: true,
      purchaseForm: {
        poitems: []
      },
      venderList: [],
      venderTotal: '',
      venderLoading: true,
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
      this.curpage = page
      this.loading = true
      this.sendAxios('query', this.queryForm.poId, this.queryForm.venderCode, this.queryForm.payType, this.queryForm.startDate, this.queryForm.endDate, this.queryForm.status, page).then(({data}) => {
        this.tableData = data.list
        this.loading = false
        this.total = data.total
      })
    },
    // 展示采购单细节
    showPoitem ({poId}) {
      this.detailLoading = true
      this.dialogNoteDetailVisible = true
      this.sendAxios('query', poId).then(({data}) => {
        this.purchaseForm = data.list[0]
        this.detailLoading = false
        this.sendAxios('queryItem', poId).then(({data}) => {
          this.purchaseForm.poitems = data
          console.log(this.purchaseForm)
        })
      })
    },
    // 发送请求
    sendAxios (url, poId, venderCode ,payType, startDate, endDate, status, page = 1) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: `api/main/purchase/pomain/${url}`,
          params: {
            poId,
            venderCode,
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
      this.sendAxios('query', this.queryForm.poId, this.queryForm.venderCode, this.queryForm.payType, this.queryForm.startDate, this.queryForm.endDate, this.queryForm.status).then(({data}) => {
        this.tableData = data.list
        this.total = data.total
        console.log(this.tableData)
      })
      this.curpage = 1
    },
    // 选择供应商查找
    choseSupplier () {
      this.dialogVisible = true
      this.venderLoading = true
      axios({
        method: 'GET',
        url: '/api/main/purchase/vender/show'
      }).then(({data}) => {
        console.log(data)
        this.venderList = data.list
        this.venderTotal = data.total
        this.venderLoading = false
      })
    },
    // 供应商翻页
    venderPageChange (page) {
      this.venderLoading = true
      axios({
        method: 'GET',
        url: '/api/main/purchase/vender/show',
        params: {
          page,
        }
      }).then(({data}) => {
        console.log(data)
        this.venderList = data.list
        this.venderTotal = data.total
        this.venderLoading = false
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