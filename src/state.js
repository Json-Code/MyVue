import {observe} from './observer/index'
import {proxy} from './util/index'
import Watcher from './observer/watcher'
import { Dep } from './observer/dep'

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
  if (opts.computed) {
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

// 计算属性
// 计算属性特点 默认不执行 等用户取值的时候再执行，会缓存取值的结果
// 如果依赖的值变化了 会更新dirty属性 再次取值时 可以重新求值
function createComputedGetter(vm, key) {
  // 这个watcher就是我们定义的计算属性
  let watcher = vm._watchersComputed[key]
  // 用户取值时会执行此方法
  return function() {
    if(watcher) {
      // 如果页面取值 而且dirty是true 就会去调用watcher的get方法
      if(watcher.dirty) {
        watcher.evaluate()
      }
      if(Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
function initComputed(vm) {
  let computed = vm.$options.computed
  // 将计算属性的配置 放到VM上
  let watchers = vm._watchersComputed = Object.create(null)
  for(let key in computed) {
    let userDef= computed[key]
    watchers[key] = new Watcher(vm, userDef, ()=>{}, {lazy:true})
    Object.defineProperty(vm, key, {
      get: createComputedGetter(vm, key)
    })
  }
}

// watch属性
// watch不能用在模板里 监控的逻辑都放在watch中即可
function createWatcher(vm, key, handler, opts) {
  return vm.$watch(key, handler, opts)
}
function initWatch(vm) {
  // 获取用户传入的watch
  let watch = vm.$options.watch
  for(let key in watch) {
    let userDef = watch[key]
    let handler = userDef
    if(userDef.handler) {
      handler = userDef.handler
    }
    createWatcher(vm, key, handler, {immediate: userDef.immediate})
  }
}