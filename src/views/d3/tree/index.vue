<template>
  <div class="tree-wrapper"></div>
</template>
<script>
import * as d3 from 'd3'
// import sourceData from './dataSource.json'
import treeData from './data'
export default {
  name: 'TreePage',
  data() {
    return {
      // dataSource: sourceData,
      attrs: {
        id: `ID${Math.floor(Math.random() * 1000000)}`, // Id for event handlings
        svgWidth: 800,
        svgHeight: 600,
        marginTop: 0,
        marginBottom: 0,
        marginRight: 0,
        marginLeft: 0,
        container: '.tree-wrapper',
        defaultTextFill: '#00193A',
        nodeTextFill: '#E9DEC9',
        defaultFont: 'Helvetica',
        backgroundColor: '#E5D7BB',
        data: treeData,
        depth: 180,
        duration: 600,
        strokeWidth: 3,
        dropShadowId: null,
        initialZoom: 1,
        onNodeClick: (d) => d,
        hideSubordinates: true,
        root: {
          x0: 0,
          y0: 0
        },
        layouts: {
          treemap: null
        }
      },
      calc: {
        id: null,
        chartTopMargin: null,
        chartLeftMargin: null,
        chartWidth: null,
        chartHeight: null
      },
      svg: null,
      nodes: []
    }
  },
  mounted() {
    this.updateAttrs()
    this.renderTree()
    this.updateHandle(this.attrs.root)
    const paths = d3.selectAll('path')
    paths.attr('transform', ' translate(100,0) rotate(-90)')
  },
  methods: {
    updateAttrs() {
      this.calc.id = `ID${Math.floor(Math.random() * 1000000)}` // id for event handlings
      this.calc.chartLeftMargin = this.attrs.marginLeft
      this.calc.chartTopMargin = this.attrs.marginTop
      this.calc.chartWidth =
        this.attrs.svgWidth - this.attrs.marginRight - this.calc.chartLeftMargin
      this.calc.chartHeight =
        this.attrs.svgHeight - this.attrs.marginBottom - this.calc.chartTopMargin
      this.attrs.calc = this.calc
      // Get maximum node width and height
      this.calc.nodeMaxWidth = d3.max(this.attrs.data, ({ width }) => width)
      this.calc.nodeMaxHeight = d3.max(this.attrs.data, ({ height }) => height)

      // Calculate max node depth (it's needed for layout heights calculation)
      this.attrs.depth = this.calc.nodeMaxHeight + 100
      this.calc.centerX = this.calc.chartWidth / 2

      this.attrs.layouts.treemap = d3
        .tree()
        .size([this.calc.chartWidth, this.calc.chartHeight])
        .nodeSize([this.calc.nodeMaxWidth + 180, this.calc.nodeMaxHeight + this.depth])

      // Convert flat data to hierarchical
      this.attrs.root = d3
        .stratify()
        .id(({ nodeId }) => nodeId)
        .parentId(({ parentNodeId }) => parentNodeId)(this.attrs.data)
      // Set child nodes enter appearance positions
      this.attrs.root.x0 = 0
      this.attrs.root.y0 = 0
    },
    renderTree() {
      //-------------------------- Add svg--------------------------
      this.svg = d3
        .select('.tree-wrapper')
        .append('svg')
        .attr('width', this.attrs.svgWidth)
        .attr('height', this.attrs.svgHeight)
        .attr('font-family', this.attrs.defaultFont)
        // .call(behaviors.zoom)
        // .attr('cursor', 'move')
        .style('background-color', 'rgba(0,0,0,0.3)')

      //-------------------------- Add container g element--------------------------
      this.attrs.chart = this.svg.append('g').attr('class', 'chart')
      // .attr('transform', `translate(${this.calc.chartLeftMargin},${this.calc.chartTopMargin})`)

      // -------------------------- Add one more container g element, for better positioning controls
      this.attrs.centerGroup = this.attrs.chart
        .append('g')
        .attr('class', 'center-group')
        .attr(
          'transform',
          `translate(${this.calc.centerX},${this.calc.nodeMaxHeight / 2 + 300}) scale(${
            this.attrs.initialZoom
          })`
        )
    },
    /* Function converts rgba objects to rgba color string
      {red:110,green:150,blue:255,alpha:1}  => rgba(110,150,255,1)
    */
    rgbaObjToColor({ red, green, blue, alpha }) {
      return `rgba(${red},${green},${blue},${alpha})`
    },

    // This function basically redraws visible graph, based on nodes state
    updateHandle({ x0, y0, x, y }) {
      const attrs = this.attrs
      // const calc = attrs.calc
      //  Assigns the x and y position for the nodes
      const treeData = attrs.layouts.treemap(attrs.root)
      console.log(treeData)

      // Get tree nodes and links and attach some properties
      const nodes = treeData.descendants().map((d) => {
        // If at least one property is already set, then we don't want to reset other properties
        if (d.width) return d
        console.log(d)

        // Declare properties with deffault values
        let imageWidth = 100
        let imageHeight = 100
        let imageBorderColor = 'steelblue'
        let imageBorderWidth = 0
        let imageRx = 0
        let imageCenterTopDistance = 0
        let imageCenterLeftDistance = 0
        let borderColor = 'steelblue'
        let backgroundColor = 'steelblue'
        let width = d.data.width
        let height = d.data.height
        let dropShadowId = `none`

        // Override default values based on data
        if (d.data.nodeImage && d.data.nodeImage.shadow) {
          dropShadowId = `url(#${attrs.dropShadowId})`
        }
        if (d.data.nodeImage && d.data.nodeImage.width) {
          imageWidth = d.data.nodeImage.width
        }
        if (d.data.nodeImage && d.data.nodeImage.height) {
          imageHeight = d.data.nodeImage.height
        }
        if (d.data.nodeImage && d.data.nodeImage.borderColor) {
          imageBorderColor = this.rgbaObjToColor(d.data.nodeImage.borderColor)
        }
        if (d.data.nodeImage && d.data.nodeImage.borderWidth) {
          imageBorderWidth = d.data.nodeImage.borderWidth
        }
        if (d.data.nodeImage && d.data.nodeImage.centerTopDistance) {
          imageCenterTopDistance = d.data.nodeImage.centerTopDistance
        }
        if (d.data.nodeImage && d.data.nodeImage.centerLeftDistance) {
          imageCenterLeftDistance = d.data.nodeImage.centerLeftDistance
        }
        if (d.data.borderColor) {
          borderColor = this.rgbaObjToColor(d.data.borderColor)
        }
        if (d.data.backgroundColor) {
          backgroundColor = this.rgbaObjToColor(d.data.backgroundColor)
        }
        if (d.data.nodeImage && d.data.nodeImage.cornerShape.toLowerCase() == 'circle') {
          imageRx = Math.max(imageWidth, imageHeight)
        }
        if (d.data.nodeImage && d.data.nodeImage.cornerShape.toLowerCase() == 'rounded') {
          imageRx = Math.min(imageWidth, imageHeight) / 6
        }

        // Extend node object with calculated properties
        return Object.assign(d, {
          imageWidth,
          imageHeight,
          imageBorderColor,
          imageBorderWidth,
          borderColor,
          backgroundColor,
          imageRx,
          width,
          height,
          imageCenterTopDistance,
          imageCenterLeftDistance,
          dropShadowId
        })
      })
      // Set constant depth for each nodes
      nodes.forEach((d) => (d.y = d.depth * attrs.depth))
      console.log(nodes)
      // Get all links
      // --------------------------  LINKS ----------------------

      const links = treeData.descendants().slice(1)

      // Get links selection
      const linkSelection = attrs.centerGroup.selectAll('path.link').data(links, ({ id }) => id)

      // Enter any new links at the parent's previous position.
      const linkEnter = linkSelection
        .enter()
        .insert('path', '.center-group')
        .attr('class', 'link')
        .attr('pointer-events', 'all')
        .attr('d', () => {
          const o = {
            x: x0,
            y: y0
          }
          return this.diagonal(o, o)
        })

      // Get links update selection
      const linkUpdate = linkEnter.merge(linkSelection)

      // Styling links
      linkUpdate
        .attr('fill', 'none')
        .attr('stroke-width', (data) => data.connectorLineWidth || 2)
        .attr('stroke', (data) => {
          if (data.connectorLineColor) {
            return this.rgbaObjToColor(data.connectorLineColor)
          }
          return 'green'
        })
        .attr('stroke-dasharray', (data) => {
          if (data.dashArray) {
            return data.dashArray
          }
          return ''
        })

      // Transition back to the parent element position
      linkUpdate
        .transition()
        .duration(attrs.duration)
        .attr('d', (d) => this.diagonal(d, d.parent))

      // --------------------------  NODES ----------------------
      // Get nodes selection
      const nodesSelection = attrs.centerGroup.selectAll('g.node').data(nodes, ({ id }) => id)
      // Enter any new nodes at the parent's previous position.
      const nodeEnter = nodesSelection
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('pointer-events', 'all')
        .attr('transform', (d) => {
          return `translate(${d.x},${d.y})`
        })
        .attr('cursor', 'pointer')
        .on('click', ({ data }) => {
          if ([...d3.event.srcElement.classList].includes('node-button-circle')) {
            return
          }
          attrs.onNodeClick(data.nodeId)
        })
      const nodeUpdate = nodeEnter.merge(nodesSelection).style('font', '12px sans-serif')

      // Add background rectangle for the nodes
      nodeUpdate
        .append('rect')
        .attr('class', 'node-rect')
        .attr('width', (data) => {
          return data.width
        })
        .attr('height', (data) => data.height)
        .attr('x', (data) => -data.width / 2)
        .attr('y', (data) => -data.height / 2)
        .attr('rx', (data) => data.borderRadius || 2)
        .attr('stroke-width', (data) => data.borderWidth || this.attrs.strokeWidth)
        .attr('cursor', 'pointer')
        .attr('stroke', ({ borderColor }) => (borderColor ? borderColor : '#fff'))
        .style('fill', ({ _children }) => (_children ? '#fff' : 'rgba(0,0,0,0)'))

      // Node update styles
      // Add foreignObject element inside rectangle
      const fo = nodeUpdate
        .append('foreignObject')
        .attr('class', 'node-foreign-object')
        .attr('fill', (d) => {
          console.log(d)
          return 'red'
        })
        .attr('width', ({ width }) => width)
        .attr('height', ({ height }) => height)
        .attr('x', ({ width }) => -width / 2)
        .attr('y', ({ height }) => -height / 2)

      // Add foreign object
      fo.append('xhtml:div')
        .attr('class', 'node-foreign-object-div')
        .style('width', ({ width }) => `${width}px`)
        .style('height', ({ height }) => `${height}px`)
        .style('color', '#fff')
        .html(({ data }) => data.template)

      // Transition to the proper position for the node
      nodeUpdate
        .transition()
        .attr('opacity', 0)
        .duration(attrs.duration)
        .attr('transform', ({ x, y }) => `translate(${x},${y})`)
        .attr('opacity', 1)

      // Remove any exiting nodes after transition
      const nodeExitTransition = nodesSelection
        .exit()
        .attr('opacity', 1)
        .attr('pointer-events', 'none')
        .transition()
        .duration(attrs.duration)
        .attr('transform', () => `translate(${x},${y})`)
        .on('end', function() {
          d3.select(this).remove()
        })
        .attr('opacity', 0)

      // On exit reduce the node rects size to 0
      nodeExitTransition
        .selectAll('.node-rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('x', 0)
        .attr('y', 0)

      // Store the old positions for transition.
      nodes.forEach((d) => {
        d.x0 = d.x
        d.y0 = d.y
      })
    },
    restyleForeignObjectElements() {
      this.svg
        .selectAll('.node-foreign-object')
        .attr('width', ({ width }) => width)
        .attr('height', ({ height }) => height)
        .attr('x', ({ width }) => -width / 2)
        .attr('y', ({ height }) => -height / 2)
      this.svg
        .selectAll('.node-foreign-object-div')
        .style('width', ({ width }) => `${width}px`)
        .style('height', ({ height }) => `${height}px`)
        .style('color', '#E9DEC9')
        .html(({ data }) => data.template)
    },
    // Generate custom diagonal - play with it here - https://to.ly/1zhTK
    diagonal(s, t) {
      // Calculate some variables based on source and target (s,t) coordinates
      const x = s && s.x ? s.x : 0
      const y = s && s.y ? s.y : 0
      const ex = t && t.x ? t.x : 0
      const ey = t && t.y ? t.y : 0
      let xrvs = ex - x < 0 ? -1 : 1
      let yrvs = ey - y < 0 ? -1 : 1
      let rdef = 35
      let rInitial = Math.abs(ex - x) / 2 < rdef ? Math.abs(ex - x) / 2 : rdef
      let r = Math.abs(ey - y) / 2 < rInitial ? Math.abs(ey - y) / 2 : rInitial
      let h = Math.abs(ey - y) / 2 - r
      let w = Math.abs(ex - x) - r * 2

      // Build the path
      const path = `
               M ${x} ${y}
               L ${x} ${y + h * yrvs}
               C  ${x} ${y + h * yrvs + r * yrvs} ${x} ${y + h * yrvs + r * yrvs} ${x +
        r * xrvs} ${y + h * yrvs + r * yrvs}
               L ${x + w * xrvs + r * xrvs} ${y + h * yrvs + r * yrvs}
               C ${ex}  ${y + h * yrvs + r * yrvs} ${ex}  ${y + h * yrvs + r * yrvs} ${ex} ${ey -
        h * yrvs}
               L ${ex} ${ey}
             `
      // Return result
      return path
    },
    patternify(params) {
      var container = this
      var selector = params.selector
      var elementTag = params.tag
      var data = params.data || [selector]

      // Pattern in action
      var selection = container.selectAll('.' + selector).data(data, (d, i) => {
        if (typeof d === 'object') {
          if (d.id) {
            return d.id
          }
        }
        return i
      })
      selection.exit().remove()
      selection = selection
        .enter()
        .append(elementTag)
        .merge(selection)
      selection.attr('class', selector)
      return selection
    }
  }
}
</script>
<style scoped>
.tree-wrapper {
  padding: 30px;
}
</style>
