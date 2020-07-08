export function patch(oldVnode, vnode) {
  // 递归创建真实节点 替换掉老节点
  const isRealElement = oldVnode.nodeType
  if(isRealElement) {
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode
    let el = creatElm(vnode)
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChild(oldElm)

    return el
  }
}

function creatElm(vnode) {
  let {tag, children, key, data, text} = vnode
  // 是标签就创建标签
  if(typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    //更新属性
    updateProperties(vnode)
    // 递归创建儿子节点 将儿子节点添加到父亲上
    children.forEach(child => {
      return vnode.el.appendChild(creatElm(child))
    })
  }else {
    // 虚拟dom上映射真实dom 方便以后操作
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(vnode) {
  let newProps = vnode.data || {}
  let el = vnode.el
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    }else if(key === 'class') {
      el.className = newProps.class
    }else {
      el.setAttribute(key, newProps[key])
    }
  }
}