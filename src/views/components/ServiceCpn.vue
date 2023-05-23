<template>
  <div id="leftService">
    <div id="div_container">
      <div
        v-for="(item, index) in resJson.data"
        :key="index"
        draggable="true"
        @drag="handleDrag(item)"
      >
        {{ item.name }}
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
  Ref
} from 'vue'
import { ServiceArrType, ServiceType } from './ServiceType'
import { default_data } from '../../store/data'

export default defineComponent({
  components: {},
  setup(props) {
    const resJson = reactive(default_data)
    const curChoose = inject('curChoose') as Ref<ServiceArrType>
    const handleDrag = (item: ServiceType) => {
      curChoose.value = [] as ServiceArrType
      curChoose.value.push(item)
    }
    return { resJson, handleDrag }
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
#div_container {
  display: flex;
  flex-wrap: wrap;
}
#div_container div {
  width: 40%;
  height: 40px;
  line-height: 40px;
  border: 1px solid black;
  text-align: center;
  margin: 20px auto;
  border-radius: 8px;
}
#div_container div:hover {
  background-color: skyblue;
}
</style>
