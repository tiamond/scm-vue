<template>
  <div>
    <el-date-picker
      v-model="value2"
      type="month"
      placeholder="选择月"
      format="yyyy-MM"
      value-format="yyyy-MM"
      size="mini">
    </el-date-picker>
    <el-button type="primary" @click="queryReport" size="mini">查询</el-button>
    <p class="mainInfo">
      产品总数量: <span>{{form.totalNum}}</span>件; 
    </p>
    <ReportTable
      :tableData="tableData"
      :total="tableTotal"
      @getList="tableChangePage"
      :columnsType="'stockColumns'"
      :loading="tableLoading"
    />
  </div>
</template>

<script>
import axios from 'axios'
import ReportTable from './templates/ReportTable'
export default {
  name: 'StockReport',
  components: {
    ReportTable,
  },
  data () {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 2.592e9;
        }
      },
      value2: '',
      tableData: [],
      form:{},
      tableTotal: 0,
      tableLoading: true,
    }
  },
  created () {
    let y = new Date().getFullYear()
    let M = new Date().getMonth()+1
    this.value2 = `${y}-${M<10?'0'+M:M}`
    this.getList()
  },
  methods: {
    // 获得数据
    getList (time = this.value2, page = 1) {
      this.tableLoading = true
      axios({
        method: 'GET',
        url: '/api/main/report/stock/main',
        params: {
          time,
          page, 
        }
      }).then(({data}) => {
        console.log(data)
        this.tableData = data.details.list
        this.form = data
        this.tableTotal = data.details.total
        this.tableLoading = false
      })
    },
    // 查询
    queryReport () {
      this.getList(this.value2)
    },
    // 分页 
    tableChangePage (page) {
      console.log(page)
      this.getList(this.value2, page)
    } 
  }
}
</script>

<style lang="stylus" scoped>
.el-date-editor
  margin 0 15px
.mainInfo
  color #464646
  font-size 14px
  span 
    color red
    font-size 16px
</style>