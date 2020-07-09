import {pushTarget, popTarget} from './dep'
let id = 0
import {queueWatcher} from './schedular'

class Watcher{
  constructor(vm, exprOrFn, callback = () => {}, options = {}){
    this.vm = vm
    this.callback = callback
    this.options = options
    this.id = id++
    this.exprOrFn = exprOrFn
    this.immediate = options.immediate
    // 计算属性标识 
    this.lazy = options.lazy
    this.dirty = this.lazy
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn //将内部传过来的回调函数 放到getter属性上
    }else {
      this.getter = function () {
        // 会将vm上对应的表达式取出来
        return ((vm, exprOrFn) => vm[exprOrFn])(vm, exprOrFn)
      }
    }
    if (options.user) {
      // 如果是用户watcher
      this.user = true
    }
    this.depsId = new Set()
    this.deps = []
    // 创建watcher的时候 先将表达式对应的值取出来
    // 如果当前是计算属性的话 不会默认调取get方法
    this.value = this.lazy ? undefined : this.get()
    // 如果有immediate 则直接执行handler函数
    if(this.immediate) {
      this.callback(this.value)
    }
  }
  evaluate() {
    // dep放置计算属性watcher
    this.value = this.get()
    // 设置标记 表明计算属性值已经求过了
    this.dirty = false
  }
  addDep(dep) {
    // watcher里不能放重复的dep dep里不能放重复的watcher
    let id = dep.id
    if(!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  depend() {
    let deps = this.deps.length
    while(i--) {
      // 找到firstName和lastName的dep 为其添加当前的渲染watcher
      deps[i].depend()
    }
  }
  get() {
    // 把当前watcher存起来
    pushTarget(this)
    // 这个函数调用时就会将当前计算属性watcher存起来
    let value = this.getter.call(this.vm) // 渲染watcher的执行
    //移出watcher
    popTarget()
    return value
  }
  update() {
    if(this.lazy) {
      // 如果是计算属性依赖的值变化了 稍后取值时重新计算
      this.dirty = true
    }else {
      queueWatcher(this)
    }
  }
  run() {
    // 新值
    let value = this.get()
    if(this.value !== value) {
      this.callback(value, this.value)
    }
  }
}

// 在模板取值中 会进行依赖收集 再更改数据是会进行对应的watcher调用更新操作
//dep 和 watcher 是一个多对多的关系 dep里存放着相关的watcher 
//dep和watcher的观察者模式示例，watcher订阅dep，dep通知watcher执行update。
export default Watcher