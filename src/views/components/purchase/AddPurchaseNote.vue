<template>
  <div>
    <!-- 添加采购单按钮 -->
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-button 
          class="addUser"
          type="primary" 
          @click="addPurchase" 
          style="margin: 0 20px"
          size="small">
          添加采购单
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 采购单列表 -->
    <el-table
      :data="puraseList"
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
        fixed="right"
        label="操作"
        width="220"
        class="cmondBtn">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="showNote(scope.$index, puraseList)"
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
      v-if="puraseList"
      background
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="total">
    </el-pagination>

    <!-- 查看采购单弹框 -->
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
      dialogMsg: '新添采购单',
      total: 0,
      loading: true,
      detailLoading: true,
      puraseList: [],
      PurchaseColumns: [
        { id: 'poId', label: '采购单编号', width: 115 },
        { id: 'createTime', label: '创建时间', width: 135 },
        { id: 'venderName', label: '供应商名称', width: 90 },
        { id: 'account', label: '创建用户', width: 85 },
        { id: 'tipFee', label: '附加费用', width: 85 },
        { id: 'productTotal', label: '采购产品总价', width: 100 },
        { id: 'poTotal', label: '采购单总价格', width: 120 },
        { id: 'payType', label: '付款方式', width: 80 },
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
    this.getPuraseList ()
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
    // 新添采购单
    addPurchase () {
      const data = {
        poId: '',
        venderCode: '',
        account: '',
        createTime: '',
        tipFee: 0,
        productTotal: '',
        poTotal: '',
        payType: '',
        prePayFee: 0,
        status: '',
        remark: '',
        poitems: [
          // {
          //   productCode: '',
          //   unitPrice: '',
          //   num: '',
          //   unitName: '',
          //   itemPrice: ''
          // }
        ], 
      }
      data.poId = new Date().getTime()
      data.account = cookie.get('account')
      data.createTime = this.setNowTime()
      this.$store.commit({
        type: 'setUpdPoitemInfo',
        data,
        url: 'add'
      })
      this.$router.push('/purchase/add-purchase-note/add-note')
    },
    // 获取采购单
    getPuraseList (type = 1) {
      axios({
        method: 'GET',
        url: '/api/main/purchase/pomain/show',
        params: {
          type,
        }
      }).then(
        resp => {
          console.log(resp)
          // if (resp.data.list.length != 0) {
            this.puraseList = resp.data.list
            this.loading = false
            this.total = resp.data.total
          // }
        }
      )
    },
    // 分页
    pageChange (page) {
      console.log('当前页码', page)
      
    },
    // 查看采购单详情
    showNote (index, data) {
      this.noteDetailList = []
      this.detailLoading = true
      const poId = data[index].poId
      this.dialogNoteDetailVisible = true
      axios({
        method: 'GET',
        url: 'api/main/purchase/pomain/queryItem',
        params: {
          poId
        }
      }).then(
        resp => {
          this.noteDetailList = resp.data
          this.detailLoading = false
        }
      )
    },
    // 删除一个采购单
    deleteOneNote (note) {
      const poId = note.poId
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
        method: 'POST',
        url: '/api/main/purchase/pomain/delete',
        data: qs.stringify({
          poId
        })
      }).then(
        resp => {
          console.log(resp.data)
          if (resp.data.code === 2) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getPuraseList()
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
    // 修改采购单
    updateNote (data) {
      console.log(data)
      this.loading = true
      axios({
        method: 'GET',
        url: 'api/main/purchase/pomain/queryItem',
        params: {
          poId: data.poId
        }
      }).then(
        resp => {
          data.poitems = resp.data
          this.$store.commit({
            type: 'setUpdPoitemInfo',
            data,
            url: 'update'
          })
          // this.loading = false
          this.$router.push('/purchase/add-purchase-note/add-note')
        }
      )
      
    },
  }

}
</script>

<style lang="stylus" scoped>
.el-table
  margin-left 20px
</style>