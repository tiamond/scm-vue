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
      销售单数: <span>{{form.totalnum}}</span>单;  
      已了结单数: <span>{{form.endtotalnum}}</span>件; 
      销售总金额: <span>{{form.sototal | currency}}</span>元;
      已付款金额: <span>{{form.totalpay | currency}}</span>元;
    </p>
    <el-table border stripe>
      <el-table-column label="销售单数">
        <template>
          {{form.totalnum}}
        </template>
      </el-table-column>
      <el-table-column label="已了结单数">
        <template>
          {{form.endtotalnum}}
        </template>
      </el-table-column>
    </el-table>
    
    <ReportTable
      :tableData="tableData"
      :total="tableTotal"
      @getList="tableChangePage"
      :columnsType="'somainColumns'"
      :loading="tableLoading"
      :curPage="curPage"
    />
  </div>
</template>

<script>
import axios from 'axios'
import ReportTable from './templates/ReportTable'
export default {
  name: 'SomainReport',
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
      curPage: 1,
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
        url: '/api/main/report/somain/main',
        params: {
          time,
          page, 
        }
      }).then(({data}) => {
        console.log(data)
        this.tableData = data.details.list
        this.tableData.map(item => {
          if (item.payType == 1 && item.status == 2) {
            item.obligation = item.soTotal
          } else if (item.payType == 2 && item.status == 1) {
            item.obligation = item.soTotal
          } else if (item.payType == 3 && item.status == 1) {
            item.obligation = item.prePayFee
          } else if (item.payType == 3 && item.status == 5) {
            item.obligation = item.soTotal - item.prePayFee
          } else {
            item.obligation = 0
          }
          if (item.payType == 3 && item.status == 1) {
            item.lessPrePay = item.prePayFee
          } else {
            item.lessPrePay = 0
          }
        })
        this.form = data
        this.tableTotal = data.details.total
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
      this.getList(this.value2, page)
    } 
  },
  filters: {
    currency (val) {
      return Number(val).toFixed(2)
    }
  },
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