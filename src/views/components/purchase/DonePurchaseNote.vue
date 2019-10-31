<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane name="1">
      <span slot="label"><i class="el-icon-date"></i>货到付款</span>
      <ProductTable @getList="queryPoitem" :payType="name" :tableData="poitemList" :loading="loading" :total="tableTotal"/>
    </el-tab-pane>
    <el-tab-pane label="款到发货" name="2">
      <ProductTable @getList="queryPoitem" :payType="name" :tableData="poitemList" :loading="loading" :total="tableTotal"/>
    </el-tab-pane>
    <el-tab-pane label="预付款到发货" name="3">
      <ProductTable @getList="queryPoitem" :payType="name" :tableData="poitemList" :loading="loading" :total="tableTotal"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import ProductTable from '@/views/components/purchase/templates/ProductTable'
import axios from 'axios'
import qs from 'querystring'
export default {
  data() {
    return {
      activeName: '1',
      poitemList: [],
      loading: true,
      tableTotal: 0,
      name: 1
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
    queryPoitem (payType, page = 1) {
      this.loading = true
      axios({
        method: 'GET',
        url: '/api/main/purchase/pomain/show',
        params: {
          payType,
          page,
          type: 1  // 当前测试，入库做完改成4
        }
      }).then(
        resp => {
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