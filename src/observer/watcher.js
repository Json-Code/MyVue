import {pushTarget, popTarget} from './dep'
let id = 0
import {queueWatcher} from './schedular'

class Watcher{
  constructor(vm, exprOrFn, callback, options){
    this.vm = vm
    this.callback = callback
    this.options = options
    this.id = id++
    this.getter = exprOrFn //将内部传过来的回调函数 放到getter属性上
    this.depsId = new Set()
    this.deps = []
    this.get()
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
  get() {
    // 把当前watcher存起来
    pushTarget(this)
    this.getter() // 渲染watcher的执行
    //移出watcher
    popTarget()
  }
  update() {
    queueWatcher(this)
  }
  run() {
    this.get()
  }
}

// 在模板取值中 会进行依赖收集 再更改数据是会进行对应的watcher调用更新操作
//dep 和 watcher 是一个多对多的关系 dep里存放着相关的watcher 
//dep和watcher的观察者模式示例，watcher订阅dep，dep通知watcher执行update。
export default Watcher