<template>
  <div id="leftService">
    <h3>微服务</h3>
    <div id="service_container">
      <div
        v-for="(item, index) in resJson.data"
        :key="index"
        draggable="true"
        @drag="handleDrag(item, false)"
      >
        {{ item.name }}
      </div>
    </div>
    <h3>逻辑节点</h3>
    <div id="logic_container">
      <div
        v-for="(item, index) in basicJson.data"
        :key="index"
        draggable="true"
        @drag="handleDrag(item, true)"
      >
        {{ item.name }}
      </div>
    </div>
    <h3>生成事件流</h3>
    <div id="createworkflow">
      <el-button @click="createworkflow">生成</el-button>
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
  Ref
} from 'vue'
import { ServiceArrType, ServiceType } from './ServiceType'
import { default_data, basic_data } from '../../store/data'

export default defineComponent({
  components: {},
  setup(props, { emit }) {
    const resJson = reactive(default_data)
    const basicJson = reactive(basic_data)
    const curChoose = inject('curChoose') as Ref<ServiceArrType>
    const handleDrag = (item: ServiceType, isConfig: boolean) => {
      curChoose.value = [] as ServiceArrType
      if (isConfig) {
        item.isConfig = true
      } else {
        item.isConfig = false
      }
      curChoose.value.push(item)
    }
    const createworkflow = () => {
      emit('createWorkFlow')
    }
    return { resJson, handleDrag, basicJson, createworkflow }
  }
})
</script>

<style scoped>
#leftService {
  width: 20vw;
  height: 100vh;
  background-color: rgb(224, 224, 224, 0.2);
  border-right: 1px solid skyblue;
}
#service_container,
#logic_container {
  display: flex;
  flex-wrap: wrap;
}
#service_container div,
#logic_container div {
  width: 40%;
  height: 40px;
  line-height: 40px;
  border: 1px solid black;
  text-align: center;
  margin: 20px auto;
  border-radius: 8px;
}
#service_container div:hover,
#logic_container div:hover {
  background-color: skyblue;
}
h3 {
  background-color: rgb(241, 243, 244);
  padding: 10px 0;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
#createworkflow .el-button {
  margin: 20px 0;
}
</style>
