<template>
  <div id="mainview">
    <ServiceCpn></ServiceCpn>
    <GrapCpn @curConfig="changeConfig"></GrapCpn>
    <!-- <ConfigCpn :curConfig="curConfigNode"></ConfigCpn> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide, reactive } from 'vue'
import GrapCpn from './components/GrapCpn.vue'
import ServiceCpn from './components/ServiceCpn.vue'
import ConfigCpn from './components/ConfigCpn.vue'
import { ServiceArrType, ServiceType } from './components/ServiceType'

export default defineComponent({
  components: {
    GrapCpn,
    ServiceCpn
    // ConfigCpn
  },
  setup() {
    const curChoose = ref<ServiceArrType>([])
    provide('curChoose', curChoose)
    const globalMap = ref(new Map())
    provide('globalMap', globalMap)
    const curConfigNode = ref()
    const changeConfig = (item: any) => {
      curConfigNode.value = item
    }
    return {
      changeConfig,
      curConfigNode
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
