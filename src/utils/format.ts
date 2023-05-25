export function formatJson(
  resJsonArr: any,
  globalMap: Map<string, Array<any>>
) {
  let startNode: any
  let finalNode: any
  const lineDataArr: Array<any> = []
  const lineLogicArr: Array<any> = []
  const serviceArr: Array<any> = []
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
      } else {
        serviceArr.push(item)
      }
    }
  })
  // 先生成逻辑模板
  const firstLine = lineLogicArr.find((line: any) => {
    return startNode.id == line.source.cell
  })
}

const findServiceById = (id: string, globalMap: Map<string, Array<any>>) => {
  const t = globalMap.get(id)
  return t ? t[0] : null
}

/* const workFlowTemplate = (configName: string, input) => {
  let resStr = ''
  const str1 = `{
    "name": ${configName},
    "description": "deal my img",
    "version": 1,
    "schemaVersion": 2,
    "ownerEmail": "CoderGarril@outlook.com",
    "tasks": [
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
  }

  `
  return resStr
} */

const serviceTemplate = (serviceName: string, inputKeysName: string) => {
  return `                  {
    "name": ${serviceName},
    "taskReferenceName": ${serviceName},
    "inputParameters": {
        ${inputKeysName}
    },
    "type": "SIMPLE"
}`
}
