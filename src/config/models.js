export const modelConfigs = {
  public: {
    name: '公用大模型',
    description: '使用平台提供的公共API，无需配置，直接使用',
    badge: {
      text: '推荐',
      type: 'primary'
    },
    models: [
      {
        id: 'kimi',
        name: 'KIMI',
        version: '1.0',
        provider: 'Moonshot AI',
        apiRules: {
          // KIMI 的 API 调用规则
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {apiKey}'
          },
          requestFormat: {
            messages: [], // 消息格式
            temperature: 0.7,
            model: 'moonshot-v1-8k'
          },
          responseFormat: {
            messagePath: 'choices[0].message.content' // 响应结果的路径
          }
        }
      },
      {
        id: 'doubao',
        name: '豆包',
        version: '1.0',
        provider: '字节跳动',
        apiRules: {
          // 豆包的 API 调用规则
          headers: {
            'Content-Type': 'application/json',
            'Authorization': '{apiKey}'
          },
          requestFormat: {
            messages: [],
            temperature: 0.8,
            model: 'doubao-v1'
          },
          responseFormat: {
            messagePath: 'data.text'
          }
        }
      }
    ]
  },
  custom: {
    name: '自定义大模型',
    description: '使用自己的API密钥，支持更多自定义设置',
    badge: {
      text: '高级',
      type: 'purple'
    },
    models: [
      {
        id: 'kimi',
        name: 'KIMI',
        version: '1.0',
        provider: 'Moonshot AI',
        apiConfig: {
          keyPlaceholder: '请输入 KIMI API Key',
          endpointPlaceholder: '请输入 KIMI 接口地址',
          defaultEndpoint: 'https://api.moonshot.cn/v1',
          validateKey: (key) => /^[A-Za-z0-9-]{30,}$/.test(key)
        },
        apiRules: {
          // 与公用模型相同的 API 规则
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {apiKey}'
          },
          requestFormat: {
            messages: [],
            temperature: 0.7,
            model: 'moonshot-v1-8k'
          },
          responseFormat: {
            messagePath: 'choices[0].message.content'
          }
        }
      },
      {
        id: 'doubao',
        name: '豆包',
        version: '1.0',
        provider: '字节跳动',
        apiConfig: {
          keyPlaceholder: '请输入豆包 API Key',
          endpointPlaceholder: '请输入豆包接口地址',
          defaultEndpoint: 'https://api.doubao.com/v1',
          validateKey: (key) => /^[A-Za-z0-9]{32}$/.test(key)
        },
        apiRules: {
          // 与公用模型相同的 API 规则
          headers: {
            'Content-Type': 'application/json',
            'Authorization': '{apiKey}'
          },
          requestFormat: {
            messages: [],
            temperature: 0.8,
            model: 'doubao-v1'
          },
          responseFormat: {
            messagePath: 'data.text'
          }
        }
      }
    ]
  }
}

export const getModelConfig = (type, modelId) => {
  const category = modelConfigs[type]
  if (!category) return null
  return category.models.find(model => model.id === modelId)
}

export const getBadgeStyle = (type) => {
  const styles = {
    primary: {
      background: 'var(--accent)',
      color: 'white'
    },
    purple: {
      background: '#7B68EE',
      color: 'white'
    }
  }
  return styles[type] || styles.primary
}

export const createModelApi = (model, apiKey, endpoint) => {
  const rules = model.apiRules
  
  return {
    async sendMessage(messages) {
      const headers = { ...rules.headers }
      // 替换 headers 中的 apiKey 占位符
      Object.keys(headers).forEach(key => {
        headers[key] = headers[key].replace('{apiKey}', apiKey)
      })

      const requestBody = {
        ...rules.requestFormat,
        messages
      }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody)
        })

        const data = await response.json()
        
        // 根据配置的路径获取响应内容
        return {
          success: true,
          content: getValueByPath(data, rules.responseFormat.messagePath)
        }
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
    }
  }
}

// 辅助函数：根据路径获取对象值
const getValueByPath = (obj, path) => {
  return path.split('.').reduce((acc, part) => {
    if (part.includes('[') && part.includes(']')) {
      const [arrayName, index] = part.split(/[\[\]]/);
      return acc[arrayName][parseInt(index)];
    }
    return acc[part];
  }, obj);
} 