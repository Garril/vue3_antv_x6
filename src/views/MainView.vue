<template>
  <div id="mainview">
    <ServiceCpn @createWorkFlow="startCreateWF"></ServiceCpn>
    <GrapCpn @curConfig="changeConfig" ref="graphRef"></GrapCpn>
    <ConfigCpn
      :curConfig="curConfigNode"
      @changeLineColor="changeLineColor"
      @changeNormalLine="changeNormalLine"
    ></ConfigCpn>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide, reactive } from 'vue'
import GrapCpn from './components/GrapCpn.vue'
import ServiceCpn from './components/ServiceCpn.vue'
import ConfigCpn from './components/ConfigCpn.vue'
import { ServiceArrType, ServiceType } from './components/ServiceType'
import { formatJson } from '../utils/format'
import { Graph, Color } from '@antv/x6'

export default defineComponent({
  components: {
    GrapCpn,
    ServiceCpn,
    ConfigCpn
  },
  setup() {
    const curChoose = ref<ServiceArrType>([])
    provide('curChoose', curChoose)
    const globalMap = ref(new Map<string, Array<any>>())
    provide('globalMap', globalMap)
    const lineMap = ref(new Map<string, unknown>())
    provide('lineMap', lineMap)
    const curConfigNode = ref()
    const graphRef = ref()
    const changeConfig = (item: any) => {
      curConfigNode.value = item
      // console.log('click emit: ', item)
    }
    const changeLineColor = () => {
      const edges = graphRef.value.graph.getEdges()
      const target = edges.find((edge: any) => {
        if (edge.id == curConfigNode.value.id) {
          return edge
        }
      })
      const color = Color.named.blue
      target.attr('line/stroke', color)
    }
    const changeNormalLine = () => {
      const edges = graphRef.value.graph.getEdges()
      const target = edges.find((edge: any) => {
        if (edge.id == curConfigNode.value.id) {
          return edge
        }
      })
      const color = Color.named.black
      target.attr('line/stroke', color)
    }
    const startCreateWF = () => {
      formatJson(graphRef.value.graph.toJSON().cells, globalMap.value)
    }
    return {
      changeConfig,
      curConfigNode,
      startCreateWF,
      graphRef,
      changeLineColor,
      changeNormalLine
    }
  }
})
</script>

<style scoped>
#mainview {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
}
</style>
