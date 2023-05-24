<template>
  <div id="rightConfig">
    <h3>配置界面</h3>
    <div id="config_container">
      <div v-for="item in configList" :key="item">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  inject,
  ComputedRef,
  watch,
  Ref,
  ref
} from 'vue'

export default defineComponent({
  components: {},
  props: {
    curConfig: {
      type: Object
    }
  },
  setup(props, { emit }) {
    const configList = ref()
    const curInfo = ref()
    const globalMap = inject('globalMap') as Ref<Map<string, Array<any>>>
    const judgeRender = () => {
      if (curInfo.value.isConfig) {
        configList.value.push()
      }
    }
    watch(
      () => props.curConfig,
      () => {
        const id = props?.curConfig?.id
        const infoArr = globalMap.value.get(id)
        if (infoArr) {
          curInfo.value = infoArr[0]
          judgeRender()
        }
      }
    )
    return { configList }
  }
})
</script>

<style scoped>
#rightConfig {
  width: 20%;
  height: 100vh;
  border-left: 1px solid skyblue;
}
h3 {
  background-color: rgb(241, 243, 244);
  padding: 10px 0;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
</style>
