<template>
  <div id="grap_cpn" ref="grapWrapRef" @drop="handleDrop" @dragover.prevent>
    <div id="container" ref="containerRef"></div>
    <div id="config_container" v-if="isOpen">
      <div class="input_btn">
        <label for="input_num">input的数量</label>
        <input id="input_num" type="number" v-model="inputNum" />
      </div>
      <div class="input_btn">
        <label for="output_num">output的数量</label>
        <input id="output_num" type="number" v-model="outputNum" />
      </div>
      <el-button class="btn" @click="finishNum">确认</el-button>
      <ConfigForm
        v-if="isFormOpen"
        :outputNum="outputNum"
        :inputNum="inputNum"
        @onSubmit="finishConfig"
        @onCancel="quitConfig"
      ></ConfigForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref, Ref } from 'vue'
// 引入
import { Graph, Shape, Color } from '@antv/x6'
import { History } from '@antv/x6-plugin-history/lib/index'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import ConfigForm from './ConfigForm.vue'
import { ServiceType, ServiceArrType } from './ServiceType'
import { line } from '@antv/x6/lib/registry/port-layout/line'
// 创建实例

export default defineComponent({
  components: { ConfigForm },
  setup(props, { emit }) {
    const data = {
      // // 节点
      // nodes: [
      //   {
      //     id: 'node1', // String，可选，节点的唯一标识
      //     x: 40, // Number，必选，节点位置的 x 值
      //     y: 40, // Number，必选，节点位置的 y 值
      //     width: 80, // Number，可选，节点大小的 width 值
      //     height: 40, // Number，可选，节点大小的 height 值
      //     label: 'hello' // String，节点标签
      //   },
      //   {
      //     id: 'node2', // String，节点的唯一标识
      //     x: 160, // Number，必选，节点位置的 x 值
      //     y: 180, // Number，必选，节点位置的 y 值
      //     width: 80, // Number，可选，节点大小的 width 值
      //     height: 40, // Number，可选，节点大小的 height 值
      //     label: 'world' // String，节点标签
      //   }
      // ],
      // // 边
      // edges: [
      //   {
      //     source: 'node1', // String，必须，起始节点 id
      //     target: 'node2' // String，必须，目标节点 id
      //   }
      // ]
    }
    const grapWrapRef = ref()
    const containerRef = ref()
    const graph = ref()
    const curChoose = inject('curChoose') as Ref<ServiceArrType>
    const curItem = ref()
    const globalMap = inject('globalMap') as Ref<Map<string, Array<any>>>
    const lineMap = inject('lineMap') as Ref<Map<string, unknown>>
    const isOpen = ref(false)
    const isFormOpen = ref(false)
    const finishNum = () => {
      isFormOpen.value = true
    }
    const inputNum = ref()
    const outputNum = ref()
    const curNodeInfo = ref()
    const drawGraph = () => {
      const options = {
        container: containerRef.value,
        width: 800,
        height: 600,
        background: {
          color: '#fffbe6' // 设置画布背景颜色
        },
        grid: {
          size: 10, // 网格大小 10px
          visible: true // 渲染网格背景
        }
      }
      options.height = grapWrapRef.value.offsetHeight
      options.width = grapWrapRef.value.offsetWidth
      graph.value = new Graph(options)
      graph.value.use(
        new History({
          enabled: true
        })
      )
      graph.value.use(
        new Keyboard({
          enabled: true
        })
      )
      graph.value.bindKey('ctrl+z', () => {
        onUndo()
      })
      graph.value.on('node:click', ({ node }: any) => {
        emit('curConfig', node)
      })
      graph.value.on('edge:click', ({ edge }: any) => {
        if (!lineMap.value.has(edge.id)) {
          lineMap.value.set(edge.id, edge)
        }
        console.log('you click edge: ', edge.id, edge, lineMap)
        emit('curConfig', edge)
      })
      graph.value.on('cell:added', ({ cell }: any) => {
        globalMap.value.set(cell.id, [curItem.value, cell])
      })
      graph.value.centerContent()
      graph.value.fromJSON(data)
    }
    const initGraph = () => {
      // 确保 id 为 container 的 div 存在
      if (!containerRef.value) {
        const judgeGraphDiv = setInterval(() => {
          if (containerRef.value !== null) {
            window.clearInterval(judgeGraphDiv)
            drawGraph()
          }
        }, 1000)
      } else {
        drawGraph()
      }
    }
    const handleDrop = () => {
      curItem.value = curChoose.value[0]
      const node_options = {
        x: 60,
        y: 50,
        width: 180,
        height: 80,
        label: 'In Ports & Out Ports',
        ports: {
          groups: {
            in: {
              position: 'left', // 链接桩位置
              label: {
                position: 'left' // 标签位置
              },
              attrs: {
                circle: {
                  r: 8,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 4,
                  fill: '#fff'
                }
              }
            },
            out: {
              position: 'right', // 链接桩位置
              label: {
                position: 'right' // 标签位置
              },
              attrs: {
                circle: {
                  r: 8,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 4,
                  fill: '#fff'
                }
              }
            }
          },
          items: [
            {
              id: 'port1',
              group: 'in',
              attrs: {
                text: { text: 'in1' }
              }
            },
            {
              id: 'port2',
              group: 'in',
              attrs: {
                text: { text: 'in2' }
              }
            },
            {
              id: 'port3',
              group: 'in',
              attrs: {
                text: { text: 'in3' }
              }
            },
            {
              id: 'port4',
              group: 'out',
              attrs: {
                text: { text: 'out1' }
              }
            },
            {
              id: 'port5',
              group: 'out',
              attrs: {
                text: { text: 'out2' }
              }
            }
          ]
        },
        tools: ['button-remove']
      }
      node_options.label = curItem.value.name
      const input_output_arr = [] as any
      curItem.value?.inputKeys?.forEach((keyName: string, index: string) => {
        input_output_arr.push({
          id: 'port-in-' + index,
          group: 'in',
          attrs: {
            text: { text: 'in-' + keyName }
          }
        })
      })
      curItem.value?.outputKeys?.forEach((keyName: string, index: string) => {
        input_output_arr.push({
          id: 'port-out-' + index,
          group: 'out',
          attrs: {
            text: { text: 'out-' + keyName }
          }
        })
      })
      node_options.ports.items = input_output_arr
      if (curItem.value.isConfig && curItem.value.name != 'final') {
        isOpen.value = true
        curNodeInfo.value = node_options
      } else {
        graph.value.addNode(node_options)
      }
    }
    const onUndo = () => {
      const pluginArr = Array.from(graph.value.installedPlugins)
      const hasHistory = pluginArr.find((item: any) => {
        return item.name == 'history'
      })
      if (hasHistory) {
        graph.value.undo()
      } else {
        console.log('没找到history插件')
      }
    }
    const finishConfig = (info: any) => {
      console.log(info)
      isFormOpen.value = false
      isOpen.value = false
      const input_output_arr = [] as any
      for (let i = 0; i < info.inputNum; i++) {
        input_output_arr.push({
          id: 'port-in-' + (i + 1),
          group: 'in',
          attrs: {
            text: { text: 'in-' + info.data['input' + (i + 1)] }
          }
        })
      }
      for (let i = 0; i < info.outputNum; i++) {
        input_output_arr.push({
          id: 'port-out-' + (i + 1),
          group: 'out',
          attrs: {
            text: { text: 'out-' + info.data['output' + (i + 1)] }
          }
        })
      }
      curItem.value.configName = info.data.name
      curNodeInfo.value.ports.items = input_output_arr
      graph.value.addNode(curNodeInfo.value)
    }
    const quitConfig = () => {
      isFormOpen.value = false
      isOpen.value = false
    }
    onMounted(() => {
      initGraph()
    })
    return {
      containerRef,
      grapWrapRef,
      handleDrop,
      onUndo,
      isOpen,
      inputNum,
      outputNum,
      finishNum,
      isFormOpen,
      finishConfig,
      quitConfig,
      graph
    }
  }
})
</script>

<style scoped>
#grap_cpn {
  flex: 1;
  height: 100vh !important;
}
#config_container {
  position: absolute;
  top: 10%;
  left: 40%;
  z-index: 100;
  background-color: #fff;
  padding: 20px 40px;
}
#config_container .btn {
  margin: 10px auto;
}
#config_container .input_btn {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 4px 0 0 0;
  margin: 10px 0;
  box-sizing: border-box;
  width: 100%;
}
#config_container .input_btn label {
  padding: 0 10px;
}
</style>
