export function createElement(tag, data={}, ...children) {
  let key = data.key
  if (key) {
    delete data.key
  }
  return vnode(tag, data, key, children, undefined)
}
export function createTextNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}
function vnode(tag, data, key, children, text){
  return {
    tag,
    data,
    key,
    children,
    text
  }
}
// 渲染流程: 将template转换成ast语法树 -> 生成render方法 -> 生成虚拟dom -> 生成真实dom