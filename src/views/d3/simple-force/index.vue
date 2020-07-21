<template>
  <div class="simple-force-wrapper">
    This is a simple force page!
    <div class="svg-detail-wrapper"></div>
  </div>
</template>

<script>
// import * as d3 from 'd3-force'
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { searchApi } from '@/service'
export default {
  name: 'SimpleForce',
  components: {
    // HelloWorld
  },
  data() {
    return {
      keyword: '吴恩达',
      result: {},
      nodes: [],
      links: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      try {
        const data = await searchApi.QueryDataByKeyword(this.keyword)
        if (data) {
          console.log(data)
          this.result = data
          this.type = data.mapVO.nodes[0].type
          this.nodes = this.result.mapInfo.nodes
          this.links = this.result.mapInfo.relations
        }
      } catch (error) {
        this.$message.error(error.toString())
      }
    }
  }
}
</script>
