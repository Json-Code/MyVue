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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
  /**
   * 数据代理
   * @param {*} vm 
   * @param {*} source 
   * @param {*} key 
   */

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }
  /**
   * 合并两个对象
   * @param {*} parent 
   * @param {*} child 
   */

  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strats = {};

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });
  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      // 合并过的就不需要合并了
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    } // 默认的合并策略


    function mergeField(key) {
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      }

      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (child[key] == null) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }

    return options;
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
        // 新增属性继续观察
        this.__ob__.observerArray(inserted);
      }

      ob.dep.notify();
      return result;
    };
  });

  var id = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "depend",
      value: function depend() {
        // 让当前的watcher 记住我当前的dep 
        //  当前watcher存有当前dep的时候 说明当前dep也存在当前watcher
        Dep.target.addDep(this);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();
  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push[watcher];
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // vue如果数据层次过多 需要递归去解析对象中的属性 依次添加set和gte方法
      this.dep = new Dep(); // 给数组用的
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
    // 这个dep是给对象用的
    var dep = new Dep(); // 这个value可能是对象 也可能是数组 返回的结果是当前这个value对应的observer实例

    var childOb = observe(value); // 递归实现深度检测

    Object.defineProperty(data, key, {
      get: function get() {
        // 获取值的操作
        // 如果当前有watcher
        if (Dep.target) {
          // 将当前watcher存起来
          dep.depend();

          if (childOb) {
            /*****数组的依赖收集********/
            // 收集了数组的相关依赖
            childOb.dep.depend(); // 如果数组中还有数组

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newValue) {
        // 修改值的操作
        if (newValue === value) return;
        observe(newValue); // 继续劫持用户设置的值 因为用户有可能设置的是一个对象

        value = newValue; // 通知依赖的watcher来进行更新操作

        dep.notify();
      }
    });
  } // 如果数组里面  添加的是一个新数组


  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i]; // 将数组中的每一个都取出来 收集依赖

      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  } // 吧data的数据 使用defineProperty重新定义


  function observe(data) {
    var isObj = isObject(data);

    if (!isObj) {
      return;
    }

    return new Observer(data);
  }

  var callbacks = [];
  var waiting = false;

  function flushCallback() {
    callbacks.forEach(function (cb) {
      return cb();
    });
    waiting = false;
    callbacks = [];
  }

  function nextTick(cb) {
    // 多次调用nexttick 如果没有刷新的时候 就先把他放到数组中
    // 刷新后 更改waiting
    callbacks.push(cb);

    if (waiting === false) {
      setTimeout(flushCallback, 0);
      waiting = true;
    }
  }

  var queue = [];
  var has = {};

  function flushSchedularQueue() {
    queue.forEach(function (watcher) {
      return watcher.run();
    });
    queue = [];
    has = {};
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] == null) {
      queue.push(watcher);
      has[id] = true; // 微任务和宏任务
      //Vue.$nextTick = promise / mutationObserver / setImmediated / setTimeout

      nextTick(flushSchedularQueue);
    }
  }

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.id = id$1++;
      this.exprOrFn = exprOrFn;
      this.immediate = options.immediate; // 计算属性标识 

      this.lazy = options.lazy;
      this.dirty = this.lazy;

      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn; //将内部传过来的回调函数 放到getter属性上
      } else {
        this.getter = function () {
          // 会将vm上对应的表达式取出来
          return function (vm, exprOrFn) {
            return vm[exprOrFn];
          }(vm, exprOrFn);
        };
      }

      if (options.user) {
        // 如果是用户watcher
        this.user = true;
      }

      this.depsId = new Set();
      this.deps = []; // 创建watcher的时候 先将表达式对应的值取出来
      // 如果当前是计算属性的话 不会默认调取get方法

      this.value = this.lazy ? undefined : this.get(); // 如果有immediate 则直接执行handler函数

      if (this.immediate) {
        this.callback(this.value);
      }
    }

    _createClass(Watcher, [{
      key: "evaluate",
      value: function evaluate() {
        // dep放置计算属性watcher
        this.value = this.get(); // 设置标记 表明计算属性值已经求过了

        this.dirty = false;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        // watcher里不能放重复的dep dep里不能放重复的watcher
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }
    }, {
      key: "depend",
      value: function depend() {
        var deps = this.deps.length;

        while (i--) {
          // 找到firstName和lastName的dep 为其添加当前的渲染watcher
          deps[i].depend();
        }
      }
    }, {
      key: "get",
      value: function get() {
        // 把当前watcher存起来
        pushTarget(this); // 这个函数调用时就会将当前计算属性watcher存起来

        var value = this.getter.call(this.vm); // 渲染watcher的执行
        //移出watcher

        popTarget();
        return value;
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          // 如果是计算属性依赖的值变化了 稍后取值时重新计算
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        // 新值
        var value = this.get();

        if (this.value !== value) {
          this.callback(value, this.value);
        }
      }
    }]);

    return Watcher;
  }(); // 在模板取值中 会进行依赖收集 再更改数据是会进行对应的watcher调用更新操作

  function initState(vm) {
    var opts = vm.$options; // vue的数据来源 属性 方法 数据 计算数学 watch

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) {
      initComputed(vm);
    }

    if (opts.watch) {
      initWatch(vm);
    }
  }

  function initData(vm) {
    // 数据初始化
    var data = vm.$options.data; // 用户传递的data

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 代理_data属性到vm上

    for (var key in data) {
      proxy(vm, '_data', key);
    } // 对象劫持 用户改变数据 我希望得到通知 刷新界面
    // MVVM 数据驱动视图
    // Object.defineProperty()


    observe(data); // 响应式原理
  } // 计算属性
  // 计算属性特点 默认不执行 等用户取值的时候再执行，会缓存取值的结果
  // 如果依赖的值变化了 会更新dirty属性 再次取值时 可以重新求值


  function createComputedGetter(vm, key) {
    // 这个watcher就是我们定义的计算属性
    var watcher = vm._watchersComputed[key]; // 用户取值时会执行此方法

    return function () {
      if (watcher) {
        // 如果页面取值 而且dirty是true 就会去调用watcher的get方法
        if (watcher.dirty) {
          watcher.evaluate();
        }

        if (Dep.target) {
          watcher.depend();
        }

        return watcher.value;
      }
    };
  }

  function initComputed(vm) {
    var computed = vm.$options.computed; // 将计算属性的配置 放到VM上

    var watchers = vm._watchersComputed = Object.create(null);

    for (var key in computed) {
      var userDef = computed[key];
      watchers[key] = new Watcher(vm, userDef, function () {}, {
        lazy: true
      });
      Object.defineProperty(vm, key, {
        get: createComputedGetter(vm, key)
      });
    }
  } // watch属性
  // watch不能用在模板里 监控的逻辑都放在watch中即可


  function createWatcher(vm, key, handler, opts) {
    return vm.$watch(key, handler, opts);
  }

  function initWatch(vm) {
    // 获取用户传入的watch
    var watch = vm.$options.watch;

    for (var key in watch) {
      var userDef = watch[key];
      var handler = userDef;

      if (userDef.handler) {
        handler = userDef.handler;
      }

      createWatcher(vm, key, handler, {
        immediate: userDef.immediate
      });
    }
  }

  // ast语法树 用对象来描述原生语法 虚拟dom 用对象来描述dom节点
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //aaa: asd

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTagOpen = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签的结尾 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; //匹配属性

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的>
  function parseHTML(html) {
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
      // 遇到开始标签 创建ast元素
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
    } // 解析结束标签  找到父节点 添加孩子


    function end(tagName) {
      var element = stack.pop(); // 拿到的是ast对象
      // 标识当前这个元素是属于哪个父亲的

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    } // 不停的去解析html


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

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 处理属性 拼接成属性的字符串

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i]; // 将style属性转为对象

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(children) {
    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    }
  }

  function gen(node) {
    if (node.type == 1) {
      // 元素标签
      return generate(node);
    } else {
      var text = node.text;
      var tokens = [];
      var match, index; // 每次的偏移量

      var lastIndex = defaultTagRE.lastIndex = 0; // 只要是全局匹配 就需要每次匹配时将lastIndex调到0处

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function generate(el) {
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(el.children ? ",".concat(genChildren(el.children)) : '', ")\n  ");
    return code;
  }

  function compileToFunction(template) {
    // 1 解析模板  将模板转为AST语法树
    var root = parseHTML(template); // 2 需要将ast语法树生成为最终的render函数（就是字符串拼接 模板引擎）

    var code = generate(root); // 通过with（obj）将后面的{}中的语句块中的缺省对象设置为obj

    var renderFn = new Function("with(this){return ".concat(code, "}"));
    return renderFn; // 模板引擎实现： 1.拼接字符串 2.增加with 3.new Function
  }

  function patch(oldVnode, vnode) {
    // 递归创建真实节点 替换掉老节点
    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      var oldElm = oldVnode;
      var parentElm = oldElm.parentNode;
      var el = creatElm(vnode);
      parentElm.insertBefore(el, oldElm.nextSibling);
      parentElm.removeChild(oldElm);
      return el;
    }
  }

  function creatElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text; // 是标签就创建标签

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag); //更新属性

      updateProperties(vnode); // 递归创建儿子节点 将儿子节点添加到父亲上

      children.forEach(function (child) {
        return vnode.el.appendChild(creatElm(child));
      });
    } else {
      // 虚拟dom上映射真实dom 方便以后操作
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function updateProperties(vnode) {
    var newProps = vnode.data || {};
    var el = vnode.el;

    for (var key in newProps) {
      if (key === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this; // 通过虚拟节点 渲染真实dom

      vm.$el = patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    var option = vm.$options; // render

    vm.$el = el; // Watcher 用来渲染
    // vm._rende解析render方法 产生虚拟dom
    // vm._update通过虚拟dom创建真实的dom

    callHook(vm, 'beforeMount'); // 渲染页面

    var updateComponent = function updateComponent() {
      // 无论是渲染还是更新都会调用此方法
      // 返回的是虚拟dom
      vm._update(vm._render());
    };

    new Watcher(vm, updateComponent, function () {}, true); // true表示他是一个渲染watcher

    callHook(vm, 'mounted');
  } // 找到对应的钩子 依次执行

  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function initMixin(Vue) {
    // 在原型上添加一个init方法
    Vue.prototype._init = function (options) {
      // 数据的劫持
      var vm = this; // 将用户传递的 和 全局的进行合并

      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, 'beforeCreate'); // 初试状态

      initState(vm); //分割代码

      callHook(vm, 'created'); // 如果用户传入了el属性 需要将页面渲染

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
        options.render = render; // 渲染当前组件 挂载组件

        mountComponent(vm, el);
      }
    };

    Vue.prototype.$nextTick = nextTick;

    Vue.prototype.$watch = function (expr, handler, opts) {
      var vm = this; // 原理 创建一个用户watcher

      new Watcher(vm, expr, handler, _objectSpread2({
        user: true
      }, opts));
    };
  }

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, key, children, undefined);
  }
  function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  } // 渲染流程: 将template转换成ast语法树 -> 生成render方法 -> 生成虚拟dom -> 生成真实dom

  function renderMixin(Vue) {
    // _c 创建元素的虚拟节点
    Vue.prototype._c = function () {
      // arguments -> tag, data, children1, children2, ....
      return createElement.apply(void 0, arguments);
    }; // _v 创建文本的虚拟节点


    Vue.prototype._v = function (text) {
      return createTextNode(text);
    }; // _s JSON.stringify


    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render; // 去实例上取值

      var vnode = render.call(vm);
      return vnode;
    };
  }

  function initClobalAPI(Vue) {
    // 整合了所以的全局相关的内容
    Vue.options = {};

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    }; // 声明周期合并策略
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

  // Vue核心代码 只是Vue的一个声明

  function Vue(options) {
    // 进行vue的初始化操作
    this._init(options);
  } // 通过引入文件的方式，给vue原型上添加方法


  initMixin(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue); // 初始化全局api

  initClobalAPI(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
