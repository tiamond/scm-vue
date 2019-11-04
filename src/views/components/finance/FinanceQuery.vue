<template>
  <div>
    <!-- 查询 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="mini">
      <el-form-item label="收支类型">
        <el-select v-model="queryForm.type" placeholder="收支类型">
          <el-option label="支出" value="支出"></el-option>
          <el-option label="收入" value="收入"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="相关单据号">
        <el-input v-model="queryForm.no" placeholder="相关单据号"></el-input>
      </el-form-item>
      <el-form-item label="日期范围查询">
        <el-date-picker
          size="mini"
          v-model="value2"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      
      <el-form-item label="付款方式" label-width="120px">
        <el-select v-model="queryForm.payType" placeholder="请选择付款方式">
          <el-option label="货到付款" :value="1"></el-option>
          <el-option label="款到发货" :value="2"></el-option>
          <el-option label="预付款到发货" :value="3"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 查询结果 -->
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
        :label="payLabel"
        prop="payTime">
      </el-table-column>
      <el-table-column
        v-for="col in tableColumns" :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width">
      </el-table-column>
      <el-table-column
        label="单据付款方式">
        <template slot-scope="scope">
          {{ scope.row.payType | payType }}
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
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'FinanceQuery',
  data () {
    return {
      loading: false,
      tableColumns: [
        // {prop: 'payTime', label: '付款日期'},
        {prop: 'ordercode', label: '相关单据号'},
        {prop: 'payPrice', label: '金额'},
        {prop: 'account', label: '经手人'},
        // {prop: 'payType', label: '单据付款方式'},
      ],
      tableData: [],
      queryForm: {
        type: '支出',
        startDate: '',
        endDate: '',
        payType: '',
        no: '',
        page: '',
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }],
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      value2: '',
      total: 0,
      payLabel: '付款日期',
    }
  },
  filters: {
    payType (val) {
      if (val == 1) {
        return '货到付款'
      } else if (val == 2) {
        return '款到发货'
      } else {
        return '预付款到发货'
      }
    }
  },
  created () {
    this.queryList()
  },
  methods: {
    queryList () {
      this.queryForm.startDate = this.value2[0]
      this.queryForm.endDate = this.value2[1]
      this.loading = true
      if (this.queryForm.type == '收入') {
        this.payLabel = '收款日期'
      } else {
        this.payLabel = '付款日期'
      }
      axios({
        method: 'GET',
        url: '/api/main/finance/query',
        params: this.queryForm
      }).then(({data}) => {
        this.loading = false,
        this.tableData = data.list
        this.total = data.total
      })
    },
    pageChange (page) {
      this.queryForm.page = page
      this.queryList()
    },
  }
}
</script>

<style lang="stylus" scoped>
.demo-form-inline
  margin-left 15px
  height 40px
>>> .el-input__inner
  width 150px
>>> .el-date-editor
  width 200px
.el-table
  margin-left 15px
</style>