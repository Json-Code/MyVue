import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
  input: './src/index.js', // 文件入口
  output: {
    file: 'dist/umd/vue.js', // 出口文件
    name: 'Vue', // 指定打包后全局变量的名字
    format: 'umd', // 统一模块规范
    sourcemap: true, // es6 -> es5 开启源码调试
  },
  plugins: [// 使用的插件
    babel({
      exclude: "node_modules/**"
    }),
    process.env.ENV === 'development' ? serve({
      open: true,
      openPage: '/public/index.html',//默认打开html的路径
      port: 3000,
      contentBase: ''
    }) : null
  ]
}