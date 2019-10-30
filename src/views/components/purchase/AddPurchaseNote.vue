<template>
  <div>
    <!-- 添加采购单 -->
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
        width="150"
        class="cmondBtn">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="showDialog(scope.$index, SupplierListData)"
            type="primary"
            size="mini">
            修改
          </el-button>
          <el-button
            @click.native.prevent="deleteSupplier(scope.$index, SupplierListData)"
            type="danger"
            size="mini">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <!-- 分页 -->
    <el-pagination
      v-if="puraseList.length"
      background
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
import axios from 'axios'
import qs from 'querystring'
export default {
  data () {
    return {
      dialogMsg: '新添采购单',
      dialogFormVisible: false,
      total: 0,
      loading: true,
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
    }
  },
  methods: {
    // 新添采购单
    addPurchase () {
      console.log('新添采购单')
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
          console.log(resp.data)
          if (resp.data.list != 0) {
            this.puraseList = resp.data.list
            this.loading = false
            this.total = resp.data.total
          }
          console.log(this.puraseList);
          
        }
      )
    },
    // 分页
    pageChange (page) {
      console.log('当前页码', page)
      
    }
  },
  created () {
    this.getPuraseList ()
  }
}
</script>

<style lang="stylus" scoped>
.el-table
  margin-left 20px
</style>