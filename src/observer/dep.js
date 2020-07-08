let id = 0
export class Dep{
  constructor() {
    this.id = id++
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  depend() {
    // 让当前的watcher 记住我当前的dep 
    //  当前watcher存有当前dep的时候 说明当前dep也存在当前watcher
    Dep.target.addDep(this)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}

let stack= []
export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push[watcher]
}

export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}