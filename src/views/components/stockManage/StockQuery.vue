<template>
  <div>
    <!-- 查询 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="mini">
      <el-form-item label="产品编号">
        <el-input v-model="queryForm.productCode" placeholder="产品编号"></el-input>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="queryForm.name" placeholder="产品名称"></el-input>
      </el-form-item>
      <el-form-item label="库存数量范围">
        <el-col :span="11">
          <el-input v-model="queryForm.min" placeholder="最小" class="query-range"></el-input>
        </el-col>
        <el-col class="line" :span="2">—</el-col>
        <el-col :span="11">
          <el-input v-model="queryForm.max" placeholder="最大" class="query-range"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 展示表 -->
    <el-table
      :data="tableData"
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
        v-for="col in tableColumns" :key="col.prop"
        :prop="col.prop"
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
            type="text"
            size="mini">
            库存变更记录
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="total">
    </el-pagination>

    <!-- 出入库记录弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="OutInDialogVisible"
      width="80%"
      center>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="入库记录" name="1">
          <StocklogTable 
            :tableData="logTableData"
            :isInstock="isInstock"
            :loading="logLoading"
            :total="logTotal"
            @getList="logChangePage"/>
        </el-tab-pane>
        <el-tab-pane label="出库记录" name="2">
          <StocklogTable 
            :tableData="logTableData"
            :isInstock="isInstock"
            :loading="logLoading"
            :total="logTotal"
            @getList="logChangePage"/>
        </el-tab-pane>
      </el-tabs>
      
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="OutInDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
import StocklogTable from './templates/StocklogTable'
export default {
  name: 'StockQuery',
  components: {
    StocklogTable,
  },
  data () {
    return {
      queryForm: {
        productCode:　'',
        name: '',
        min: '',
        max: ''
      },
      tableColumns: [
        {prop: 'productCode', label: '产品编号'},
        {prop: 'name', label: '产品名称'},
        {prop: 'num', label: '库存数量'},
        {prop: 'poNum', label: '采购在途数'},
        {prop: 'soNum', label: '预销售数'}
      ],
      tableData: [],
      logTableData: [],
      logTotal: 0,
      total: 0,
      OutInDialogVisible: false,
      loading: true,
      activeName: '1',
      isInstock: 'true',
      logLoading: true,
      curProCode: '',
      logType: '',
    }
  },
  created () {
    this.getList ()
  },
  methods: {
    getList (page = 1) {
      this.loading = true
      axios({
        method: 'GET',
        url: '/api/main/stock/query',
        params: {
          ...this.queryForm,
          page,
        }
      }).then(({data}) => {
        console.log(data)
        this.tableData = data.list
        this.total = data.total
        this.loading = false
      })
    },
    // 分页
    pageChange (page) {
      console.log(page)
      this.getList(page)
    },
    // 查询
    queryList () {
      this.getList()
    },
    // 库存变更记录
    showDialog ({productCode}) {
      this.OutInDialogVisible = true
      this.curProCode = productCode
      this.activeName = '1'
      this.isInstock = true
      this.queryOutInStockLog(productCode)
    },
    // 查询出入库
    queryOutInStockLog (productCode, stockType = 1, page) {
      this.logLoading = true
      axios({
        method: 'GET',
        url: '/api/main/stock/alterRecord',
        params: {
          productCode,
          stockType,
          page,
        }
      }).then(({data}) => {
        console.log(data)
        this.logLoading = false
        this.logTableData = data.data.list
        this.logTotal = data.data.total
      })
    },
    // 切换出入库查询
    handleClick ({name}) {
      this.logType = name
      console.log(name)
      if (name == 1) {
        this.isInstock = true
      } else {
        this.isInstock = false
      }
      this.queryOutInStockLog(this.curProCode, this.logType)
    },
    // logchangepage
    logChangePage (page) {
      this.queryOutInStockLog(this.curProCode, this.logType, page)
    }
  }
}
</script>

<style lang="stylus" scoped>
.demo-form-inline
  margin-left 15px
  height 40px
>>> .el-input__inner
  width 150px
.el-table
  margin-left 15px 
.query-range >>> .el-input__inner
  width 75px
</style>