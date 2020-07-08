import {parseHTML} from './parser-html'
import {generate} from './generate'

export function compileToFunction(template) {
  // 1 解析模板  将模板转为AST语法树
  let root = parseHTML(template)
  // 2 需要将ast语法树生成为最终的render函数（就是字符串拼接 模板引擎）
  let code = generate(root)
  // 通过with（obj）将后面的{}中的语句块中的缺省对象设置为obj
  let renderFn = new Function(`with(this){return ${code}}`)
  return renderFn
  // 模板引擎实现： 1.拼接字符串 2.增加with 3.new Function
}