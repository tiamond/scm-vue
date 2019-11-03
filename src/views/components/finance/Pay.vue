<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane name="1">
        <span slot="label"><i class="el-icon-date"></i>货到付款</span>
        <ProductTable 
          @getList="queryPoitem" 
          :payType="name" 
          :tableData="poitemList" 
          :loading="loading" 
          :total="tableTotal"
          :baseUrl="url"
          :titMsg="titMsg"
          :isPurchase="isPurchase"
          :queryURL="queryURL"/>
      </el-tab-pane>
      <el-tab-pane label="款到发货" name="2">
        <ProductTable 
          @getList="queryPoitem" 
          :payType="name" 
          :tableData="poitemList" 
          :loading="loading" 
          :total="tableTotal"
          :baseUrl="url"
          :titMsg="titMsg"
          :isPurchase="isPurchase"
          :queryURL="queryURL"/>
      </el-tab-pane>
      <el-tab-pane label="预付款到发货" name="3">
        <ProductTable 
          @getList="queryPoitem" 
          :payType="name" 
          :tableData="poitemList" 
          :loading="loading" 
          :total="tableTotal"
          :baseUrl="url"
          :titMsg="titMsg"
          :isPurchase="isPurchase"
          :queryURL="queryURL"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ProductTable from '@/components/ProductTable'
import axios from 'axios'
import qs from 'querystring'
export default {
  data() {
    return {
      activeName: '1',
      poitemList: [],
      loading: true,
      tableTotal: 0,
      name: 1,
      url: '/api/main/finance/pay',
      titMsg: '付款',
      isPurchase: true,
      queryURL: '/api/main/purchase/pomain/queryItem'
    }
  },
  created () {
    this.loading = true
    this.queryPoitem(1)
  },
  methods: {
    handleClick({name}, event) {
      this.loading = true
      this.queryPoitem(name);
      this.name = name
    },
    // 获取采购订单
    queryPoitem (payType, page = 1, type = 3) {
      this.loading = true
      axios({
        method: 'GET',
        url: '/api/main/purchase/pomain/show',
        params: {
          payType,
          page,
          type, 
        }
      }).then(
        resp => {
          console.log(resp)
          this.poitemList = resp.data.list
          this.tableTotal = resp.data.total
          this.loading = false
        }
      )
    }
  },
  components: {
    ProductTable,
  }
}
</script>

<style>

</style>