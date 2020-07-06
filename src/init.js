import {initState} from './state'

export function initMixin(Vue) {
  // 在原型上添加一个init方法
  Vue.prototype._init = function (options) {
    // 数据的劫持
    const vm = this
    vm.$options = options

    // 初试状态
    initState(vm) //分割代码

    // 如果用户传入了el属性 需要将页面渲染
  }
}
