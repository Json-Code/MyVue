import Watcher from './observer/watcher'
import {patch} from './vdom/patch'

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this
    // 通过虚拟节点 渲染真实dom
    vm.$el = patch(vm.$el, vnode)
  }
}

export function mountComponent(vm, el) {
  const option = vm.$options // render
  vm.$el = el

  // Watcher 用来渲染
  // vm._rende解析render方法 产生虚拟dom
  // vm._update通过虚拟dom创建真实的dom

  // 渲染页面
  let updateComponent = () => { // 无论是渲染还是更新都会调用此方法
    // 返回的是虚拟dom
    vm._update(vm._render())
  }
  new Watcher(vm, updateComponent, () => {}, true) // true表示他是一个渲染watcher
}