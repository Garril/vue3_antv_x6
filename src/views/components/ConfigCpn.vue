<template>
  <div id="rightConfig">
    <h3>配置界面</h3>
    <div id="config_container">
      <div id="control_container" v-if="openBtns">
        <div class="input_btn">
          <label for="addinput">添加input字段名</label>
          <input id="addinput" type="text" v-model="addInputName" />
          <button class="btn" @click="addNodePort(true)">addPort</button>
        </div>
        <div class="input_btn">
          <label for="removeinput">删除input字段名</label>
          <input id="removeinput" type="text" v-model="removeInputName" />
          <button class="btn" @click="removeNodePort(true)">removePort</button>
        </div>
        <div class="input_btn">
          <label for="addoutput">添加output字段名</label>
          <input id="addoutput" type="text" v-model="addOutputName" />
          <button class="btn" @click="addNodePort(false)">addPort</button>
        </div>
        <div class="input_btn">
          <label for="removeoutput">删除output字段名</label>
          <input id="removeoutput" type="text" v-model="removeOutputName" />
          <button class="btn" @click="removeNodePort(false)">removePort</button>
        </div>
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
import { Graph, Node, Color } from '@antv/x6'

export default defineComponent({
  components: {},
  props: {
    curConfig: {
      type: Object
    }
  },
  setup(props, { emit }) {
    const openBtns = ref(false)
    const curJsonInfo = ref()
    const curCellInfo = ref()
    const addInputName = ref()
    const addOutputName = ref()
    const removeInputName = ref()
    const removeOutputName = ref()
    const globalMap = inject('globalMap') as Ref<Map<string, Array<any>>>
    const judgeRender = () => {
      if (curJsonInfo.value.isConfig) {
        // configList.value.push()
        openBtns.value = true
      } else {
        openBtns.value = false
      }
    }
    const addNodePort = (sign: boolean) => {
      console.log('add')
      const ports = curCellInfo.value.getPorts()
      console.log(ports)
      const options = {
        group: 'top',
        position: 'left',
        label: {
          position: 'left'
        },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff'
          },
          text: {
            text: `${ports.length + 1}`
          }
        }
      }
      if (sign) {
        // 添加input连接点
      } else {
        // 添加output连接点
      }
      curCellInfo.value.addPort(options)
    }
    const removeNodePort = (sign: boolean) => {
      console.log('remove')
      const ports = curCellInfo.value.getPorts()
      if (sign) {
        // 删除input连接点
      } else {
        // 删除output连接点
      }
      if (ports.length) {
        curCellInfo.value.removePortAt(ports.length - 1)
      }
    }
    watch(
      () => props.curConfig,
      () => {
        const id = props?.curConfig?.id
        const infoArr = globalMap.value.get(id)
        if (infoArr) {
          curJsonInfo.value = infoArr[0]
          curCellInfo.value = infoArr[1]
          judgeRender()
        }
      }
    )
    return {
      openBtns,
      addNodePort,
      removeNodePort,
      addInputName,
      addOutputName,
      removeInputName,
      removeOutputName
    }
  }
})
</script>

<style scoped>
#rightConfig {
  width: 25%;
  height: 100vh;
  border-left: 1px solid skyblue;
}
h3 {
  background-color: rgb(241, 243, 244);
  padding: 10px 0;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
#control_container {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
#control_container .input_btn .btn {
  width: 30%;
  margin: 20px auto;
}
#control_container .input_btn {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  border-bottom: 1px solid #000000;
  padding: 20px 0 0 0;
  margin: 10px 0;
  box-sizing: border-box;
  width: 100%;
}
#control_container .input_btn label {
  padding: 0 10px;
}
#control_container .input_btn input {
  width: 130px;
}
</style>
