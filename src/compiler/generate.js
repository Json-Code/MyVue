const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// 处理属性 拼接成属性的字符串
function genProps(attrs) {
  let str = ''
  for(let i = 0; i< attrs.length; i++) {
    let attr = attrs[i]
    // 将style属性转为对象
    if(attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}
function genChildren(children) {
  if(children && children.length > 0) {
    return `${children.map(c => gen(c)).join(',')}`
  } else {
    false
  }
}
function gen(node) {
  if(node.type == 1 ) {
    // 元素标签
    return generate(node)
  }else {
    let text = node.text
    let tokens =[]
    let match,index
    // 每次的偏移量
    let lastIndex = defaultTagRE.lastIndex = 0// 只要是全局匹配 就需要每次匹配时将lastIndex调到0处
    while (match = defaultTagRE.exec(text)) {
      index = match.index
      if(index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if(lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join('+')})`
  }
}

export function generate(el) {
  let code = `_c("${el.tag}",${
    el.attrs.length ? genProps(el.attrs) : 'undefined'
  }${
    el.children ? `,${genChildren(el.children)}` : ''
  })
  `
  return code
}