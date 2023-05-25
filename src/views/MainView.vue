<template>
  <div id="mainview">
    <ServiceCpn @createWorkFlow="startCreateWF"></ServiceCpn>
    <GrapCpn @curConfig="changeConfig" ref="graphRef"></GrapCpn>
    <!-- <ConfigCpn :curConfig="curConfigNode"></ConfigCpn> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide, reactive } from 'vue'
import GrapCpn from './components/GrapCpn.vue'
import ServiceCpn from './components/ServiceCpn.vue'
import ConfigCpn from './components/ConfigCpn.vue'
import { ServiceArrType, ServiceType } from './components/ServiceType'
import { formatJson } from '../utils/format'
export default defineComponent({
  components: {
    GrapCpn,
    ServiceCpn
    // ConfigCpn
  },
  setup() {
    const curChoose = ref<ServiceArrType>([])
    provide('curChoose', curChoose)
    const globalMap = ref(new Map<string, Array<any>>())
    provide('globalMap', globalMap)
    const curConfigNode = ref()
    const graphRef = ref()
    const changeConfig = (item: any) => {
      curConfigNode.value = item
    }

    const startCreateWF = () => {
      formatJson(graphRef.value.graph.toJSON().cells, globalMap.value)
    }
    return {
      changeConfig,
      curConfigNode,
      startCreateWF,
      graphRef
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
