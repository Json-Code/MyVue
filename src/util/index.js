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