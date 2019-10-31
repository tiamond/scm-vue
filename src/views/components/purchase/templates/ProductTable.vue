<template>
  <div>
    <!-- 订单表格 -->
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
        :label="col.lebal"
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
          <el-button @click="endPoitem(scope.row)" type="text" size="small">了结</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      @current-change="pageChange"
      layout="prev, pager, next"
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
export default {
  name: 'ProductTable',
  methods: {
    handleClick(row) {
      console.log(row);
    }
  },
  data() {
    return {
      tableColumns: [
        {prop: 'poId', lebal: '采购单编号', width: '130'},
        {prop: 'createTime', lebal: '创建时间', width: '140'},
        {prop: 'venderName', lebal: '供应商名称', width: '90'},
        {prop: 'account', lebal: '创建用户', width: '90'},
        {prop: 'tipFee', lebal: '附加费用', width: '90'},
        {prop: 'productTotal', lebal: '采购产品总价', width: '95'},
        {prop: 'poTotal', lebal: '采购单总价格', width: '95'},
        {prop: 'prePayFee', lebal: '最低预付款金额', width: '105'},
      ],
      gridData: [],
      dialogTableVisible: false,
      noteDetailList: [],
      noteColumns: [
        {id: 'productCode', label: '产品编号', width: '80px'},
        {id: 'productName', label: '产品名称', width: '80px'},
        {id: 'num', label: '产品数量', width: '80px'},
        {id: 'unitName', label: '数列单位', width: '80px'},
        {id: 'unitPrice', label: '产品单价', width: '80px'},
      ],
      dialogNoteDetailVisible: false,
      detailLoading: true,
      page: 1
    }
  },
  props: ['tableData', 'loading', 'total', 'payType'],
  methods: {
    // 展示采购单细节
    showPoitem ({poId}) {
      this.detailLoading = true
      console.log(poId)
      this.dialogNoteDetailVisible = true
      this.sendAxios('queryItem', poId).then(({data}) => {
        this.noteDetailList = data
        this.detailLoading = false
      })
    },
    // 了结订单
    endPoitem ({poId}) {
      this.$confirm('此操作将了结该订单，并从类表中删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sendAxios('end', poId).then(({data}) => {
          console.log(data)
          if (data.code === 2) {
            this.$message({
              type: 'success',
              message: data.message
            });
            this.$emit('getList', this.payType, this.page)
          } else {
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })       
      })
    },
    // 发送请求
    sendAxios (url, poId) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: `api/main/purchase/pomain/${url}`,
          params: {
            poId,
          }
        }).then(resp => {
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 页码改变
    pageChange (page) {
      this.page = page
      this.$emit('getList', this.payType, page)
    }
  }
}
</script>

<style>

</style>