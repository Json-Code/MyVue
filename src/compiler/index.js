import {parseHTML} from './parser-html'

export function compileToFunction(template) {
  // 1 解析模板  将模板转为AST语法树
  let root = parseHTML(template)
  console.log(root)
  return function render() {

  } 
}