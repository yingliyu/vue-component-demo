<template>
  <div class="cluster-wrapper">
    <h1>cluster</h1>
    <div class="cluster" id="cluster"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { forceCluster } from 'd3-force-cluster'
import { forceAttract } from 'd3-force-attract'
console.log(d3)
export default {
  name: 'Cluster',
  props: {},
  components: {},
  data() {
    return {
      svg: null,
      width: 1000,
      height: 600
    }
  },
  mounted() {
    this.renderCluster()
  },
  methods: {
    renderCluster() {
      var width = 960,
        height = 500,
        padding = 1.5, // separation between same-color nodes
        // clusterPadding = 6, // separation between different-color nodes
        maxRadius = 12

      var n = 200, // total number of nodes
        m = 10 // number of distinct clusters

      var color = d3.scaleSequential(d3.interpolateRainbow).domain(d3.range(m))
      // The largest node for each cluster.
      var clusters = new Array(m)

      var nodes = d3.range(n).map(function() {
        var i = Math.floor(Math.random() * m),
          r = Math.sqrt(((i + 1) / m) * -Math.log(Math.random())) * maxRadius,
          d = {
            cluster: i,
            radius: r,
            x: Math.cos((i / m) * 2 * Math.PI) * 200 + width / 2 + Math.random(),
            y: Math.sin((i / m) * 2 * Math.PI) * 200 + height / 2 + Math.random()
          }
        if (!clusters[i] || r > clusters[i].radius) clusters[i] = d
        return d
      })

      var maxRad = d3.max(nodes, function(d) {
          return d.radius
        }),
        maxStrength = 0.25
      var simulation = d3
        .forceSimulation()
        // pull toward mouse (see 'mousemove' handler below)
        .force(
          'attract',
          forceAttract()
            .target([width / 2, height / 2])
            .strength(function(d) {
              return Math.pow((d.radius / maxRad) * maxStrength, 2)
            })
        )

        // cluster by section
        .force(
          'cluster',
          forceCluster()
            .centers(function(d) {
              return clusters[d.cluster]
            })
            .strength(0.75)
            .centerInertia(0.1)
        )

        // apply collision with padding
        .force(
          'collide',
          d3
            .forceCollide(function(d) {
              return d.radius + padding
            })
            .strength(0)
        )

        .on('tick', layoutTick)
        .nodes(nodes)
      var svg = d3
        .select('#cluster')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
      var node = svg
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .style('fill', function(d) {
          return color(d.cluster / 10)
        })
        .call(
          d3
            .drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
        )

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }

      // svg.on('mousemove', function() {
      //   simulation.force('attract').target(d3.mouse(this))
      //   simulation.alphaTarget(0.3).restart()
      // })

      // ramp up collision strength to provide smooth transition
      var transitionTime = 3000
      var t = d3.timer(function(elapsed) {
        var dt = elapsed / transitionTime
        simulation.force('collide').strength(Math.pow(dt, 2) * 0.7)
        if (dt >= 1.0) t.stop()
      })

      function layoutTick() {
        node
          .attr('cx', function(d) {
            return d.x
          })
          .attr('cy', function(d) {
            return d.y
          })
          .attr('r', function(d) {
            return d.radius
          })
      }
    }
  }
}
</script>
<style scoped lang="less">
.cluster {
  width: 1000px;
  height: 800px;
}
</style>
