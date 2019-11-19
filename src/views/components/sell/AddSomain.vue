<template>
  <div>
    <!-- 添加销售单按钮 -->
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-button 
          class="addUser"
          type="primary" 
          @click="addSomain" 
          style="margin: 0 20px"
          size="small">
          添加销售单
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 销售单列表 -->
    <el-table
      :data="somainList"
      style="width: 98%"
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
        v-for="col in PurchaseColumns" :key="col.id"
        :prop="col.id"
        :label="col.label"
        :width="col.width">
      </el-table-column>
      <el-table-column
        label="支付方式"
        width="95">
        <template slot-scope="scope">
          {{scope.row.payType == 1 ? '货到付款' : (scope.row.payType == 2 ? '款到发货' : '预付款到发货')}}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="220"
        class="cmondBtn">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="showNote(scope.row)"
            type="info"
            size="mini">
            查看
          </el-button>
          <el-button
            @click.native.prevent="updateNote(scope.row)"
            type="primary"
            size="mini">
            修改
          </el-button>
          <el-button
            @click.native.prevent="deleteOneNote(scope.row)"
            type="danger"
            size="mini">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <!-- 分页 -->
    <el-pagination
      v-if="somainList"
      background
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="total">
    </el-pagination>

    <!-- 查看销售单弹框 -->
    <el-dialog title="订单细节" :visible.sync="dialogNoteDetailVisible">
      <el-table :data="noteDetailList" size="mini" v-loading="detailLoading">
        <el-table-column 
          v-for="col in noteColumns"
          :key="col.productCode"
          :property="col.id" 
          :label="col.label" 
          :width="col.width">
        </el-table-column>
        <el-table-column
          label="产品总价">
          <template slot-scope="scope">
            {{ scope.row.unitPrice*scope.row.num }}
          </template>
        </el-table-column>
        
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
import qs from 'querystring'
import cookie from 'js-cookie'
export default {
  data () {
    return {
      dialogMsg: '新添销售单',
      total: 0,
      loading: true,
      detailLoading: true,
      somainList: [],
      PurchaseColumns: [
        { id: 'soId', label: '销售单编号', width: 115 },
        { id: 'createTime', label: '创建时间', width: 135 },
        { id: 'customerName', label: '客户名称', width: 90 },
        { id: 'account', label: '创建用户', width: 85 },
        { id: 'tipFee', label: '附加费用', width: 85 },
        { id: 'productTotal', label: '销售产品总价', width: 100 },
        { id: 'soTotal', label: '销售单总价格', width: 100 },
        { id: 'prePayFee', label: '最低预付款金额', width: 110 }
      ],
      dialogNoteDetailVisible:  false,
      noteDetailList: [],
      noteColumns: [
        {id: 'productCode', label: '产品编号', width: '80px'},
        {id: 'productName', label: '产品名称', width: '80px'},
        {id: 'num', label: '产品数量', width: '80px'},
        {id: 'unitName', label: '数列单位', width: '80px'},
        {id: 'unitPrice', label: '产品单价', width: '80px'},
      ]
    }
  },
  created () {
    this.getSomainList ()
  },
  methods: {
     // 当前时间
    setNowTime() {
      let date = new Date()
      let y = date.getFullYear()
      let m = date.getMonth()+1
      let d = date.getDate()
      let h = date.getHours()
      let mm = date.getMinutes()
      let s = date.getSeconds()
      return `${y}-${m < 10 ? '0'+m : m}-${d < 10 ? '0'+d : d} ${h < 10 ? '0'+h : h}:${mm < 10 ? '0'+mm : mm}:${s < 10 ? '0'+s : s}`
    },
    // 新添销售单
    addSomain () {
      const data = {
        soId: new Date().getTime(),
        customerCode: '',
        account: cookie.get('account'),
        createTime: this.setNowTime(),
        tipFee: 0,
        productTotal: '',
        soTotal: '',
        payType: '',
        prePayFee: 0,
        status: 1,
        remark: '',
        soitems: [
          {
            productCode: '',
            unitPrice: '',
            num: '',
            unitName: '',
            itemPrice: ''
          }
        ], 
      }
      this.$store.commit({
        type: 'setUpdSomainInfo',
        data,
        url: 'add'
      })
      this.$router.push('/sell-manage/add-somain/add-somain-note')
    },
    // 获取销售单
    getSomainList (type = 1) {
      axios({
        method: 'GET',
        url: '/api/main/sell/somain/show',
        params: {
          type,
        }
      }).then(
        ({data}) => {
          this.somainList = data.list
          this.loading = false
          this.total = data.total
          console.log(data)
        }
      )
    },
    // 分页
    pageChange (page) {
      console.log('当前页码', page)
      
    },
    // 查看销售单详情
    showNote ({soId}) {
      this.noteDetailList = []
      this.detailLoading = true
      this.dialogNoteDetailVisible = true
      axios({
        method: 'GET',
        url: 'api/main/sell/somain/queryItem',
        params: {
          soId
        }
      }).then(
        resp => {
          this.noteDetailList = resp.data
          this.detailLoading = false
        }
      )
    },
    // 删除一个销售单
    deleteOneNote ({soId}) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
        method: 'POST',
        url: '/api/main/sell/somain/delete',
        data: qs.stringify({
          soId
        })
      }).then(
        resp => {
          console.log(resp.data)
          if (resp.data.code === 2) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getSomainList()
          }
        }
      )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 修改销售单
    updateNote (data) {
      console.log(data)
      this.loading = true
      axios({
        method: 'GET',
        url: 'api/main/sell/somain/queryItem',
        params: {
          soId: data.soId
        }
      }).then(
        resp => {
          data.soitems = resp.data
          this.$store.commit({
            type: 'setUpdSomainInfo',
            data,
            url: 'update'
          })
          // this.loading = false
          this.$router.push('/sell-manage/add-somain/add-somain-note')
        }
      )
      
    },
  }

}
</script>

<style lang="stylus" scoped>