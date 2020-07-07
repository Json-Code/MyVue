import {observe} from './observer/index'
import {proxy} from './util/index'

export function initState(vm) {
  const opts = vm.$options
  // vue的数据来源 属性 方法 数据 计算数学 watch
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethod(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.cpmputed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}

function initProps(vm) {

}
function initMethod(vm) {

}

function initData(vm) {
  // 数据初始化
  let data = vm.$options.data // 用户传递的data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;

  // 代理_data属性到vm上
  for(let key in data) {
    proxy(vm, '_data', key)
  }

  // 对象劫持 用户改变数据 我希望得到通知 刷新界面
  // MVVM 数据驱动视图
  // Object.defineProperty()
  observe(data) // 响应式原理
}
function initComputed(vm) {

}
function initWatch(vm) {

}