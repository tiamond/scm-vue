<template>
  <div>
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
        :label="col.label">
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
            更新库存
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
      :visible.sync="StockDialogVisible"
      width="80%"
      center>
      <el-form :inline="true" :model="stockFrom" class="demo-form-inline" size="mini">
        <el-form-item label="产品编号">
          <el-input v-model="stockFrom.productCode" placeholder="产品编号" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品原始数量">
          <el-input v-model="stockFrom.originNum" placeholder="产品原始数量" disabled></el-input>
        </el-form-item>
        <el-form-item label="变化数量">
          <el-input v-model="stockFrom.num" placeholder="变化数量"></el-input>
        </el-form-item>
        
        <el-form-item label="变化类型" class="select">
          <el-select v-model="stockFrom.type" placeholder="请选择">
            <el-option label="损耗" value="损耗"></el-option>
            <el-option label="盘余" value="盘余"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="损益原因">
          <el-input type="textarea" v-model="stockFrom.description" placeholder="损益原因"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="StockDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateStock">确 定</el-button>
      </span>
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
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'CheckStock',
  data () {
    return {
      loading: true,
      centerDialogVisible: false,
      titMsg: '',
      tableData: [],
      tableColumns: [
        {prop: 'productCode', label: '产品编号'},
        {prop: 'name', label: '产品名称'},
        {prop: 'num', label: '库存数量'},
        {prop: 'poNum', label: '采购在途数'},
        {prop: 'soNum', label: '预销售数'}
      ],
      total: 0,
      StockDialogVisible: false,
      stockFrom: {
        productCode: '',
        originNum: '',
        num: '',
        type: '',
        description: '',
        page: '',
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList (page = 1) {
      this.loading = true
      axios({
        method: 'GET',
        url: '/api/main/stock/query',
        params: {
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
      this.getList(page)
    },
    // 盘点
    showDialog ({productCode, num}) {
      this.StockDialogVisible = true
      this.stockFrom.productCode = productCode
      this.stockFrom.originNum = num
      this.stockFrom.num = ''
      this.stockFrom.total = ''
      this.stockFrom.description = ''
    },
    // 更新库存
    updateStock () {
      this.StockDialogVisible = false
      axios({
        method: 'GET',
        url: '/api/main/stock/checkstock',
        params: this.stockFrom
      }).then(({data}) => {
        this.centerDialogVisible = true
        this.titMsg = data.message
        this.getList()
        setTimeout(() => {
          this.centerDialogVisible = false
        }, 2000);
      })
    }
  },
}
</script>

<style lang="stylus" scoped>
.demo-form-inline >>> .el-input__inner
  width 150px
</style>