<template>
  <div id="rightConfig">
    <h3>配置界面</h3>
    <div id="config_container">
      <div id="control_container" v-if="openBtns">
        <el-button @click="changeLine(true, true)">全设为流程线</el-button>
        <el-button @click="changeLine(true)">设置为流程线</el-button>
        <el-button @click="changeLine(false)">设置为数据线</el-button>
      </div>
      <div id="input_container" v-if="openInput">
        <h2>请输入JS表达式</h2>
        <el-input v-model="input" :placeholder="egStr"></el-input>
        <el-button @click="changeExpress">确定</el-button>
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
    const openInput = ref(false)
    const curJsonInfo = ref()
    const input = ref('')
    const egStr = ref("eg: $.type == 'gray' ? 'gray' : 'beauty'")
    const curCellInfo = ref()
    const globalMap = inject('globalMap') as Ref<Map<string, Array<any>>>
    const lineMap = inject('lineMap') as Ref<Map<string, unknown>>
    watch(
      () => props.curConfig,
      () => {
        const id = props?.curConfig?.id
        const infoArr = globalMap.value.get(id)
        if (props?.curConfig?.port) {
          if (infoArr) {
            curJsonInfo.value = infoArr[0]
            curCellInfo.value = infoArr[1]
          }
          openBtns.value = false
          if (infoArr && infoArr[0]?.name == 'switch') {
            openInput.value = true
          } else {
            openInput.value = false
          }
        } else {
          openBtns.value = true
        }
      }
    )
    const changeLine = (sign: boolean, all?: boolean) => {
      if (all) {
        emit('changeAllLineColor')
        return
      }
      if (sign) {
        emit('changeLineColor')
      } else {
        emit('changeNormalLine')
      }
    }
    const changeExpress = () => {
      const id = props?.curConfig?.id
      const infoArr = globalMap.value.get(id)
      if (infoArr && infoArr[0]) {
        infoArr[0].express = input.value
        globalMap.value.set(id, [infoArr[0], infoArr[1]])
      }
    }
    return {
      openBtns,
      changeLine,
      openInput,
      input,
      egStr,
      changeExpress
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
#control_container button {
  margin: 20px 10px;
}
</style>
