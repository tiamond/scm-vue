
    

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
      收款总金额: <span>{{form.recePrice | currency}}</span>元;
      付款总金额: <span>{{form.payPrice | currency}}</span>元; 
      收款交易次数: <span>{{form.receCount}}</span>次; 
      付款交易次数: <span>{{form.payCount}}</span>次; 
    </p>
    
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="收款明细" name="receipt">
      <ReportTable
        :tableData="tableData"
        :total="tableTotal"
        @getList="tableChangePage"
        :columnsType="'receiptColumns'"
        :loading="tableLoading"
        :curPage="curPage"
      />
    </el-tab-pane>
    <el-tab-pane label="付款明细" name="pay">
      <ReportTable
        :tableData="tableData"
        :total="tableTotal"
        @getList="tableChangePage"
        :columnsType="'payColumns'"
        :loading="tableLoading"
        :curPage="curPage"
      />
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
import ReportTable from './templates/ReportTable'
export default {
  name: 'PomainReport',
  components: {
    ReportTable,
  },
  data () {
    return {
      activeName: 'receipt',
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
      curPage: 1,
    }
  },
  filters: {
    currency (val) {
      return Number(val).toFixed(2)
    }
  },
  created () {
    let y = new Date().getFullYear()
    let M = new Date().getMonth()+1
    this.value2 = `${y}-${M<10?'0'+M:M}`
    this.getList()
    this.getDetails()
  },
  methods: {
    // 获得主信息
    getList (time = this.value2, page = 1) {
      this.tableLoading = true
      axios({
        method: 'GET',
        url: '/api/main/report/payment/main',
        params: {
          time,
          page, 
        }
      }).then(({data}) => {
        this.form = data
        this.tableLoading = false
      })
    },
    // 查询
    queryReport () {
      this.getList(this.value2)
      this.curPage = 1
    },
    // 分页 
    tableChangePage (page) {
      console.log(page)
      this.curPage = page
      this.getDetails(this.value2, page)
    },  
    // tab Toggle
    handleClick ({name}) {
      this.getDetails()
    },
    getDetails (time = this.value2, page = 1, name=this.activeName) {
      this.tableLoading = true
      axios({
        method: 'GET',
        url: '/api//main/report/payment/detail/'+name,
        params: {
          time,
          page,
        }
      }).then(({data}) => {
        console.log(data)
        this.tableData = data.list
        this.tableTotal = data.total
        this.tableLoading = false
      })
    },
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