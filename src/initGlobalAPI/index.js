import {mergeOptions} from '../util/index'

export function initClobalAPI(Vue) {
  // 整合了所以的全局相关的内容
  Vue.options = {}

  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
  }

  // 声明周期合并策略
  // Vue.mixin({
  //   a:1,
  //   b:2,
  //   beforeCreate() {
  //     console.log('a')
  //   }
  // })
  // Vue.mixin({
  //   b:2,
  //   beforeCreate() {
  //     console.log('b')
  //   }
  // })

}