// 重新会导致原数组改变的方法 7个

let oldArrayMethods = Array.prototype

// 原型链查找
// value.__proto = arrayMethods
// arrayMethods.__proto__ = oldArrayMethods
export const arrayMethods = Object.create(oldArrayMethods)

let methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'sort',
  'splice',
  'reverse'
]
methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    // AOP切片编程
    const result = oldArrayMethods[method].apply(this, args) // 调用原生的数组方法

    let inserted // 当前用户插入的元素
    let ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice': // splice有删除 新增的功能 arr.splice(0,1,{name:1})
        inserted = args.slice(2)
      default:
        break;
    }
    if(inserted) {
      // 新增属性继续观察
      this.__ob__.observerArray(inserted)
    }

    ob.dep.notify()
    return result
  }
})