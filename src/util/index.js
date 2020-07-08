/**
 * 
 * @param {*} data 当前数据是不是对象
 */
export function isObject(data) {
  return typeof data === 'object' && data !== null
}

/**
 * 为当前属性添加响应式标记
 * @param {*} data 
 * @param {*} key 
 * @param {*} value 
 */
export function def (data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value: value
  })
}

/**
 * 数据代理
 * @param {*} vm 
 * @param {*} source 
 * @param {*} key 
 */
export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}

/**
 * 合并两个对象
 * @param {*} parent 
 * @param {*} child 
 */
const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]

let strats = {}
function mergeHook(parentVal, childVal) {
  if(childVal) {
    if(parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

export function mergeOptions(parent, child) {
  const options = {}
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    // 合并过的就不需要合并了
    if(!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  // 默认的合并策略
  function mergeField(key) {
    if(strats[key]) {
      return options[key] = strats[key](parent[key], child[key])
    }
    if(typeof parent[key] === 'object' && typeof child[key] === 'object') {
      options[key] = {
        ...parent[key],
        ...child[key]
      }
    }else if(child[key] == null) {
      options[key] = parent[key]
    }else {
      options[key] = child[key]
    }
  }
  return options
}