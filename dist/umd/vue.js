(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * 
   * @param {*} data 当前数据是不是对象
   */
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  /**
   * 为当前属性添加响应式标记
   * @param {*} data 
   * @param {*} key 
   * @param {*} value 
   */

  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }

  // 重新会导致原数组改变的方法 7个
  var oldArrayMethods = Array.prototype; // 原型链查找
  // value.__proto = arrayMethods
  // arrayMethods.__proto__ = oldArrayMethods

  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'sort', 'splice', 'reverse'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // AOP切片编程
      var result = oldArrayMethods[method].apply(this, args); // 调用原生的数组方法

      var inserted; // 当前用户插入的元素

      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          // splice有删除 新增的功能 arr.splice(0,1,{name:1})
          inserted = args.slice(2);
      }

      if (inserted) {
        this.__ob__.observerArray(inserted);
      }

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // vue如果数据层次过多 需要递归去解析对象中的属性 依次添加set和gte方法
      // 给每一个监控过的对象都增加一个__ob__属性 方便之后新增的属性再次添加监听
      // 为了避免—__ob__循环调用,我们需要在defineProperty上设置 并将其设置为不可遍历
      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        // 如果是数组的话并不会对索引进行观察 因为会导致性能问题
        // 重写数组方法 (装饰模式 函数劫持 代理)
        value.__proto__ = arrayMethods; // 如果数组里放的是对象我再监控

        this.observerArray(value);
      } else {
        // 对对象进行监控
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(value) {
        for (var i = 0; i < value.length; i++) {
          // [{}]
          observe(value[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]); // 定义响应式数据
        });
      }
    }]);

    return Observer;
  }(); // 定义响应式数据


  function defineReactive(data, key, value) {
    observe(value); // 递归实现深度检测

    Object.defineProperty(data, key, {
      get: function get() {
        // 获取值的操作
        return value;
      },
      set: function set(newValue) {
        // 修改值的操作
        if (newValue === value) return;
        observe(newValue); // 继续劫持用户设置的值 因为用户有可能设置的是一个对象

        value = newValue;
      }
    });
  } // 吧data的数据 使用defineProperty重新定义


  function observe(data) {
    var isObj = isObject(data);

    if (!isObj) {
      return;
    }

    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; // vue的数据来源 属性 方法 数据 计算数学 watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.cpmputed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    // 数据初始化
    var data = vm.$options.data; // 用户传递的data

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 对象劫持 用户改变数据 我希望得到通知 刷新界面
    // MVVM 数据驱动视图
    // Object.defineProperty()

    observe(data); // 响应式原理
  }

  // ast语法树 用对象来描述原生语法 虚拟dom 用对象来描述dom节点
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //aaa: asd

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTagOpen = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签的结尾 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; //匹配属性

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的>
  var root = null; // ast语法树的树根

  var currentParent; // 标识当前父亲

  var stack = [];
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null
    };
  } // 解析开始标签  创建ast元素


  function start(tagName, attrs) {
    console.log("开始标签", tagName, attrs); // 遇到开始标签 创建ast元素

    var element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    }

    currentParent = element; // 把当前父元素标记为父ast树

    stack.push(element);
  } // 解析文本标签 直接添加到当前父元素


  function chars(text) {
    text = text.replace(/\s/g, '');

    if (text) {
      currentParent.children.push({
        text: text,
        type: TEXT_TYPE
      });
    }

    console.log("文本是" + text);
  } // 解析结束标签  找到父节点 添加孩子


  function end(tagName) {
    console.log("结束标签", tagName);
    var element = stack.pop(); // 拿到的是ast对象
    // 标识当前这个元素是属于哪个父亲的

    currentParent = stack[stack.length - 1];

    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }

  function parseHTML(html) {
    // 不停的去解析html
    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        // 如果当前索引为0 肯定是一个标签
        var startTagMatch = parseStartTag(); //通过这个方法获取到匹配结果 {tagName, attrs}

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTagOpen);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    } // 删除已经检查过的表情


    function advance(n) {
      html = html.substring(n);
    } // 解析开始标签


    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 将标签删除

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 将属性去掉
          advance(attr[0].length); // 将属性去掉

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          // 去掉开始标签的>
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  function compileToFunction(template) {
    // 1 解析模板  将模板转为AST语法树
    var root = parseHTML(template);
    console.log(root);
    return function render() {};
  }

  function initMixin(Vue) {
    // 在原型上添加一个init方法
    Vue.prototype._init = function (options) {
      // 数据的劫持
      var vm = this;
      vm.$options = options; // 初试状态

      initState(vm); //分割代码
      // 如果用户传入了el属性 需要将页面渲染

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // 默认会先去查找有没有render方法，没有renderh会采用template template也没有就用el中的内容

      if (!options.render) {
        // 对模板进行编译
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunction(template);
        options.render = render;
      }
    };
  }

  // Vue核心代码 只是Vue的一个声明

  function Vue(options) {
    // 进行vue的初始化操作
    this._init(options);
  } // 通过引入文件的方式，给uvue原型上添加方法


  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
