export function formatJson(
  resJsonArr: any,
  globalMap: Map<string, Array<any>>
) {
  let startNode: any
  const lineArr: Array<any> = []
  const serviceArr: Array<any> = []
  // 将所有节点，按照起始节点、线、微服务 进行分类
  resJsonArr.forEach((item: any, index: string) => {
    if (!item.attrs) {
      lineArr.push(item)
    } else {
      if (item.attrs.text.text == 'start') {
        startNode = item
      } else {
        serviceArr.push(item)
      }
    }
  })
  // 从start开始，先找线
  const firstLineArr = lineArr.map((item) => {
    if ((item.source.cell = startNode.id)) {
      return item
    }
  })
  // 拿到所有与首节点相连的节点
  const firstNodeArr: Array<any> = []
  firstLineArr.forEach((item) => {
    firstNodeArr.push(findServiceById(item.target.cell, globalMap))
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
