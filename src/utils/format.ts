const findServiceById = (id: string, globalMap: Map<string, Array<any>>) => {
  const t = globalMap.get(id)
  return t ? t[0] : null
}

const serviceTemplate = (
  serviceBasic: any,
  serviceDeatil: any,
  lineDataArr: any
) => {
  const str1 = `{
    "name": ${serviceBasic.name},
    "taskReferenceName": ${serviceBasic.name},
  `
  //   let str2 = ''
  //   serviceBasic.inputKeys.map((item: any, index: number) => {})
  //   return `
  //     "inputParameters": {
  //         ${inputKeysName}
  //     },
  //     "type": "SIMPLE"
  // }`
}

const switchTemplate = (
  serviceBasic: any,
  serviceDeatil: any,
  lineDataArr: any
) => {
  console.log('first')
}

const workFlowTemplate = (
  logicTemplate: any,
  globalMap: Map<string, Array<any>>,
  lineDataArr: any
) => {
  console.log(lineDataArr)
  let resStr = ''
  const str1 = `{
    "name": ${logicTemplate.workflow},
    "description": "deal my img",
    "version": 1,
    "schemaVersion": 2,
    "ownerEmail": "CoderGarril@outlook.com",
  `
  const temp = `"tasks": [
    {
        "name": "imgService",
        "taskReferenceName": "get_img",
        "inputParameters": {
            "name": "\${workflow.input.name}",
            "type": "\${workflow.input.type}"
        },
        "type": "SIMPLE"
    },
    {
        "name": "switch_task",
        "taskReferenceName": "choose_methods",
        "inputParameters": {
            "type": "\${workflow.input.type}"
        },
        "type": "SWITCH",
        "evaluatorType": "javascript",
        "expression": "$.type == 'gray' ? 'gray' : 'beauty'",
        "decisionCases": {
            "gray": [
                {
                    "name": "grayImg",
                    "taskReferenceName": "gray_img",
                    "inputParameters": {
                        "inputData": "\${get_img.output.responseData}"
                    },
                    "type": "SIMPLE"
                }
            ],
            "beauty": [
                {
                    "name": "beautyImg",
                    "taskReferenceName": "beauty_img",
                    "inputParameters": {
                        "inputData": "\${get_img.output.responseData}"
                    },
                    "type": "SIMPLE"
                }
            ]
        }
    }
]
}`
  logicTemplate.task.forEach((item: any) => {
    const infoArr = globalMap.get(item.service)
    if (item.isConfig && item.type == 'switch') {
      if (infoArr && infoArr[0] && infoArr[1]) {
        // switchTemplate(infoArr[0], infoArr[1])
      }
    } else {
      if ((infoArr && infoArr[0] && infoArr[1], lineDataArr)) {
        // serviceTemplate(infoArr[0], infoArr[1], lineDataArr)
      }
    }
  })
  const str2 = ``
  resStr += str1
  return resStr
}

/*
    {
      workflow:xxx,
      task: [
        {
          isConfig: false,
          service: xxx,
        },
        {...},
        {
          isConfig: true,
          service: zzz,
          type: switch,
          express: yyy,
          case: [
            {
              isConfig: false,
              service: xxx
            },{...}
          ]
        },
        {...},
        { final over }
      ]
    }
  */
export function formatJson(
  resJsonArr: any,
  globalMap: Map<string, Array<any>>
) {
  let startNode: any
  let finalNode: any
  const lineDataArr: Array<any> = []
  const lineLogicArr: Array<any> = []
  const serviceArr: Array<any> = []
  const switchArr: Array<any> = []
  // 将所有节点，按照起始节点、终点节点、线(逻辑和数据)、微服务 进行分类
  resJsonArr.forEach((item: any, index: string) => {
    if (!item?.attrs || item?.attrs?.line) {
      if (
        item.attrs &&
        item.attrs.line &&
        item.attrs.line.stroke == '#0000ff'
      ) {
        lineLogicArr.push(item)
      } else {
        lineDataArr.push(item)
      }
    } else {
      if (item.attrs.text.text == 'start') {
        startNode = item
      } else if (item.attrs.text.text === 'final') {
        finalNode = item
      } else if (item.attrs.text.text === 'switch') {
        switchArr.push(item)
      } else {
        serviceArr.push(item)
      }
    }
  })

  // 生成逻辑模板
  const logicTemplate = {} as any
  logicTemplate.workflow = startNode.id
  logicTemplate.task = []
  const firstLine = lineLogicArr.find((line: any, index: number) => {
    if (startNode.id == line.source.cell) {
      return line
    }
  })
  // 与start节点相连接的id
  const targetId = firstLine.target.cell
  // 拿到所有的swicthId
  const switchIdArr = switchArr.map((node: any) => {
    return node.id
  })
  // 对应 switch id 和 他在task中的对象
  const switchMap = new Map<string, any>()
  // switch之后的所有节点数组
  const afterSwitchArr = new Set()
  // 先处理switch节点
  switchArr.forEach((node: any, index: number) => {
    let beforeNodeId: any
    // 所有从switch连接出去的节点id
    const arr = lineLogicArr.map((line: any, index2: number) => {
      if (line.source.cell == node.id) {
        return line.target.cell
      } else if (line.target.cell == node.id) {
        // 拿到当前节点之前的线
        beforeNodeId = line.source.cell
      }
    })
    // 拿到当前的switch节点info
    const switchNode = globalMap.get(node.id)
    if (switchNode) {
      const obj = {
        isConfig: true,
        service: node.id,
        type: 'switch',
        express: switchNode[0].express
      } as any
      const t = [] as any
      arr.forEach((item: any) => {
        if (item) {
          afterSwitchArr.add(item)
          t.push({
            isConfig: false,
            service: item
          })
        }
      })
      obj.case = t
      // obj就是switch节点，找到switch之前的所有节点
      /*       if (!switchIdArr.find((i) => i == beforeNodeId)) {
        // 前面一个不是switch
        console.log('前面一个不是switch')
      } else {
        console.log('前面一个是switch')
      } */
      switchMap.set(node.id, obj)
    }
  })
  let newStartId = targetId
  for (let i = 0; i < lineLogicArr.length; i++) {
    const source = lineLogicArr[i]?.source?.cell
    const target = lineLogicArr[i]?.target?.cell
    if (afterSwitchArr.has(target)) continue
    if (source == startNode.id) {
      if (switchIdArr.find((i) => i === target)) {
        logicTemplate.task.push(switchMap.get(target))
        i = 0
        newStartId = target
      } else {
        logicTemplate.task.push({
          isConfig: false,
          service: target
        })
        i = 0
        newStartId = target
      }
      continue
    }
    if (source == newStartId) {
      if (switchIdArr.find((i) => i === target)) {
        logicTemplate.task.push(switchMap.get(target))
        i = 0
        newStartId = target
      } else {
        logicTemplate.task.push({
          isConfig: false,
          service: target
        })
        i = 0
        newStartId = target
      }
      continue
    }
  }
  /*   const isSwitch = switchArr.find((item: any) => {
    return item.id == targetId
  })

  if (isSwitch) {
    const switchNode = globalMap.get(targetId)
    if (switchNode) {
      const obj = {
        isConfig: true,
        service: targetId,
        type: 'switch',
        express: switchNode[0].express
      } as any
      const t = [] as any
      const arr = lineLogicArr.map((line: any, index: number) => {
        if (line.source.cell == targetId) {
          return line.target.cell
        }
      })
      console.log('switch 的子线 arr', arr)
      if (arr[0]) {
        firstLine = lineLogicArr.find((line: any, index: number) => {
          if (arr[0] == line.source.cell) {
            return line
          }
        })
      }
      arr.forEach((item: any) => {
        t.push({
          isConfig: false,
          service: item
        })
      })
      obj.case = t
      logicTemplate.task.push(obj)
    }
  } else {
    logicTemplate.task.push({
      isConfig: false,
      service: targetId
    })
    firstLine = lineLogicArr.find((line: any, index: number) => {
      if (targetId == line.source.cell) {
        return line
      }
    })
  } */

  console.log(logicTemplate)
  // 根据logicTemplate去生成json
  workFlowTemplate(logicTemplate, globalMap, lineDataArr)
}
