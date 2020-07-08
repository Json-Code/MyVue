import {isObject, def} from '../util/index'
import {arrayMethods} from './array.js'
import {Dep} from './dep'
class Observer {
  constructor(value) {
    // vue如果数据层次过多 需要递归去解析对象中的属性 依次添加set和gte方法

    this.dep = new Dep// 给数组用的

    // 给每一个监控过的对象都增加一个__ob__属性 方便之后新增的属性再次添加监听
    // 为了避免—__ob__循环调用,我们需要在defineProperty上设置 并将其设置为不可遍历
    def(value, '__ob__', this)
    if(Array.isArray(value)) {
      // 如果是数组的话并不会对索引进行观察 因为会导致性能问题

      // 重写数组方法 (装饰模式 函数劫持 代理)
      value.__proto__ = arrayMethods
      // 如果数组里放的是对象我再监控
      this.observerArray(value)
    }else {
      // 对对象进行监控
      this.walk(value)
    }
  }
  observerArray(value) {
    for(let i = 0; i < value.length; i++) {
      // [{}]
      observe(value[i])
    }
  }
  walk(data) {
    let keys = Object.keys(data)
    keys.forEach((key) => {
      defineReactive(data, key, data[key]) // 定义响应式数据
    })
  }
}

// 定义响应式数据
function defineReactive(data, key, value) {
  // 这个dep是给对象用的
  let dep = new Dep()
  // 这个value可能是对象 也可能是数组 返回的结果是当前这个value对应的observer实例
  let childOb = observe(value) // 递归实现深度检测
  Object.defineProperty(data, key, {
    get() { // 获取值的操作
      // 如果当前有watcher
      if(Dep.target) {
        // 将当前watcher存起来
        dep.depend()
        if(childOb) {/*****数组的依赖收集********/
          // 收集了数组的相关依赖
          childOb.dep.depend()

          // 如果数组中还有数组
          if(Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newValue) { // 修改值的操作
      if (newValue === value) return
      observe(newValue) // 继续劫持用户设置的值 因为用户有可能设置的是一个对象
      value = newValue

      // 通知依赖的watcher来进行更新操作
      dep.notify()
    }
  })
}

// 如果数组里面  添加的是一个新数组
function dependArray(value) {
 for(let i = 0; i < value.length; i++) {
   let current = value[i]
   // 将数组中的每一个都取出来 收集依赖
   current.__ob__ &&current.__ob__.dep.depend()
   if(Array.isArray(current)){
     dependArray(current)
   }
 }
}

// 吧data的数据 使用defineProperty重新定义
export function observe(data) {
  let isObj =   isObject(data)
  if (!isObj) {
    return
  }
  return new Observer(data)
}