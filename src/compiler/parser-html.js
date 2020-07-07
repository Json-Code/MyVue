// ast语法树 用对象来描述原生语法 虚拟dom 用对象来描述dom节点
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // abc-aaa
const qnameCapture = `((?:${ncname}\\:)?${ncname})` //aaa: asd
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则 捕获的内容是标签名
const endTagOpen = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签的结尾 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ //匹配属性
const startTagClose = /^\s*(\/?)>/ // 匹配标签结束的>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

let root = null // ast语法树的树根
let currentParent // 标识当前父亲
let stack = []
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3

function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null
  }
}

// 解析开始标签  创建ast元素
function start(tagName, attrs) {
  // 遇到开始标签 创建ast元素
  let element = createASTElement(tagName, attrs)
  if (!root) {
    root = element
  }
  currentParent = element // 把当前父元素标记为父ast树
  stack.push(element)
}
// 解析文本标签 直接添加到当前父元素
function chars(text) {
  text = text.replace(/\s/g, '')
  if(text) {
    currentParent.children.push({
      text,
      type: TEXT_TYPE
    })
  }
}
// 解析结束标签  找到父节点 添加孩子
function end(tagName) {
  let element = stack.pop() // 拿到的是ast对象
  // 标识当前这个元素是属于哪个父亲的
  currentParent = stack[stack.length - 1]
  if(currentParent) {
    element.parent = currentParent
    currentParent.children.push(element)
  }
}
export function parseHTML(html) {
  // 不停的去解析html
  while(html) {
    let textEnd = html.indexOf('<')
    if(textEnd == 0) {
      // 如果当前索引为0 肯定是一个标签
      let startTagMatch = parseStartTag() //通过这个方法获取到匹配结果 {tagName, attrs}
      if(startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let endTagMatch = html.match(endTagOpen)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    let text
    if(textEnd >= 0) {
      text = html.substring(0, textEnd)
    }
    if(text) {
      advance(text.length)
      chars(text)
    }
  }

  // 删除已经检查过的表情
  function advance(n) {
    html = html.substring(n)
  }
  // 解析开始标签
  function parseStartTag() {
    let start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) // 将标签删除
      let end,attr
      while (!(end = html.match(startTagClose)) &&(attr = html.match(attribute))) {
        // 将属性去掉
        advance(attr[0].length) // 将属性去掉
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
      }
      if(end) { // 去掉开始标签的>
        advance(end[0].length)
        return match
      }
    }
  }
  return root
}