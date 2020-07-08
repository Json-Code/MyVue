// Vue核心代码 只是Vue的一个声明
import {initMixin} from './init'
import {renderMixin} from './render'
import {lifecycleMixin} from './lifycycle'
import {initClobalAPI} from './initGlobalAPI/index'

function Vue(options) {
  // 进行vue的初始化操作
  this._init(options)
}
// 通过引入文件的方式，给vue原型上添加方法
initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)

// 初始化全局api
initClobalAPI(Vue)

export default Vue