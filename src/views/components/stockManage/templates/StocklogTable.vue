<template>
<div>
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
      v-for="col in tableColumns" :key="col.prop"
      :prop="col.prop"
      :label="col.label">
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
export default {
  name: 'StocklogTable',
  data () {
    return {
      InTableColumns: [
        {prop: 'stockTime', label: '入库时间'},
        {prop: 'orderCode', label: '相关采购单号'},
        {prop: 'createUser', label: '入库经手人'},
        {prop: 'stockNum', label: '入库数量'},
      ],
      OutTableColumns: [
        {prop: 'stockTime', label: '出库时间'},
        {prop: 'orderCode', label: '相关采购单号'},
        {prop: 'createUser', label: '出库经手人'},
        {prop: 'stockNum', label: '出库数量'},
      ],
      tableColumns: [],
    }
  },
  props: ['tableData', 'isInstock', 'loading', 'total'],
  watch: {
    isInstock: {
      handler (val) {
        if (val) {
          this.tableColumns = this.InTableColumns
        } else {
          this.tableColumns = this.OutTableColumns
        }
      },
      immediate: true
    }
  },
  methods: {
    pageChange (page) {
      this.$emit('getList', page)
    }
  }
}
</script>

<style>

</style>