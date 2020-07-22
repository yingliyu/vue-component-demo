<template>
  <div class="simple-force-wrapper graph-wrapper">
    <div class="graph-side">
      <ul>
        <li v-for="(item, index) in typeList" :key="index">
          <img :src="getIcon(item.key)" alt="" />
          <span>{{ item.name }}</span>
        </li>
      </ul>
      <transition name="slide-fade" mode="in-out">
        <div class="side-layout-con" v-show="showPannel()" :key="currentWord">
          <relate-pannel
            v-show="popList && popList.length > 0"
            :title="popTitle"
            :list="popList"
          ></relate-pannel>
        </div>
      </transition>
    </div>
    <div class="svg-detail-wrapper"></div>
  </div>
</template>

<script>
// import * as d3 from 'd3-force'
import { searchApi } from '@/service'
import * as d3 from 'd3'
import expertIco1 from './img/ico-expert.png'
import orgIco from './img/ico-org.png'
import projectIco from './img/ico-project.png'
import patentIco from './img/ico-patent.png'
import paperIco from './img/ico-paper.png'
import honorIco from './img/ico-honor.png'
import keywordIco from './img/ico-keyword.png'
import RelatePannel from './relate-pannel'
import appConfig from '@/config'
export default {
  name: 'GraphDetail',
  components: {
    RelatePannel
  },

  data() {
    return {
      keyword: '吴恩达',
      result: {},
      nodes: [],
      links: [],
      title: '知识图谱',
      forceSimulation: null,
      transitionName: '',
      svg: null,
      svgW: 510,
      svgH: 514,
      typeList: appConfig.typeList,
      centerWordMap: appConfig.centerWordMap,
      fontSizeList: [26, 24, 20, 20, 20, 15],
      colorList: ['#967adc', '#8cc152', '#3bafda', '#f6bb42', '#37bc9b', '#ff7e90', '#ff7043'],
      rediusList: [100, 70, 60, 40, 25],
      // keyword: this.$route.query.keyword, // 如：李飞飞
      currentWord: this.$route.path.split('/')[2], // id
      chargeStrength: -600, // 万有引力
      paperIco: paperIco, // 论文小图标
      orgIco: orgIco,
      expertIco: expertIco1,
      projectIco: projectIco,
      patentIco: patentIco,
      honorIco: honorIco,
      keywordIco: keywordIco,
      popList: [],
      popTitle: '',
      graphFlag: true,
      edgepaths: []
    }
  },

  mounted() {
    this.getData()
    this.initData()
  },

  methods: {
    async getData() {
      try {
        const data = await searchApi.QueryDataByKeyword(this.keyword)
        if (data) {
          this.result = data
          this.type = data.mapVO.nodes[0].type
          this.nodes = this.result.mapInfo.nodes
          this.links = this.result.mapInfo.relations
        }
      } catch (error) {
        this.$message.error(error.toString())
      }
    },
    async initData() {
      d3.selectAll('svg').remove() // 移除svg节点
      this.initForceSimulation()
      this.initSvgContainer()
      this.drawSvg()
    },

    initForceSimulation() {
      const padding = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }

      this.svg = d3
        .select('.svg-detail-wrapper')
        .append('svg')
        .attr('viewBox', '-100 -200 1300 1105')
        .attr('width', this.svgW)
        .attr('height', this.svgH)
        .append('g')
        .attr('transform', `translate(${padding.top}, ${padding.left})`)
    },

    initSvgContainer() {
      try {
        // 力导向图
        this.forceSimulation = d3
          .forceSimulation()
          .alpha(2) // 活力，渲染之后再自动动多久
          .force(
            'link',
            d3
              .forceLink()
              .id((data) => data.code)
              .distance((data) => {
                // 无分支的节点
                // console.log(data)
                if (data.target.name === '荣誉' || data.target.name === '组织') {
                  return 200
                } else {
                  return data.target.level === 5 ? data.target.level * 22 : data.target.level * 3
                }
              })
          ) // 映射id & 线的长度
          .force(
            'charge',
            d3
              .forceManyBody()
              .strength((d) => -(9 - d.level) * 30)
              .theta(0.01)
              .distanceMin(15)
              .distanceMax(20)
          )
          .force('x', d3.forceX())
          .force('y', d3.forceY())
          .force('center', d3.forceCenter(this.svgW, this.svgH / 1.5))
          .force(
            'collide',
            d3
              .forceCollide((d) => {
                if (d.name === this.currentWord && d.level === 1) {
                  d.fx = this.svgW / 1.1 // 设置特定节点固定x坐标
                  d.fy = this.svgH / 1.5
                }
                return 120 - d.level * 14
              })
              .iterations(0.5)
              .strength(0.5)
          )
      } catch (error) {
        console.log('initSvgContainer===' + error)
      }
    },

    drawSvg() {
      try {
        let that = this
        this.forceSimulation.nodes(this.nodes).on('tick', function() {
          if (!that.graphFlag) {
            return
          }
          edges
            .attr('x1', (data) => data.source.x)
            .attr('y1', (data) => data.source.y)
            .attr('x2', (data) => data.target.x)
            .attr('y2', (data) => data.target.y)
          gs.attr('transform', (data) => `translate(${data.x}, ${data.y})`)
          edgepaths.attr(
            'd',
            (d) => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
          )
        })
        this.forceSimulation.force('link').links(this.links)

        // 绘制边
        const edges = this.svg
          .append('g')
          .selectAll('line')
          .data(this.links)
          .enter()
          .append('line')
          .attr('stroke', 'rgba(255,255,255,0.4)')
          .attr('stroke-width', '2px')
          .attr('target', (data) => data.target.name)
          .attr('source', (data) => data.source.name)
        edges.append('title').text((data) => data.label)
        const edgepaths = this.svg
          .selectAll('.edgepath') //make path go along with the link provide position for link labels
          .data(this.links)
          .enter()
          .append('path')
          .attr('class', 'edgepath')
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', 0)
          .attr('id', function(d, i) {
            return 'edgepath' + i
          })
          .style('pointer-events', 'none')

        const edgelabels = this.svg
          .selectAll('.edgelabel')
          .data(this.links)
          .enter()
          .append('text')
          .style('pointer-events', 'none')
          .attr('class', 'edgelabel')
          .attr('id', function(d, i) {
            return 'edgelabel' + i
          })
          .attr('font-size', 24)
          .attr('fill', '#fff')

        edgelabels
          .append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
          .attr('xlink:href', function(d, i) {
            return '#edgepath' + i
          })
          .style('text-anchor', 'middle')
          .style('pointer-events', 'none')
          .attr('startOffset', '50%')
          .text((d) => d.label)

        const gs = this.svg
          .selectAll('.node')
          .data(this.nodes)
          .enter()
          .append('g')
          .attr('class', 'node')
          .attr('name', (data) => data.name)
          .attr('transform', (data) => `translate(${data.x}, ${data.y})`)
          .call(
            d3
              .drag()
              .on('start', this.started)
              .on('drag', this.dragged)
              .on('end', this.ended)
          )
          .on('click', (d) => {
            this.clickHandel(d)
          })

        gs.append('circle')
          .attr('class', 'circle-node')
          .attr('nodes', (d) => d)
          .attr('r', (data) => {
            return this.rediusList[data.level - 1]
          })
          .attr('fill', (d) => {
            // return '#10162d'
            return this.colorList[d.colorIdx]
          })
          .attr('stroke', (d) => {
            return this.colorList[d.colorIdx]
            // return '#fff'
          })
          .attr('stroke-width', '4px')
          .attr('style', 'cursor: pointer;')
          .attr('nodeTest', (d) => JSON.stringify(d))
        gs.filter((d) => {
          if (d.level && d.level < 4) {
            return this
          }
        })
          .append('text')
          .attr('style', (d) => {
            return `cursor: pointer; text-anchor: middle;font-size:${
              this.fontSizeList[d.level - 1]
            }px`
          })
          .selectAll('tspan')
          .data((d) => {
            if (d.name) {
              if (d.name.includes('.')) {
                return d.name.split('.')
              } else {
                return d.name.split(' ')
              }
            }
          })
          .join('tspan')
          .attr('fill', '#f1f1f1')
          .attr('x', 0)
          .attr('y', (d, i, nodes) => {
            if (nodes) {
              return `${i - nodes.length / 2 + 1.8}em`
            } else {
              return `0em`
            }
          })
          .text((data) => data)
        // .on('click', (data, index, nodes) => {
        //   const id = nodes[0].parentNode['code']
        //   this.clickHandel(id)
        // })

        gs.filter((d) => {
          if (d.level && d.level < 4) {
            return this
          }
        })
          .append('image')
          .attr('href', (d) => {
            if (d.name === '专利') {
              return this.patentIco
            } else {
              return this[`${d.type}Ico`]
            }
          })
          .attr('width', (d) => {
            return `${this.fontSizeList[d.level] * 2}px`
          })
          .attr('height', (d) => {
            return `${this.fontSizeList[d.level] * 2}px`
          })
          .attr('x', '-20')
          .attr('y', '-40')

        gs.filter((d) => {
          if (d.level && d.level > 3) {
            return this
          }
        })
          .append('image')
          .attr('href', (d) => {
            if (d.name === '专利') {
              return this.patentIco
            } else {
              return this[`${d.type}Ico`]
            }
          })
          .attr('width', (d) => {
            return `${this.fontSizeList[d.level] * 2}px`
          })
          .attr('height', (d) => {
            return `${this.fontSizeList[d.level] * 2}px`
          })
          .attr('x', (d) => {
            return d.level === 5 ? '-15' : '-18'
          })
          .attr('y', (d) => {
            return d.level === 5 ? '-15' : '-20'
          })
      } catch (error) {
        console.log('drawSvg===' + error)
        this.graphFlag = false
      }
    },

    started(d) {
      if (!d3.event.active) {
        this.forceSimulation.alphaTarget(0.3).restart()
      }
      d3.event.sourceEvent.stopPropagation()
      d.fx = d.x
      d.fy = d.y
    },

    dragged(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    },

    ended(d) {
      if (!d3.event.active) {
        this.forceSimulation.alphaTarget(0)
      }
      d.fx = null
      d.fy = null
    },

    clickHandel(d) {
      if (d.level < 4 && d.level !== 1) {
        if (this.centerWordMap[d.name]) {
          this.currentWord = d.name
          this.popList = [] // 清空layout
          this.$emit('changeKey', d.name)
          this.$router.push(`/search/${d.name}`)
        } else {
          this.currentWord = d.code
          this.showLayout(d)
        }
      } else {
        this.currentWord = d.code
        this.showLayout(d)
      }
    },

    showLayout(node) {
      if (node.layout) {
        this.popList = node.layoutList
        this.popTitle = node.name
      } else {
        this.popList = ['']
        this.popTitle = node.name
      }
    },

    showPannel() {
      return this.popList && this.popList.length
    },

    getIcon(type) {
      return this[`${type}Ico`]
    }
  },

  computed: {
    nodeId() {
      return this.links[0].source.code
    }
  },

  watch: {
    $route(to, from) {
      if (to.meta.path.includes(from.meta.path)) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
    },

    nodes: {
      handler() {
        // console.log(newVal)
        this.initData()
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
// @import '~@/style/variables.less';
.graph-wrapper {
  width: 1200px;
  height: calc(100vh - 70px);
  background: rgba(0, 0, 0, 0.8);
  // background: url('../home/img/bg.png') center no-repeat fixed;
  background-size: cover;
  color: #fff;
  display: flex;
  justify-content: flex-start;
  touch-action: none;
  // padding: 10px 55px;
  box-sizing: border-box;
  header {
    display: flex;
    justify-content: center;
  }
  .graph-side {
    width: 150px;
    color: #fff;
    margin-left: 15px;
    margin-right: 15px;
    padding-top: 20px;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 12px;
    ul {
      width: 100%;
      border: solid 2px #0c64a8;
      border-radius: 10px;
      padding: 5px 15px;
      box-sizing: border-box;
    }
    li {
      line-height: 22px;
      text-align: left;
    }
    img {
      width: 16px;
      vertical-align: middle;
    }
    span {
      display: inline-block;
      width: 30px;
      white-space: nowrap;
      padding-left: 15px;
    }

    .side-layout-con {
      width: 150px;
      height: 338px;
      margin-top: 10px;
      overflow-y: scroll;
      padding: 0px 10px 5px;
      border-radius: 5px;
      border: solid 2px #0c64a8;
      text-align: left;
      box-sizing: border-box;
    }
  }
  .svg-detail-wrapper {
    width: 510px;
    height: 514px;
  }
}
.vue {
  width: 100%;
  height: 100%;
}
</style>
