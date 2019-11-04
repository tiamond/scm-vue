<template>
  <div>
    <el-table :data="tableData"
      border
      v-loading="loading"
      size="mini"
      max-height="850"
      style="width: 90%;margin-left: 15px">
      <el-table-column v-for="(col, index) in tableColumns"
        :prop="col.id"
        :key="index"
        :label="col.label">
      </el-table-column>
      <el-table-column label="订单状态" v-if="hasStatus">
        <template slot-scope="scope">
          {{scope.row.status | status}}
        </template>
      </el-table-column>
      <el-table-column label="付款方式" v-if="hasPayType">
        <template slot-scope="scope">
          {{scope.row.payType | payType}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="chagePage">
    </el-pagination>
    
  </div>
</template>

<script>
export default {
  name: 'ReportTable',
  data () {
    return {
      tableColumns: [],
      pomainColumns: [
        {id: 'poId', label: '采购单编号'},
        {id: 'venderName', label: '供应商名称'},
        {id: 'createTime', label: '创建日期'},
        {id: 'account', label: '创建用户'},
        {id: 'poTotal', label: '采购单总金额'},
        {id: 'obligation', label: '未付款金额'},
        {id: 'lessPrePay', label: '最低预付款金额'},
      ],
      somainColumns: [
        {id: 'soId', label: '销售单号'},
        {id: 'customerCode', label: '客户编号'},
        {id: 'customerName', label: '客户名称'},
        {id: 'createTime', label: '销售日期'},
        {id: 'account', label: '经手人'},
        {id: 'soTotal', label: '销售单总金额'},
        {id: 'obligation', label: '未付款金额'},
        {id: 'lessPrePay', label: '最低预付款金额'},
      ],
      receiptColumns: [
        {id: 'soid', label: '销售单编号'},
        {id: 'createTime', label: '销售单日期'},
        {id: 'pay_time', label: '收款日期'},
        {id: 'pay_price', label: '收款金额'},
        {id: 'account', label: '经手人'},
      ],
      payColumns: [
        {id: 'poid', label: '采购单号'},
        {id: 'createTime', label: '采购日期'},
        {id: 'pay_time', label: '付款日期'},
        {id: 'pay_price', label: '付款金额'},
        {id: 'account', label: '经手人'},
      ],
      instockColumns: [
        {id: 'poId', label: '采购单号'},
        {id: 'stockTime', label: '入库日期'},
        {id: 'productCode', label: '产品编号'},
        {id: 'name', label: '产品名称'},
        {id: 'stockNum', label: '产品数'},
        {id: 'productTotal', label: '产品总金额'},
      ],
      outstockColumns: [
        {id: 'soId', label: '销售单号'},
        {id: 'stockTime', label: '出库日期'},
        {id: 'productCode', label: '产品编号'},
        {id: 'name', label: '产品名称'},
        {id: 'stockNum', label: '产品数'},
        {id: 'productTotal', label: '产品总金额'},
      ],
      stockColumns: [
        {id: 'ProductCode', label: '产品编号'},
        {id: 'name', label: '产品名称'},
        {id: 'num', label: '产品数'},
      ],
      hasPayType: true,
      hasStatus: true
    }
  },
  props: ['tableData', 'total', 'columnsType', 'loading'],
  mounted () {
    if (this.columnsType == 'pomainColumns') {
      this.tableColumns = this.pomainColumns
    } else if (this.columnsType == 'receiptColumns') {
      this.tableColumns = this.receiptColumns
      this.hasPayType = false
    } else if (this.columnsType == 'payColumns') {
      this.tableColumns = this.payColumns
      this.hasPayType = false
    } else if (this.columnsType == 'instockColumns') {
      this.tableColumns = this.instockColumns
      this.hasPayType = false
      this.hasStatus = false
    } else if (this.columnsType == 'outstockColumns') {
      this.tableColumns = this.outstockColumns
      this.hasPayType = false
      this.hasStatus = false
    } else if (this.columnsType == 'stockColumns') {
      this.tableColumns = this.stockColumns
      this.hasPayType = false
      this.hasStatus = false
    } else if (this.columnsType == 'somainColumns') {
      this.tableColumns = this.somainColumns
    }
  },
  filters: {
    payType(val) {
      if (val == 1) {
        return '货到付款'
      } else if (val ==2) {
        return '款到发货'
      } else if (val == 3) {
        return '预付款到发货'
      }
    },
    status (val) {
      if (val == 1) {
        return '新增'
      } else if (val == 2) {
        return '已发货'
      } else if (val == 3) {
        return '已收款'
      } else if (val == 4) {
        return '已了结'
      } else if (val == 5) {
        return '已预付'
      }
    },
  },
  methods: {
    // 分页
    chagePage (page) {
      this.$emit('getList', page)
    },
  }
}
</script>

<style>

</style>