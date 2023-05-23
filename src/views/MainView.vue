<template>
  <div id="mainview">
    <ServiceCpn></ServiceCpn>
    <GrapCpn></GrapCpn>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide, reactive } from 'vue'
import GrapCpn from './components/GrapCpn.vue'
import ServiceCpn from './components/ServiceCpn.vue'
import { ServiceArrType } from './components/ServiceType'

export default defineComponent({
  components: {
    GrapCpn,
    ServiceCpn
  },
  setup() {
    const curChoose = ref<ServiceArrType>([])
    provide('curChoose', curChoose)
    return {}
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
