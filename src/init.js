import {initState} from './state'
import {compileToFunction} from './compiler/index'
import {mountComponent} from './lifycycle'

export function initMixin(Vue) {
  // 在原型上添加一个init方法
  Vue.prototype._init = function (options) {
    // 数据的劫持
    const vm = this
    vm.$options = options

    // 初试状态
    initState(vm) //分割代码

    // 如果用户传入了el属性 需要将页面渲染
    if(vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function(el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)

    // 默认会先去查找有没有render方法，没有renderh会采用template template也没有就用el中的内容
    if(!options.render) {
      // 对模板进行编译
      let template = options.template
      if(!template && el) {
        template = el.outerHTML
      }
      const render = compileToFunction(template)
      options.render = render
      
      // 渲染当前组件 挂载组件
      mountComponent(vm, el)
    }
  }
}
