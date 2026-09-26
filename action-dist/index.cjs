"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@babel/runtime/helpers/interopRequireDefault.js
var require_interopRequireDefault = __commonJS({
  "node_modules/@babel/runtime/helpers/interopRequireDefault.js"(exports2, module2) {
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }
    module2.exports = _interopRequireDefault, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/core-js/modules/_global.js
var require_global = __commonJS({
  "node_modules/core-js/modules/_global.js"(exports2, module2) {
    var global = module2.exports = typeof window != "undefined" && window.Math == Math ? window : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();
    if (typeof __g == "number") __g = global;
  }
});

// node_modules/core-js/modules/_core.js
var require_core = __commonJS({
  "node_modules/core-js/modules/_core.js"(exports2, module2) {
    var core = module2.exports = { version: "2.6.12" };
    if (typeof __e == "number") __e = core;
  }
});

// node_modules/core-js/modules/_is-object.js
var require_is_object = __commonJS({
  "node_modules/core-js/modules/_is-object.js"(exports2, module2) {
    module2.exports = function(it) {
      return typeof it === "object" ? it !== null : typeof it === "function";
    };
  }
});

// node_modules/core-js/modules/_an-object.js
var require_an_object = __commonJS({
  "node_modules/core-js/modules/_an-object.js"(exports2, module2) {
    var isObject = require_is_object();
    module2.exports = function(it) {
      if (!isObject(it)) throw TypeError(it + " is not an object!");
      return it;
    };
  }
});

// node_modules/core-js/modules/_fails.js
var require_fails = __commonJS({
  "node_modules/core-js/modules/_fails.js"(exports2, module2) {
    module2.exports = function(exec) {
      try {
        return !!exec();
      } catch (e) {
        return true;
      }
    };
  }
});

// node_modules/core-js/modules/_descriptors.js
var require_descriptors = __commonJS({
  "node_modules/core-js/modules/_descriptors.js"(exports2, module2) {
    module2.exports = !require_fails()(function() {
      return Object.defineProperty({}, "a", { get: function() {
        return 7;
      } }).a != 7;
    });
  }
});

// node_modules/core-js/modules/_dom-create.js
var require_dom_create = __commonJS({
  "node_modules/core-js/modules/_dom-create.js"(exports2, module2) {
    var isObject = require_is_object();
    var document = require_global().document;
    var is = isObject(document) && isObject(document.createElement);
    module2.exports = function(it) {
      return is ? document.createElement(it) : {};
    };
  }
});

// node_modules/core-js/modules/_ie8-dom-define.js
var require_ie8_dom_define = __commonJS({
  "node_modules/core-js/modules/_ie8-dom-define.js"(exports2, module2) {
    module2.exports = !require_descriptors() && !require_fails()(function() {
      return Object.defineProperty(require_dom_create()("div"), "a", { get: function() {
        return 7;
      } }).a != 7;
    });
  }
});

// node_modules/core-js/modules/_to-primitive.js
var require_to_primitive = __commonJS({
  "node_modules/core-js/modules/_to-primitive.js"(exports2, module2) {
    var isObject = require_is_object();
    module2.exports = function(it, S) {
      if (!isObject(it)) return it;
      var fn, val;
      if (S && typeof (fn = it.toString) == "function" && !isObject(val = fn.call(it))) return val;
      if (typeof (fn = it.valueOf) == "function" && !isObject(val = fn.call(it))) return val;
      if (!S && typeof (fn = it.toString) == "function" && !isObject(val = fn.call(it))) return val;
      throw TypeError("Can't convert object to primitive value");
    };
  }
});

// node_modules/core-js/modules/_object-dp.js
var require_object_dp = __commonJS({
  "node_modules/core-js/modules/_object-dp.js"(exports2) {
    var anObject = require_an_object();
    var IE8_DOM_DEFINE = require_ie8_dom_define();
    var toPrimitive = require_to_primitive();
    var dP = Object.defineProperty;
    exports2.f = require_descriptors() ? Object.defineProperty : function defineProperty(O, P, Attributes) {
      anObject(O);
      P = toPrimitive(P, true);
      anObject(Attributes);
      if (IE8_DOM_DEFINE) try {
        return dP(O, P, Attributes);
      } catch (e) {
      }
      if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported!");
      if ("value" in Attributes) O[P] = Attributes.value;
      return O;
    };
  }
});

// node_modules/core-js/modules/_property-desc.js
var require_property_desc = __commonJS({
  "node_modules/core-js/modules/_property-desc.js"(exports2, module2) {
    module2.exports = function(bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value
      };
    };
  }
});

// node_modules/core-js/modules/_hide.js
var require_hide = __commonJS({
  "node_modules/core-js/modules/_hide.js"(exports2, module2) {
    var dP = require_object_dp();
    var createDesc = require_property_desc();
    module2.exports = require_descriptors() ? function(object, key, value) {
      return dP.f(object, key, createDesc(1, value));
    } : function(object, key, value) {
      object[key] = value;
      return object;
    };
  }
});

// node_modules/core-js/modules/_has.js
var require_has = __commonJS({
  "node_modules/core-js/modules/_has.js"(exports2, module2) {
    var hasOwnProperty = {}.hasOwnProperty;
    module2.exports = function(it, key) {
      return hasOwnProperty.call(it, key);
    };
  }
});

// node_modules/core-js/modules/_uid.js
var require_uid = __commonJS({
  "node_modules/core-js/modules/_uid.js"(exports2, module2) {
    var id = 0;
    var px = Math.random();
    module2.exports = function(key) {
      return "Symbol(".concat(key === void 0 ? "" : key, ")_", (++id + px).toString(36));
    };
  }
});

// node_modules/core-js/modules/_library.js
var require_library = __commonJS({
  "node_modules/core-js/modules/_library.js"(exports2, module2) {
    module2.exports = false;
  }
});

// node_modules/core-js/modules/_shared.js
var require_shared = __commonJS({
  "node_modules/core-js/modules/_shared.js"(exports2, module2) {
    var core = require_core();
    var global = require_global();
    var SHARED = "__core-js_shared__";
    var store = global[SHARED] || (global[SHARED] = {});
    (module2.exports = function(key, value) {
      return store[key] || (store[key] = value !== void 0 ? value : {});
    })("versions", []).push({
      version: core.version,
      mode: require_library() ? "pure" : "global",
      copyright: "\xA9 2020 Denis Pushkarev (zloirock.ru)"
    });
  }
});

// node_modules/core-js/modules/_function-to-string.js
var require_function_to_string = __commonJS({
  "node_modules/core-js/modules/_function-to-string.js"(exports2, module2) {
    module2.exports = require_shared()("native-function-to-string", Function.toString);
  }
});

// node_modules/core-js/modules/_redefine.js
var require_redefine = __commonJS({
  "node_modules/core-js/modules/_redefine.js"(exports2, module2) {
    var global = require_global();
    var hide = require_hide();
    var has = require_has();
    var SRC = require_uid()("src");
    var $toString = require_function_to_string();
    var TO_STRING = "toString";
    var TPL = ("" + $toString).split(TO_STRING);
    require_core().inspectSource = function(it) {
      return $toString.call(it);
    };
    (module2.exports = function(O, key, val, safe) {
      var isFunction = typeof val == "function";
      if (isFunction) has(val, "name") || hide(val, "name", key);
      if (O[key] === val) return;
      if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? "" + O[key] : TPL.join(String(key)));
      if (O === global) {
        O[key] = val;
      } else if (!safe) {
        delete O[key];
        hide(O, key, val);
      } else if (O[key]) {
        O[key] = val;
      } else {
        hide(O, key, val);
      }
    })(Function.prototype, TO_STRING, function toString() {
      return typeof this == "function" && this[SRC] || $toString.call(this);
    });
  }
});

// node_modules/core-js/modules/_a-function.js
var require_a_function = __commonJS({
  "node_modules/core-js/modules/_a-function.js"(exports2, module2) {
    module2.exports = function(it) {
      if (typeof it != "function") throw TypeError(it + " is not a function!");
      return it;
    };
  }
});

// node_modules/core-js/modules/_ctx.js
var require_ctx = __commonJS({
  "node_modules/core-js/modules/_ctx.js"(exports2, module2) {
    var aFunction = require_a_function();
    module2.exports = function(fn, that, length) {
      aFunction(fn);
      if (that === void 0) return fn;
      switch (length) {
        case 1:
          return function(a) {
            return fn.call(that, a);
          };
        case 2:
          return function(a, b) {
            return fn.call(that, a, b);
          };
        case 3:
          return function(a, b, c) {
            return fn.call(that, a, b, c);
          };
      }
      return function() {
        return fn.apply(that, arguments);
      };
    };
  }
});

// node_modules/core-js/modules/_export.js
var require_export = __commonJS({
  "node_modules/core-js/modules/_export.js"(exports2, module2) {
    var global = require_global();
    var core = require_core();
    var hide = require_hide();
    var redefine = require_redefine();
    var ctx = require_ctx();
    var PROTOTYPE = "prototype";
    var $export = function(type, name, source) {
      var IS_FORCED = type & $export.F;
      var IS_GLOBAL = type & $export.G;
      var IS_STATIC = type & $export.S;
      var IS_PROTO = type & $export.P;
      var IS_BIND = type & $export.B;
      var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
      var exports3 = IS_GLOBAL ? core : core[name] || (core[name] = {});
      var expProto = exports3[PROTOTYPE] || (exports3[PROTOTYPE] = {});
      var key, own, out, exp;
      if (IS_GLOBAL) source = name;
      for (key in source) {
        own = !IS_FORCED && target && target[key] !== void 0;
        out = (own ? target : source)[key];
        exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == "function" ? ctx(Function.call, out) : out;
        if (target) redefine(target, key, out, type & $export.U);
        if (exports3[key] != out) hide(exports3, key, exp);
        if (IS_PROTO && expProto[key] != out) expProto[key] = out;
      }
    };
    global.core = core;
    $export.F = 1;
    $export.G = 2;
    $export.S = 4;
    $export.P = 8;
    $export.B = 16;
    $export.W = 32;
    $export.U = 64;
    $export.R = 128;
    module2.exports = $export;
  }
});

// node_modules/core-js/modules/es6.object.define-property.js
var require_es6_object_define_property = __commonJS({
  "node_modules/core-js/modules/es6.object.define-property.js"() {
    var $export = require_export();
    $export($export.S + $export.F * !require_descriptors(), "Object", { defineProperty: require_object_dp().f });
  }
});

// node_modules/core-js/modules/_defined.js
var require_defined = __commonJS({
  "node_modules/core-js/modules/_defined.js"(exports2, module2) {
    module2.exports = function(it) {
      if (it == void 0) throw TypeError("Can't call method on  " + it);
      return it;
    };
  }
});

// node_modules/core-js/modules/_to-object.js
var require_to_object = __commonJS({
  "node_modules/core-js/modules/_to-object.js"(exports2, module2) {
    var defined = require_defined();
    module2.exports = function(it) {
      return Object(defined(it));
    };
  }
});

// node_modules/core-js/modules/_to-integer.js
var require_to_integer = __commonJS({
  "node_modules/core-js/modules/_to-integer.js"(exports2, module2) {
    var ceil = Math.ceil;
    var floor = Math.floor;
    module2.exports = function(it) {
      return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
    };
  }
});

// node_modules/core-js/modules/_to-length.js
var require_to_length = __commonJS({
  "node_modules/core-js/modules/_to-length.js"(exports2, module2) {
    var toInteger = require_to_integer();
    var min = Math.min;
    module2.exports = function(it) {
      return it > 0 ? min(toInteger(it), 9007199254740991) : 0;
    };
  }
});

// node_modules/core-js/modules/_string-at.js
var require_string_at = __commonJS({
  "node_modules/core-js/modules/_string-at.js"(exports2, module2) {
    var toInteger = require_to_integer();
    var defined = require_defined();
    module2.exports = function(TO_STRING) {
      return function(that, pos) {
        var s = String(defined(that));
        var i = toInteger(pos);
        var l = s.length;
        var a, b;
        if (i < 0 || i >= l) return TO_STRING ? "" : void 0;
        a = s.charCodeAt(i);
        return a < 55296 || a > 56319 || i + 1 === l || (b = s.charCodeAt(i + 1)) < 56320 || b > 57343 ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 55296 << 10) + (b - 56320) + 65536;
      };
    };
  }
});

// node_modules/core-js/modules/_advance-string-index.js
var require_advance_string_index = __commonJS({
  "node_modules/core-js/modules/_advance-string-index.js"(exports2, module2) {
    "use strict";
    var at = require_string_at()(true);
    module2.exports = function(S, index, unicode) {
      return index + (unicode ? at(S, index).length : 1);
    };
  }
});

// node_modules/core-js/modules/_cof.js
var require_cof = __commonJS({
  "node_modules/core-js/modules/_cof.js"(exports2, module2) {
    var toString = {}.toString;
    module2.exports = function(it) {
      return toString.call(it).slice(8, -1);
    };
  }
});

// node_modules/core-js/modules/_wks.js
var require_wks = __commonJS({
  "node_modules/core-js/modules/_wks.js"(exports2, module2) {
    var store = require_shared()("wks");
    var uid = require_uid();
    var Symbol2 = require_global().Symbol;
    var USE_SYMBOL = typeof Symbol2 == "function";
    var $exports = module2.exports = function(name) {
      return store[name] || (store[name] = USE_SYMBOL && Symbol2[name] || (USE_SYMBOL ? Symbol2 : uid)("Symbol." + name));
    };
    $exports.store = store;
  }
});

// node_modules/core-js/modules/_classof.js
var require_classof = __commonJS({
  "node_modules/core-js/modules/_classof.js"(exports2, module2) {
    var cof = require_cof();
    var TAG = require_wks()("toStringTag");
    var ARG = cof(/* @__PURE__ */ (function() {
      return arguments;
    })()) == "Arguments";
    var tryGet = function(it, key) {
      try {
        return it[key];
      } catch (e) {
      }
    };
    module2.exports = function(it) {
      var O, T, B;
      return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (T = tryGet(O = Object(it), TAG)) == "string" ? T : ARG ? cof(O) : (B = cof(O)) == "Object" && typeof O.callee == "function" ? "Arguments" : B;
    };
  }
});

// node_modules/core-js/modules/_regexp-exec-abstract.js
var require_regexp_exec_abstract = __commonJS({
  "node_modules/core-js/modules/_regexp-exec-abstract.js"(exports2, module2) {
    "use strict";
    var classof = require_classof();
    var builtinExec = RegExp.prototype.exec;
    module2.exports = function(R, S) {
      var exec = R.exec;
      if (typeof exec === "function") {
        var result = exec.call(R, S);
        if (typeof result !== "object") {
          throw new TypeError("RegExp exec method returned something other than an Object or null");
        }
        return result;
      }
      if (classof(R) !== "RegExp") {
        throw new TypeError("RegExp#exec called on incompatible receiver");
      }
      return builtinExec.call(R, S);
    };
  }
});

// node_modules/core-js/modules/_flags.js
var require_flags = __commonJS({
  "node_modules/core-js/modules/_flags.js"(exports2, module2) {
    "use strict";
    var anObject = require_an_object();
    module2.exports = function() {
      var that = anObject(this);
      var result = "";
      if (that.global) result += "g";
      if (that.ignoreCase) result += "i";
      if (that.multiline) result += "m";
      if (that.unicode) result += "u";
      if (that.sticky) result += "y";
      return result;
    };
  }
});

// node_modules/core-js/modules/_regexp-exec.js
var require_regexp_exec = __commonJS({
  "node_modules/core-js/modules/_regexp-exec.js"(exports2, module2) {
    "use strict";
    var regexpFlags = require_flags();
    var nativeExec = RegExp.prototype.exec;
    var nativeReplace = String.prototype.replace;
    var patchedExec = nativeExec;
    var LAST_INDEX = "lastIndex";
    var UPDATES_LAST_INDEX_WRONG = (function() {
      var re1 = /a/, re2 = /b*/g;
      nativeExec.call(re1, "a");
      nativeExec.call(re2, "a");
      return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
    })();
    var NPCG_INCLUDED = /()??/.exec("")[1] !== void 0;
    var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;
    if (PATCH) {
      patchedExec = function exec(str) {
        var re = this;
        var lastIndex, reCopy, match, i;
        if (NPCG_INCLUDED) {
          reCopy = new RegExp("^" + re.source + "$(?!\\s)", regexpFlags.call(re));
        }
        if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];
        match = nativeExec.call(re, str);
        if (UPDATES_LAST_INDEX_WRONG && match) {
          re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
        }
        if (NPCG_INCLUDED && match && match.length > 1) {
          nativeReplace.call(match[0], reCopy, function() {
            for (i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === void 0) match[i] = void 0;
            }
          });
        }
        return match;
      };
    }
    module2.exports = patchedExec;
  }
});

// node_modules/core-js/modules/es6.regexp.exec.js
var require_es6_regexp_exec = __commonJS({
  "node_modules/core-js/modules/es6.regexp.exec.js"() {
    "use strict";
    var regexpExec = require_regexp_exec();
    require_export()({
      target: "RegExp",
      proto: true,
      forced: regexpExec !== /./.exec
    }, {
      exec: regexpExec
    });
  }
});

// node_modules/core-js/modules/_fix-re-wks.js
var require_fix_re_wks = __commonJS({
  "node_modules/core-js/modules/_fix-re-wks.js"(exports2, module2) {
    "use strict";
    require_es6_regexp_exec();
    var redefine = require_redefine();
    var hide = require_hide();
    var fails = require_fails();
    var defined = require_defined();
    var wks = require_wks();
    var regexpExec = require_regexp_exec();
    var SPECIES = wks("species");
    var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function() {
      var re = /./;
      re.exec = function() {
        var result = [];
        result.groups = { a: "7" };
        return result;
      };
      return "".replace(re, "$<a>") !== "7";
    });
    var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function() {
      var re = /(?:)/;
      var originalExec = re.exec;
      re.exec = function() {
        return originalExec.apply(this, arguments);
      };
      var result = "ab".split(re);
      return result.length === 2 && result[0] === "a" && result[1] === "b";
    })();
    module2.exports = function(KEY, length, exec) {
      var SYMBOL = wks(KEY);
      var DELEGATES_TO_SYMBOL = !fails(function() {
        var O = {};
        O[SYMBOL] = function() {
          return 7;
        };
        return ""[KEY](O) != 7;
      });
      var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function() {
        var execCalled = false;
        var re = /a/;
        re.exec = function() {
          execCalled = true;
          return null;
        };
        if (KEY === "split") {
          re.constructor = {};
          re.constructor[SPECIES] = function() {
            return re;
          };
        }
        re[SYMBOL]("");
        return !execCalled;
      }) : void 0;
      if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === "replace" && !REPLACE_SUPPORTS_NAMED_GROUPS || KEY === "split" && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
        var nativeRegExpMethod = /./[SYMBOL];
        var fns = exec(
          defined,
          SYMBOL,
          ""[KEY],
          function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
            if (regexp.exec === regexpExec) {
              if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
              }
              return { done: true, value: nativeMethod.call(str, regexp, arg2) };
            }
            return { done: false };
          }
        );
        var strfn = fns[0];
        var rxfn = fns[1];
        redefine(String.prototype, KEY, strfn);
        hide(
          RegExp.prototype,
          SYMBOL,
          length == 2 ? function(string, arg) {
            return rxfn.call(string, this, arg);
          } : function(string) {
            return rxfn.call(string, this);
          }
        );
      }
    };
  }
});

// node_modules/core-js/modules/es6.regexp.replace.js
var require_es6_regexp_replace = __commonJS({
  "node_modules/core-js/modules/es6.regexp.replace.js"() {
    "use strict";
    var anObject = require_an_object();
    var toObject = require_to_object();
    var toLength = require_to_length();
    var toInteger = require_to_integer();
    var advanceStringIndex = require_advance_string_index();
    var regExpExec = require_regexp_exec_abstract();
    var max = Math.max;
    var min = Math.min;
    var floor = Math.floor;
    var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
    var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;
    var maybeToString = function(it) {
      return it === void 0 ? it : String(it);
    };
    require_fix_re_wks()("replace", 2, function(defined, REPLACE, $replace, maybeCallNative) {
      return [
        // `String.prototype.replace` method
        // https://tc39.github.io/ecma262/#sec-string.prototype.replace
        function replace(searchValue, replaceValue) {
          var O = defined(this);
          var fn = searchValue == void 0 ? void 0 : searchValue[REPLACE];
          return fn !== void 0 ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
        },
        // `RegExp.prototype[@@replace]` method
        // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
        function(regexp, replaceValue) {
          var res = maybeCallNative($replace, regexp, this, replaceValue);
          if (res.done) return res.value;
          var rx = anObject(regexp);
          var S = String(this);
          var functionalReplace = typeof replaceValue === "function";
          if (!functionalReplace) replaceValue = String(replaceValue);
          var global = rx.global;
          if (global) {
            var fullUnicode = rx.unicode;
            rx.lastIndex = 0;
          }
          var results = [];
          while (true) {
            var result = regExpExec(rx, S);
            if (result === null) break;
            results.push(result);
            if (!global) break;
            var matchStr = String(result[0]);
            if (matchStr === "") rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
          }
          var accumulatedResult = "";
          var nextSourcePosition = 0;
          for (var i = 0; i < results.length; i++) {
            result = results[i];
            var matched = String(result[0]);
            var position = max(min(toInteger(result.index), S.length), 0);
            var captures = [];
            for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
            var namedCaptures = result.groups;
            if (functionalReplace) {
              var replacerArgs = [matched].concat(captures, position, S);
              if (namedCaptures !== void 0) replacerArgs.push(namedCaptures);
              var replacement = String(replaceValue.apply(void 0, replacerArgs));
            } else {
              replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
            }
            if (position >= nextSourcePosition) {
              accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
              nextSourcePosition = position + matched.length;
            }
          }
          return accumulatedResult + S.slice(nextSourcePosition);
        }
      ];
      function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
        var tailPos = position + matched.length;
        var m = captures.length;
        var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
        if (namedCaptures !== void 0) {
          namedCaptures = toObject(namedCaptures);
          symbols = SUBSTITUTION_SYMBOLS;
        }
        return $replace.call(replacement, symbols, function(match, ch) {
          var capture;
          switch (ch.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return matched;
            case "`":
              return str.slice(0, position);
            case "'":
              return str.slice(tailPos);
            case "<":
              capture = namedCaptures[ch.slice(1, -1)];
              break;
            default:
              var n = +ch;
              if (n === 0) return match;
              if (n > m) {
                var f = floor(n / 10);
                if (f === 0) return match;
                if (f <= m) return captures[f - 1] === void 0 ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
                return match;
              }
              capture = captures[n - 1];
          }
          return capture === void 0 ? "" : capture;
        });
      }
    });
  }
});

// node_modules/core-js/modules/_iobject.js
var require_iobject = __commonJS({
  "node_modules/core-js/modules/_iobject.js"(exports2, module2) {
    var cof = require_cof();
    module2.exports = Object("z").propertyIsEnumerable(0) ? Object : function(it) {
      return cof(it) == "String" ? it.split("") : Object(it);
    };
  }
});

// node_modules/core-js/modules/_to-iobject.js
var require_to_iobject = __commonJS({
  "node_modules/core-js/modules/_to-iobject.js"(exports2, module2) {
    var IObject = require_iobject();
    var defined = require_defined();
    module2.exports = function(it) {
      return IObject(defined(it));
    };
  }
});

// node_modules/core-js/modules/_to-absolute-index.js
var require_to_absolute_index = __commonJS({
  "node_modules/core-js/modules/_to-absolute-index.js"(exports2, module2) {
    var toInteger = require_to_integer();
    var max = Math.max;
    var min = Math.min;
    module2.exports = function(index, length) {
      index = toInteger(index);
      return index < 0 ? max(index + length, 0) : min(index, length);
    };
  }
});

// node_modules/core-js/modules/_array-includes.js
var require_array_includes = __commonJS({
  "node_modules/core-js/modules/_array-includes.js"(exports2, module2) {
    var toIObject = require_to_iobject();
    var toLength = require_to_length();
    var toAbsoluteIndex = require_to_absolute_index();
    module2.exports = function(IS_INCLUDES) {
      return function($this, el, fromIndex) {
        var O = toIObject($this);
        var length = toLength(O.length);
        var index = toAbsoluteIndex(fromIndex, length);
        var value;
        if (IS_INCLUDES && el != el) while (length > index) {
          value = O[index++];
          if (value != value) return true;
        }
        else for (; length > index; index++) if (IS_INCLUDES || index in O) {
          if (O[index] === el) return IS_INCLUDES || index || 0;
        }
        return !IS_INCLUDES && -1;
      };
    };
  }
});

// node_modules/core-js/modules/_strict-method.js
var require_strict_method = __commonJS({
  "node_modules/core-js/modules/_strict-method.js"(exports2, module2) {
    "use strict";
    var fails = require_fails();
    module2.exports = function(method, arg) {
      return !!method && fails(function() {
        arg ? method.call(null, function() {
        }, 1) : method.call(null);
      });
    };
  }
});

// node_modules/core-js/modules/es6.array.index-of.js
var require_es6_array_index_of = __commonJS({
  "node_modules/core-js/modules/es6.array.index-of.js"() {
    "use strict";
    var $export = require_export();
    var $indexOf = require_array_includes()(false);
    var $native = [].indexOf;
    var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;
    $export($export.P + $export.F * (NEGATIVE_ZERO || !require_strict_method()($native)), "Array", {
      // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
      indexOf: function indexOf(searchElement) {
        return NEGATIVE_ZERO ? $native.apply(this, arguments) || 0 : $indexOf(this, searchElement, arguments[1]);
      }
    });
  }
});

// node_modules/twitter-text/dist/regexp/cashtag.js
var require_cashtag = __commonJS({
  "node_modules/twitter-text/dist/regexp/cashtag.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var cashtag = /[a-z]{1,6}(?:[._][a-z]{1,2})?/i;
    var _default = cashtag;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/punct.js
var require_punct = __commonJS({
  "node_modules/twitter-text/dist/regexp/punct.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var punct = /\!'#%&'\(\)*\+,\\\-\.\/:;<=>\?@\[\]\^_{|}~\$/;
    var _default = punct;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/core-js/modules/_object-pie.js
var require_object_pie = __commonJS({
  "node_modules/core-js/modules/_object-pie.js"(exports2) {
    exports2.f = {}.propertyIsEnumerable;
  }
});

// node_modules/core-js/modules/_object-gopd.js
var require_object_gopd = __commonJS({
  "node_modules/core-js/modules/_object-gopd.js"(exports2) {
    var pIE = require_object_pie();
    var createDesc = require_property_desc();
    var toIObject = require_to_iobject();
    var toPrimitive = require_to_primitive();
    var has = require_has();
    var IE8_DOM_DEFINE = require_ie8_dom_define();
    var gOPD = Object.getOwnPropertyDescriptor;
    exports2.f = require_descriptors() ? gOPD : function getOwnPropertyDescriptor(O, P) {
      O = toIObject(O);
      P = toPrimitive(P, true);
      if (IE8_DOM_DEFINE) try {
        return gOPD(O, P);
      } catch (e) {
      }
      if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
    };
  }
});

// node_modules/core-js/modules/_set-proto.js
var require_set_proto = __commonJS({
  "node_modules/core-js/modules/_set-proto.js"(exports2, module2) {
    var isObject = require_is_object();
    var anObject = require_an_object();
    var check = function(O, proto) {
      anObject(O);
      if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
    };
    module2.exports = {
      set: Object.setPrototypeOf || ("__proto__" in {} ? (
        // eslint-disable-line
        (function(test, buggy, set) {
          try {
            set = require_ctx()(Function.call, require_object_gopd().f(Object.prototype, "__proto__").set, 2);
            set(test, []);
            buggy = !(test instanceof Array);
          } catch (e) {
            buggy = true;
          }
          return function setPrototypeOf(O, proto) {
            check(O, proto);
            if (buggy) O.__proto__ = proto;
            else set(O, proto);
            return O;
          };
        })({}, false)
      ) : void 0),
      check
    };
  }
});

// node_modules/core-js/modules/_inherit-if-required.js
var require_inherit_if_required = __commonJS({
  "node_modules/core-js/modules/_inherit-if-required.js"(exports2, module2) {
    var isObject = require_is_object();
    var setPrototypeOf = require_set_proto().set;
    module2.exports = function(that, target, C) {
      var S = target.constructor;
      var P;
      if (S !== C && typeof S == "function" && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
        setPrototypeOf(that, P);
      }
      return that;
    };
  }
});

// node_modules/core-js/modules/_shared-key.js
var require_shared_key = __commonJS({
  "node_modules/core-js/modules/_shared-key.js"(exports2, module2) {
    var shared = require_shared()("keys");
    var uid = require_uid();
    module2.exports = function(key) {
      return shared[key] || (shared[key] = uid(key));
    };
  }
});

// node_modules/core-js/modules/_object-keys-internal.js
var require_object_keys_internal = __commonJS({
  "node_modules/core-js/modules/_object-keys-internal.js"(exports2, module2) {
    var has = require_has();
    var toIObject = require_to_iobject();
    var arrayIndexOf = require_array_includes()(false);
    var IE_PROTO = require_shared_key()("IE_PROTO");
    module2.exports = function(object, names) {
      var O = toIObject(object);
      var i = 0;
      var result = [];
      var key;
      for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
      while (names.length > i) if (has(O, key = names[i++])) {
        ~arrayIndexOf(result, key) || result.push(key);
      }
      return result;
    };
  }
});

// node_modules/core-js/modules/_enum-bug-keys.js
var require_enum_bug_keys = __commonJS({
  "node_modules/core-js/modules/_enum-bug-keys.js"(exports2, module2) {
    module2.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
  }
});

// node_modules/core-js/modules/_object-gopn.js
var require_object_gopn = __commonJS({
  "node_modules/core-js/modules/_object-gopn.js"(exports2) {
    var $keys = require_object_keys_internal();
    var hiddenKeys = require_enum_bug_keys().concat("length", "prototype");
    exports2.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
      return $keys(O, hiddenKeys);
    };
  }
});

// node_modules/core-js/modules/_is-regexp.js
var require_is_regexp = __commonJS({
  "node_modules/core-js/modules/_is-regexp.js"(exports2, module2) {
    var isObject = require_is_object();
    var cof = require_cof();
    var MATCH = require_wks()("match");
    module2.exports = function(it) {
      var isRegExp;
      return isObject(it) && ((isRegExp = it[MATCH]) !== void 0 ? !!isRegExp : cof(it) == "RegExp");
    };
  }
});

// node_modules/core-js/modules/_set-species.js
var require_set_species = __commonJS({
  "node_modules/core-js/modules/_set-species.js"(exports2, module2) {
    "use strict";
    var global = require_global();
    var dP = require_object_dp();
    var DESCRIPTORS = require_descriptors();
    var SPECIES = require_wks()("species");
    module2.exports = function(KEY) {
      var C = global[KEY];
      if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
        configurable: true,
        get: function() {
          return this;
        }
      });
    };
  }
});

// node_modules/core-js/modules/es6.regexp.constructor.js
var require_es6_regexp_constructor = __commonJS({
  "node_modules/core-js/modules/es6.regexp.constructor.js"() {
    var global = require_global();
    var inheritIfRequired = require_inherit_if_required();
    var dP = require_object_dp().f;
    var gOPN = require_object_gopn().f;
    var isRegExp = require_is_regexp();
    var $flags = require_flags();
    var $RegExp = global.RegExp;
    var Base = $RegExp;
    var proto = $RegExp.prototype;
    var re1 = /a/g;
    var re2 = /a/g;
    var CORRECT_NEW = new $RegExp(re1) !== re1;
    if (require_descriptors() && (!CORRECT_NEW || require_fails()(function() {
      re2[require_wks()("match")] = false;
      return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, "i") != "/a/i";
    }))) {
      $RegExp = function RegExp2(p, f) {
        var tiRE = this instanceof $RegExp;
        var piRE = isRegExp(p);
        var fiU = f === void 0;
        return !tiRE && piRE && p.constructor === $RegExp && fiU ? p : inheritIfRequired(
          CORRECT_NEW ? new Base(piRE && !fiU ? p.source : p, f) : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f),
          tiRE ? this : proto,
          $RegExp
        );
      };
      proxy = function(key) {
        key in $RegExp || dP($RegExp, key, {
          configurable: true,
          get: function() {
            return Base[key];
          },
          set: function(it) {
            Base[key] = it;
          }
        });
      };
      for (keys = gOPN(Base), i = 0; keys.length > i; ) proxy(keys[i++]);
      proto.constructor = $RegExp;
      $RegExp.prototype = proto;
      require_redefine()(global, "RegExp", $RegExp);
    }
    var proxy;
    var keys;
    var i;
    require_set_species()("RegExp");
  }
});

// node_modules/twitter-text/dist/lib/regexSupplant.js
var require_regexSupplant = __commonJS({
  "node_modules/twitter-text/dist/lib/regexSupplant.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_replace();
    require_es6_regexp_constructor();
    require_es6_array_index_of();
    function _default(regex, map, flags) {
      flags = flags || "";
      if (typeof regex !== "string") {
        if (regex.global && flags.indexOf("g") < 0) {
          flags += "g";
        }
        if (regex.ignoreCase && flags.indexOf("i") < 0) {
          flags += "i";
        }
        if (regex.multiline && flags.indexOf("m") < 0) {
          flags += "m";
        }
        regex = regex.source;
      }
      return new RegExp(regex.replace(/#\{(\w+)\}/g, function(match, name) {
        var newRegex = map[name] || "";
        if (typeof newRegex !== "string") {
          newRegex = newRegex.source;
        }
        return newRegex;
      }), flags);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/spacesGroup.js
var require_spacesGroup = __commonJS({
  "node_modules/twitter-text/dist/regexp/spacesGroup.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var spacesGroup = /\x09-\x0D\x20\x85\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000/;
    var _default = spacesGroup;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/spaces.js
var require_spaces = __commonJS({
  "node_modules/twitter-text/dist/regexp/spaces.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _spacesGroup = _interopRequireDefault(require_spacesGroup());
    var _default = (0, _regexSupplant["default"])(/[#{spacesGroup}]/, {
      spacesGroup: _spacesGroup["default"]
    });
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validCashtag.js
var require_validCashtag = __commonJS({
  "node_modules/twitter-text/dist/regexp/validCashtag.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _cashtag = _interopRequireDefault(require_cashtag());
    var _punct = _interopRequireDefault(require_punct());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _spaces = _interopRequireDefault(require_spaces());
    var validCashtag = (0, _regexSupplant["default"])("(^|#{spaces})(\\$)(#{cashtag})(?=$|\\s|[#{punct}])", {
      cashtag: _cashtag["default"],
      spaces: _spaces["default"],
      punct: _punct["default"]
    }, "gi");
    var _default = validCashtag;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/extractCashtagsWithIndices.js
var require_extractCashtagsWithIndices = __commonJS({
  "node_modules/twitter-text/dist/extractCashtagsWithIndices.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_replace();
    require_es6_array_index_of();
    var _validCashtag = _interopRequireDefault(require_validCashtag());
    function _default(text) {
      if (!text || text.indexOf("$") === -1) {
        return [];
      }
      var tags = [];
      text.replace(_validCashtag["default"], function(match, before, dollar, cashtag, offset, chunk) {
        var startPosition = offset + before.length;
        var endPosition = startPosition + cashtag.length + 1;
        tags.push({
          cashtag,
          indices: [startPosition, endPosition]
        });
      });
      return tags;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/core-js/modules/es6.regexp.match.js
var require_es6_regexp_match = __commonJS({
  "node_modules/core-js/modules/es6.regexp.match.js"() {
    "use strict";
    var anObject = require_an_object();
    var toLength = require_to_length();
    var advanceStringIndex = require_advance_string_index();
    var regExpExec = require_regexp_exec_abstract();
    require_fix_re_wks()("match", 1, function(defined, MATCH, $match, maybeCallNative) {
      return [
        // `String.prototype.match` method
        // https://tc39.github.io/ecma262/#sec-string.prototype.match
        function match(regexp) {
          var O = defined(this);
          var fn = regexp == void 0 ? void 0 : regexp[MATCH];
          return fn !== void 0 ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
        },
        // `RegExp.prototype[@@match]` method
        // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
        function(regexp) {
          var res = maybeCallNative($match, regexp, this);
          if (res.done) return res.value;
          var rx = anObject(regexp);
          var S = String(this);
          if (!rx.global) return regExpExec(rx, S);
          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
          var A = [];
          var n = 0;
          var result;
          while ((result = regExpExec(rx, S)) !== null) {
            var matchStr = String(result[0]);
            A[n] = matchStr;
            if (matchStr === "") rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
            n++;
          }
          return n === 0 ? null : A;
        }
      ];
    });
  }
});

// node_modules/twitter-text/dist/regexp/hashSigns.js
var require_hashSigns = __commonJS({
  "node_modules/twitter-text/dist/regexp/hashSigns.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var hashSigns = /[#＃]/;
    var _default = hashSigns;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/endHashtagMatch.js
var require_endHashtagMatch = __commonJS({
  "node_modules/twitter-text/dist/regexp/endHashtagMatch.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _hashSigns = _interopRequireDefault(require_hashSigns());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var endHashtagMatch = (0, _regexSupplant["default"])(/^(?:#{hashSigns}|:\/\/)/, {
      hashSigns: _hashSigns["default"]
    });
    var _default = endHashtagMatch;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validCCTLD.js
var require_validCCTLD = __commonJS({
  "node_modules/twitter-text/dist/regexp/validCCTLD.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    require_es6_regexp_constructor();
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var validCCTLD = (0, _regexSupplant["default"])(RegExp("(?:(?:\uD55C\uAD6D|\u9999\u6E2F|\u6FB3\u9580|\u65B0\u52A0\u5761|\u53F0\u7063|\u53F0\u6E7E|\u4E2D\u570B|\u4E2D\u56FD|\u10D2\u10D4|\u0EA5\u0EB2\u0EA7|\u0E44\u0E17\u0E22|\u0DBD\u0D82\u0D9A\u0DCF|\u0D2D\u0D3E\u0D30\u0D24\u0D02|\u0CAD\u0CBE\u0CB0\u0CA4|\u0C2D\u0C3E\u0C30\u0C24\u0C4D|\u0B9A\u0BBF\u0B99\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC2\u0BB0\u0BCD|\u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8|\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE|\u0B2D\u0B3E\u0B30\u0B24|\u0AAD\u0ABE\u0AB0\u0AA4|\u0A2D\u0A3E\u0A30\u0A24|\u09AD\u09BE\u09F0\u09A4|\u09AD\u09BE\u09B0\u09A4|\u09AC\u09BE\u0982\u09B2\u09BE|\u092D\u093E\u0930\u094B\u0924|\u092D\u093E\u0930\u0924\u092E\u094D|\u092D\u093E\u0930\u0924|\u0680\u0627\u0631\u062A|\u067E\u0627\u06A9\u0633\u062A\u0627\u0646|\u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627|\u0645\u0644\u064A\u0633\u064A\u0627|\u0645\u0635\u0631|\u0642\u0637\u0631|\u0641\u0644\u0633\u0637\u064A\u0646|\u0639\u0645\u0627\u0646|\u0639\u0631\u0627\u0642|\u0633\u0648\u0631\u064A\u0629|\u0633\u0648\u062F\u0627\u0646|\u062A\u0648\u0646\u0633|\u0628\u06BE\u0627\u0631\u062A|\u0628\u0627\u0631\u062A|\u0627\u06CC\u0631\u0627\u0646|\u0627\u0645\u0627\u0631\u0627\u062A|\u0627\u0644\u0645\u063A\u0631\u0628|\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629|\u0627\u0644\u062C\u0632\u0627\u0626\u0631|\u0627\u0644\u0628\u062D\u0631\u064A\u0646|\u0627\u0644\u0627\u0631\u062F\u0646|\u0570\u0561\u0575|\u049B\u0430\u0437|\u0443\u043A\u0440|\u0441\u0440\u0431|\u0440\u0444|\u043C\u043E\u043D|\u043C\u043A\u0434|\u0435\u044E|\u0431\u0435\u043B|\u0431\u0433|\u03B5\u03C5|\u03B5\u03BB|zw|zm|za|yt|ye|ws|wf|vu|vn|vi|vg|ve|vc|va|uz|uy|us|um|uk|ug|ua|tz|tw|tv|tt|tr|tp|to|tn|tm|tl|tk|tj|th|tg|tf|td|tc|sz|sy|sx|sv|su|st|ss|sr|so|sn|sm|sl|sk|sj|si|sh|sg|se|sd|sc|sb|sa|rw|ru|rs|ro|re|qa|py|pw|pt|ps|pr|pn|pm|pl|pk|ph|pg|pf|pe|pa|om|nz|nu|nr|np|no|nl|ni|ng|nf|ne|nc|na|mz|my|mx|mw|mv|mu|mt|ms|mr|mq|mp|mo|mn|mm|ml|mk|mh|mg|mf|me|md|mc|ma|ly|lv|lu|lt|ls|lr|lk|li|lc|lb|la|kz|ky|kw|kr|kp|kn|km|ki|kh|kg|ke|jp|jo|jm|je|it|is|ir|iq|io|in|im|il|ie|id|hu|ht|hr|hn|hm|hk|gy|gw|gu|gt|gs|gr|gq|gp|gn|gm|gl|gi|gh|gg|gf|ge|gd|gb|ga|fr|fo|fm|fk|fj|fi|eu|et|es|er|eh|eg|ee|ec|dz|do|dm|dk|dj|de|cz|cy|cx|cw|cv|cu|cr|co|cn|cm|cl|ck|ci|ch|cg|cf|cd|cc|ca|bz|by|bw|bv|bt|bs|br|bq|bo|bn|bm|bl|bj|bi|bh|bg|bf|be|bd|bb|ba|az|ax|aw|au|at|as|ar|aq|ao|an|am|al|ai|ag|af|ae|ad|ac)(?=[^0-9a-zA-Z@+-]|$))"));
    var _default = validCCTLD;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/directionalMarkersGroup.js
var require_directionalMarkersGroup = __commonJS({
  "node_modules/twitter-text/dist/regexp/directionalMarkersGroup.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var directionalMarkersGroup = /\u202A-\u202E\u061C\u200E\u200F\u2066\u2067\u2068\u2069/;
    var _default = directionalMarkersGroup;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/invalidCharsGroup.js
var require_invalidCharsGroup = __commonJS({
  "node_modules/twitter-text/dist/regexp/invalidCharsGroup.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var invalidCharsGroup = /\uFFFE\uFEFF\uFFFF/;
    var _default = invalidCharsGroup;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/lib/stringSupplant.js
var require_stringSupplant = __commonJS({
  "node_modules/twitter-text/dist/lib/stringSupplant.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_replace();
    function _default(str, map) {
      return str.replace(/#\{(\w+)\}/g, function(match, name) {
        return map[name] || "";
      });
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/invalidDomainChars.js
var require_invalidDomainChars = __commonJS({
  "node_modules/twitter-text/dist/regexp/invalidDomainChars.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _directionalMarkersGroup = _interopRequireDefault(require_directionalMarkersGroup());
    var _invalidCharsGroup = _interopRequireDefault(require_invalidCharsGroup());
    var _punct = _interopRequireDefault(require_punct());
    var _spacesGroup = _interopRequireDefault(require_spacesGroup());
    var _stringSupplant = _interopRequireDefault(require_stringSupplant());
    var invalidDomainChars = (0, _stringSupplant["default"])("#{punct}#{spacesGroup}#{invalidCharsGroup}#{directionalMarkersGroup}", {
      punct: _punct["default"],
      spacesGroup: _spacesGroup["default"],
      invalidCharsGroup: _invalidCharsGroup["default"],
      directionalMarkersGroup: _directionalMarkersGroup["default"]
    });
    var _default = invalidDomainChars;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validDomainChars.js
var require_validDomainChars = __commonJS({
  "node_modules/twitter-text/dist/regexp/validDomainChars.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _invalidDomainChars = _interopRequireDefault(require_invalidDomainChars());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var validDomainChars = (0, _regexSupplant["default"])(/[^#{invalidDomainChars}]/, {
      invalidDomainChars: _invalidDomainChars["default"]
    });
    var _default = validDomainChars;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validDomainName.js
var require_validDomainName = __commonJS({
  "node_modules/twitter-text/dist/regexp/validDomainName.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validDomainChars = _interopRequireDefault(require_validDomainChars());
    var validDomainName = (0, _regexSupplant["default"])(/(?:(?:#{validDomainChars}(?:-|#{validDomainChars})*)?#{validDomainChars}\.)/, {
      validDomainChars: _validDomainChars["default"]
    });
    var _default = validDomainName;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validGTLD.js
var require_validGTLD = __commonJS({
  "node_modules/twitter-text/dist/regexp/validGTLD.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    require_es6_regexp_constructor();
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var validGTLD = (0, _regexSupplant["default"])(RegExp("(?:(?:\uC0BC\uC131|\uB2F7\uCEF4|\uB2F7\uB137|\u9999\u683C\u91CC\u62C9|\u9910\u5385|\u98DF\u54C1|\u98DE\u5229\u6D66|\u96FB\u8A0A\u76C8\u79D1|\u96C6\u56E2|\u901A\u8CA9|\u8D2D\u7269|\u8C37\u6B4C|\u8BFA\u57FA\u4E9A|\u8054\u901A|\u7F51\u7EDC|\u7F51\u7AD9|\u7F51\u5E97|\u7F51\u5740|\u7EC4\u7EC7\u673A\u6784|\u79FB\u52A8|\u73E0\u5B9D|\u70B9\u770B|\u6E38\u620F|\u6DE1\u9A6C\u9521|\u673A\u6784|\u66F8\u7C4D|\u65F6\u5C1A|\u65B0\u95FB|\u653F\u5E9C|\u653F\u52A1|\u62DB\u8058|\u624B\u8868|\u624B\u673A|\u6211\u7231\u4F60|\u6148\u5584|\u5FAE\u535A|\u5E7F\u4E1C|\u5DE5\u884C|\u5BB6\u96FB|\u5A31\u4E50|\u5929\u4E3B\u6559|\u5927\u62FF|\u5927\u4F17\u6C7D\u8F66|\u5728\u7EBF|\u5609\u91CC\u5927\u9152\u5E97|\u5609\u91CC|\u5546\u6807|\u5546\u5E97|\u5546\u57CE|\u516C\u76CA|\u516C\u53F8|\u516B\u5366|\u5065\u5EB7|\u4FE1\u606F|\u4F5B\u5C71|\u4F01\u4E1A|\u4E2D\u6587\u7F51|\u4E2D\u4FE1|\u4E16\u754C|\u30DD\u30A4\u30F3\u30C8|\u30D5\u30A1\u30C3\u30B7\u30E7\u30F3|\u30BB\u30FC\u30EB|\u30B9\u30C8\u30A2|\u30B3\u30E0|\u30B0\u30FC\u30B0\u30EB|\u30AF\u30E9\u30A6\u30C9|\u307F\u3093\u306A|\u0E04\u0E2D\u0E21|\u0938\u0902\u0917\u0920\u0928|\u0928\u0947\u091F|\u0915\u0949\u092E|\u0647\u0645\u0631\u0627\u0647|\u0645\u0648\u0642\u0639|\u0645\u0648\u0628\u0627\u064A\u0644\u064A|\u0643\u0648\u0645|\u0643\u0627\u062B\u0648\u0644\u064A\u0643|\u0639\u0631\u0628|\u0634\u0628\u0643\u0629|\u0628\u064A\u062A\u0643|\u0628\u0627\u0632\u0627\u0631|\u0627\u0644\u0639\u0644\u064A\u0627\u0646|\u0627\u0631\u0627\u0645\u0643\u0648|\u0627\u062A\u0635\u0627\u0644\u0627\u062A|\u0627\u0628\u0648\u0638\u0628\u064A|\u05E7\u05D5\u05DD|\u0441\u0430\u0439\u0442|\u0440\u0443\u0441|\u043E\u0440\u0433|\u043E\u043D\u043B\u0430\u0439\u043D|\u043C\u043E\u0441\u043A\u0432\u0430|\u043A\u043E\u043C|\u043A\u0430\u0442\u043E\u043B\u0438\u043A|\u0434\u0435\u0442\u0438|zuerich|zone|zippo|zip|zero|zara|zappos|yun|youtube|you|yokohama|yoga|yodobashi|yandex|yamaxun|yahoo|yachts|xyz|xxx|xperia|xin|xihuan|xfinity|xerox|xbox|wtf|wtc|wow|world|works|work|woodside|wolterskluwer|wme|winners|wine|windows|win|williamhill|wiki|wien|whoswho|weir|weibo|wedding|wed|website|weber|webcam|weatherchannel|weather|watches|watch|warman|wanggou|wang|walter|walmart|wales|vuelos|voyage|voto|voting|vote|volvo|volkswagen|vodka|vlaanderen|vivo|viva|vistaprint|vista|vision|visa|virgin|vip|vin|villas|viking|vig|video|viajes|vet|versicherung|verm\xF6gensberatung|verm\xF6gensberater|verisign|ventures|vegas|vanguard|vana|vacations|ups|uol|uno|university|unicom|uconnect|ubs|ubank|tvs|tushu|tunes|tui|tube|trv|trust|travelersinsurance|travelers|travelchannel|travel|training|trading|trade|toys|toyota|town|tours|total|toshiba|toray|top|tools|tokyo|today|tmall|tkmaxx|tjx|tjmaxx|tirol|tires|tips|tiffany|tienda|tickets|tiaa|theatre|theater|thd|teva|tennis|temasek|telefonica|telecity|tel|technology|tech|team|tdk|tci|taxi|tax|tattoo|tatar|tatamotors|target|taobao|talk|taipei|tab|systems|symantec|sydney|swiss|swiftcover|swatch|suzuki|surgery|surf|support|supply|supplies|sucks|style|study|studio|stream|store|storage|stockholm|stcgroup|stc|statoil|statefarm|statebank|starhub|star|staples|stada|srt|srl|spreadbetting|spot|sport|spiegel|space|soy|sony|song|solutions|solar|sohu|software|softbank|social|soccer|sncf|smile|smart|sling|skype|sky|skin|ski|site|singles|sina|silk|shriram|showtime|show|shouji|shopping|shop|shoes|shiksha|shia|shell|shaw|sharp|shangrila|sfr|sexy|sex|sew|seven|ses|services|sener|select|seek|security|secure|seat|search|scot|scor|scjohnson|science|schwarz|schule|school|scholarships|schmidt|schaeffler|scb|sca|sbs|sbi|saxo|save|sas|sarl|sapo|sap|sanofi|sandvikcoromant|sandvik|samsung|samsclub|salon|sale|sakura|safety|safe|saarland|ryukyu|rwe|run|ruhr|rugby|rsvp|room|rogers|rodeo|rocks|rocher|rmit|rip|rio|ril|rightathome|ricoh|richardli|rich|rexroth|reviews|review|restaurant|rest|republican|report|repair|rentals|rent|ren|reliance|reit|reisen|reise|rehab|redumbrella|redstone|red|recipes|realty|realtor|realestate|read|raid|radio|racing|qvc|quest|quebec|qpon|pwc|pub|prudential|pru|protection|property|properties|promo|progressive|prof|productions|prod|pro|prime|press|praxi|pramerica|post|porn|politie|poker|pohl|pnc|plus|plumbing|playstation|play|place|pizza|pioneer|pink|ping|pin|pid|pictures|pictet|pics|piaget|physio|photos|photography|photo|phone|philips|phd|pharmacy|pfizer|pet|pccw|pay|passagens|party|parts|partners|pars|paris|panerai|panasonic|pamperedchef|page|ovh|ott|otsuka|osaka|origins|orientexpress|organic|org|orange|oracle|open|ooo|onyourside|online|onl|ong|one|omega|ollo|oldnavy|olayangroup|olayan|okinawa|office|off|observer|obi|nyc|ntt|nrw|nra|nowtv|nowruz|now|norton|northwesternmutual|nokia|nissay|nissan|ninja|nikon|nike|nico|nhk|ngo|nfl|nexus|nextdirect|next|news|newholland|new|neustar|network|netflix|netbank|net|nec|nba|navy|natura|nationwide|name|nagoya|nadex|nab|mutuelle|mutual|museum|mtr|mtpc|mtn|msd|movistar|movie|mov|motorcycles|moto|moscow|mortgage|mormon|mopar|montblanc|monster|money|monash|mom|moi|moe|moda|mobily|mobile|mobi|mma|mls|mlb|mitsubishi|mit|mint|mini|mil|microsoft|miami|metlife|merckmsd|meo|menu|men|memorial|meme|melbourne|meet|media|med|mckinsey|mcdonalds|mcd|mba|mattel|maserati|marshalls|marriott|markets|marketing|market|map|mango|management|man|makeup|maison|maif|madrid|macys|luxury|luxe|lupin|lundbeck|ltda|ltd|lplfinancial|lpl|love|lotto|lotte|london|lol|loft|locus|locker|loans|loan|llp|llc|lixil|living|live|lipsy|link|linde|lincoln|limo|limited|lilly|like|lighting|lifestyle|lifeinsurance|life|lidl|liaison|lgbt|lexus|lego|legal|lefrak|leclerc|lease|lds|lawyer|law|latrobe|latino|lat|lasalle|lanxess|landrover|land|lancome|lancia|lancaster|lamer|lamborghini|ladbrokes|lacaixa|kyoto|kuokgroup|kred|krd|kpn|kpmg|kosher|komatsu|koeln|kiwi|kitchen|kindle|kinder|kim|kia|kfh|kerryproperties|kerrylogistics|kerryhotels|kddi|kaufen|juniper|juegos|jprs|jpmorgan|joy|jot|joburg|jobs|jnj|jmp|jll|jlc|jio|jewelry|jetzt|jeep|jcp|jcb|java|jaguar|iwc|iveco|itv|itau|istanbul|ist|ismaili|iselect|irish|ipiranga|investments|intuit|international|intel|int|insure|insurance|institute|ink|ing|info|infiniti|industries|inc|immobilien|immo|imdb|imamat|ikano|iinet|ifm|ieee|icu|ice|icbc|ibm|hyundai|hyatt|hughes|htc|hsbc|how|house|hotmail|hotels|hoteles|hot|hosting|host|hospital|horse|honeywell|honda|homesense|homes|homegoods|homedepot|holiday|holdings|hockey|hkt|hiv|hitachi|hisamitsu|hiphop|hgtv|hermes|here|helsinki|help|healthcare|health|hdfcbank|hdfc|hbo|haus|hangout|hamburg|hair|guru|guitars|guide|guge|gucci|guardian|group|grocery|gripe|green|gratis|graphics|grainger|gov|got|gop|google|goog|goodyear|goodhands|goo|golf|goldpoint|gold|godaddy|gmx|gmo|gmbh|gmail|globo|global|gle|glass|glade|giving|gives|gifts|gift|ggee|george|genting|gent|gea|gdn|gbiz|gay|garden|gap|games|game|gallup|gallo|gallery|gal|fyi|futbol|furniture|fund|fun|fujixerox|fujitsu|ftr|frontier|frontdoor|frogans|frl|fresenius|free|fox|foundation|forum|forsale|forex|ford|football|foodnetwork|food|foo|fly|flsmidth|flowers|florist|flir|flights|flickr|fitness|fit|fishing|fish|firmdale|firestone|fire|financial|finance|final|film|fido|fidelity|fiat|ferrero|ferrari|feedback|fedex|fast|fashion|farmers|farm|fans|fan|family|faith|fairwinds|fail|fage|extraspace|express|exposed|expert|exchange|everbank|events|eus|eurovision|etisalat|esurance|estate|esq|erni|ericsson|equipment|epson|epost|enterprises|engineering|engineer|energy|emerck|email|education|edu|edeka|eco|eat|earth|dvr|dvag|durban|dupont|duns|dunlop|duck|dubai|dtv|drive|download|dot|doosan|domains|doha|dog|dodge|doctor|docs|dnp|diy|dish|discover|discount|directory|direct|digital|diet|diamonds|dhl|dev|design|desi|dentist|dental|democrat|delta|deloitte|dell|delivery|degree|deals|dealer|deal|dds|dclk|day|datsun|dating|date|data|dance|dad|dabur|cyou|cymru|cuisinella|csc|cruises|cruise|crs|crown|cricket|creditunion|creditcard|credit|cpa|courses|coupons|coupon|country|corsica|coop|cool|cookingchannel|cooking|contractors|contact|consulting|construction|condos|comsec|computer|compare|company|community|commbank|comcast|com|cologne|college|coffee|codes|coach|clubmed|club|cloud|clothing|clinique|clinic|click|cleaning|claims|cityeats|city|citic|citi|citadel|cisco|circle|cipriani|church|chrysler|chrome|christmas|chloe|chintai|cheap|chat|chase|charity|channel|chanel|cfd|cfa|cern|ceo|center|ceb|cbs|cbre|cbn|cba|catholic|catering|cat|casino|cash|caseih|case|casa|cartier|cars|careers|career|care|cards|caravan|car|capitalone|capital|capetown|canon|cancerresearch|camp|camera|cam|calvinklein|call|cal|cafe|cab|bzh|buzz|buy|business|builders|build|bugatti|budapest|brussels|brother|broker|broadway|bridgestone|bradesco|box|boutique|bot|boston|bostik|bosch|boots|booking|book|boo|bond|bom|bofa|boehringer|boats|bnpparibas|bnl|bmw|bms|blue|bloomberg|blog|blockbuster|blanco|blackfriday|black|biz|bio|bingo|bing|bike|bid|bible|bharti|bet|bestbuy|best|berlin|bentley|beer|beauty|beats|bcn|bcg|bbva|bbt|bbc|bayern|bauhaus|basketball|baseball|bargains|barefoot|barclays|barclaycard|barcelona|bar|bank|band|bananarepublic|banamex|baidu|baby|azure|axa|aws|avianca|autos|auto|author|auspost|audio|audible|audi|auction|attorney|athleta|associates|asia|asda|arte|art|arpa|army|archi|aramco|arab|aquarelle|apple|app|apartments|aol|anz|anquan|android|analytics|amsterdam|amica|amfam|amex|americanfamily|americanexpress|alstom|alsace|ally|allstate|allfinanz|alipay|alibaba|alfaromeo|akdn|airtel|airforce|airbus|aigo|aig|agency|agakhan|africa|afl|afamilycompany|aetna|aero|aeg|adult|ads|adac|actor|active|aco|accountants|accountant|accenture|academy|abudhabi|abogado|able|abc|abbvie|abbott|abb|abarth|aarp|aaa|onion)(?=[^0-9a-zA-Z@+-]|$))"));
    var _default = validGTLD;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validPunycode.js
var require_validPunycode = __commonJS({
  "node_modules/twitter-text/dist/regexp/validPunycode.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validPunycode = /(?:xn--[\-0-9a-z]+)/;
    var _default = validPunycode;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validSubdomain.js
var require_validSubdomain = __commonJS({
  "node_modules/twitter-text/dist/regexp/validSubdomain.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validDomainChars = _interopRequireDefault(require_validDomainChars());
    var validSubdomain = (0, _regexSupplant["default"])(/(?:(?:#{validDomainChars}(?:[_-]|#{validDomainChars})*)?#{validDomainChars}\.)/, {
      validDomainChars: _validDomainChars["default"]
    });
    var _default = validSubdomain;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validDomain.js
var require_validDomain = __commonJS({
  "node_modules/twitter-text/dist/regexp/validDomain.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validCCTLD = _interopRequireDefault(require_validCCTLD());
    var _validDomainName = _interopRequireDefault(require_validDomainName());
    var _validGTLD = _interopRequireDefault(require_validGTLD());
    var _validPunycode = _interopRequireDefault(require_validPunycode());
    var _validSubdomain = _interopRequireDefault(require_validSubdomain());
    var validDomain = (0, _regexSupplant["default"])(/(?:#{validSubdomain}*#{validDomainName}(?:#{validGTLD}|#{validCCTLD}|#{validPunycode}))/, {
      validDomainName: _validDomainName["default"],
      validSubdomain: _validSubdomain["default"],
      validGTLD: _validGTLD["default"],
      validCCTLD: _validCCTLD["default"],
      validPunycode: _validPunycode["default"]
    });
    var _default = validDomain;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validPortNumber.js
var require_validPortNumber = __commonJS({
  "node_modules/twitter-text/dist/regexp/validPortNumber.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validPortNumber = /[0-9]+/;
    var _default = validPortNumber;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/cyrillicLettersAndMarks.js
var require_cyrillicLettersAndMarks = __commonJS({
  "node_modules/twitter-text/dist/regexp/cyrillicLettersAndMarks.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var cyrillicLettersAndMarks = /\u0400-\u04FF/;
    var _default = cyrillicLettersAndMarks;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/latinAccentChars.js
var require_latinAccentChars = __commonJS({
  "node_modules/twitter-text/dist/regexp/latinAccentChars.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var latinAccentChars = /\xC0-\xD6\xD8-\xF6\xF8-\xFF\u0100-\u024F\u0253\u0254\u0256\u0257\u0259\u025B\u0263\u0268\u026F\u0272\u0289\u028B\u02BB\u0300-\u036F\u1E00-\u1EFF/;
    var _default = latinAccentChars;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validGeneralUrlPathChars.js
var require_validGeneralUrlPathChars = __commonJS({
  "node_modules/twitter-text/dist/regexp/validGeneralUrlPathChars.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _cyrillicLettersAndMarks = _interopRequireDefault(require_cyrillicLettersAndMarks());
    var _latinAccentChars = _interopRequireDefault(require_latinAccentChars());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var validGeneralUrlPathChars = (0, _regexSupplant["default"])(/[a-z#{cyrillicLettersAndMarks}0-9!\*';:=\+,\.\$\/%#\[\]\-\u2013_~@\|&#{latinAccentChars}]/i, {
      cyrillicLettersAndMarks: _cyrillicLettersAndMarks["default"],
      latinAccentChars: _latinAccentChars["default"]
    });
    var _default = validGeneralUrlPathChars;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validUrlBalancedParens.js
var require_validUrlBalancedParens = __commonJS({
  "node_modules/twitter-text/dist/regexp/validUrlBalancedParens.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validGeneralUrlPathChars = _interopRequireDefault(require_validGeneralUrlPathChars());
    var validUrlBalancedParens = (0, _regexSupplant["default"])("\\((?:#{validGeneralUrlPathChars}+|(?:#{validGeneralUrlPathChars}*\\(#{validGeneralUrlPathChars}+\\)#{validGeneralUrlPathChars}*))\\)", {
      validGeneralUrlPathChars: _validGeneralUrlPathChars["default"]
    }, "i");
    var _default = validUrlBalancedParens;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validUrlPathEndingChars.js
var require_validUrlPathEndingChars = __commonJS({
  "node_modules/twitter-text/dist/regexp/validUrlPathEndingChars.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _cyrillicLettersAndMarks = _interopRequireDefault(require_cyrillicLettersAndMarks());
    var _latinAccentChars = _interopRequireDefault(require_latinAccentChars());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validUrlBalancedParens = _interopRequireDefault(require_validUrlBalancedParens());
    var validUrlPathEndingChars = (0, _regexSupplant["default"])(/[\+\-a-z#{cyrillicLettersAndMarks}0-9=_#\/#{latinAccentChars}]|(?:#{validUrlBalancedParens})/i, {
      cyrillicLettersAndMarks: _cyrillicLettersAndMarks["default"],
      latinAccentChars: _latinAccentChars["default"],
      validUrlBalancedParens: _validUrlBalancedParens["default"]
    });
    var _default = validUrlPathEndingChars;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validUrlPath.js
var require_validUrlPath = __commonJS({
  "node_modules/twitter-text/dist/regexp/validUrlPath.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validGeneralUrlPathChars = _interopRequireDefault(require_validGeneralUrlPathChars());
    var _validUrlBalancedParens = _interopRequireDefault(require_validUrlBalancedParens());
    var _validUrlPathEndingChars = _interopRequireDefault(require_validUrlPathEndingChars());
    var validUrlPath = (0, _regexSupplant["default"])("(?:(?:#{validGeneralUrlPathChars}*(?:#{validUrlBalancedParens}#{validGeneralUrlPathChars}*)*#{validUrlPathEndingChars})|(?:@#{validGeneralUrlPathChars}+/))", {
      validGeneralUrlPathChars: _validGeneralUrlPathChars["default"],
      validUrlBalancedParens: _validUrlBalancedParens["default"],
      validUrlPathEndingChars: _validUrlPathEndingChars["default"]
    }, "i");
    var _default = validUrlPath;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validUrlPrecedingChars.js
var require_validUrlPrecedingChars = __commonJS({
  "node_modules/twitter-text/dist/regexp/validUrlPrecedingChars.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _directionalMarkersGroup = _interopRequireDefault(require_directionalMarkersGroup());
    var _invalidCharsGroup = _interopRequireDefault(require_invalidCharsGroup());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var validUrlPrecedingChars = (0, _regexSupplant["default"])(/(?:[^A-Za-z0-9@＠$#＃#{invalidCharsGroup}]|[#{directionalMarkersGroup}]|^)/, {
      invalidCharsGroup: _invalidCharsGroup["default"],
      directionalMarkersGroup: _directionalMarkersGroup["default"]
    });
    var _default = validUrlPrecedingChars;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validUrlQueryChars.js
var require_validUrlQueryChars = __commonJS({
  "node_modules/twitter-text/dist/regexp/validUrlQueryChars.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validUrlQueryChars = /[a-z0-9!?\*'@\(\);:&=\+\$\/%#\[\]\-_\.,~|]/i;
    var _default = validUrlQueryChars;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validUrlQueryEndingChars.js
var require_validUrlQueryEndingChars = __commonJS({
  "node_modules/twitter-text/dist/regexp/validUrlQueryEndingChars.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validUrlQueryEndingChars = /[a-z0-9\-_&=#\/]/i;
    var _default = validUrlQueryEndingChars;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/extractUrl.js
var require_extractUrl = __commonJS({
  "node_modules/twitter-text/dist/regexp/extractUrl.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validDomain = _interopRequireDefault(require_validDomain());
    var _validPortNumber = _interopRequireDefault(require_validPortNumber());
    var _validUrlPath = _interopRequireDefault(require_validUrlPath());
    var _validUrlPrecedingChars = _interopRequireDefault(require_validUrlPrecedingChars());
    var _validUrlQueryChars = _interopRequireDefault(require_validUrlQueryChars());
    var _validUrlQueryEndingChars = _interopRequireDefault(require_validUrlQueryEndingChars());
    var extractUrl = (0, _regexSupplant["default"])("((#{validUrlPrecedingChars})((https?:\\/\\/)?(#{validDomain})(?::(#{validPortNumber}))?(\\/#{validUrlPath}*)?(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?))", {
      validUrlPrecedingChars: _validUrlPrecedingChars["default"],
      validDomain: _validDomain["default"],
      validPortNumber: _validPortNumber["default"],
      validUrlPath: _validUrlPath["default"],
      validUrlQueryChars: _validUrlQueryChars["default"],
      validUrlQueryEndingChars: _validUrlQueryEndingChars["default"]
    }, "gi");
    var _default = extractUrl;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/invalidUrlWithoutProtocolPrecedingChars.js
var require_invalidUrlWithoutProtocolPrecedingChars = __commonJS({
  "node_modules/twitter-text/dist/regexp/invalidUrlWithoutProtocolPrecedingChars.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var invalidUrlWithoutProtocolPrecedingChars = /[-_.\/]$/;
    var _default = invalidUrlWithoutProtocolPrecedingChars;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/core-js/modules/_species-constructor.js
var require_species_constructor = __commonJS({
  "node_modules/core-js/modules/_species-constructor.js"(exports2, module2) {
    var anObject = require_an_object();
    var aFunction = require_a_function();
    var SPECIES = require_wks()("species");
    module2.exports = function(O, D) {
      var C = anObject(O).constructor;
      var S;
      return C === void 0 || (S = anObject(C)[SPECIES]) == void 0 ? D : aFunction(S);
    };
  }
});

// node_modules/core-js/modules/es6.regexp.split.js
var require_es6_regexp_split = __commonJS({
  "node_modules/core-js/modules/es6.regexp.split.js"() {
    "use strict";
    var isRegExp = require_is_regexp();
    var anObject = require_an_object();
    var speciesConstructor = require_species_constructor();
    var advanceStringIndex = require_advance_string_index();
    var toLength = require_to_length();
    var callRegExpExec = require_regexp_exec_abstract();
    var regexpExec = require_regexp_exec();
    var fails = require_fails();
    var $min = Math.min;
    var $push = [].push;
    var $SPLIT = "split";
    var LENGTH = "length";
    var LAST_INDEX = "lastIndex";
    var MAX_UINT32 = 4294967295;
    var SUPPORTS_Y = !fails(function() {
      RegExp(MAX_UINT32, "y");
    });
    require_fix_re_wks()("split", 2, function(defined, SPLIT, $split, maybeCallNative) {
      var internalSplit;
      if ("abbc"[$SPLIT](/(b)*/)[1] == "c" || "test"[$SPLIT](/(?:)/, -1)[LENGTH] != 4 || "ab"[$SPLIT](/(?:ab)*/)[LENGTH] != 2 || "."[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 || "."[$SPLIT](/()()/)[LENGTH] > 1 || ""[$SPLIT](/.?/)[LENGTH]) {
        internalSplit = function(separator, limit) {
          var string = String(this);
          if (separator === void 0 && limit === 0) return [];
          if (!isRegExp(separator)) return $split.call(string, separator, limit);
          var output = [];
          var flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.unicode ? "u" : "") + (separator.sticky ? "y" : "");
          var lastLastIndex = 0;
          var splitLimit = limit === void 0 ? MAX_UINT32 : limit >>> 0;
          var separatorCopy = new RegExp(separator.source, flags + "g");
          var match, lastIndex, lastLength;
          while (match = regexpExec.call(separatorCopy, string)) {
            lastIndex = separatorCopy[LAST_INDEX];
            if (lastIndex > lastLastIndex) {
              output.push(string.slice(lastLastIndex, match.index));
              if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
              lastLength = match[0][LENGTH];
              lastLastIndex = lastIndex;
              if (output[LENGTH] >= splitLimit) break;
            }
            if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++;
          }
          if (lastLastIndex === string[LENGTH]) {
            if (lastLength || !separatorCopy.test("")) output.push("");
          } else output.push(string.slice(lastLastIndex));
          return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
        };
      } else if ("0"[$SPLIT](void 0, 0)[LENGTH]) {
        internalSplit = function(separator, limit) {
          return separator === void 0 && limit === 0 ? [] : $split.call(this, separator, limit);
        };
      } else {
        internalSplit = $split;
      }
      return [
        // `String.prototype.split` method
        // https://tc39.github.io/ecma262/#sec-string.prototype.split
        function split(separator, limit) {
          var O = defined(this);
          var splitter = separator == void 0 ? void 0 : separator[SPLIT];
          return splitter !== void 0 ? splitter.call(separator, O, limit) : internalSplit.call(String(O), separator, limit);
        },
        // `RegExp.prototype[@@split]` method
        // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
        //
        // NOTE: This cannot be properly polyfilled in engines that don't support
        // the 'y' flag.
        function(regexp, limit) {
          var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
          if (res.done) return res.value;
          var rx = anObject(regexp);
          var S = String(this);
          var C = speciesConstructor(rx, RegExp);
          var unicodeMatching = rx.unicode;
          var flags = (rx.ignoreCase ? "i" : "") + (rx.multiline ? "m" : "") + (rx.unicode ? "u" : "") + (SUPPORTS_Y ? "y" : "g");
          var splitter = new C(SUPPORTS_Y ? rx : "^(?:" + rx.source + ")", flags);
          var lim = limit === void 0 ? MAX_UINT32 : limit >>> 0;
          if (lim === 0) return [];
          if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
          var p = 0;
          var q = 0;
          var A = [];
          while (q < S.length) {
            splitter.lastIndex = SUPPORTS_Y ? q : 0;
            var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
            var e;
            if (z === null || (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p) {
              q = advanceStringIndex(S, q, unicodeMatching);
            } else {
              A.push(S.slice(p, q));
              if (A.length === lim) return A;
              for (var i = 1; i <= z.length - 1; i++) {
                A.push(z[i]);
                if (A.length === lim) return A;
              }
              q = p = e;
            }
          }
          A.push(S.slice(p));
          return A;
        }
      ];
    });
  }
});

// node_modules/twitter-text/dist/regexp/validAsciiDomain.js
var require_validAsciiDomain = __commonJS({
  "node_modules/twitter-text/dist/regexp/validAsciiDomain.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _latinAccentChars = _interopRequireDefault(require_latinAccentChars());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validCCTLD = _interopRequireDefault(require_validCCTLD());
    var _validGTLD = _interopRequireDefault(require_validGTLD());
    var _validPunycode = _interopRequireDefault(require_validPunycode());
    var validAsciiDomain = (0, _regexSupplant["default"])(/(?:(?:[\-a-z0-9#{latinAccentChars}]+)\.)+(?:#{validGTLD}|#{validCCTLD}|#{validPunycode})/gi, {
      latinAccentChars: _latinAccentChars["default"],
      validGTLD: _validGTLD["default"],
      validCCTLD: _validCCTLD["default"],
      validPunycode: _validPunycode["default"]
    });
    var _default = validAsciiDomain;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/lib/idna.js
var require_idna = __commonJS({
  "node_modules/twitter-text/dist/lib/idna.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    require_es6_regexp_split();
    require_es6_regexp_match();
    var _punycode = _interopRequireDefault(require("punycode"));
    var _validAsciiDomain = _interopRequireDefault(require_validAsciiDomain());
    var MAX_DOMAIN_LABEL_LENGTH = 63;
    var PUNYCODE_ENCODED_DOMAIN_PREFIX = "xn--";
    var idna = {
      toAscii: function toAscii(domain) {
        if (domain.substring(0, 4) === PUNYCODE_ENCODED_DOMAIN_PREFIX && !domain.match(_validAsciiDomain["default"])) {
          return;
        }
        var labels = domain.split(".");
        for (var i = 0; i < labels.length; i++) {
          var label = labels[i];
          var punycodeEncodedLabel = _punycode["default"].toASCII(label);
          if (punycodeEncodedLabel.length < 1 || punycodeEncodedLabel.length > MAX_DOMAIN_LABEL_LENGTH) {
            return;
          }
        }
        return labels.join(".");
      }
    };
    var _default = idna;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validTcoUrl.js
var require_validTcoUrl = __commonJS({
  "node_modules/twitter-text/dist/regexp/validTcoUrl.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validUrlQueryChars = _interopRequireDefault(require_validUrlQueryChars());
    var _validUrlQueryEndingChars = _interopRequireDefault(require_validUrlQueryEndingChars());
    var validTcoUrl = (0, _regexSupplant["default"])(/^https?:\/\/t\.co\/([a-z0-9]+)(?:\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?/, {
      validUrlQueryChars: _validUrlQueryChars["default"],
      validUrlQueryEndingChars: _validUrlQueryEndingChars["default"]
    }, "i");
    var _default = validTcoUrl;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/extractUrlsWithIndices.js
var require_extractUrlsWithIndices = __commonJS({
  "node_modules/twitter-text/dist/extractUrlsWithIndices.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    require_es6_array_index_of();
    require_es6_regexp_replace();
    require_es6_regexp_constructor();
    require_es6_regexp_match();
    var _extractUrl = _interopRequireDefault(require_extractUrl());
    var _invalidUrlWithoutProtocolPrecedingChars = _interopRequireDefault(require_invalidUrlWithoutProtocolPrecedingChars());
    var _idna = _interopRequireDefault(require_idna());
    var _validAsciiDomain = _interopRequireDefault(require_validAsciiDomain());
    var _validTcoUrl = _interopRequireDefault(require_validTcoUrl());
    var DEFAULT_PROTOCOL = "https://";
    var DEFAULT_PROTOCOL_OPTIONS = {
      extractUrlsWithoutProtocol: true
    };
    var MAX_URL_LENGTH = 4096;
    var MAX_TCO_SLUG_LENGTH = 40;
    var extractUrlsWithIndices = function extractUrlsWithIndices2(text) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : DEFAULT_PROTOCOL_OPTIONS;
      if (!text || (options.extractUrlsWithoutProtocol ? !text.match(/\./) : !text.match(/:/))) {
        return [];
      }
      var urls = [];
      var _loop = function _loop2() {
        var before = RegExp.$2;
        var url = RegExp.$3;
        var protocol = RegExp.$4;
        var domain = RegExp.$5;
        var path = RegExp.$7;
        var endPosition = _extractUrl["default"].lastIndex;
        var startPosition = endPosition - url.length;
        if (!isValidUrl(url, protocol || DEFAULT_PROTOCOL, domain)) {
          return "continue";
        }
        if (!protocol) {
          if (!options.extractUrlsWithoutProtocol || before.match(_invalidUrlWithoutProtocolPrecedingChars["default"])) {
            return "continue";
          }
          var lastUrl = null;
          var asciiEndPosition = 0;
          domain.replace(_validAsciiDomain["default"], function(asciiDomain) {
            var asciiStartPosition = domain.indexOf(asciiDomain, asciiEndPosition);
            asciiEndPosition = asciiStartPosition + asciiDomain.length;
            lastUrl = {
              url: asciiDomain,
              indices: [startPosition + asciiStartPosition, startPosition + asciiEndPosition]
            };
            urls.push(lastUrl);
          });
          if (lastUrl == null) {
            return "continue";
          }
          if (path) {
            lastUrl.url = url.replace(domain, lastUrl.url);
            lastUrl.indices[1] = endPosition;
          }
        } else {
          if (url.match(_validTcoUrl["default"])) {
            var tcoUrlSlug = RegExp.$1;
            if (tcoUrlSlug && tcoUrlSlug.length > MAX_TCO_SLUG_LENGTH) {
              return "continue";
            } else {
              url = RegExp.lastMatch;
              endPosition = startPosition + url.length;
            }
          }
          urls.push({
            url,
            indices: [startPosition, endPosition]
          });
        }
      };
      while (_extractUrl["default"].exec(text)) {
        var _ret = _loop();
        if (_ret === "continue") continue;
      }
      return urls;
    };
    var isValidUrl = function isValidUrl2(url, protocol, domain) {
      var urlLength = url.length;
      var punycodeEncodedDomain = _idna["default"].toAscii(domain);
      if (!punycodeEncodedDomain || !punycodeEncodedDomain.length) {
        return false;
      }
      urlLength = urlLength + punycodeEncodedDomain.length - domain.length;
      return protocol.length + urlLength <= MAX_URL_LENGTH;
    };
    var _default = extractUrlsWithIndices;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/core-js/modules/es6.array.sort.js
var require_es6_array_sort = __commonJS({
  "node_modules/core-js/modules/es6.array.sort.js"() {
    "use strict";
    var $export = require_export();
    var aFunction = require_a_function();
    var toObject = require_to_object();
    var fails = require_fails();
    var $sort = [].sort;
    var test = [1, 2, 3];
    $export($export.P + $export.F * (fails(function() {
      test.sort(void 0);
    }) || !fails(function() {
      test.sort(null);
    }) || !require_strict_method()($sort)), "Array", {
      // 22.1.3.25 Array.prototype.sort(comparefn)
      sort: function sort(comparefn) {
        return comparefn === void 0 ? $sort.call(toObject(this)) : $sort.call(toObject(this), aFunction(comparefn));
      }
    });
  }
});

// node_modules/twitter-text/dist/removeOverlappingEntities.js
var require_removeOverlappingEntities = __commonJS({
  "node_modules/twitter-text/dist/removeOverlappingEntities.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_array_sort();
    function _default(entities) {
      entities.sort(function(a, b) {
        return a.indices[0] - b.indices[0];
      });
      var prev = entities[0];
      for (var i = 1; i < entities.length; i++) {
        if (prev.indices[1] > entities[i].indices[0]) {
          entities.splice(i, 1);
          i--;
        } else {
          prev = entities[i];
        }
      }
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/astralLetterAndMarks.js
var require_astralLetterAndMarks = __commonJS({
  "node_modules/twitter-text/dist/regexp/astralLetterAndMarks.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var astralLetterAndMarks = /\ud800[\udc00-\udc0b\udc0d-\udc26\udc28-\udc3a\udc3c\udc3d\udc3f-\udc4d\udc50-\udc5d\udc80-\udcfa\uddfd\ude80-\ude9c\udea0-\uded0\udee0\udf00-\udf1f\udf30-\udf40\udf42-\udf49\udf50-\udf7a\udf80-\udf9d\udfa0-\udfc3\udfc8-\udfcf]|\ud801[\udc00-\udc9d\udd00-\udd27\udd30-\udd63\ude00-\udf36\udf40-\udf55\udf60-\udf67]|\ud802[\udc00-\udc05\udc08\udc0a-\udc35\udc37\udc38\udc3c\udc3f-\udc55\udc60-\udc76\udc80-\udc9e\udd00-\udd15\udd20-\udd39\udd80-\uddb7\uddbe\uddbf\ude00-\ude03\ude05\ude06\ude0c-\ude13\ude15-\ude17\ude19-\ude33\ude38-\ude3a\ude3f\ude60-\ude7c\ude80-\ude9c\udec0-\udec7\udec9-\udee6\udf00-\udf35\udf40-\udf55\udf60-\udf72\udf80-\udf91]|\ud803[\udc00-\udc48]|\ud804[\udc00-\udc46\udc7f-\udcba\udcd0-\udce8\udd00-\udd34\udd50-\udd73\udd76\udd80-\uddc4\uddda\ude00-\ude11\ude13-\ude37\udeb0-\udeea\udf01-\udf03\udf05-\udf0c\udf0f\udf10\udf13-\udf28\udf2a-\udf30\udf32\udf33\udf35-\udf39\udf3c-\udf44\udf47\udf48\udf4b-\udf4d\udf57\udf5d-\udf63\udf66-\udf6c\udf70-\udf74]|\ud805[\udc80-\udcc5\udcc7\udd80-\uddb5\uddb8-\uddc0\ude00-\ude40\ude44\ude80-\udeb7]|\ud806[\udca0-\udcdf\udcff\udec0-\udef8]|\ud808[\udc00-\udf98]|\ud80c[\udc00-\udfff]|\ud80d[\udc00-\udc2e]|\ud81a[\udc00-\ude38\ude40-\ude5e\uded0-\udeed\udef0-\udef4\udf00-\udf36\udf40-\udf43\udf63-\udf77\udf7d-\udf8f]|\ud81b[\udf00-\udf44\udf50-\udf7e\udf8f-\udf9f]|\ud82c[\udc00\udc01]|\ud82f[\udc00-\udc6a\udc70-\udc7c\udc80-\udc88\udc90-\udc99\udc9d\udc9e]|\ud834[\udd65-\udd69\udd6d-\udd72\udd7b-\udd82\udd85-\udd8b\uddaa-\uddad\ude42-\ude44]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e\udc9f\udca2\udca5\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb]|\ud83a[\udc00-\udcc4\udcd0-\udcd6]|\ud83b[\ude00-\ude03\ude05-\ude1f\ude21\ude22\ude24\ude27\ude29-\ude32\ude34-\ude37\ude39\ude3b\ude42\ude47\ude49\ude4b\ude4d-\ude4f\ude51\ude52\ude54\ude57\ude59\ude5b\ude5d\ude5f\ude61\ude62\ude64\ude67-\ude6a\ude6c-\ude72\ude74-\ude77\ude79-\ude7c\ude7e\ude80-\ude89\ude8b-\ude9b\udea1-\udea3\udea5-\udea9\udeab-\udebb]|\ud840[\udc00-\udfff]|\ud841[\udc00-\udfff]|\ud842[\udc00-\udfff]|\ud843[\udc00-\udfff]|\ud844[\udc00-\udfff]|\ud845[\udc00-\udfff]|\ud846[\udc00-\udfff]|\ud847[\udc00-\udfff]|\ud848[\udc00-\udfff]|\ud849[\udc00-\udfff]|\ud84a[\udc00-\udfff]|\ud84b[\udc00-\udfff]|\ud84c[\udc00-\udfff]|\ud84d[\udc00-\udfff]|\ud84e[\udc00-\udfff]|\ud84f[\udc00-\udfff]|\ud850[\udc00-\udfff]|\ud851[\udc00-\udfff]|\ud852[\udc00-\udfff]|\ud853[\udc00-\udfff]|\ud854[\udc00-\udfff]|\ud855[\udc00-\udfff]|\ud856[\udc00-\udfff]|\ud857[\udc00-\udfff]|\ud858[\udc00-\udfff]|\ud859[\udc00-\udfff]|\ud85a[\udc00-\udfff]|\ud85b[\udc00-\udfff]|\ud85c[\udc00-\udfff]|\ud85d[\udc00-\udfff]|\ud85e[\udc00-\udfff]|\ud85f[\udc00-\udfff]|\ud860[\udc00-\udfff]|\ud861[\udc00-\udfff]|\ud862[\udc00-\udfff]|\ud863[\udc00-\udfff]|\ud864[\udc00-\udfff]|\ud865[\udc00-\udfff]|\ud866[\udc00-\udfff]|\ud867[\udc00-\udfff]|\ud868[\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|\ud86a[\udc00-\udfff]|\ud86b[\udc00-\udfff]|\ud86c[\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|\ud87e[\udc00-\ude1d]|\udb40[\udd00-\uddef]/;
    var _default = astralLetterAndMarks;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/bmpLetterAndMarks.js
var require_bmpLetterAndMarks = __commonJS({
  "node_modules/twitter-text/dist/regexp/bmpLetterAndMarks.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var bmpLetterAndMarks = /A-Za-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u052f\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u065f\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06ef\u06fa-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07ca-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0-\u08b2\u08e4-\u0963\u0971-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09f0\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a70-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0c00-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c81-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0cf1\u0cf2\u0d01-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0edc-\u0edf\u0f00\u0f18\u0f19\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u103f\u1050-\u108f\u109a-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16f1-\u16f8\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17d3\u17d7\u17dc\u17dd\u180b-\u180d\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191e\u1920-\u192b\u1930-\u193b\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f\u1aa7\u1ab0-\u1abe\u1b00-\u1b4b\u1b6b-\u1b73\u1b80-\u1baf\u1bba-\u1bf3\u1c00-\u1c37\u1c4d-\u1c4f\u1c5a-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1cf8\u1cf9\u1d00-\u1df5\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u20d0-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2183\u2184\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005\u3006\u302a-\u302f\u3031-\u3035\u303b\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua672\ua674-\ua67d\ua67f-\ua69d\ua69f-\ua6e5\ua6f0\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua7ad\ua7b0\ua7b1\ua7f7-\ua827\ua840-\ua873\ua880-\ua8c4\ua8e0-\ua8f7\ua8fb\ua90a-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf\ua9e0-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa36\uaa40-\uaa4d\uaa60-\uaa76\uaa7a-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab5f\uab64\uab65\uabc0-\uabea\uabec\uabed\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf870-\uf87f\uf882\uf884-\uf89f\uf8b8\uf8c1-\uf8d6\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe2d\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc/;
    var _default = bmpLetterAndMarks;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/nonBmpCodePairs.js
var require_nonBmpCodePairs = __commonJS({
  "node_modules/twitter-text/dist/regexp/nonBmpCodePairs.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var nonBmpCodePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/gm;
    var _default = nonBmpCodePairs;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/hashtagAlpha.js
var require_hashtagAlpha = __commonJS({
  "node_modules/twitter-text/dist/regexp/hashtagAlpha.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _astralLetterAndMarks = _interopRequireDefault(require_astralLetterAndMarks());
    var _bmpLetterAndMarks = _interopRequireDefault(require_bmpLetterAndMarks());
    var _nonBmpCodePairs = _interopRequireDefault(require_nonBmpCodePairs());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var hashtagAlpha = (0, _regexSupplant["default"])(/(?:[#{bmpLetterAndMarks}]|(?=#{nonBmpCodePairs})(?:#{astralLetterAndMarks}))/, {
      bmpLetterAndMarks: _bmpLetterAndMarks["default"],
      nonBmpCodePairs: _nonBmpCodePairs["default"],
      astralLetterAndMarks: _astralLetterAndMarks["default"]
    });
    var _default = hashtagAlpha;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/astralNumerals.js
var require_astralNumerals = __commonJS({
  "node_modules/twitter-text/dist/regexp/astralNumerals.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var astralNumerals = /\ud801[\udca0-\udca9]|\ud804[\udc66-\udc6f\udcf0-\udcf9\udd36-\udd3f\uddd0-\uddd9\udef0-\udef9]|\ud805[\udcd0-\udcd9\ude50-\ude59\udec0-\udec9]|\ud806[\udce0-\udce9]|\ud81a[\ude60-\ude69\udf50-\udf59]|\ud835[\udfce-\udfff]/;
    var _default = astralNumerals;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/bmpNumerals.js
var require_bmpNumerals = __commonJS({
  "node_modules/twitter-text/dist/regexp/bmpNumerals.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var bmpNumerals = /0-9\u0660-\u0669\u06f0-\u06f9\u07c0-\u07c9\u0966-\u096f\u09e6-\u09ef\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0be6-\u0bef\u0c66-\u0c6f\u0ce6-\u0cef\u0d66-\u0d6f\u0de6-\u0def\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f29\u1040-\u1049\u1090-\u1099\u17e0-\u17e9\u1810-\u1819\u1946-\u194f\u19d0-\u19d9\u1a80-\u1a89\u1a90-\u1a99\u1b50-\u1b59\u1bb0-\u1bb9\u1c40-\u1c49\u1c50-\u1c59\ua620-\ua629\ua8d0-\ua8d9\ua900-\ua909\ua9d0-\ua9d9\ua9f0-\ua9f9\uaa50-\uaa59\uabf0-\uabf9\uff10-\uff19/;
    var _default = bmpNumerals;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/hashtagSpecialChars.js
var require_hashtagSpecialChars = __commonJS({
  "node_modules/twitter-text/dist/regexp/hashtagSpecialChars.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var hashtagSpecialChars = /_\u200c\u200d\ua67e\u05be\u05f3\u05f4\uff5e\u301c\u309b\u309c\u30a0\u30fb\u3003\u0f0b\u0f0c\xb7/;
    var _default = hashtagSpecialChars;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/hashtagAlphaNumeric.js
var require_hashtagAlphaNumeric = __commonJS({
  "node_modules/twitter-text/dist/regexp/hashtagAlphaNumeric.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _astralLetterAndMarks = _interopRequireDefault(require_astralLetterAndMarks());
    var _astralNumerals = _interopRequireDefault(require_astralNumerals());
    var _bmpLetterAndMarks = _interopRequireDefault(require_bmpLetterAndMarks());
    var _bmpNumerals = _interopRequireDefault(require_bmpNumerals());
    var _hashtagSpecialChars = _interopRequireDefault(require_hashtagSpecialChars());
    var _nonBmpCodePairs = _interopRequireDefault(require_nonBmpCodePairs());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var hashtagAlphaNumeric = (0, _regexSupplant["default"])(/(?:[#{bmpLetterAndMarks}#{bmpNumerals}#{hashtagSpecialChars}]|(?=#{nonBmpCodePairs})(?:#{astralLetterAndMarks}|#{astralNumerals}))/, {
      bmpLetterAndMarks: _bmpLetterAndMarks["default"],
      bmpNumerals: _bmpNumerals["default"],
      hashtagSpecialChars: _hashtagSpecialChars["default"],
      nonBmpCodePairs: _nonBmpCodePairs["default"],
      astralLetterAndMarks: _astralLetterAndMarks["default"],
      astralNumerals: _astralNumerals["default"]
    });
    var _default = hashtagAlphaNumeric;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/codePoint.js
var require_codePoint = __commonJS({
  "node_modules/twitter-text/dist/regexp/codePoint.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var codePoint = /(?:[^\uD800-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])/;
    var _default = codePoint;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/hashtagBoundary.js
var require_hashtagBoundary = __commonJS({
  "node_modules/twitter-text/dist/regexp/hashtagBoundary.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _codePoint = _interopRequireDefault(require_codePoint());
    var _hashtagAlphaNumeric = _interopRequireDefault(require_hashtagAlphaNumeric());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var hashtagBoundary = (0, _regexSupplant["default"])(/(?:^|\uFE0E|\uFE0F|$|(?!#{hashtagAlphaNumeric}|&)#{codePoint})/, {
      codePoint: _codePoint["default"],
      hashtagAlphaNumeric: _hashtagAlphaNumeric["default"]
    });
    var _default = hashtagBoundary;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validHashtag.js
var require_validHashtag = __commonJS({
  "node_modules/twitter-text/dist/regexp/validHashtag.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _hashSigns = _interopRequireDefault(require_hashSigns());
    var _hashtagAlpha = _interopRequireDefault(require_hashtagAlpha());
    var _hashtagAlphaNumeric = _interopRequireDefault(require_hashtagAlphaNumeric());
    var _hashtagBoundary = _interopRequireDefault(require_hashtagBoundary());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var validHashtag = (0, _regexSupplant["default"])(/(#{hashtagBoundary})(#{hashSigns})(?!\uFE0F|\u20E3)(#{hashtagAlphaNumeric}*#{hashtagAlpha}#{hashtagAlphaNumeric}*)/gi, {
      hashtagBoundary: _hashtagBoundary["default"],
      hashSigns: _hashSigns["default"],
      hashtagAlphaNumeric: _hashtagAlphaNumeric["default"],
      hashtagAlpha: _hashtagAlpha["default"]
    });
    var _default = validHashtag;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/extractHashtagsWithIndices.js
var require_extractHashtagsWithIndices = __commonJS({
  "node_modules/twitter-text/dist/extractHashtagsWithIndices.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    require_es6_regexp_replace();
    require_es6_regexp_match();
    var _endHashtagMatch = _interopRequireDefault(require_endHashtagMatch());
    var _extractUrlsWithIndices = _interopRequireDefault(require_extractUrlsWithIndices());
    var _hashSigns = _interopRequireDefault(require_hashSigns());
    var _removeOverlappingEntities = _interopRequireDefault(require_removeOverlappingEntities());
    var _validHashtag = _interopRequireDefault(require_validHashtag());
    var extractHashtagsWithIndices = function extractHashtagsWithIndices2(text, options) {
      if (!options) {
        options = {
          checkUrlOverlap: true
        };
      }
      if (!text || !text.match(_hashSigns["default"])) {
        return [];
      }
      var tags = [];
      text.replace(_validHashtag["default"], function(match, before, hash, hashText, offset, chunk) {
        var after = chunk.slice(offset + match.length);
        if (after.match(_endHashtagMatch["default"])) {
          return;
        }
        var startPosition = offset + before.length;
        var endPosition = startPosition + hashText.length + 1;
        tags.push({
          hashtag: hashText,
          indices: [startPosition, endPosition]
        });
      });
      if (options.checkUrlOverlap) {
        var urls = (0, _extractUrlsWithIndices["default"])(text);
        if (urls.length > 0) {
          var entities = tags.concat(urls);
          (0, _removeOverlappingEntities["default"])(entities);
          tags = [];
          for (var i = 0; i < entities.length; i++) {
            if (entities[i].hashtag) {
              tags.push(entities[i]);
            }
          }
        }
      }
      return tags;
    };
    var _default = extractHashtagsWithIndices;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/atSigns.js
var require_atSigns = __commonJS({
  "node_modules/twitter-text/dist/regexp/atSigns.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var atSigns = /[@＠]/;
    var _default = atSigns;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/endMentionMatch.js
var require_endMentionMatch = __commonJS({
  "node_modules/twitter-text/dist/regexp/endMentionMatch.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _atSigns = _interopRequireDefault(require_atSigns());
    var _latinAccentChars = _interopRequireDefault(require_latinAccentChars());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var endMentionMatch = (0, _regexSupplant["default"])(/^(?:#{atSigns}|[#{latinAccentChars}]|:\/\/)/, {
      atSigns: _atSigns["default"],
      latinAccentChars: _latinAccentChars["default"]
    });
    var _default = endMentionMatch;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validMentionPrecedingChars.js
var require_validMentionPrecedingChars = __commonJS({
  "node_modules/twitter-text/dist/regexp/validMentionPrecedingChars.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validMentionPrecedingChars = /(?:^|[^a-zA-Z0-9_!#$%&*@＠]|(?:^|[^a-zA-Z0-9_+~.-])(?:rt|RT|rT|Rt):?)/;
    var _default = validMentionPrecedingChars;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validMentionOrList.js
var require_validMentionOrList = __commonJS({
  "node_modules/twitter-text/dist/regexp/validMentionOrList.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _atSigns = _interopRequireDefault(require_atSigns());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validMentionPrecedingChars = _interopRequireDefault(require_validMentionPrecedingChars());
    var validMentionOrList = (0, _regexSupplant["default"])(
      "(#{validMentionPrecedingChars})(#{atSigns})([a-zA-Z0-9_]{1,20})(/[a-zA-Z][a-zA-Z0-9_-]{0,24})?",
      // $4: List (optional)
      {
        validMentionPrecedingChars: _validMentionPrecedingChars["default"],
        atSigns: _atSigns["default"]
      },
      "g"
    );
    var _default = validMentionOrList;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/extractMentionsOrListsWithIndices.js
var require_extractMentionsOrListsWithIndices = __commonJS({
  "node_modules/twitter-text/dist/extractMentionsOrListsWithIndices.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_replace();
    require_es6_regexp_match();
    var _atSigns = _interopRequireDefault(require_atSigns());
    var _endMentionMatch = _interopRequireDefault(require_endMentionMatch());
    var _validMentionOrList = _interopRequireDefault(require_validMentionOrList());
    function _default(text) {
      if (!text || !text.match(_atSigns["default"])) {
        return [];
      }
      var possibleNames = [];
      text.replace(_validMentionOrList["default"], function(match, before, atSign, screenName, slashListname, offset, chunk) {
        var after = chunk.slice(offset + match.length);
        if (!after.match(_endMentionMatch["default"])) {
          slashListname = slashListname || "";
          var startPosition = offset + before.length;
          var endPosition = startPosition + screenName.length + slashListname.length + 1;
          possibleNames.push({
            screenName,
            listSlug: slashListname,
            indices: [startPosition, endPosition]
          });
        }
      });
      return possibleNames;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/extractEntitiesWithIndices.js
var require_extractEntitiesWithIndices = __commonJS({
  "node_modules/twitter-text/dist/extractEntitiesWithIndices.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _extractCashtagsWithIndices = _interopRequireDefault(require_extractCashtagsWithIndices());
    var _extractHashtagsWithIndices = _interopRequireDefault(require_extractHashtagsWithIndices());
    var _extractMentionsOrListsWithIndices = _interopRequireDefault(require_extractMentionsOrListsWithIndices());
    var _extractUrlsWithIndices = _interopRequireDefault(require_extractUrlsWithIndices());
    var _removeOverlappingEntities = _interopRequireDefault(require_removeOverlappingEntities());
    function _default(text, options) {
      var entities = (0, _extractUrlsWithIndices["default"])(text, options).concat((0, _extractMentionsOrListsWithIndices["default"])(text)).concat((0, _extractHashtagsWithIndices["default"])(text, {
        checkUrlOverlap: false
      })).concat((0, _extractCashtagsWithIndices["default"])(text));
      if (entities.length == 0) {
        return [];
      }
      (0, _removeOverlappingEntities["default"])(entities);
      return entities;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/lib/clone.js
var require_clone = __commonJS({
  "node_modules/twitter-text/dist/lib/clone.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    function _default(o) {
      var r = {};
      for (var k in o) {
        if (o.hasOwnProperty(k)) {
          r[k] = o[k];
        }
      }
      return r;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/extractHtmlAttrsFromOptions.js
var require_extractHtmlAttrsFromOptions = __commonJS({
  "node_modules/twitter-text/dist/extractHtmlAttrsFromOptions.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var BOOLEAN_ATTRIBUTES = {
      disabled: true,
      readonly: true,
      multiple: true,
      checked: true
    };
    var OPTIONS_NOT_ATTRIBUTES = {
      urlClass: true,
      listClass: true,
      usernameClass: true,
      hashtagClass: true,
      cashtagClass: true,
      usernameUrlBase: true,
      listUrlBase: true,
      hashtagUrlBase: true,
      cashtagUrlBase: true,
      usernameUrlBlock: true,
      listUrlBlock: true,
      hashtagUrlBlock: true,
      linkUrlBlock: true,
      usernameIncludeSymbol: true,
      suppressLists: true,
      suppressNoFollow: true,
      targetBlank: true,
      suppressDataScreenName: true,
      urlEntities: true,
      symbolTag: true,
      textWithSymbolTag: true,
      urlTarget: true,
      invisibleTagAttrs: true,
      linkAttributeBlock: true,
      linkTextBlock: true,
      htmlEscapeNonEntities: true
    };
    function _default(options) {
      var htmlAttrs = {};
      for (var k in options) {
        var v = options[k];
        if (OPTIONS_NOT_ATTRIBUTES[k]) {
          continue;
        }
        if (BOOLEAN_ATTRIBUTES[k]) {
          v = v ? k : null;
        }
        if (v == null) {
          continue;
        }
        htmlAttrs[k] = v;
      }
      return htmlAttrs;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/htmlEscape.js
var require_htmlEscape = __commonJS({
  "node_modules/twitter-text/dist/htmlEscape.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_replace();
    var HTML_ENTITIES = {
      "&": "&amp;",
      ">": "&gt;",
      "<": "&lt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    function _default(text) {
      return text && text.replace(/[&"'><]/g, function(character) {
        return HTML_ENTITIES[character];
      });
    }
    module2.exports = exports2.default;
  }
});

// node_modules/core-js/modules/es6.regexp.flags.js
var require_es6_regexp_flags = __commonJS({
  "node_modules/core-js/modules/es6.regexp.flags.js"() {
    if (require_descriptors() && /./g.flags != "g") require_object_dp().f(RegExp.prototype, "flags", {
      configurable: true,
      get: require_flags()
    });
  }
});

// node_modules/core-js/modules/es6.regexp.to-string.js
var require_es6_regexp_to_string = __commonJS({
  "node_modules/core-js/modules/es6.regexp.to-string.js"() {
    "use strict";
    require_es6_regexp_flags();
    var anObject = require_an_object();
    var $flags = require_flags();
    var DESCRIPTORS = require_descriptors();
    var TO_STRING = "toString";
    var $toString = /./[TO_STRING];
    var define = function(fn) {
      require_redefine()(RegExp.prototype, TO_STRING, fn, true);
    };
    if (require_fails()(function() {
      return $toString.call({ source: "a", flags: "b" }) != "/a/b";
    })) {
      define(function toString() {
        var R = anObject(this);
        return "/".concat(
          R.source,
          "/",
          "flags" in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : void 0
        );
      });
    } else if ($toString.name != TO_STRING) {
      define(function toString() {
        return $toString.call(this);
      });
    }
  }
});

// node_modules/core-js/modules/es6.date.to-string.js
var require_es6_date_to_string = __commonJS({
  "node_modules/core-js/modules/es6.date.to-string.js"() {
    var DateProto = Date.prototype;
    var INVALID_DATE = "Invalid Date";
    var TO_STRING = "toString";
    var $toString = DateProto[TO_STRING];
    var getTime = DateProto.getTime;
    if (/* @__PURE__ */ new Date(NaN) + "" != INVALID_DATE) {
      require_redefine()(DateProto, TO_STRING, function toString() {
        var value = getTime.call(this);
        return value === value ? $toString.call(this) : INVALID_DATE;
      });
    }
  }
});

// node_modules/core-js/modules/es6.object.to-string.js
var require_es6_object_to_string = __commonJS({
  "node_modules/core-js/modules/es6.object.to-string.js"() {
    "use strict";
    var classof = require_classof();
    var test = {};
    test[require_wks()("toStringTag")] = "z";
    if (test + "" != "[object z]") {
      require_redefine()(Object.prototype, "toString", function toString() {
        return "[object " + classof(this) + "]";
      }, true);
    }
  }
});

// node_modules/twitter-text/dist/tagAttrs.js
var require_tagAttrs = __commonJS({
  "node_modules/twitter-text/dist/tagAttrs.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_to_string();
    require_es6_date_to_string();
    require_es6_object_to_string();
    var _htmlEscape = _interopRequireDefault(require_htmlEscape());
    var BOOLEAN_ATTRIBUTES = {
      disabled: true,
      readonly: true,
      multiple: true,
      checked: true
    };
    function _default(attributes) {
      var htmlAttrs = "";
      for (var k in attributes) {
        var v = attributes[k];
        if (BOOLEAN_ATTRIBUTES[k]) {
          v = v ? k : null;
        }
        if (v == null) {
          continue;
        }
        htmlAttrs += " ".concat((0, _htmlEscape["default"])(k), '="').concat((0, _htmlEscape["default"])(v.toString()), '"');
      }
      return htmlAttrs;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/linkToText.js
var require_linkToText = __commonJS({
  "node_modules/twitter-text/dist/linkToText.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _stringSupplant = _interopRequireDefault(require_stringSupplant());
    var _tagAttrs = _interopRequireDefault(require_tagAttrs());
    function _default(entity, text, attributes, options) {
      if (!options.suppressNoFollow) {
        attributes.rel = "nofollow";
      }
      if (options.linkAttributeBlock) {
        options.linkAttributeBlock(entity, attributes);
      }
      if (options.linkTextBlock) {
        text = options.linkTextBlock(entity, text);
      }
      var d = {
        text,
        attr: (0, _tagAttrs["default"])(attributes)
      };
      return (0, _stringSupplant["default"])("<a#{attr}>#{text}</a>", d);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/linkToTextWithSymbol.js
var require_linkToTextWithSymbol = __commonJS({
  "node_modules/twitter-text/dist/linkToTextWithSymbol.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_match();
    var _atSigns = _interopRequireDefault(require_atSigns());
    var _htmlEscape = _interopRequireDefault(require_htmlEscape());
    var _linkToText = _interopRequireDefault(require_linkToText());
    function _default(entity, symbol, text, attributes, options) {
      var taggedSymbol = options.symbolTag ? "<".concat(options.symbolTag, ">").concat(symbol, "</").concat(options.symbolTag, ">") : symbol;
      text = (0, _htmlEscape["default"])(text);
      var taggedText = options.textWithSymbolTag ? "<".concat(options.textWithSymbolTag, ">").concat(text, "</").concat(options.textWithSymbolTag, ">") : text;
      if (options.usernameIncludeSymbol || !symbol.match(_atSigns["default"])) {
        return (0, _linkToText["default"])(entity, taggedSymbol + taggedText, attributes, options);
      } else {
        return taggedSymbol + (0, _linkToText["default"])(entity, taggedText, attributes, options);
      }
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/linkToCashtag.js
var require_linkToCashtag = __commonJS({
  "node_modules/twitter-text/dist/linkToCashtag.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _clone = _interopRequireDefault(require_clone());
    var _htmlEscape = _interopRequireDefault(require_htmlEscape());
    var _linkToTextWithSymbol = _interopRequireDefault(require_linkToTextWithSymbol());
    function _default(entity, text, options) {
      var cashtag = (0, _htmlEscape["default"])(entity.cashtag);
      var attrs = (0, _clone["default"])(options.htmlAttrs || {});
      attrs.href = options.cashtagUrlBase + cashtag;
      attrs.title = "$".concat(cashtag);
      attrs["class"] = options.cashtagClass;
      if (options.targetBlank) {
        attrs.target = "_blank";
      }
      return (0, _linkToTextWithSymbol["default"])(entity, "$", cashtag, attrs, options);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/rtlChars.js
var require_rtlChars = __commonJS({
  "node_modules/twitter-text/dist/regexp/rtlChars.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var rtlChars = /[\u0600-\u06FF]|[\u0750-\u077F]|[\u0590-\u05FF]|[\uFE70-\uFEFF]/gm;
    var _default = rtlChars;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/linkToHashtag.js
var require_linkToHashtag = __commonJS({
  "node_modules/twitter-text/dist/linkToHashtag.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_match();
    var _clone = _interopRequireDefault(require_clone());
    var _htmlEscape = _interopRequireDefault(require_htmlEscape());
    var _rtlChars = _interopRequireDefault(require_rtlChars());
    var _linkToTextWithSymbol = _interopRequireDefault(require_linkToTextWithSymbol());
    function _default(entity, text, options) {
      var hash = text.substring(entity.indices[0], entity.indices[0] + 1);
      var hashtag = (0, _htmlEscape["default"])(entity.hashtag);
      var attrs = (0, _clone["default"])(options.htmlAttrs || {});
      attrs.href = options.hashtagUrlBase + hashtag;
      attrs.title = "#".concat(hashtag);
      attrs["class"] = options.hashtagClass;
      if (hashtag.charAt(0).match(_rtlChars["default"])) {
        attrs["class"] += " rtl";
      }
      if (options.targetBlank) {
        attrs.target = "_blank";
      }
      return (0, _linkToTextWithSymbol["default"])(entity, hash, hashtag, attrs, options);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/linkTextWithEntity.js
var require_linkTextWithEntity = __commonJS({
  "node_modules/twitter-text/dist/linkTextWithEntity.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_match();
    require_es6_array_index_of();
    require_es6_regexp_replace();
    var _htmlEscape = _interopRequireDefault(require_htmlEscape());
    var _stringSupplant = _interopRequireDefault(require_stringSupplant());
    function _default(entity, options) {
      var displayUrl = entity.display_url;
      var expandedUrl = entity.expanded_url;
      var displayUrlSansEllipses = displayUrl.replace(/…/g, "");
      if (expandedUrl.indexOf(displayUrlSansEllipses) != -1) {
        var displayUrlIndex = expandedUrl.indexOf(displayUrlSansEllipses);
        var v = {
          displayUrlSansEllipses,
          // Portion of expandedUrl that precedes the displayUrl substring
          beforeDisplayUrl: expandedUrl.substr(0, displayUrlIndex),
          // Portion of expandedUrl that comes after displayUrl
          afterDisplayUrl: expandedUrl.substr(displayUrlIndex + displayUrlSansEllipses.length),
          precedingEllipsis: displayUrl.match(/^…/) ? "\u2026" : "",
          followingEllipsis: displayUrl.match(/…$/) ? "\u2026" : ""
        };
        for (var k in v) {
          if (v.hasOwnProperty(k)) {
            v[k] = (0, _htmlEscape["default"])(v[k]);
          }
        }
        v["invisible"] = options.invisibleTagAttrs;
        return (0, _stringSupplant["default"])("<span class='tco-ellipsis'>#{precedingEllipsis}<span #{invisible}>&nbsp;</span></span><span #{invisible}>#{beforeDisplayUrl}</span><span class='js-display-url'>#{displayUrlSansEllipses}</span><span #{invisible}>#{afterDisplayUrl}</span><span class='tco-ellipsis'><span #{invisible}>&nbsp;</span>#{followingEllipsis}</span>", v);
      }
      return displayUrl;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/urlHasProtocol.js
var require_urlHasProtocol = __commonJS({
  "node_modules/twitter-text/dist/regexp/urlHasProtocol.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var urlHasProtocol = /^https?:\/\//i;
    var _default = urlHasProtocol;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/linkToUrl.js
var require_linkToUrl = __commonJS({
  "node_modules/twitter-text/dist/linkToUrl.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_match();
    var _clone = _interopRequireDefault(require_clone());
    var _htmlEscape = _interopRequireDefault(require_htmlEscape());
    var _linkToText = _interopRequireDefault(require_linkToText());
    var _linkTextWithEntity = _interopRequireDefault(require_linkTextWithEntity());
    var _urlHasProtocol = _interopRequireDefault(require_urlHasProtocol());
    function _default(entity, text, options) {
      var url = entity.url;
      var displayUrl = url;
      var linkText = (0, _htmlEscape["default"])(displayUrl);
      var urlEntity = options.urlEntities && options.urlEntities[url] || entity;
      if (urlEntity.display_url) {
        linkText = (0, _linkTextWithEntity["default"])(urlEntity, options);
      }
      var attrs = (0, _clone["default"])(options.htmlAttrs || {});
      if (!url.match(_urlHasProtocol["default"])) {
        url = "http://".concat(url);
      }
      attrs.href = url;
      if (options.targetBlank) {
        attrs.target = "_blank";
      }
      if (options.urlClass) {
        attrs["class"] = options.urlClass;
      }
      if (options.urlTarget) {
        attrs.target = options.urlTarget;
      }
      if (!options.title && urlEntity.display_url) {
        attrs.title = urlEntity.expanded_url;
      }
      return (0, _linkToText["default"])(entity, linkText, attrs, options);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/linkToMentionAndList.js
var require_linkToMentionAndList = __commonJS({
  "node_modules/twitter-text/dist/linkToMentionAndList.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _clone = _interopRequireDefault(require_clone());
    var _htmlEscape = _interopRequireDefault(require_htmlEscape());
    var _linkToTextWithSymbol = _interopRequireDefault(require_linkToTextWithSymbol());
    function _default(entity, text, options) {
      var at = text.substring(entity.indices[0], entity.indices[0] + 1);
      var user = (0, _htmlEscape["default"])(entity.screenName);
      var slashListname = (0, _htmlEscape["default"])(entity.listSlug);
      var isList = entity.listSlug && !options.suppressLists;
      var attrs = (0, _clone["default"])(options.htmlAttrs || {});
      attrs["class"] = isList ? options.listClass : options.usernameClass;
      attrs.href = isList ? options.listUrlBase + user + slashListname : options.usernameUrlBase + user;
      if (!isList && !options.suppressDataScreenName) {
        attrs["data-screen-name"] = user;
      }
      if (options.targetBlank) {
        attrs.target = "_blank";
      }
      return (0, _linkToTextWithSymbol["default"])(entity, at, isList ? user + slashListname : user, attrs, options);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/autoLinkEntities.js
var require_autoLinkEntities = __commonJS({
  "node_modules/twitter-text/dist/autoLinkEntities.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_array_sort();
    var _clone = _interopRequireDefault(require_clone());
    var _extractHtmlAttrsFromOptions = _interopRequireDefault(require_extractHtmlAttrsFromOptions());
    var _htmlEscape = _interopRequireDefault(require_htmlEscape());
    var _linkToCashtag = _interopRequireDefault(require_linkToCashtag());
    var _linkToHashtag = _interopRequireDefault(require_linkToHashtag());
    var _linkToUrl = _interopRequireDefault(require_linkToUrl());
    var _linkToMentionAndList = _interopRequireDefault(require_linkToMentionAndList());
    var DEFAULT_LIST_CLASS = "tweet-url list-slug";
    var DEFAULT_USERNAME_CLASS = "tweet-url username";
    var DEFAULT_HASHTAG_CLASS = "tweet-url hashtag";
    var DEFAULT_CASHTAG_CLASS = "tweet-url cashtag";
    function _default(text, entities, options) {
      var options = (0, _clone["default"])(options || {});
      options.hashtagClass = options.hashtagClass || DEFAULT_HASHTAG_CLASS;
      options.hashtagUrlBase = options.hashtagUrlBase || "https://twitter.com/search?q=%23";
      options.cashtagClass = options.cashtagClass || DEFAULT_CASHTAG_CLASS;
      options.cashtagUrlBase = options.cashtagUrlBase || "https://twitter.com/search?q=%24";
      options.listClass = options.listClass || DEFAULT_LIST_CLASS;
      options.usernameClass = options.usernameClass || DEFAULT_USERNAME_CLASS;
      options.usernameUrlBase = options.usernameUrlBase || "https://twitter.com/";
      options.listUrlBase = options.listUrlBase || "https://twitter.com/";
      options.htmlAttrs = (0, _extractHtmlAttrsFromOptions["default"])(options);
      options.invisibleTagAttrs = options.invisibleTagAttrs || "style='position:absolute;left:-9999px;'";
      var urlEntities, i, len;
      if (options.urlEntities) {
        urlEntities = {};
        for (i = 0, len = options.urlEntities.length; i < len; i++) {
          urlEntities[options.urlEntities[i].url] = options.urlEntities[i];
        }
        options.urlEntities = urlEntities;
      }
      var result = "";
      var beginIndex = 0;
      entities.sort(function(a, b) {
        return a.indices[0] - b.indices[0];
      });
      var nonEntity = options.htmlEscapeNonEntities ? _htmlEscape["default"] : function(text2) {
        return text2;
      };
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        result += nonEntity(text.substring(beginIndex, entity.indices[0]));
        if (entity.url) {
          result += (0, _linkToUrl["default"])(entity, text, options);
        } else if (entity.hashtag) {
          result += (0, _linkToHashtag["default"])(entity, text, options);
        } else if (entity.screenName) {
          result += (0, _linkToMentionAndList["default"])(entity, text, options);
        } else if (entity.cashtag) {
          result += (0, _linkToCashtag["default"])(entity, text, options);
        }
        beginIndex = entity.indices[1];
      }
      result += nonEntity(text.substring(beginIndex, text.length));
      return result;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/autoLink.js
var require_autoLink = __commonJS({
  "node_modules/twitter-text/dist/autoLink.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _extractEntitiesWithIndices = _interopRequireDefault(require_extractEntitiesWithIndices());
    var _autoLinkEntities = _interopRequireDefault(require_autoLinkEntities());
    function _default(text, options) {
      var entities = (0, _extractEntitiesWithIndices["default"])(text, {
        extractUrlsWithoutProtocol: false
      });
      return (0, _autoLinkEntities["default"])(text, entities, options);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/autoLinkCashtags.js
var require_autoLinkCashtags = __commonJS({
  "node_modules/twitter-text/dist/autoLinkCashtags.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _autoLinkEntities = _interopRequireDefault(require_autoLinkEntities());
    var _extractCashtagsWithIndices = _interopRequireDefault(require_extractCashtagsWithIndices());
    function _default(text, options) {
      var entities = (0, _extractCashtagsWithIndices["default"])(text);
      return (0, _autoLinkEntities["default"])(text, entities, options);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/autoLinkHashtags.js
var require_autoLinkHashtags = __commonJS({
  "node_modules/twitter-text/dist/autoLinkHashtags.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _extractHashtagsWithIndices = _interopRequireDefault(require_extractHashtagsWithIndices());
    var _autoLinkEntities = _interopRequireDefault(require_autoLinkEntities());
    function _default(text, options) {
      var entities = (0, _extractHashtagsWithIndices["default"])(text);
      return (0, _autoLinkEntities["default"])(text, entities, options);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/autoLinkUrlsCustom.js
var require_autoLinkUrlsCustom = __commonJS({
  "node_modules/twitter-text/dist/autoLinkUrlsCustom.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _autoLinkEntities = _interopRequireDefault(require_autoLinkEntities());
    var _extractUrlsWithIndices = _interopRequireDefault(require_extractUrlsWithIndices());
    function _default(text, options) {
      var entities = (0, _extractUrlsWithIndices["default"])(text, {
        extractUrlsWithoutProtocol: false
      });
      return (0, _autoLinkEntities["default"])(text, entities, options);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/autoLinkUsernamesOrLists.js
var require_autoLinkUsernamesOrLists = __commonJS({
  "node_modules/twitter-text/dist/autoLinkUsernamesOrLists.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _extractMentionsOrListsWithIndices = _interopRequireDefault(require_extractMentionsOrListsWithIndices());
    var _autoLinkEntities = _interopRequireDefault(require_autoLinkEntities());
    function _default(text, options) {
      var entities = (0, _extractMentionsOrListsWithIndices["default"])(text);
      return (0, _autoLinkEntities["default"])(text, entities, options);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/lib/convertUnicodeIndices.js
var require_convertUnicodeIndices = __commonJS({
  "node_modules/twitter-text/dist/lib/convertUnicodeIndices.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    require_es6_array_sort();
    var convertUnicodeIndices = function convertUnicodeIndices2(text, entities, indicesInUTF16) {
      if (entities.length === 0) {
        return;
      }
      var charIndex = 0;
      var codePointIndex = 0;
      entities.sort(function(a, b) {
        return a.indices[0] - b.indices[0];
      });
      var entityIndex = 0;
      var entity = entities[0];
      while (charIndex < text.length) {
        if (entity.indices[0] === (indicesInUTF16 ? charIndex : codePointIndex)) {
          var len = entity.indices[1] - entity.indices[0];
          entity.indices[0] = indicesInUTF16 ? codePointIndex : charIndex;
          entity.indices[1] = entity.indices[0] + len;
          entityIndex++;
          if (entityIndex === entities.length) {
            break;
          }
          entity = entities[entityIndex];
        }
        var c = text.charCodeAt(charIndex);
        if (c >= 55296 && c <= 56319 && charIndex < text.length - 1) {
          c = text.charCodeAt(charIndex + 1);
          if (c >= 56320 && c <= 57343) {
            charIndex++;
          }
        }
        codePointIndex++;
        charIndex++;
      }
    };
    var _default = convertUnicodeIndices;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/modifyIndicesFromUnicodeToUTF16.js
var require_modifyIndicesFromUnicodeToUTF16 = __commonJS({
  "node_modules/twitter-text/dist/modifyIndicesFromUnicodeToUTF16.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _convertUnicodeIndices = _interopRequireDefault(require_convertUnicodeIndices());
    function _default(text, entities) {
      (0, _convertUnicodeIndices["default"])(text, entities, false);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/autoLinkWithJSON.js
var require_autoLinkWithJSON = __commonJS({
  "node_modules/twitter-text/dist/autoLinkWithJSON.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _autoLinkEntities = _interopRequireDefault(require_autoLinkEntities());
    var _modifyIndicesFromUnicodeToUTF = _interopRequireDefault(require_modifyIndicesFromUnicodeToUTF16());
    function _default(text, json, options) {
      if (json.user_mentions) {
        for (var i = 0; i < json.user_mentions.length; i++) {
          json.user_mentions[i].screenName = json.user_mentions[i].screen_name;
        }
      }
      if (json.hashtags) {
        for (var i = 0; i < json.hashtags.length; i++) {
          json.hashtags[i].hashtag = json.hashtags[i].text;
        }
      }
      if (json.symbols) {
        for (var i = 0; i < json.symbols.length; i++) {
          json.symbols[i].cashtag = json.symbols[i].text;
        }
      }
      var entities = [];
      for (var key in json) {
        entities = entities.concat(json[key]);
      }
      (0, _modifyIndicesFromUnicodeToUTF["default"])(text, entities);
      return (0, _autoLinkEntities["default"])(text, entities, options);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/configs.js
var require_configs = __commonJS({
  "node_modules/twitter-text/dist/configs.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _default = {
      version1: {
        version: 1,
        maxWeightedTweetLength: 140,
        scale: 1,
        defaultWeight: 1,
        transformedURLLength: 23,
        ranges: []
      },
      version2: {
        version: 2,
        maxWeightedTweetLength: 280,
        scale: 100,
        defaultWeight: 200,
        transformedURLLength: 23,
        ranges: [{
          start: 0,
          end: 4351,
          weight: 100
        }, {
          start: 8192,
          end: 8205,
          weight: 100
        }, {
          start: 8208,
          end: 8223,
          weight: 100
        }, {
          start: 8242,
          end: 8247,
          weight: 100
        }]
      },
      version3: {
        version: 3,
        maxWeightedTweetLength: 280,
        scale: 100,
        defaultWeight: 200,
        emojiParsingEnabled: true,
        transformedURLLength: 23,
        ranges: [{
          start: 0,
          end: 4351,
          weight: 100
        }, {
          start: 8192,
          end: 8205,
          weight: 100
        }, {
          start: 8208,
          end: 8223,
          weight: 100
        }, {
          start: 8242,
          end: 8247,
          weight: 100
        }]
      },
      defaults: {
        version: 3,
        maxWeightedTweetLength: 280,
        scale: 100,
        defaultWeight: 200,
        emojiParsingEnabled: true,
        transformedURLLength: 23,
        ranges: [{
          start: 0,
          end: 4351,
          weight: 100
        }, {
          start: 8192,
          end: 8205,
          weight: 100
        }, {
          start: 8208,
          end: 8223,
          weight: 100
        }, {
          start: 8242,
          end: 8247,
          weight: 100
        }]
      }
    };
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/convertUnicodeIndices.js
var require_convertUnicodeIndices2 = __commonJS({
  "node_modules/twitter-text/dist/convertUnicodeIndices.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_array_sort();
    function _default(text, entities, indicesInUTF16) {
      if (entities.length == 0) {
        return;
      }
      var charIndex = 0;
      var codePointIndex = 0;
      entities.sort(function(a, b) {
        return a.indices[0] - b.indices[0];
      });
      var entityIndex = 0;
      var entity = entities[0];
      while (charIndex < text.length) {
        if (entity.indices[0] == (indicesInUTF16 ? charIndex : codePointIndex)) {
          var len = entity.indices[1] - entity.indices[0];
          entity.indices[0] = indicesInUTF16 ? codePointIndex : charIndex;
          entity.indices[1] = entity.indices[0] + len;
          entityIndex++;
          if (entityIndex == entities.length) {
            break;
          }
          entity = entities[entityIndex];
        }
        var c = text.charCodeAt(charIndex);
        if (c >= 55296 && c <= 56319 && charIndex < text.length - 1) {
          c = text.charCodeAt(charIndex + 1);
          if (c >= 56320 && c <= 57343) {
            charIndex++;
          }
        }
        codePointIndex++;
        charIndex++;
      }
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/extractCashtags.js
var require_extractCashtags = __commonJS({
  "node_modules/twitter-text/dist/extractCashtags.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _extractCashtagsWithIndices = _interopRequireDefault(require_extractCashtagsWithIndices());
    function _default(text) {
      var cashtagsOnly = [], cashtagsWithIndices = (0, _extractCashtagsWithIndices["default"])(text);
      for (var i = 0; i < cashtagsWithIndices.length; i++) {
        cashtagsOnly.push(cashtagsWithIndices[i].cashtag);
      }
      return cashtagsOnly;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/extractHashtags.js
var require_extractHashtags = __commonJS({
  "node_modules/twitter-text/dist/extractHashtags.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _extractHashtagsWithIndices = _interopRequireDefault(require_extractHashtagsWithIndices());
    function _default(text) {
      var hashtagsOnly = [];
      var hashtagsWithIndices = (0, _extractHashtagsWithIndices["default"])(text);
      for (var i = 0; i < hashtagsWithIndices.length; i++) {
        hashtagsOnly.push(hashtagsWithIndices[i].hashtag);
      }
      return hashtagsOnly;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/extractMentionsWithIndices.js
var require_extractMentionsWithIndices = __commonJS({
  "node_modules/twitter-text/dist/extractMentionsWithIndices.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _extractMentionsOrListsWithIndices = _interopRequireDefault(require_extractMentionsOrListsWithIndices());
    function _default(text) {
      var mentions = [];
      var mentionOrList;
      var mentionsOrLists = (0, _extractMentionsOrListsWithIndices["default"])(text);
      for (var i = 0; i < mentionsOrLists.length; i++) {
        mentionOrList = mentionsOrLists[i];
        if (mentionOrList.listSlug === "") {
          mentions.push({
            screenName: mentionOrList.screenName,
            indices: mentionOrList.indices
          });
        }
      }
      return mentions;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/extractMentions.js
var require_extractMentions = __commonJS({
  "node_modules/twitter-text/dist/extractMentions.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _extractMentionsWithIndices = _interopRequireDefault(require_extractMentionsWithIndices());
    function _default(text) {
      var screenNamesOnly = [], screenNamesWithIndices = (0, _extractMentionsWithIndices["default"])(text);
      for (var i = 0; i < screenNamesWithIndices.length; i++) {
        var screenName = screenNamesWithIndices[i].screenName;
        screenNamesOnly.push(screenName);
      }
      return screenNamesOnly;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validReply.js
var require_validReply = __commonJS({
  "node_modules/twitter-text/dist/regexp/validReply.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _atSigns = _interopRequireDefault(require_atSigns());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _spaces = _interopRequireDefault(require_spaces());
    var validReply = (0, _regexSupplant["default"])(/^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/, {
      atSigns: _atSigns["default"],
      spaces: _spaces["default"]
    });
    var _default = validReply;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/extractReplies.js
var require_extractReplies = __commonJS({
  "node_modules/twitter-text/dist/extractReplies.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_constructor();
    require_es6_regexp_match();
    var _endMentionMatch = _interopRequireDefault(require_endMentionMatch());
    var _validReply = _interopRequireDefault(require_validReply());
    function _default(text) {
      if (!text) {
        return null;
      }
      var possibleScreenName = text.match(_validReply["default"]);
      if (!possibleScreenName || RegExp.rightContext.match(_endMentionMatch["default"])) {
        return null;
      }
      return possibleScreenName[1];
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/extractUrls.js
var require_extractUrls = __commonJS({
  "node_modules/twitter-text/dist/extractUrls.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _extractUrlsWithIndices = _interopRequireDefault(require_extractUrlsWithIndices());
    function _default(text, options) {
      var urlsOnly = [];
      var urlsWithIndices = (0, _extractUrlsWithIndices["default"])(text, options);
      for (var i = 0; i < urlsWithIndices.length; i++) {
        urlsOnly.push(urlsWithIndices[i].url);
      }
      return urlsOnly;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/core-js/modules/_is-array.js
var require_is_array = __commonJS({
  "node_modules/core-js/modules/_is-array.js"(exports2, module2) {
    var cof = require_cof();
    module2.exports = Array.isArray || function isArray(arg) {
      return cof(arg) == "Array";
    };
  }
});

// node_modules/core-js/modules/es6.array.is-array.js
var require_es6_array_is_array = __commonJS({
  "node_modules/core-js/modules/es6.array.is-array.js"() {
    var $export = require_export();
    $export($export.S, "Array", { isArray: require_is_array() });
  }
});

// node_modules/twitter-text/dist/lib/getCharacterWeight.js
var require_getCharacterWeight = __commonJS({
  "node_modules/twitter-text/dist/lib/getCharacterWeight.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    require_es6_array_is_array();
    var getCharacterWeight = function getCharacterWeight2(ch, options) {
      var defaultWeight = options.defaultWeight, ranges = options.ranges;
      var weight = defaultWeight;
      var chCodePoint = ch.charCodeAt(0);
      if (Array.isArray(ranges)) {
        for (var i = 0, length = ranges.length; i < length; i++) {
          var currRange = ranges[i];
          if (chCodePoint >= currRange.start && chCodePoint <= currRange.end) {
            weight = currRange.weight;
            break;
          }
        }
      }
      return weight;
    };
    var _default = getCharacterWeight;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/modifyIndicesFromUTF16ToUnicode.js
var require_modifyIndicesFromUTF16ToUnicode = __commonJS({
  "node_modules/twitter-text/dist/modifyIndicesFromUTF16ToUnicode.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _convertUnicodeIndices = _interopRequireDefault(require_convertUnicodeIndices());
    function _default(text, entities) {
      (0, _convertUnicodeIndices["default"])(text, entities, true);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/core-js/modules/_array-reduce.js
var require_array_reduce = __commonJS({
  "node_modules/core-js/modules/_array-reduce.js"(exports2, module2) {
    var aFunction = require_a_function();
    var toObject = require_to_object();
    var IObject = require_iobject();
    var toLength = require_to_length();
    module2.exports = function(that, callbackfn, aLen, memo, isRight) {
      aFunction(callbackfn);
      var O = toObject(that);
      var self2 = IObject(O);
      var length = toLength(O.length);
      var index = isRight ? length - 1 : 0;
      var i = isRight ? -1 : 1;
      if (aLen < 2) for (; ; ) {
        if (index in self2) {
          memo = self2[index];
          index += i;
          break;
        }
        index += i;
        if (isRight ? index < 0 : length <= index) {
          throw TypeError("Reduce of empty array with no initial value");
        }
      }
      for (; isRight ? index >= 0 : length > index; index += i) if (index in self2) {
        memo = callbackfn(memo, self2[index], index, O);
      }
      return memo;
    };
  }
});

// node_modules/core-js/modules/es6.array.reduce.js
var require_es6_array_reduce = __commonJS({
  "node_modules/core-js/modules/es6.array.reduce.js"() {
    "use strict";
    var $export = require_export();
    var $reduce = require_array_reduce();
    $export($export.P + $export.F * !require_strict_method()([].reduce, true), "Array", {
      // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
      reduce: function reduce(callbackfn) {
        return $reduce(this, callbackfn, arguments.length, arguments[1], false);
      }
    });
  }
});

// node_modules/core-js/modules/_add-to-unscopables.js
var require_add_to_unscopables = __commonJS({
  "node_modules/core-js/modules/_add-to-unscopables.js"(exports2, module2) {
    var UNSCOPABLES = require_wks()("unscopables");
    var ArrayProto = Array.prototype;
    if (ArrayProto[UNSCOPABLES] == void 0) require_hide()(ArrayProto, UNSCOPABLES, {});
    module2.exports = function(key) {
      ArrayProto[UNSCOPABLES][key] = true;
    };
  }
});

// node_modules/core-js/modules/_iter-step.js
var require_iter_step = __commonJS({
  "node_modules/core-js/modules/_iter-step.js"(exports2, module2) {
    module2.exports = function(done, value) {
      return { value, done: !!done };
    };
  }
});

// node_modules/core-js/modules/_iterators.js
var require_iterators = __commonJS({
  "node_modules/core-js/modules/_iterators.js"(exports2, module2) {
    module2.exports = {};
  }
});

// node_modules/core-js/modules/_object-keys.js
var require_object_keys = __commonJS({
  "node_modules/core-js/modules/_object-keys.js"(exports2, module2) {
    var $keys = require_object_keys_internal();
    var enumBugKeys = require_enum_bug_keys();
    module2.exports = Object.keys || function keys(O) {
      return $keys(O, enumBugKeys);
    };
  }
});

// node_modules/core-js/modules/_object-dps.js
var require_object_dps = __commonJS({
  "node_modules/core-js/modules/_object-dps.js"(exports2, module2) {
    var dP = require_object_dp();
    var anObject = require_an_object();
    var getKeys = require_object_keys();
    module2.exports = require_descriptors() ? Object.defineProperties : function defineProperties(O, Properties) {
      anObject(O);
      var keys = getKeys(Properties);
      var length = keys.length;
      var i = 0;
      var P;
      while (length > i) dP.f(O, P = keys[i++], Properties[P]);
      return O;
    };
  }
});

// node_modules/core-js/modules/_html.js
var require_html = __commonJS({
  "node_modules/core-js/modules/_html.js"(exports2, module2) {
    var document = require_global().document;
    module2.exports = document && document.documentElement;
  }
});

// node_modules/core-js/modules/_object-create.js
var require_object_create = __commonJS({
  "node_modules/core-js/modules/_object-create.js"(exports2, module2) {
    var anObject = require_an_object();
    var dPs = require_object_dps();
    var enumBugKeys = require_enum_bug_keys();
    var IE_PROTO = require_shared_key()("IE_PROTO");
    var Empty = function() {
    };
    var PROTOTYPE = "prototype";
    var createDict = function() {
      var iframe = require_dom_create()("iframe");
      var i = enumBugKeys.length;
      var lt = "<";
      var gt = ">";
      var iframeDocument;
      iframe.style.display = "none";
      require_html().appendChild(iframe);
      iframe.src = "javascript:";
      iframeDocument = iframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(lt + "script" + gt + "document.F=Object" + lt + "/script" + gt);
      iframeDocument.close();
      createDict = iframeDocument.F;
      while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
      return createDict();
    };
    module2.exports = Object.create || function create(O, Properties) {
      var result;
      if (O !== null) {
        Empty[PROTOTYPE] = anObject(O);
        result = new Empty();
        Empty[PROTOTYPE] = null;
        result[IE_PROTO] = O;
      } else result = createDict();
      return Properties === void 0 ? result : dPs(result, Properties);
    };
  }
});

// node_modules/core-js/modules/_set-to-string-tag.js
var require_set_to_string_tag = __commonJS({
  "node_modules/core-js/modules/_set-to-string-tag.js"(exports2, module2) {
    var def = require_object_dp().f;
    var has = require_has();
    var TAG = require_wks()("toStringTag");
    module2.exports = function(it, tag, stat) {
      if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
    };
  }
});

// node_modules/core-js/modules/_iter-create.js
var require_iter_create = __commonJS({
  "node_modules/core-js/modules/_iter-create.js"(exports2, module2) {
    "use strict";
    var create = require_object_create();
    var descriptor = require_property_desc();
    var setToStringTag = require_set_to_string_tag();
    var IteratorPrototype = {};
    require_hide()(IteratorPrototype, require_wks()("iterator"), function() {
      return this;
    });
    module2.exports = function(Constructor, NAME, next) {
      Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
      setToStringTag(Constructor, NAME + " Iterator");
    };
  }
});

// node_modules/core-js/modules/_object-gpo.js
var require_object_gpo = __commonJS({
  "node_modules/core-js/modules/_object-gpo.js"(exports2, module2) {
    var has = require_has();
    var toObject = require_to_object();
    var IE_PROTO = require_shared_key()("IE_PROTO");
    var ObjectProto = Object.prototype;
    module2.exports = Object.getPrototypeOf || function(O) {
      O = toObject(O);
      if (has(O, IE_PROTO)) return O[IE_PROTO];
      if (typeof O.constructor == "function" && O instanceof O.constructor) {
        return O.constructor.prototype;
      }
      return O instanceof Object ? ObjectProto : null;
    };
  }
});

// node_modules/core-js/modules/_iter-define.js
var require_iter_define = __commonJS({
  "node_modules/core-js/modules/_iter-define.js"(exports2, module2) {
    "use strict";
    var LIBRARY = require_library();
    var $export = require_export();
    var redefine = require_redefine();
    var hide = require_hide();
    var Iterators = require_iterators();
    var $iterCreate = require_iter_create();
    var setToStringTag = require_set_to_string_tag();
    var getPrototypeOf = require_object_gpo();
    var ITERATOR = require_wks()("iterator");
    var BUGGY = !([].keys && "next" in [].keys());
    var FF_ITERATOR = "@@iterator";
    var KEYS = "keys";
    var VALUES = "values";
    var returnThis = function() {
      return this;
    };
    module2.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
      $iterCreate(Constructor, NAME, next);
      var getMethod = function(kind) {
        if (!BUGGY && kind in proto) return proto[kind];
        switch (kind) {
          case KEYS:
            return function keys() {
              return new Constructor(this, kind);
            };
          case VALUES:
            return function values() {
              return new Constructor(this, kind);
            };
        }
        return function entries() {
          return new Constructor(this, kind);
        };
      };
      var TAG = NAME + " Iterator";
      var DEF_VALUES = DEFAULT == VALUES;
      var VALUES_BUG = false;
      var proto = Base.prototype;
      var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
      var $default = $native || getMethod(DEFAULT);
      var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod("entries") : void 0;
      var $anyNative = NAME == "Array" ? proto.entries || $native : $native;
      var methods, key, IteratorPrototype;
      if ($anyNative) {
        IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
        if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
          setToStringTag(IteratorPrototype, TAG, true);
          if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != "function") hide(IteratorPrototype, ITERATOR, returnThis);
        }
      }
      if (DEF_VALUES && $native && $native.name !== VALUES) {
        VALUES_BUG = true;
        $default = function values() {
          return $native.call(this);
        };
      }
      if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
        hide(proto, ITERATOR, $default);
      }
      Iterators[NAME] = $default;
      Iterators[TAG] = returnThis;
      if (DEFAULT) {
        methods = {
          values: DEF_VALUES ? $default : getMethod(VALUES),
          keys: IS_SET ? $default : getMethod(KEYS),
          entries: $entries
        };
        if (FORCED) for (key in methods) {
          if (!(key in proto)) redefine(proto, key, methods[key]);
        }
        else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
      }
      return methods;
    };
  }
});

// node_modules/core-js/modules/es6.array.iterator.js
var require_es6_array_iterator = __commonJS({
  "node_modules/core-js/modules/es6.array.iterator.js"(exports2, module2) {
    "use strict";
    var addToUnscopables = require_add_to_unscopables();
    var step = require_iter_step();
    var Iterators = require_iterators();
    var toIObject = require_to_iobject();
    module2.exports = require_iter_define()(Array, "Array", function(iterated, kind) {
      this._t = toIObject(iterated);
      this._i = 0;
      this._k = kind;
    }, function() {
      var O = this._t;
      var kind = this._k;
      var index = this._i++;
      if (!O || index >= O.length) {
        this._t = void 0;
        return step(1);
      }
      if (kind == "keys") return step(0, index);
      if (kind == "values") return step(0, O[index]);
      return step(0, [index, O[index]]);
    }, "values");
    Iterators.Arguments = Iterators.Array;
    addToUnscopables("keys");
    addToUnscopables("values");
    addToUnscopables("entries");
  }
});

// node_modules/core-js/modules/web.dom.iterable.js
var require_web_dom_iterable = __commonJS({
  "node_modules/core-js/modules/web.dom.iterable.js"() {
    var $iterators = require_es6_array_iterator();
    var getKeys = require_object_keys();
    var redefine = require_redefine();
    var global = require_global();
    var hide = require_hide();
    var Iterators = require_iterators();
    var wks = require_wks();
    var ITERATOR = wks("iterator");
    var TO_STRING_TAG = wks("toStringTag");
    var ArrayValues = Iterators.Array;
    var DOMIterables = {
      CSSRuleList: true,
      // TODO: Not spec compliant, should be false.
      CSSStyleDeclaration: false,
      CSSValueList: false,
      ClientRectList: false,
      DOMRectList: false,
      DOMStringList: false,
      DOMTokenList: true,
      DataTransferItemList: false,
      FileList: false,
      HTMLAllCollection: false,
      HTMLCollection: false,
      HTMLFormElement: false,
      HTMLSelectElement: false,
      MediaList: true,
      // TODO: Not spec compliant, should be false.
      MimeTypeArray: false,
      NamedNodeMap: false,
      NodeList: true,
      PaintRequestList: false,
      Plugin: false,
      PluginArray: false,
      SVGLengthList: false,
      SVGNumberList: false,
      SVGPathSegList: false,
      SVGPointList: false,
      SVGStringList: false,
      SVGTransformList: false,
      SourceBufferList: false,
      StyleSheetList: true,
      // TODO: Not spec compliant, should be false.
      TextTrackCueList: false,
      TextTrackList: false,
      TouchList: false
    };
    for (collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
      NAME = collections[i];
      explicit = DOMIterables[NAME];
      Collection = global[NAME];
      proto = Collection && Collection.prototype;
      if (proto) {
        if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
        if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
        Iterators[NAME] = ArrayValues;
        if (explicit) {
          for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
        }
      }
    }
    var NAME;
    var explicit;
    var Collection;
    var proto;
    var key;
    var collections;
    var i;
  }
});

// node_modules/core-js/modules/_object-sap.js
var require_object_sap = __commonJS({
  "node_modules/core-js/modules/_object-sap.js"(exports2, module2) {
    var $export = require_export();
    var core = require_core();
    var fails = require_fails();
    module2.exports = function(KEY, exec) {
      var fn = (core.Object || {})[KEY] || Object[KEY];
      var exp = {};
      exp[KEY] = exec(fn);
      $export($export.S + $export.F * fails(function() {
        fn(1);
      }), "Object", exp);
    };
  }
});

// node_modules/core-js/modules/es6.object.keys.js
var require_es6_object_keys = __commonJS({
  "node_modules/core-js/modules/es6.object.keys.js"() {
    var toObject = require_to_object();
    var $keys = require_object_keys();
    require_object_sap()("keys", function() {
      return function keys(it) {
        return $keys(toObject(it));
      };
    });
  }
});

// node_modules/twitter-text/dist/regexp/invalidChars.js
var require_invalidChars = __commonJS({
  "node_modules/twitter-text/dist/regexp/invalidChars.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _invalidCharsGroup = _interopRequireDefault(require_invalidCharsGroup());
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var invalidChars = (0, _regexSupplant["default"])(/[#{invalidCharsGroup}]/, {
      invalidCharsGroup: _invalidCharsGroup["default"]
    });
    var _default = invalidChars;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/hasInvalidCharacters.js
var require_hasInvalidCharacters = __commonJS({
  "node_modules/twitter-text/dist/hasInvalidCharacters.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _invalidChars = _interopRequireDefault(require_invalidChars());
    function _default(text) {
      return _invalidChars["default"].test(text);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twemoji-parser/dist/lib/regex.js
var require_regex = __commonJS({
  "node_modules/twemoji-parser/dist/lib/regex.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = /(?:\ud83d[\udc68\udc69])(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddb0-\uddb3])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\uddb5\uddb6\uddb8\uddb9\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a-\udc6d\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\udeeb\udeec\udef4-\udef9]|\ud83e[\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd40-\udd45\udd47-\udd70\udd73-\udd76\udd7a\udd7c-\udda2\uddb4\uddb7\uddc0-\uddc2\uddd0\uddde-\uddff]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g;
  }
});

// node_modules/twemoji-parser/dist/index.js
var require_dist = __commonJS({
  "node_modules/twemoji-parser/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.TypeName = void 0;
    exports2.parse = parse;
    exports2.toCodePoints = toCodePoints;
    var _regex = require_regex();
    var _regex2 = _interopRequireDefault(_regex);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var TypeName = exports2.TypeName = "emoji";
    function parse(text, options) {
      var assetType = options && options.assetType ? options.assetType : "svg";
      var getTwemojiUrl = options && options.buildUrl ? options.buildUrl : function(codepoints2, assetType2) {
        return assetType2 === "png" ? "https://twemoji.maxcdn.com/2/72x72/" + codepoints2 + ".png" : "https://twemoji.maxcdn.com/2/svg/" + codepoints2 + ".svg";
      };
      var entities = [];
      _regex2.default.lastIndex = 0;
      while (true) {
        var result = _regex2.default.exec(text);
        if (!result) {
          break;
        }
        var emojiText = result[0];
        var codepoints = toCodePoints(removeVS16s(emojiText)).join("-");
        entities.push({
          url: codepoints ? getTwemojiUrl(codepoints, assetType) : "",
          indices: [result.index, _regex2.default.lastIndex],
          text: emojiText,
          type: TypeName
        });
      }
      return entities;
    }
    var vs16RegExp = /\uFE0F/g;
    var zeroWidthJoiner = String.fromCharCode(8205);
    var removeVS16s = function removeVS16s2(rawEmoji) {
      return rawEmoji.indexOf(zeroWidthJoiner) < 0 ? rawEmoji.replace(vs16RegExp, "") : rawEmoji;
    };
    function toCodePoints(unicodeSurrogates) {
      var points = [];
      var char = 0;
      var previous = 0;
      var i = 0;
      while (i < unicodeSurrogates.length) {
        char = unicodeSurrogates.charCodeAt(i++);
        if (previous) {
          points.push((65536 + (previous - 55296 << 10) + (char - 56320)).toString(16));
          previous = 0;
        } else if (char > 55296 && char <= 56319) {
          previous = char;
        } else {
          points.push(char.toString(16));
        }
      }
      return points;
    }
  }
});

// node_modules/twitter-text/dist/regexp/urlHasHttps.js
var require_urlHasHttps = __commonJS({
  "node_modules/twitter-text/dist/regexp/urlHasHttps.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var urlHasHttps = /^https:\/\//i;
    var _default = urlHasHttps;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/parseTweet.js
var require_parseTweet = __commonJS({
  "node_modules/twitter-text/dist/parseTweet.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    require_es6_array_reduce();
    require_web_dom_iterable();
    require_es6_array_iterator();
    require_es6_object_to_string();
    require_es6_object_keys();
    var _configs = _interopRequireDefault(require_configs());
    var _extractUrlsWithIndices = _interopRequireDefault(require_extractUrlsWithIndices());
    var _getCharacterWeight = _interopRequireDefault(require_getCharacterWeight());
    var _hasInvalidCharacters = _interopRequireDefault(require_hasInvalidCharacters());
    var _modifyIndicesFromUTF16ToUnicode = _interopRequireDefault(require_modifyIndicesFromUTF16ToUnicode());
    var _twemojiParser = require_dist();
    var _urlHasHttps = _interopRequireDefault(require_urlHasHttps());
    var parseTweet2 = function parseTweet3() {
      var text = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _configs["default"].defaults;
      var mergedOptions = Object.keys(options).length ? options : _configs["default"].defaults;
      var defaultWeight = mergedOptions.defaultWeight, emojiParsingEnabled = mergedOptions.emojiParsingEnabled, scale = mergedOptions.scale, maxWeightedTweetLength = mergedOptions.maxWeightedTweetLength, transformedURLLength = mergedOptions.transformedURLLength;
      var normalizedText = typeof String.prototype.normalize === "function" ? text.normalize() : text;
      var urlEntitiesMap = transformEntitiesToHash((0, _extractUrlsWithIndices["default"])(normalizedText));
      var emojiEntitiesMap = emojiParsingEnabled ? transformEntitiesToHash((0, _twemojiParser.parse)(normalizedText)) : [];
      var tweetLength = normalizedText.length;
      var weightedLength = 0;
      var validDisplayIndex = 0;
      var valid = true;
      for (var charIndex = 0; charIndex < tweetLength; charIndex++) {
        if (urlEntitiesMap[charIndex]) {
          var _urlEntitiesMap$charI = urlEntitiesMap[charIndex], url = _urlEntitiesMap$charI.url, indices = _urlEntitiesMap$charI.indices;
          weightedLength += transformedURLLength * scale;
          charIndex += url.length - 1;
        } else if (emojiParsingEnabled && emojiEntitiesMap[charIndex]) {
          var _emojiEntitiesMap$cha = emojiEntitiesMap[charIndex], emoji = _emojiEntitiesMap$cha.text, _indices = _emojiEntitiesMap$cha.indices;
          weightedLength += defaultWeight;
          charIndex += emoji.length - 1;
        } else {
          charIndex += isSurrogatePair(normalizedText, charIndex) ? 1 : 0;
          weightedLength += (0, _getCharacterWeight["default"])(normalizedText.charAt(charIndex), mergedOptions);
        }
        if (valid) {
          valid = !(0, _hasInvalidCharacters["default"])(normalizedText.substring(charIndex, charIndex + 1));
        }
        if (valid && weightedLength <= maxWeightedTweetLength * scale) {
          validDisplayIndex = charIndex;
        }
      }
      weightedLength = weightedLength / scale;
      valid = valid && weightedLength > 0 && weightedLength <= maxWeightedTweetLength;
      var permillage = Math.floor(weightedLength / maxWeightedTweetLength * 1e3);
      var normalizationOffset = text.length - normalizedText.length;
      validDisplayIndex += normalizationOffset;
      return {
        weightedLength,
        valid,
        permillage,
        validRangeStart: 0,
        validRangeEnd: validDisplayIndex,
        displayRangeStart: 0,
        displayRangeEnd: text.length > 0 ? text.length - 1 : 0
      };
    };
    var transformEntitiesToHash = function transformEntitiesToHash2(entities) {
      return entities.reduce(function(map, entity) {
        map[entity.indices[0]] = entity;
        return map;
      }, {});
    };
    var isSurrogatePair = function isSurrogatePair2(text, cIndex) {
      if (cIndex < text.length - 1) {
        var c = text.charCodeAt(cIndex);
        var cNext = text.charCodeAt(cIndex + 1);
        return 55296 <= c && c <= 56319 && 56320 <= cNext && cNext <= 57343;
      }
      return false;
    };
    var _default = parseTweet2;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/getTweetLength.js
var require_getTweetLength = __commonJS({
  "node_modules/twitter-text/dist/getTweetLength.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _configs = _interopRequireDefault(require_configs());
    var _extractUrlsWithIndices = _interopRequireDefault(require_extractUrlsWithIndices());
    var _getCharacterWeight = _interopRequireDefault(require_getCharacterWeight());
    var _modifyIndicesFromUTF16ToUnicode = _interopRequireDefault(require_modifyIndicesFromUTF16ToUnicode());
    var _nonBmpCodePairs = _interopRequireDefault(require_nonBmpCodePairs());
    var _parseTweet = _interopRequireDefault(require_parseTweet());
    var _urlHasHttps = _interopRequireDefault(require_urlHasHttps());
    var getTweetLength = function getTweetLength2(text) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _configs["default"].defaults;
      return (0, _parseTweet["default"])(text, options).weightedLength;
    };
    var _default = getTweetLength;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/getUnicodeTextLength.js
var require_getUnicodeTextLength = __commonJS({
  "node_modules/twitter-text/dist/getUnicodeTextLength.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_replace();
    var _nonBmpCodePairs = _interopRequireDefault(require_nonBmpCodePairs());
    function _default(text) {
      return text.replace(_nonBmpCodePairs["default"], " ").length;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/splitTags.js
var require_splitTags = __commonJS({
  "node_modules/twitter-text/dist/splitTags.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_split();
    function _default(text) {
      var firstSplits = text.split("<"), secondSplits, allSplits = [], split;
      for (var i = 0; i < firstSplits.length; i += 1) {
        split = firstSplits[i];
        if (!split) {
          allSplits.push("");
        } else {
          secondSplits = split.split(">");
          for (var j = 0; j < secondSplits.length; j += 1) {
            allSplits.push(secondSplits[j]);
          }
        }
      }
      return allSplits;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/hitHighlight.js
var require_hitHighlight = __commonJS({
  "node_modules/twitter-text/dist/hitHighlight.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _splitTags = _interopRequireDefault(require_splitTags());
    function _default(text, hits, options) {
      var defaultHighlightTag = "em";
      hits = hits || [];
      options = options || {};
      if (hits.length === 0) {
        return text;
      }
      var tagName = options.tag || defaultHighlightTag, tags = ["<".concat(tagName, ">"), "</".concat(tagName, ">")], chunks = (0, _splitTags["default"])(text), i, j, result = "", chunkIndex = 0, chunk = chunks[0], prevChunksLen = 0, chunkCursor = 0, startInChunk = false, chunkChars = chunk, flatHits = [], index, hit, tag, placed, hitSpot;
      for (i = 0; i < hits.length; i += 1) {
        for (j = 0; j < hits[i].length; j += 1) {
          flatHits.push(hits[i][j]);
        }
      }
      for (index = 0; index < flatHits.length; index += 1) {
        hit = flatHits[index];
        tag = tags[index % 2];
        placed = false;
        while (chunk != null && hit >= prevChunksLen + chunk.length) {
          result += chunkChars.slice(chunkCursor);
          if (startInChunk && hit === prevChunksLen + chunkChars.length) {
            result += tag;
            placed = true;
          }
          if (chunks[chunkIndex + 1]) {
            result += "<".concat(chunks[chunkIndex + 1], ">");
          }
          prevChunksLen += chunkChars.length;
          chunkCursor = 0;
          chunkIndex += 2;
          chunk = chunks[chunkIndex];
          chunkChars = chunk;
          startInChunk = false;
        }
        if (!placed && chunk != null) {
          hitSpot = hit - prevChunksLen;
          result += chunkChars.slice(chunkCursor, hitSpot) + tag;
          chunkCursor = hitSpot;
          if (index % 2 === 0) {
            startInChunk = true;
          } else {
            startInChunk = false;
          }
        } else if (!placed) {
          placed = true;
          result += tag;
        }
      }
      if (chunk != null) {
        if (chunkCursor < chunkChars.length) {
          result += chunkChars.slice(chunkCursor);
        }
        for (index = chunkIndex + 1; index < chunks.length; index += 1) {
          result += index % 2 === 0 ? chunks[index] : "<".concat(chunks[index], ">");
        }
      }
      return result;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/core-js/modules/es6.object.define-properties.js
var require_es6_object_define_properties = __commonJS({
  "node_modules/core-js/modules/es6.object.define-properties.js"() {
    var $export = require_export();
    $export($export.S + $export.F * !require_descriptors(), "Object", { defineProperties: require_object_dps() });
  }
});

// node_modules/core-js/modules/_object-gops.js
var require_object_gops = __commonJS({
  "node_modules/core-js/modules/_object-gops.js"(exports2) {
    exports2.f = Object.getOwnPropertySymbols;
  }
});

// node_modules/core-js/modules/_own-keys.js
var require_own_keys = __commonJS({
  "node_modules/core-js/modules/_own-keys.js"(exports2, module2) {
    var gOPN = require_object_gopn();
    var gOPS = require_object_gops();
    var anObject = require_an_object();
    var Reflect2 = require_global().Reflect;
    module2.exports = Reflect2 && Reflect2.ownKeys || function ownKeys(it) {
      var keys = gOPN.f(anObject(it));
      var getSymbols = gOPS.f;
      return getSymbols ? keys.concat(getSymbols(it)) : keys;
    };
  }
});

// node_modules/core-js/modules/_create-property.js
var require_create_property = __commonJS({
  "node_modules/core-js/modules/_create-property.js"(exports2, module2) {
    "use strict";
    var $defineProperty = require_object_dp();
    var createDesc = require_property_desc();
    module2.exports = function(object, index, value) {
      if (index in object) $defineProperty.f(object, index, createDesc(0, value));
      else object[index] = value;
    };
  }
});

// node_modules/core-js/modules/es7.object.get-own-property-descriptors.js
var require_es7_object_get_own_property_descriptors = __commonJS({
  "node_modules/core-js/modules/es7.object.get-own-property-descriptors.js"() {
    var $export = require_export();
    var ownKeys = require_own_keys();
    var toIObject = require_to_iobject();
    var gOPD = require_object_gopd();
    var createProperty = require_create_property();
    $export($export.S, "Object", {
      getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
        var O = toIObject(object);
        var getDesc = gOPD.f;
        var keys = ownKeys(O);
        var result = {};
        var i = 0;
        var key, desc;
        while (keys.length > i) {
          desc = getDesc(O, key = keys[i++]);
          if (desc !== void 0) createProperty(result, key, desc);
        }
        return result;
      }
    });
  }
});

// node_modules/core-js/modules/_array-species-constructor.js
var require_array_species_constructor = __commonJS({
  "node_modules/core-js/modules/_array-species-constructor.js"(exports2, module2) {
    var isObject = require_is_object();
    var isArray = require_is_array();
    var SPECIES = require_wks()("species");
    module2.exports = function(original) {
      var C;
      if (isArray(original)) {
        C = original.constructor;
        if (typeof C == "function" && (C === Array || isArray(C.prototype))) C = void 0;
        if (isObject(C)) {
          C = C[SPECIES];
          if (C === null) C = void 0;
        }
      }
      return C === void 0 ? Array : C;
    };
  }
});

// node_modules/core-js/modules/_array-species-create.js
var require_array_species_create = __commonJS({
  "node_modules/core-js/modules/_array-species-create.js"(exports2, module2) {
    var speciesConstructor = require_array_species_constructor();
    module2.exports = function(original, length) {
      return new (speciesConstructor(original))(length);
    };
  }
});

// node_modules/core-js/modules/_array-methods.js
var require_array_methods = __commonJS({
  "node_modules/core-js/modules/_array-methods.js"(exports2, module2) {
    var ctx = require_ctx();
    var IObject = require_iobject();
    var toObject = require_to_object();
    var toLength = require_to_length();
    var asc = require_array_species_create();
    module2.exports = function(TYPE, $create) {
      var IS_MAP = TYPE == 1;
      var IS_FILTER = TYPE == 2;
      var IS_SOME = TYPE == 3;
      var IS_EVERY = TYPE == 4;
      var IS_FIND_INDEX = TYPE == 6;
      var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
      var create = $create || asc;
      return function($this, callbackfn, that) {
        var O = toObject($this);
        var self2 = IObject(O);
        var f = ctx(callbackfn, that, 3);
        var length = toLength(self2.length);
        var index = 0;
        var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : void 0;
        var val, res;
        for (; length > index; index++) if (NO_HOLES || index in self2) {
          val = self2[index];
          res = f(val, index, O);
          if (TYPE) {
            if (IS_MAP) result[index] = res;
            else if (res) switch (TYPE) {
              case 3:
                return true;
              // some
              case 5:
                return val;
              // find
              case 6:
                return index;
              // findIndex
              case 2:
                result.push(val);
            }
            else if (IS_EVERY) return false;
          }
        }
        return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
      };
    };
  }
});

// node_modules/core-js/modules/es6.array.for-each.js
var require_es6_array_for_each = __commonJS({
  "node_modules/core-js/modules/es6.array.for-each.js"() {
    "use strict";
    var $export = require_export();
    var $forEach = require_array_methods()(0);
    var STRICT = require_strict_method()([].forEach, true);
    $export($export.P + $export.F * !STRICT, "Array", {
      // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
      forEach: function forEach(callbackfn) {
        return $forEach(this, callbackfn, arguments[1]);
      }
    });
  }
});

// node_modules/core-js/modules/es6.array.filter.js
var require_es6_array_filter = __commonJS({
  "node_modules/core-js/modules/es6.array.filter.js"() {
    "use strict";
    var $export = require_export();
    var $filter = require_array_methods()(2);
    $export($export.P + $export.F * !require_strict_method()([].filter, true), "Array", {
      // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
      filter: function filter(callbackfn) {
        return $filter(this, callbackfn, arguments[1]);
      }
    });
  }
});

// node_modules/core-js/modules/_meta.js
var require_meta = __commonJS({
  "node_modules/core-js/modules/_meta.js"(exports2, module2) {
    var META = require_uid()("meta");
    var isObject = require_is_object();
    var has = require_has();
    var setDesc = require_object_dp().f;
    var id = 0;
    var isExtensible = Object.isExtensible || function() {
      return true;
    };
    var FREEZE = !require_fails()(function() {
      return isExtensible(Object.preventExtensions({}));
    });
    var setMeta = function(it) {
      setDesc(it, META, { value: {
        i: "O" + ++id,
        // object ID
        w: {}
        // weak collections IDs
      } });
    };
    var fastKey = function(it, create) {
      if (!isObject(it)) return typeof it == "symbol" ? it : (typeof it == "string" ? "S" : "P") + it;
      if (!has(it, META)) {
        if (!isExtensible(it)) return "F";
        if (!create) return "E";
        setMeta(it);
      }
      return it[META].i;
    };
    var getWeak = function(it, create) {
      if (!has(it, META)) {
        if (!isExtensible(it)) return true;
        if (!create) return false;
        setMeta(it);
      }
      return it[META].w;
    };
    var onFreeze = function(it) {
      if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
      return it;
    };
    var meta = module2.exports = {
      KEY: META,
      NEED: false,
      fastKey,
      getWeak,
      onFreeze
    };
  }
});

// node_modules/core-js/modules/_wks-ext.js
var require_wks_ext = __commonJS({
  "node_modules/core-js/modules/_wks-ext.js"(exports2) {
    exports2.f = require_wks();
  }
});

// node_modules/core-js/modules/_wks-define.js
var require_wks_define = __commonJS({
  "node_modules/core-js/modules/_wks-define.js"(exports2, module2) {
    var global = require_global();
    var core = require_core();
    var LIBRARY = require_library();
    var wksExt = require_wks_ext();
    var defineProperty = require_object_dp().f;
    module2.exports = function(name) {
      var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
      if (name.charAt(0) != "_" && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
    };
  }
});

// node_modules/core-js/modules/_enum-keys.js
var require_enum_keys = __commonJS({
  "node_modules/core-js/modules/_enum-keys.js"(exports2, module2) {
    var getKeys = require_object_keys();
    var gOPS = require_object_gops();
    var pIE = require_object_pie();
    module2.exports = function(it) {
      var result = getKeys(it);
      var getSymbols = gOPS.f;
      if (getSymbols) {
        var symbols = getSymbols(it);
        var isEnum = pIE.f;
        var i = 0;
        var key;
        while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
      }
      return result;
    };
  }
});

// node_modules/core-js/modules/_object-gopn-ext.js
var require_object_gopn_ext = __commonJS({
  "node_modules/core-js/modules/_object-gopn-ext.js"(exports2, module2) {
    var toIObject = require_to_iobject();
    var gOPN = require_object_gopn().f;
    var toString = {}.toString;
    var windowNames = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
    var getWindowNames = function(it) {
      try {
        return gOPN(it);
      } catch (e) {
        return windowNames.slice();
      }
    };
    module2.exports.f = function getOwnPropertyNames(it) {
      return windowNames && toString.call(it) == "[object Window]" ? getWindowNames(it) : gOPN(toIObject(it));
    };
  }
});

// node_modules/core-js/modules/es6.symbol.js
var require_es6_symbol = __commonJS({
  "node_modules/core-js/modules/es6.symbol.js"() {
    "use strict";
    var global = require_global();
    var has = require_has();
    var DESCRIPTORS = require_descriptors();
    var $export = require_export();
    var redefine = require_redefine();
    var META = require_meta().KEY;
    var $fails = require_fails();
    var shared = require_shared();
    var setToStringTag = require_set_to_string_tag();
    var uid = require_uid();
    var wks = require_wks();
    var wksExt = require_wks_ext();
    var wksDefine = require_wks_define();
    var enumKeys = require_enum_keys();
    var isArray = require_is_array();
    var anObject = require_an_object();
    var isObject = require_is_object();
    var toObject = require_to_object();
    var toIObject = require_to_iobject();
    var toPrimitive = require_to_primitive();
    var createDesc = require_property_desc();
    var _create = require_object_create();
    var gOPNExt = require_object_gopn_ext();
    var $GOPD = require_object_gopd();
    var $GOPS = require_object_gops();
    var $DP = require_object_dp();
    var $keys = require_object_keys();
    var gOPD = $GOPD.f;
    var dP = $DP.f;
    var gOPN = gOPNExt.f;
    var $Symbol = global.Symbol;
    var $JSON = global.JSON;
    var _stringify = $JSON && $JSON.stringify;
    var PROTOTYPE = "prototype";
    var HIDDEN = wks("_hidden");
    var TO_PRIMITIVE = wks("toPrimitive");
    var isEnum = {}.propertyIsEnumerable;
    var SymbolRegistry = shared("symbol-registry");
    var AllSymbols = shared("symbols");
    var OPSymbols = shared("op-symbols");
    var ObjectProto = Object[PROTOTYPE];
    var USE_NATIVE = typeof $Symbol == "function" && !!$GOPS.f;
    var QObject = global.QObject;
    var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
    var setSymbolDesc = DESCRIPTORS && $fails(function() {
      return _create(dP({}, "a", {
        get: function() {
          return dP(this, "a", { value: 7 }).a;
        }
      })).a != 7;
    }) ? function(it, key, D) {
      var protoDesc = gOPD(ObjectProto, key);
      if (protoDesc) delete ObjectProto[key];
      dP(it, key, D);
      if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
    } : dP;
    var wrap = function(tag) {
      var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
      sym._k = tag;
      return sym;
    };
    var isSymbol = USE_NATIVE && typeof $Symbol.iterator == "symbol" ? function(it) {
      return typeof it == "symbol";
    } : function(it) {
      return it instanceof $Symbol;
    };
    var $defineProperty = function defineProperty(it, key, D) {
      if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
      anObject(it);
      key = toPrimitive(key, true);
      anObject(D);
      if (has(AllSymbols, key)) {
        if (!D.enumerable) {
          if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
          it[HIDDEN][key] = true;
        } else {
          if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
          D = _create(D, { enumerable: createDesc(0, false) });
        }
        return setSymbolDesc(it, key, D);
      }
      return dP(it, key, D);
    };
    var $defineProperties = function defineProperties(it, P) {
      anObject(it);
      var keys = enumKeys(P = toIObject(P));
      var i = 0;
      var l = keys.length;
      var key;
      while (l > i) $defineProperty(it, key = keys[i++], P[key]);
      return it;
    };
    var $create = function create(it, P) {
      return P === void 0 ? _create(it) : $defineProperties(_create(it), P);
    };
    var $propertyIsEnumerable = function propertyIsEnumerable(key) {
      var E = isEnum.call(this, key = toPrimitive(key, true));
      if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
      return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
    };
    var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
      it = toIObject(it);
      key = toPrimitive(key, true);
      if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
      var D = gOPD(it, key);
      if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
      return D;
    };
    var $getOwnPropertyNames = function getOwnPropertyNames(it) {
      var names = gOPN(toIObject(it));
      var result = [];
      var i = 0;
      var key;
      while (names.length > i) {
        if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
      }
      return result;
    };
    var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
      var IS_OP = it === ObjectProto;
      var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
      var result = [];
      var i = 0;
      var key;
      while (names.length > i) {
        if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
      }
      return result;
    };
    if (!USE_NATIVE) {
      $Symbol = function Symbol2() {
        if (this instanceof $Symbol) throw TypeError("Symbol is not a constructor!");
        var tag = uid(arguments.length > 0 ? arguments[0] : void 0);
        var $set = function(value) {
          if (this === ObjectProto) $set.call(OPSymbols, value);
          if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
          setSymbolDesc(this, tag, createDesc(1, value));
        };
        if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
        return wrap(tag);
      };
      redefine($Symbol[PROTOTYPE], "toString", function toString() {
        return this._k;
      });
      $GOPD.f = $getOwnPropertyDescriptor;
      $DP.f = $defineProperty;
      require_object_gopn().f = gOPNExt.f = $getOwnPropertyNames;
      require_object_pie().f = $propertyIsEnumerable;
      $GOPS.f = $getOwnPropertySymbols;
      if (DESCRIPTORS && !require_library()) {
        redefine(ObjectProto, "propertyIsEnumerable", $propertyIsEnumerable, true);
      }
      wksExt.f = function(name) {
        return wrap(wks(name));
      };
    }
    $export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });
    for (es6Symbols = // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
    "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), j = 0; es6Symbols.length > j; ) wks(es6Symbols[j++]);
    var es6Symbols;
    var j;
    for (wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k; ) wksDefine(wellKnownSymbols[k++]);
    var wellKnownSymbols;
    var k;
    $export($export.S + $export.F * !USE_NATIVE, "Symbol", {
      // 19.4.2.1 Symbol.for(key)
      "for": function(key) {
        return has(SymbolRegistry, key += "") ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
      },
      // 19.4.2.5 Symbol.keyFor(sym)
      keyFor: function keyFor(sym) {
        if (!isSymbol(sym)) throw TypeError(sym + " is not a symbol!");
        for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
      },
      useSetter: function() {
        setter = true;
      },
      useSimple: function() {
        setter = false;
      }
    });
    $export($export.S + $export.F * !USE_NATIVE, "Object", {
      // 19.1.2.2 Object.create(O [, Properties])
      create: $create,
      // 19.1.2.4 Object.defineProperty(O, P, Attributes)
      defineProperty: $defineProperty,
      // 19.1.2.3 Object.defineProperties(O, Properties)
      defineProperties: $defineProperties,
      // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
      getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
      // 19.1.2.7 Object.getOwnPropertyNames(O)
      getOwnPropertyNames: $getOwnPropertyNames,
      // 19.1.2.8 Object.getOwnPropertySymbols(O)
      getOwnPropertySymbols: $getOwnPropertySymbols
    });
    var FAILS_ON_PRIMITIVES = $fails(function() {
      $GOPS.f(1);
    });
    $export($export.S + $export.F * FAILS_ON_PRIMITIVES, "Object", {
      getOwnPropertySymbols: function getOwnPropertySymbols(it) {
        return $GOPS.f(toObject(it));
      }
    });
    $JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function() {
      var S = $Symbol();
      return _stringify([S]) != "[null]" || _stringify({ a: S }) != "{}" || _stringify(Object(S)) != "{}";
    })), "JSON", {
      stringify: function stringify(it) {
        var args = [it];
        var i = 1;
        var replacer, $replacer;
        while (arguments.length > i) args.push(arguments[i++]);
        $replacer = replacer = args[1];
        if (!isObject(replacer) && it === void 0 || isSymbol(it)) return;
        if (!isArray(replacer)) replacer = function(key, value) {
          if (typeof $replacer == "function") value = $replacer.call(this, key, value);
          if (!isSymbol(value)) return value;
        };
        args[1] = replacer;
        return _stringify.apply($JSON, args);
      }
    });
    $Symbol[PROTOTYPE][TO_PRIMITIVE] || require_hide()($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
    setToStringTag($Symbol, "Symbol");
    setToStringTag(Math, "Math", true);
    setToStringTag(global.JSON, "JSON", true);
  }
});

// node_modules/@babel/runtime/helpers/typeof.js
var require_typeof = __commonJS({
  "node_modules/@babel/runtime/helpers/typeof.js"(exports2, module2) {
    function _typeof(o) {
      "@babel/helpers - typeof";
      return module2.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, module2.exports.__esModule = true, module2.exports["default"] = module2.exports, _typeof(o);
    }
    module2.exports = _typeof, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/@babel/runtime/helpers/toPrimitive.js
var require_toPrimitive = __commonJS({
  "node_modules/@babel/runtime/helpers/toPrimitive.js"(exports2, module2) {
    var _typeof = require_typeof()["default"];
    function toPrimitive(t, r) {
      if ("object" != _typeof(t) || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    module2.exports = toPrimitive, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/@babel/runtime/helpers/toPropertyKey.js
var require_toPropertyKey = __commonJS({
  "node_modules/@babel/runtime/helpers/toPropertyKey.js"(exports2, module2) {
    var _typeof = require_typeof()["default"];
    var toPrimitive = require_toPrimitive();
    function toPropertyKey(t) {
      var i = toPrimitive(t, "string");
      return "symbol" == _typeof(i) ? i : i + "";
    }
    module2.exports = toPropertyKey, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/@babel/runtime/helpers/defineProperty.js
var require_defineProperty = __commonJS({
  "node_modules/@babel/runtime/helpers/defineProperty.js"(exports2, module2) {
    var toPropertyKey = require_toPropertyKey();
    function _defineProperty(e, r, t) {
      return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: true,
        configurable: true,
        writable: true
      }) : e[r] = t, e;
    }
    module2.exports = _defineProperty, module2.exports.__esModule = true, module2.exports["default"] = module2.exports;
  }
});

// node_modules/twitter-text/dist/isInvalidTweet.js
var require_isInvalidTweet = __commonJS({
  "node_modules/twitter-text/dist/isInvalidTweet.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_object_define_property();
    require_es6_object_define_properties();
    require_es7_object_get_own_property_descriptors();
    require_es6_array_for_each();
    require_es6_array_filter();
    require_es6_symbol();
    require_web_dom_iterable();
    require_es6_array_iterator();
    require_es6_object_to_string();
    require_es6_object_keys();
    var _defineProperty2 = _interopRequireDefault(require_defineProperty());
    var _configs = _interopRequireDefault(require_configs());
    var _getTweetLength = _interopRequireDefault(require_getTweetLength());
    var _hasInvalidCharacters = _interopRequireDefault(require_hasInvalidCharacters());
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
          ownKeys(source, true).forEach(function(key) {
            (0, _defineProperty2["default"])(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(source).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
      return target;
    }
    function _default(text) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _configs["default"].defaults;
      if (!text) {
        return "empty";
      }
      var mergedOptions = _objectSpread({}, _configs["default"].defaults, {}, options);
      var maxLength = mergedOptions.maxWeightedTweetLength;
      if ((0, _getTweetLength["default"])(text, mergedOptions) > maxLength) {
        return "too_long";
      }
      if ((0, _hasInvalidCharacters["default"])(text)) {
        return "invalid_characters";
      }
      return false;
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/isValidHashtag.js
var require_isValidHashtag = __commonJS({
  "node_modules/twitter-text/dist/isValidHashtag.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _extractHashtags = _interopRequireDefault(require_extractHashtags());
    function _default(hashtag) {
      if (!hashtag) {
        return false;
      }
      var extracted = (0, _extractHashtags["default"])(hashtag);
      return extracted.length === 1 && extracted[0] === hashtag.slice(1);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/isValidList.js
var require_isValidList = __commonJS({
  "node_modules/twitter-text/dist/isValidList.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_match();
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validMentionOrList = _interopRequireDefault(require_validMentionOrList());
    var VALID_LIST_RE = (0, _regexSupplant["default"])(/^#{validMentionOrList}$/, {
      validMentionOrList: _validMentionOrList["default"]
    });
    function _default(usernameList) {
      var match = usernameList.match(VALID_LIST_RE);
      return !!(match && match[1] == "" && match[4]);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/isValidTweetText.js
var require_isValidTweetText = __commonJS({
  "node_modules/twitter-text/dist/isValidTweetText.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _isInvalidTweet = _interopRequireDefault(require_isInvalidTweet());
    function _default(text, options) {
      return !(0, _isInvalidTweet["default"])(text, options);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlUnreserved.js
var require_validateUrlUnreserved = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlUnreserved.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validateUrlUnreserved = /[a-z\u0400-\u04FF0-9\-._~]/i;
    var _default = validateUrlUnreserved;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlPctEncoded.js
var require_validateUrlPctEncoded = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlPctEncoded.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validateUrlPctEncoded = /(?:%[0-9a-f]{2})/i;
    var _default = validateUrlPctEncoded;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlSubDelims.js
var require_validateUrlSubDelims = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlSubDelims.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validateUrlSubDelims = /[!$&'()*+,;=]/i;
    var _default = validateUrlSubDelims;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlUserinfo.js
var require_validateUrlUserinfo = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlUserinfo.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validateUrlUnreserved = _interopRequireDefault(require_validateUrlUnreserved());
    var _validateUrlPctEncoded = _interopRequireDefault(require_validateUrlPctEncoded());
    var _validateUrlSubDelims = _interopRequireDefault(require_validateUrlSubDelims());
    var validateUrlUserinfo = (0, _regexSupplant["default"])("(?:#{validateUrlUnreserved}|#{validateUrlPctEncoded}|#{validateUrlSubDelims}|:)*", {
      validateUrlUnreserved: _validateUrlUnreserved["default"],
      validateUrlPctEncoded: _validateUrlPctEncoded["default"],
      validateUrlSubDelims: _validateUrlSubDelims["default"]
    }, "i");
    var _default = validateUrlUserinfo;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlDomainSegment.js
var require_validateUrlDomainSegment = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlDomainSegment.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validateUrlDomainSegment = /(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)/i;
    var _default = validateUrlDomainSegment;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlDomainTld.js
var require_validateUrlDomainTld = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlDomainTld.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validateUrlDomainTld = /(?:[a-z](?:[a-z0-9\-]*[a-z0-9])?)/i;
    var _default = validateUrlDomainTld;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlSubDomainSegment.js
var require_validateUrlSubDomainSegment = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlSubDomainSegment.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validateUrlSubDomainSegment = /(?:[a-z0-9](?:[a-z0-9_\-]*[a-z0-9])?)/i;
    var _default = validateUrlSubDomainSegment;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlDomain.js
var require_validateUrlDomain = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlDomain.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validateUrlDomainSegment = _interopRequireDefault(require_validateUrlDomainSegment());
    var _validateUrlDomainTld = _interopRequireDefault(require_validateUrlDomainTld());
    var _validateUrlSubDomainSegment = _interopRequireDefault(require_validateUrlSubDomainSegment());
    var validateUrlDomain = (0, _regexSupplant["default"])(/(?:(?:#{validateUrlSubDomainSegment}\.)*(?:#{validateUrlDomainSegment}\.)#{validateUrlDomainTld})/i, {
      validateUrlSubDomainSegment: _validateUrlSubDomainSegment["default"],
      validateUrlDomainSegment: _validateUrlDomainSegment["default"],
      validateUrlDomainTld: _validateUrlDomainTld["default"]
    });
    var _default = validateUrlDomain;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlDecOctet.js
var require_validateUrlDecOctet = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlDecOctet.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validateUrlDecOctet = /(?:[0-9]|(?:[1-9][0-9])|(?:1[0-9]{2})|(?:2[0-4][0-9])|(?:25[0-5]))/i;
    var _default = validateUrlDecOctet;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlIpv4.js
var require_validateUrlIpv4 = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlIpv4.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validateUrlDecOctet = _interopRequireDefault(require_validateUrlDecOctet());
    var validateUrlIpv4 = (0, _regexSupplant["default"])(/(?:#{validateUrlDecOctet}(?:\.#{validateUrlDecOctet}){3})/i, {
      validateUrlDecOctet: _validateUrlDecOctet["default"]
    });
    var _default = validateUrlIpv4;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlIpv6.js
var require_validateUrlIpv6 = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlIpv6.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validateUrlIpv6 = /(?:\[[a-f0-9:\.]+\])/i;
    var _default = validateUrlIpv6;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlIp.js
var require_validateUrlIp = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlIp.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validateUrlIpv = _interopRequireDefault(require_validateUrlIpv4());
    var _validateUrlIpv2 = _interopRequireDefault(require_validateUrlIpv6());
    var validateUrlIp = (0, _regexSupplant["default"])("(?:#{validateUrlIpv4}|#{validateUrlIpv6})", {
      validateUrlIpv4: _validateUrlIpv["default"],
      validateUrlIpv6: _validateUrlIpv2["default"]
    }, "i");
    var _default = validateUrlIp;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlHost.js
var require_validateUrlHost = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlHost.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validateUrlDomain = _interopRequireDefault(require_validateUrlDomain());
    var _validateUrlIp = _interopRequireDefault(require_validateUrlIp());
    var validateUrlHost = (0, _regexSupplant["default"])("(?:#{validateUrlIp}|#{validateUrlDomain})", {
      validateUrlIp: _validateUrlIp["default"],
      validateUrlDomain: _validateUrlDomain["default"]
    }, "i");
    var _default = validateUrlHost;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlPort.js
var require_validateUrlPort = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlPort.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validateUrlPort = /[0-9]{1,5}/;
    var _default = validateUrlPort;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlAuthority.js
var require_validateUrlAuthority = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlAuthority.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validateUrlUserinfo = _interopRequireDefault(require_validateUrlUserinfo());
    var _validateUrlHost = _interopRequireDefault(require_validateUrlHost());
    var _validateUrlPort = _interopRequireDefault(require_validateUrlPort());
    var validateUrlAuthority = (0, _regexSupplant["default"])(
      // $1 userinfo
      "(?:(#{validateUrlUserinfo})@)?(#{validateUrlHost})(?::(#{validateUrlPort}))?",
      {
        validateUrlUserinfo: _validateUrlUserinfo["default"],
        validateUrlHost: _validateUrlHost["default"],
        validateUrlPort: _validateUrlPort["default"]
      },
      "i"
    );
    var _default = validateUrlAuthority;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlPchar.js
var require_validateUrlPchar = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlPchar.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validateUrlUnreserved = _interopRequireDefault(require_validateUrlUnreserved());
    var _validateUrlPctEncoded = _interopRequireDefault(require_validateUrlPctEncoded());
    var _validateUrlSubDelims = _interopRequireDefault(require_validateUrlSubDelims());
    var validateUrlPchar = (0, _regexSupplant["default"])("(?:#{validateUrlUnreserved}|#{validateUrlPctEncoded}|#{validateUrlSubDelims}|[:|@])", {
      validateUrlUnreserved: _validateUrlUnreserved["default"],
      validateUrlPctEncoded: _validateUrlPctEncoded["default"],
      validateUrlSubDelims: _validateUrlSubDelims["default"]
    }, "i");
    var _default = validateUrlPchar;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlFragment.js
var require_validateUrlFragment = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlFragment.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validateUrlPchar = _interopRequireDefault(require_validateUrlPchar());
    var validateUrlFragment = (0, _regexSupplant["default"])(/(#{validateUrlPchar}|\/|\?)*/i, {
      validateUrlPchar: _validateUrlPchar["default"]
    });
    var _default = validateUrlFragment;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlPath.js
var require_validateUrlPath = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlPath.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validateUrlPchar = _interopRequireDefault(require_validateUrlPchar());
    var validateUrlPath = (0, _regexSupplant["default"])(/(\/#{validateUrlPchar}*)*/i, {
      validateUrlPchar: _validateUrlPchar["default"]
    });
    var _default = validateUrlPath;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlQuery.js
var require_validateUrlQuery = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlQuery.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validateUrlPchar = _interopRequireDefault(require_validateUrlPchar());
    var validateUrlQuery = (0, _regexSupplant["default"])(/(#{validateUrlPchar}|\/|\?)*/i, {
      validateUrlPchar: _validateUrlPchar["default"]
    });
    var _default = validateUrlQuery;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlScheme.js
var require_validateUrlScheme = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlScheme.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validateUrlScheme = /(?:[a-z][a-z0-9+\-.]*)/i;
    var _default = validateUrlScheme;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlUnencoded.js
var require_validateUrlUnencoded = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlUnencoded.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var validateUrlUnencoded = (0, _regexSupplant["default"])("^(?:([^:/?#]+):\\/\\/)?([^/?#]*)([^?#]*)(?:\\?([^#]*))?(?:#(.*))?$", "i");
    var _default = validateUrlUnencoded;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlUnicodeSubDomainSegment.js
var require_validateUrlUnicodeSubDomainSegment = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlUnicodeSubDomainSegment.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validateUrlUnicodeSubDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9_\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
    var _default = validateUrlUnicodeSubDomainSegment;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlUnicodeDomainSegment.js
var require_validateUrlUnicodeDomainSegment = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlUnicodeDomainSegment.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validateUrlUnicodeDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
    var _default = validateUrlUnicodeDomainSegment;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlUnicodeDomainTld.js
var require_validateUrlUnicodeDomainTld = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlUnicodeDomainTld.js"(exports2, module2) {
    "use strict";
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var validateUrlUnicodeDomainTld = /(?:(?:[a-z]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
    var _default = validateUrlUnicodeDomainTld;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlUnicodeDomain.js
var require_validateUrlUnicodeDomain = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlUnicodeDomain.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validateUrlUnicodeSubDomainSegment = _interopRequireDefault(require_validateUrlUnicodeSubDomainSegment());
    var _validateUrlUnicodeDomainSegment = _interopRequireDefault(require_validateUrlUnicodeDomainSegment());
    var _validateUrlUnicodeDomainTld = _interopRequireDefault(require_validateUrlUnicodeDomainTld());
    var validateUrlUnicodeDomain = (0, _regexSupplant["default"])(/(?:(?:#{validateUrlUnicodeSubDomainSegment}\.)*(?:#{validateUrlUnicodeDomainSegment}\.)#{validateUrlUnicodeDomainTld})/i, {
      validateUrlUnicodeSubDomainSegment: _validateUrlUnicodeSubDomainSegment["default"],
      validateUrlUnicodeDomainSegment: _validateUrlUnicodeDomainSegment["default"],
      validateUrlUnicodeDomainTld: _validateUrlUnicodeDomainTld["default"]
    });
    var _default = validateUrlUnicodeDomain;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlUnicodeHost.js
var require_validateUrlUnicodeHost = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlUnicodeHost.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validateUrlIp = _interopRequireDefault(require_validateUrlIp());
    var _validateUrlUnicodeDomain = _interopRequireDefault(require_validateUrlUnicodeDomain());
    var validateUrlUnicodeHost = (0, _regexSupplant["default"])("(?:#{validateUrlIp}|#{validateUrlUnicodeDomain})", {
      validateUrlIp: _validateUrlIp["default"],
      validateUrlUnicodeDomain: _validateUrlUnicodeDomain["default"]
    }, "i");
    var _default = validateUrlUnicodeHost;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/validateUrlUnicodeAuthority.js
var require_validateUrlUnicodeAuthority = __commonJS({
  "node_modules/twitter-text/dist/regexp/validateUrlUnicodeAuthority.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _regexSupplant = _interopRequireDefault(require_regexSupplant());
    var _validateUrlUserinfo = _interopRequireDefault(require_validateUrlUserinfo());
    var _validateUrlUnicodeHost = _interopRequireDefault(require_validateUrlUnicodeHost());
    var _validateUrlPort = _interopRequireDefault(require_validateUrlPort());
    var validateUrlUnicodeAuthority = (0, _regexSupplant["default"])(
      // $1 userinfo
      "(?:(#{validateUrlUserinfo})@)?(#{validateUrlUnicodeHost})(?::(#{validateUrlPort}))?",
      {
        validateUrlUserinfo: _validateUrlUserinfo["default"],
        validateUrlUnicodeHost: _validateUrlUnicodeHost["default"],
        validateUrlPort: _validateUrlPort["default"]
      },
      "i"
    );
    var _default = validateUrlUnicodeAuthority;
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/isValidUrl.js
var require_isValidUrl = __commonJS({
  "node_modules/twitter-text/dist/isValidUrl.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    require_es6_regexp_constructor();
    require_es6_regexp_match();
    var _validateUrlAuthority = _interopRequireDefault(require_validateUrlAuthority());
    var _validateUrlFragment = _interopRequireDefault(require_validateUrlFragment());
    var _validateUrlPath = _interopRequireDefault(require_validateUrlPath());
    var _validateUrlQuery = _interopRequireDefault(require_validateUrlQuery());
    var _validateUrlScheme = _interopRequireDefault(require_validateUrlScheme());
    var _validateUrlUnencoded = _interopRequireDefault(require_validateUrlUnencoded());
    var _validateUrlUnicodeAuthority = _interopRequireDefault(require_validateUrlUnicodeAuthority());
    function isValidMatch(string, regex, optional) {
      if (!optional) {
        return typeof string === "string" && string.match(regex) && RegExp["$&"] === string;
      }
      return !string || string.match(regex) && RegExp["$&"] === string;
    }
    function _default(url, unicodeDomains, requireProtocol) {
      if (unicodeDomains == null) {
        unicodeDomains = true;
      }
      if (requireProtocol == null) {
        requireProtocol = true;
      }
      if (!url) {
        return false;
      }
      var urlParts = url.match(_validateUrlUnencoded["default"]);
      if (!urlParts || urlParts[0] !== url) {
        return false;
      }
      var scheme = urlParts[1], authority = urlParts[2], path = urlParts[3], query = urlParts[4], fragment = urlParts[5];
      if (!((!requireProtocol || isValidMatch(scheme, _validateUrlScheme["default"]) && scheme.match(/^https?$/i)) && isValidMatch(path, _validateUrlPath["default"]) && isValidMatch(query, _validateUrlQuery["default"], true) && isValidMatch(fragment, _validateUrlFragment["default"], true))) {
        return false;
      }
      return unicodeDomains && isValidMatch(authority, _validateUrlUnicodeAuthority["default"]) || !unicodeDomains && isValidMatch(authority, _validateUrlAuthority["default"]);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/isValidUsername.js
var require_isValidUsername = __commonJS({
  "node_modules/twitter-text/dist/isValidUsername.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = _default;
    var _extractMentions = _interopRequireDefault(require_extractMentions());
    function _default(username) {
      if (!username) {
        return false;
      }
      var extracted = (0, _extractMentions["default"])(username);
      return extracted.length === 1 && extracted[0] === username.slice(1);
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/regexp/index.js
var require_regexp = __commonJS({
  "node_modules/twitter-text/dist/regexp/index.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _astralLetterAndMarks = _interopRequireDefault(require_astralLetterAndMarks());
    var _astralNumerals = _interopRequireDefault(require_astralNumerals());
    var _atSigns = _interopRequireDefault(require_atSigns());
    var _bmpLetterAndMarks = _interopRequireDefault(require_bmpLetterAndMarks());
    var _bmpNumerals = _interopRequireDefault(require_bmpNumerals());
    var _cashtag = _interopRequireDefault(require_cashtag());
    var _codePoint = _interopRequireDefault(require_codePoint());
    var _cyrillicLettersAndMarks = _interopRequireDefault(require_cyrillicLettersAndMarks());
    var _endHashtagMatch = _interopRequireDefault(require_endHashtagMatch());
    var _endMentionMatch = _interopRequireDefault(require_endMentionMatch());
    var _extractUrl = _interopRequireDefault(require_extractUrl());
    var _hashSigns = _interopRequireDefault(require_hashSigns());
    var _hashtagAlpha = _interopRequireDefault(require_hashtagAlpha());
    var _hashtagAlphaNumeric = _interopRequireDefault(require_hashtagAlphaNumeric());
    var _hashtagBoundary = _interopRequireDefault(require_hashtagBoundary());
    var _hashtagSpecialChars = _interopRequireDefault(require_hashtagSpecialChars());
    var _invalidChars = _interopRequireDefault(require_invalidChars());
    var _invalidCharsGroup = _interopRequireDefault(require_invalidCharsGroup());
    var _invalidDomainChars = _interopRequireDefault(require_invalidDomainChars());
    var _invalidUrlWithoutProtocolPrecedingChars = _interopRequireDefault(require_invalidUrlWithoutProtocolPrecedingChars());
    var _latinAccentChars = _interopRequireDefault(require_latinAccentChars());
    var _nonBmpCodePairs = _interopRequireDefault(require_nonBmpCodePairs());
    var _punct = _interopRequireDefault(require_punct());
    var _rtlChars = _interopRequireDefault(require_rtlChars());
    var _spaces = _interopRequireDefault(require_spaces());
    var _spacesGroup = _interopRequireDefault(require_spacesGroup());
    var _urlHasHttps = _interopRequireDefault(require_urlHasHttps());
    var _urlHasProtocol = _interopRequireDefault(require_urlHasProtocol());
    var _validAsciiDomain = _interopRequireDefault(require_validAsciiDomain());
    var _validateUrlAuthority = _interopRequireDefault(require_validateUrlAuthority());
    var _validateUrlDecOctet = _interopRequireDefault(require_validateUrlDecOctet());
    var _validateUrlDomain = _interopRequireDefault(require_validateUrlDomain());
    var _validateUrlDomainSegment = _interopRequireDefault(require_validateUrlDomainSegment());
    var _validateUrlDomainTld = _interopRequireDefault(require_validateUrlDomainTld());
    var _validateUrlFragment = _interopRequireDefault(require_validateUrlFragment());
    var _validateUrlHost = _interopRequireDefault(require_validateUrlHost());
    var _validateUrlIp = _interopRequireDefault(require_validateUrlIp());
    var _validateUrlIpv = _interopRequireDefault(require_validateUrlIpv4());
    var _validateUrlIpv2 = _interopRequireDefault(require_validateUrlIpv6());
    var _validateUrlPath = _interopRequireDefault(require_validateUrlPath());
    var _validateUrlPchar = _interopRequireDefault(require_validateUrlPchar());
    var _validateUrlPctEncoded = _interopRequireDefault(require_validateUrlPctEncoded());
    var _validateUrlPort = _interopRequireDefault(require_validateUrlPort());
    var _validateUrlQuery = _interopRequireDefault(require_validateUrlQuery());
    var _validateUrlScheme = _interopRequireDefault(require_validateUrlScheme());
    var _validateUrlSubDelims = _interopRequireDefault(require_validateUrlSubDelims());
    var _validateUrlSubDomainSegment = _interopRequireDefault(require_validateUrlSubDomainSegment());
    var _validateUrlUnencoded = _interopRequireDefault(require_validateUrlUnencoded());
    var _validateUrlUnicodeAuthority = _interopRequireDefault(require_validateUrlUnicodeAuthority());
    var _validateUrlUnicodeDomain = _interopRequireDefault(require_validateUrlUnicodeDomain());
    var _validateUrlUnicodeDomainSegment = _interopRequireDefault(require_validateUrlUnicodeDomainSegment());
    var _validateUrlUnicodeDomainTld = _interopRequireDefault(require_validateUrlUnicodeDomainTld());
    var _validateUrlUnicodeHost = _interopRequireDefault(require_validateUrlUnicodeHost());
    var _validateUrlUnicodeSubDomainSegment = _interopRequireDefault(require_validateUrlUnicodeSubDomainSegment());
    var _validateUrlUnreserved = _interopRequireDefault(require_validateUrlUnreserved());
    var _validateUrlUserinfo = _interopRequireDefault(require_validateUrlUserinfo());
    var _validCashtag = _interopRequireDefault(require_validCashtag());
    var _validCCTLD = _interopRequireDefault(require_validCCTLD());
    var _validDomain = _interopRequireDefault(require_validDomain());
    var _validDomainChars = _interopRequireDefault(require_validDomainChars());
    var _validDomainName = _interopRequireDefault(require_validDomainName());
    var _validGeneralUrlPathChars = _interopRequireDefault(require_validGeneralUrlPathChars());
    var _validGTLD = _interopRequireDefault(require_validGTLD());
    var _validHashtag = _interopRequireDefault(require_validHashtag());
    var _validMentionOrList = _interopRequireDefault(require_validMentionOrList());
    var _validMentionPrecedingChars = _interopRequireDefault(require_validMentionPrecedingChars());
    var _validPortNumber = _interopRequireDefault(require_validPortNumber());
    var _validPunycode = _interopRequireDefault(require_validPunycode());
    var _validReply = _interopRequireDefault(require_validReply());
    var _validSubdomain = _interopRequireDefault(require_validSubdomain());
    var _validTcoUrl = _interopRequireDefault(require_validTcoUrl());
    var _validUrlBalancedParens = _interopRequireDefault(require_validUrlBalancedParens());
    var _validUrlPath = _interopRequireDefault(require_validUrlPath());
    var _validUrlPathEndingChars = _interopRequireDefault(require_validUrlPathEndingChars());
    var _validUrlPrecedingChars = _interopRequireDefault(require_validUrlPrecedingChars());
    var _validUrlQueryChars = _interopRequireDefault(require_validUrlQueryChars());
    var _validUrlQueryEndingChars = _interopRequireDefault(require_validUrlQueryEndingChars());
    var _default = {
      astralLetterAndMarks: _astralLetterAndMarks["default"],
      astralNumerals: _astralNumerals["default"],
      atSigns: _atSigns["default"],
      bmpLetterAndMarks: _bmpLetterAndMarks["default"],
      bmpNumerals: _bmpNumerals["default"],
      cashtag: _cashtag["default"],
      codePoint: _codePoint["default"],
      cyrillicLettersAndMarks: _cyrillicLettersAndMarks["default"],
      endHashtagMatch: _endHashtagMatch["default"],
      endMentionMatch: _endMentionMatch["default"],
      extractUrl: _extractUrl["default"],
      hashSigns: _hashSigns["default"],
      hashtagAlpha: _hashtagAlpha["default"],
      hashtagAlphaNumeric: _hashtagAlphaNumeric["default"],
      hashtagBoundary: _hashtagBoundary["default"],
      hashtagSpecialChars: _hashtagSpecialChars["default"],
      invalidChars: _invalidChars["default"],
      invalidCharsGroup: _invalidCharsGroup["default"],
      invalidDomainChars: _invalidDomainChars["default"],
      invalidUrlWithoutProtocolPrecedingChars: _invalidUrlWithoutProtocolPrecedingChars["default"],
      latinAccentChars: _latinAccentChars["default"],
      nonBmpCodePairs: _nonBmpCodePairs["default"],
      punct: _punct["default"],
      rtlChars: _rtlChars["default"],
      spaces: _spaces["default"],
      spacesGroup: _spacesGroup["default"],
      urlHasHttps: _urlHasHttps["default"],
      urlHasProtocol: _urlHasProtocol["default"],
      validAsciiDomain: _validAsciiDomain["default"],
      validateUrlAuthority: _validateUrlAuthority["default"],
      validateUrlDecOctet: _validateUrlDecOctet["default"],
      validateUrlDomain: _validateUrlDomain["default"],
      validateUrlDomainSegment: _validateUrlDomainSegment["default"],
      validateUrlDomainTld: _validateUrlDomainTld["default"],
      validateUrlFragment: _validateUrlFragment["default"],
      validateUrlHost: _validateUrlHost["default"],
      validateUrlIp: _validateUrlIp["default"],
      validateUrlIpv4: _validateUrlIpv["default"],
      validateUrlIpv6: _validateUrlIpv2["default"],
      validateUrlPath: _validateUrlPath["default"],
      validateUrlPchar: _validateUrlPchar["default"],
      validateUrlPctEncoded: _validateUrlPctEncoded["default"],
      validateUrlPort: _validateUrlPort["default"],
      validateUrlQuery: _validateUrlQuery["default"],
      validateUrlScheme: _validateUrlScheme["default"],
      validateUrlSubDelims: _validateUrlSubDelims["default"],
      validateUrlSubDomainSegment: _validateUrlSubDomainSegment["default"],
      validateUrlUnencoded: _validateUrlUnencoded["default"],
      validateUrlUnicodeAuthority: _validateUrlUnicodeAuthority["default"],
      validateUrlUnicodeDomain: _validateUrlUnicodeDomain["default"],
      validateUrlUnicodeDomainSegment: _validateUrlUnicodeDomainSegment["default"],
      validateUrlUnicodeDomainTld: _validateUrlUnicodeDomainTld["default"],
      validateUrlUnicodeHost: _validateUrlUnicodeHost["default"],
      validateUrlUnicodeSubDomainSegment: _validateUrlUnicodeSubDomainSegment["default"],
      validateUrlUnreserved: _validateUrlUnreserved["default"],
      validateUrlUserinfo: _validateUrlUserinfo["default"],
      validCashtag: _validCashtag["default"],
      validCCTLD: _validCCTLD["default"],
      validDomain: _validDomain["default"],
      validDomainChars: _validDomainChars["default"],
      validDomainName: _validDomainName["default"],
      validGeneralUrlPathChars: _validGeneralUrlPathChars["default"],
      validGTLD: _validGTLD["default"],
      validHashtag: _validHashtag["default"],
      validMentionOrList: _validMentionOrList["default"],
      validMentionPrecedingChars: _validMentionPrecedingChars["default"],
      validPortNumber: _validPortNumber["default"],
      validPunycode: _validPunycode["default"],
      validReply: _validReply["default"],
      validSubdomain: _validSubdomain["default"],
      validTcoUrl: _validTcoUrl["default"],
      validUrlBalancedParens: _validUrlBalancedParens["default"],
      validUrlPath: _validUrlPath["default"],
      validUrlPathEndingChars: _validUrlPathEndingChars["default"],
      validUrlPrecedingChars: _validUrlPrecedingChars["default"],
      validUrlQueryChars: _validUrlQueryChars["default"],
      validUrlQueryEndingChars: _validUrlQueryEndingChars["default"]
    };
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/core-js/modules/es6.string.iterator.js
var require_es6_string_iterator = __commonJS({
  "node_modules/core-js/modules/es6.string.iterator.js"() {
    "use strict";
    var $at = require_string_at()(true);
    require_iter_define()(String, "String", function(iterated) {
      this._t = String(iterated);
      this._i = 0;
    }, function() {
      var O = this._t;
      var index = this._i;
      var point;
      if (index >= O.length) return { value: void 0, done: true };
      point = $at(O, index);
      this._i += point.length;
      return { value: point, done: false };
    });
  }
});

// node_modules/core-js/modules/_iter-call.js
var require_iter_call = __commonJS({
  "node_modules/core-js/modules/_iter-call.js"(exports2, module2) {
    var anObject = require_an_object();
    module2.exports = function(iterator, fn, value, entries) {
      try {
        return entries ? fn(anObject(value)[0], value[1]) : fn(value);
      } catch (e) {
        var ret = iterator["return"];
        if (ret !== void 0) anObject(ret.call(iterator));
        throw e;
      }
    };
  }
});

// node_modules/core-js/modules/_is-array-iter.js
var require_is_array_iter = __commonJS({
  "node_modules/core-js/modules/_is-array-iter.js"(exports2, module2) {
    var Iterators = require_iterators();
    var ITERATOR = require_wks()("iterator");
    var ArrayProto = Array.prototype;
    module2.exports = function(it) {
      return it !== void 0 && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
    };
  }
});

// node_modules/core-js/modules/core.get-iterator-method.js
var require_core_get_iterator_method = __commonJS({
  "node_modules/core-js/modules/core.get-iterator-method.js"(exports2, module2) {
    var classof = require_classof();
    var ITERATOR = require_wks()("iterator");
    var Iterators = require_iterators();
    module2.exports = require_core().getIteratorMethod = function(it) {
      if (it != void 0) return it[ITERATOR] || it["@@iterator"] || Iterators[classof(it)];
    };
  }
});

// node_modules/core-js/modules/_iter-detect.js
var require_iter_detect = __commonJS({
  "node_modules/core-js/modules/_iter-detect.js"(exports2, module2) {
    var ITERATOR = require_wks()("iterator");
    var SAFE_CLOSING = false;
    try {
      riter = [7][ITERATOR]();
      riter["return"] = function() {
        SAFE_CLOSING = true;
      };
      Array.from(riter, function() {
        throw 2;
      });
    } catch (e) {
    }
    var riter;
    module2.exports = function(exec, skipClosing) {
      if (!skipClosing && !SAFE_CLOSING) return false;
      var safe = false;
      try {
        var arr = [7];
        var iter = arr[ITERATOR]();
        iter.next = function() {
          return { done: safe = true };
        };
        arr[ITERATOR] = function() {
          return iter;
        };
        exec(arr);
      } catch (e) {
      }
      return safe;
    };
  }
});

// node_modules/core-js/modules/es6.array.from.js
var require_es6_array_from = __commonJS({
  "node_modules/core-js/modules/es6.array.from.js"() {
    "use strict";
    var ctx = require_ctx();
    var $export = require_export();
    var toObject = require_to_object();
    var call = require_iter_call();
    var isArrayIter = require_is_array_iter();
    var toLength = require_to_length();
    var createProperty = require_create_property();
    var getIterFn = require_core_get_iterator_method();
    $export($export.S + $export.F * !require_iter_detect()(function(iter) {
      Array.from(iter);
    }), "Array", {
      // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
      from: function from(arrayLike) {
        var O = toObject(arrayLike);
        var C = typeof this == "function" ? this : Array;
        var aLen = arguments.length;
        var mapfn = aLen > 1 ? arguments[1] : void 0;
        var mapping = mapfn !== void 0;
        var index = 0;
        var iterFn = getIterFn(O);
        var length, result, step, iterator;
        if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : void 0, 2);
        if (iterFn != void 0 && !(C == Array && isArrayIter(iterFn))) {
          for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
            createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
          }
        } else {
          length = toLength(O.length);
          for (result = new C(length); length > index; index++) {
            createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
          }
        }
        result.length = index;
        return result;
      }
    });
  }
});

// node_modules/twitter-text/dist/standardizeIndices.js
var require_standardizeIndices = __commonJS({
  "node_modules/twitter-text/dist/standardizeIndices.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = standardizeIndices;
    require_es6_string_iterator();
    require_es6_array_from();
    var _getUnicodeTextLength = _interopRequireDefault(require_getUnicodeTextLength());
    function standardizeIndices(text, startIndex, endIndex) {
      var totalUnicodeTextLength = (0, _getUnicodeTextLength["default"])(text);
      var encodingDiff = text.length - totalUnicodeTextLength;
      if (encodingDiff > 0) {
        var byCodePair = Array.from(text);
        var beforeText = startIndex === 0 ? "" : byCodePair.slice(0, startIndex).join("");
        var actualText = byCodePair.slice(startIndex, endIndex).join("");
        return [beforeText.length, beforeText.length + actualText.length];
      }
      return [startIndex, endIndex];
    }
    module2.exports = exports2.default;
  }
});

// node_modules/twitter-text/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/twitter-text/dist/index.js"(exports2, module2) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    require_es6_object_define_property();
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _autoLink = _interopRequireDefault(require_autoLink());
    var _autoLinkCashtags = _interopRequireDefault(require_autoLinkCashtags());
    var _autoLinkEntities = _interopRequireDefault(require_autoLinkEntities());
    var _autoLinkHashtags = _interopRequireDefault(require_autoLinkHashtags());
    var _autoLinkUrlsCustom = _interopRequireDefault(require_autoLinkUrlsCustom());
    var _autoLinkUsernamesOrLists = _interopRequireDefault(require_autoLinkUsernamesOrLists());
    var _autoLinkWithJSON = _interopRequireDefault(require_autoLinkWithJSON());
    var _configs = _interopRequireDefault(require_configs());
    var _convertUnicodeIndices = _interopRequireDefault(require_convertUnicodeIndices2());
    var _extractCashtags = _interopRequireDefault(require_extractCashtags());
    var _extractCashtagsWithIndices = _interopRequireDefault(require_extractCashtagsWithIndices());
    var _extractEntitiesWithIndices = _interopRequireDefault(require_extractEntitiesWithIndices());
    var _extractHashtags = _interopRequireDefault(require_extractHashtags());
    var _extractHashtagsWithIndices = _interopRequireDefault(require_extractHashtagsWithIndices());
    var _extractHtmlAttrsFromOptions = _interopRequireDefault(require_extractHtmlAttrsFromOptions());
    var _extractMentions = _interopRequireDefault(require_extractMentions());
    var _extractMentionsOrListsWithIndices = _interopRequireDefault(require_extractMentionsOrListsWithIndices());
    var _extractMentionsWithIndices = _interopRequireDefault(require_extractMentionsWithIndices());
    var _extractReplies = _interopRequireDefault(require_extractReplies());
    var _extractUrls = _interopRequireDefault(require_extractUrls());
    var _extractUrlsWithIndices = _interopRequireDefault(require_extractUrlsWithIndices());
    var _getTweetLength = _interopRequireDefault(require_getTweetLength());
    var _getUnicodeTextLength = _interopRequireDefault(require_getUnicodeTextLength());
    var _hasInvalidCharacters = _interopRequireDefault(require_hasInvalidCharacters());
    var _hitHighlight = _interopRequireDefault(require_hitHighlight());
    var _htmlEscape = _interopRequireDefault(require_htmlEscape());
    var _isInvalidTweet = _interopRequireDefault(require_isInvalidTweet());
    var _isValidHashtag = _interopRequireDefault(require_isValidHashtag());
    var _isValidList = _interopRequireDefault(require_isValidList());
    var _isValidTweetText = _interopRequireDefault(require_isValidTweetText());
    var _isValidUrl = _interopRequireDefault(require_isValidUrl());
    var _isValidUsername = _interopRequireDefault(require_isValidUsername());
    var _linkTextWithEntity = _interopRequireDefault(require_linkTextWithEntity());
    var _linkToCashtag = _interopRequireDefault(require_linkToCashtag());
    var _linkToHashtag = _interopRequireDefault(require_linkToHashtag());
    var _linkToMentionAndList = _interopRequireDefault(require_linkToMentionAndList());
    var _linkToText = _interopRequireDefault(require_linkToText());
    var _linkToTextWithSymbol = _interopRequireDefault(require_linkToTextWithSymbol());
    var _linkToUrl = _interopRequireDefault(require_linkToUrl());
    var _modifyIndicesFromUTF16ToUnicode = _interopRequireDefault(require_modifyIndicesFromUTF16ToUnicode());
    var _modifyIndicesFromUnicodeToUTF = _interopRequireDefault(require_modifyIndicesFromUnicodeToUTF16());
    var _index = _interopRequireDefault(require_regexp());
    var _removeOverlappingEntities = _interopRequireDefault(require_removeOverlappingEntities());
    var _parseTweet = _interopRequireDefault(require_parseTweet());
    var _splitTags = _interopRequireDefault(require_splitTags());
    var _standardizeIndices = _interopRequireDefault(require_standardizeIndices());
    var _tagAttrs = _interopRequireDefault(require_tagAttrs());
    var _default = {
      autoLink: _autoLink["default"],
      autoLinkCashtags: _autoLinkCashtags["default"],
      autoLinkEntities: _autoLinkEntities["default"],
      autoLinkHashtags: _autoLinkHashtags["default"],
      autoLinkUrlsCustom: _autoLinkUrlsCustom["default"],
      autoLinkUsernamesOrLists: _autoLinkUsernamesOrLists["default"],
      autoLinkWithJSON: _autoLinkWithJSON["default"],
      configs: _configs["default"],
      convertUnicodeIndices: _convertUnicodeIndices["default"],
      extractCashtags: _extractCashtags["default"],
      extractCashtagsWithIndices: _extractCashtagsWithIndices["default"],
      extractEntitiesWithIndices: _extractEntitiesWithIndices["default"],
      extractHashtags: _extractHashtags["default"],
      extractHashtagsWithIndices: _extractHashtagsWithIndices["default"],
      extractHtmlAttrsFromOptions: _extractHtmlAttrsFromOptions["default"],
      extractMentions: _extractMentions["default"],
      extractMentionsOrListsWithIndices: _extractMentionsOrListsWithIndices["default"],
      extractMentionsWithIndices: _extractMentionsWithIndices["default"],
      extractReplies: _extractReplies["default"],
      extractUrls: _extractUrls["default"],
      extractUrlsWithIndices: _extractUrlsWithIndices["default"],
      getTweetLength: _getTweetLength["default"],
      getUnicodeTextLength: _getUnicodeTextLength["default"],
      hasInvalidCharacters: _hasInvalidCharacters["default"],
      hitHighlight: _hitHighlight["default"],
      htmlEscape: _htmlEscape["default"],
      isInvalidTweet: _isInvalidTweet["default"],
      isValidHashtag: _isValidHashtag["default"],
      isValidList: _isValidList["default"],
      isValidTweetText: _isValidTweetText["default"],
      isValidUrl: _isValidUrl["default"],
      isValidUsername: _isValidUsername["default"],
      linkTextWithEntity: _linkTextWithEntity["default"],
      linkToCashtag: _linkToCashtag["default"],
      linkToHashtag: _linkToHashtag["default"],
      linkToMentionAndList: _linkToMentionAndList["default"],
      linkToText: _linkToText["default"],
      linkToTextWithSymbol: _linkToTextWithSymbol["default"],
      linkToUrl: _linkToUrl["default"],
      modifyIndicesFromUTF16ToUnicode: _modifyIndicesFromUTF16ToUnicode["default"],
      modifyIndicesFromUnicodeToUTF16: _modifyIndicesFromUnicodeToUTF["default"],
      regexen: _index["default"],
      removeOverlappingEntities: _removeOverlappingEntities["default"],
      parseTweet: _parseTweet["default"],
      splitTags: _splitTags["default"],
      standardizeIndices: _standardizeIndices["default"],
      tagAttrs: _tagAttrs["default"]
    };
    exports2["default"] = _default;
    module2.exports = exports2.default;
  }
});

// node_modules/oauth/lib/sha1.js
var require_sha1 = __commonJS({
  "node_modules/oauth/lib/sha1.js"(exports2) {
    var b64pad = "=";
    function b64_hmac_sha1(k, d) {
      return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
    }
    function rstr_hmac_sha1(key, data) {
      var bkey = rstr2binb(key);
      if (bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);
      var ipad = Array(16), opad = Array(16);
      for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 909522486;
        opad[i] = bkey[i] ^ 1549556828;
      }
      var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
      return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
    }
    function rstr2b64(input2) {
      try {
        b64pad;
      } catch (e) {
        b64pad = "";
      }
      var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var output = "";
      var len = input2.length;
      for (var i = 0; i < len; i += 3) {
        var triplet = input2.charCodeAt(i) << 16 | (i + 1 < len ? input2.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input2.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
          if (i * 8 + j * 6 > input2.length * 8) output += b64pad;
          else output += tab.charAt(triplet >>> 6 * (3 - j) & 63);
        }
      }
      return output;
    }
    function str2rstr_utf8(input2) {
      var output = "";
      var i = -1;
      var x, y;
      while (++i < input2.length) {
        x = input2.charCodeAt(i);
        y = i + 1 < input2.length ? input2.charCodeAt(i + 1) : 0;
        if (55296 <= x && x <= 56319 && 56320 <= y && y <= 57343) {
          x = 65536 + ((x & 1023) << 10) + (y & 1023);
          i++;
        }
        if (x <= 127)
          output += String.fromCharCode(x);
        else if (x <= 2047)
          output += String.fromCharCode(
            192 | x >>> 6 & 31,
            128 | x & 63
          );
        else if (x <= 65535)
          output += String.fromCharCode(
            224 | x >>> 12 & 15,
            128 | x >>> 6 & 63,
            128 | x & 63
          );
        else if (x <= 2097151)
          output += String.fromCharCode(
            240 | x >>> 18 & 7,
            128 | x >>> 12 & 63,
            128 | x >>> 6 & 63,
            128 | x & 63
          );
      }
      return output;
    }
    function rstr2binb(input2) {
      var output = Array(input2.length >> 2);
      for (var i = 0; i < output.length; i++)
        output[i] = 0;
      for (var i = 0; i < input2.length * 8; i += 8)
        output[i >> 5] |= (input2.charCodeAt(i / 8) & 255) << 24 - i % 32;
      return output;
    }
    function binb2rstr(input2) {
      var output = "";
      for (var i = 0; i < input2.length * 32; i += 8)
        output += String.fromCharCode(input2[i >> 5] >>> 24 - i % 32 & 255);
      return output;
    }
    function binb_sha1(x, len) {
      x[len >> 5] |= 128 << 24 - len % 32;
      x[(len + 64 >> 9 << 4) + 15] = len;
      var w = Array(80);
      var a = 1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d = 271733878;
      var e = -1009589776;
      for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for (var j = 0; j < 80; j++) {
          if (j < 16) w[j] = x[i + j];
          else w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
          var t = safe_add(
            safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
            safe_add(safe_add(e, w[j]), sha1_kt(j))
          );
          e = d;
          d = c;
          c = bit_rol(b, 30);
          b = a;
          a = t;
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
      }
      return Array(a, b, c, d, e);
    }
    function sha1_ft(t, b, c, d) {
      if (t < 20) return b & c | ~b & d;
      if (t < 40) return b ^ c ^ d;
      if (t < 60) return b & c | b & d | c & d;
      return b ^ c ^ d;
    }
    function sha1_kt(t) {
      return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
    }
    function safe_add(x, y) {
      var lsw = (x & 65535) + (y & 65535);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return msw << 16 | lsw & 65535;
    }
    function bit_rol(num, cnt) {
      return num << cnt | num >>> 32 - cnt;
    }
    exports2.HMACSHA1 = function(key, data) {
      return b64_hmac_sha1(key, data);
    };
  }
});

// node_modules/oauth/lib/_utils.js
var require_utils = __commonJS({
  "node_modules/oauth/lib/_utils.js"(exports2, module2) {
    module2.exports.isAnEarlyCloseHost = function(hostName) {
      return hostName && hostName.match(".*google(apis)?.com$");
    };
  }
});

// node_modules/oauth/lib/oauth.js
var require_oauth = __commonJS({
  "node_modules/oauth/lib/oauth.js"(exports2) {
    var crypto = require("crypto");
    var sha1 = require_sha1();
    var http = require("http");
    var https = require("https");
    var URL2 = require("url");
    var querystring = require("querystring");
    var OAuthUtils = require_utils();
    exports2.OAuth = function(requestUrl, accessUrl, consumerKey, consumerSecret, version, authorize_callback, signatureMethod, nonceSize, customHeaders) {
      this._isEcho = false;
      this._requestUrl = requestUrl;
      this._accessUrl = accessUrl;
      this._consumerKey = consumerKey;
      this._consumerSecret = this._encodeData(consumerSecret);
      if (signatureMethod == "RSA-SHA1") {
        this._privateKey = consumerSecret;
      }
      this._version = version;
      if (authorize_callback === void 0) {
        this._authorize_callback = "oob";
      } else {
        this._authorize_callback = authorize_callback;
      }
      if (signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "HMAC-SHA256" && signatureMethod != "RSA-SHA1")
        throw new Error("Un-supported signature method: " + signatureMethod);
      this._signatureMethod = signatureMethod;
      this._nonceSize = nonceSize || 32;
      this._headers = customHeaders || {
        "Accept": "*/*",
        "Connection": "close",
        "User-Agent": "Node authentication"
      };
      this._clientOptions = this._defaultClientOptions = {
        "requestTokenHttpMethod": "POST",
        "accessTokenHttpMethod": "POST",
        "followRedirects": true
      };
      this._oauthParameterSeperator = ",";
    };
    exports2.OAuthEcho = function(realm, verify_credentials, consumerKey, consumerSecret, version, signatureMethod, nonceSize, customHeaders) {
      this._isEcho = true;
      this._realm = realm;
      this._verifyCredentials = verify_credentials;
      this._consumerKey = consumerKey;
      this._consumerSecret = this._encodeData(consumerSecret);
      if (signatureMethod == "RSA-SHA1") {
        this._privateKey = consumerSecret;
      }
      this._version = version;
      if (signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "HMAC-SHA256" && signatureMethod != "RSA-SHA1")
        throw new Error("Un-supported signature method: " + signatureMethod);
      this._signatureMethod = signatureMethod;
      this._nonceSize = nonceSize || 32;
      this._headers = customHeaders || {
        "Accept": "*/*",
        "Connection": "close",
        "User-Agent": "Node authentication"
      };
      this._oauthParameterSeperator = ",";
    };
    exports2.OAuthEcho.prototype = exports2.OAuth.prototype;
    exports2.OAuth.prototype._getTimestamp = function() {
      return Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
    };
    exports2.OAuth.prototype._encodeData = function(toEncode) {
      if (toEncode == null || toEncode == "") return "";
      else {
        var result = encodeURIComponent(toEncode);
        return result.replace(/\!/g, "%21").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
      }
    };
    exports2.OAuth.prototype._decodeData = function(toDecode) {
      if (toDecode != null) {
        toDecode = toDecode.replace(/\+/g, " ");
      }
      return decodeURIComponent(toDecode);
    };
    exports2.OAuth.prototype._getSignature = function(method, url, parameters, tokenSecret) {
      var signatureBase = this._createSignatureBase(method, url, parameters);
      return this._createSignature(signatureBase, tokenSecret);
    };
    exports2.OAuth.prototype._normalizeUrl = function(url) {
      var parsedUrl = URL2.parse(url, true);
      var port = "";
      if (parsedUrl.port) {
        if (parsedUrl.protocol == "http:" && parsedUrl.port != "80" || parsedUrl.protocol == "https:" && parsedUrl.port != "443") {
          port = ":" + parsedUrl.port;
        }
      }
      if (!parsedUrl.pathname || parsedUrl.pathname == "") parsedUrl.pathname = "/";
      return parsedUrl.protocol + "//" + parsedUrl.hostname + port + parsedUrl.pathname;
    };
    exports2.OAuth.prototype._isParameterNameAnOAuthParameter = function(parameter) {
      var m = parameter.match("^oauth_");
      if (m && m[0] === "oauth_") {
        return true;
      } else {
        return false;
      }
    };
    exports2.OAuth.prototype._buildAuthorizationHeaders = function(orderedParameters) {
      var authHeader = "OAuth ";
      if (this._isEcho) {
        authHeader += 'realm="' + this._realm + '",';
      }
      for (var i = 0; i < orderedParameters.length; i++) {
        if (this._isParameterNameAnOAuthParameter(orderedParameters[i][0])) {
          authHeader += "" + this._encodeData(orderedParameters[i][0]) + '="' + this._encodeData(orderedParameters[i][1]) + '"' + this._oauthParameterSeperator;
        }
      }
      authHeader = authHeader.substring(0, authHeader.length - this._oauthParameterSeperator.length);
      return authHeader;
    };
    exports2.OAuth.prototype._makeArrayOfArgumentsHash = function(argumentsHash) {
      var argument_pairs = [];
      for (var key in argumentsHash) {
        if (argumentsHash.hasOwnProperty(key)) {
          var value = argumentsHash[key];
          if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
              argument_pairs[argument_pairs.length] = [key, value[i]];
            }
          } else {
            argument_pairs[argument_pairs.length] = [key, value];
          }
        }
      }
      return argument_pairs;
    };
    exports2.OAuth.prototype._sortRequestParams = function(argument_pairs) {
      argument_pairs.sort(function(a, b) {
        if (a[0] == b[0]) {
          return a[1] < b[1] ? -1 : 1;
        } else return a[0] < b[0] ? -1 : 1;
      });
      return argument_pairs;
    };
    exports2.OAuth.prototype._normaliseRequestParams = function(args) {
      var argument_pairs = this._makeArrayOfArgumentsHash(args);
      for (var i = 0; i < argument_pairs.length; i++) {
        argument_pairs[i][0] = this._encodeData(argument_pairs[i][0]);
        argument_pairs[i][1] = this._encodeData(argument_pairs[i][1]);
      }
      argument_pairs = this._sortRequestParams(argument_pairs);
      var args = "";
      for (var i = 0; i < argument_pairs.length; i++) {
        args += argument_pairs[i][0];
        args += "=";
        args += argument_pairs[i][1];
        if (i < argument_pairs.length - 1) args += "&";
      }
      return args;
    };
    exports2.OAuth.prototype._createSignatureBase = function(method, url, parameters) {
      url = this._encodeData(this._normalizeUrl(url));
      parameters = this._encodeData(parameters);
      return method.toUpperCase() + "&" + url + "&" + parameters;
    };
    exports2.OAuth.prototype._createSignature = function(signatureBase, tokenSecret) {
      if (tokenSecret === void 0) var tokenSecret = "";
      else tokenSecret = this._encodeData(tokenSecret);
      var key = this._consumerSecret + "&" + tokenSecret;
      var hash = "";
      if (this._signatureMethod == "PLAINTEXT") {
        hash = key;
      } else if (this._signatureMethod == "RSA-SHA1") {
        key = this._privateKey || "";
        hash = crypto.createSign("RSA-SHA1").update(signatureBase).sign(key, "base64");
      } else if (this._signatureMethod == "HMAC-SHA256") {
        hash = crypto.createHmac("sha256", key).update(signatureBase).digest("base64");
      } else {
        if (crypto.Hmac) {
          hash = crypto.createHmac("sha1", key).update(signatureBase).digest("base64");
        } else {
          hash = sha1.HMACSHA1(key, signatureBase);
        }
      }
      return hash;
    };
    exports2.OAuth.prototype.NONCE_CHARS = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ];
    exports2.OAuth.prototype._getNonce = function(nonceSize) {
      var result = [];
      var chars = this.NONCE_CHARS;
      var char_pos;
      var nonce_chars_length = chars.length;
      for (var i = 0; i < nonceSize; i++) {
        char_pos = Math.floor(Math.random() * nonce_chars_length);
        result[i] = chars[char_pos];
      }
      return result.join("");
    };
    exports2.OAuth.prototype._createClient = function(port, hostname, method, path, headers, sslEnabled) {
      var options = {
        host: hostname,
        port,
        path,
        method,
        headers
      };
      var httpModel;
      if (sslEnabled) {
        httpModel = https;
      } else {
        httpModel = http;
      }
      return httpModel.request(options);
    };
    exports2.OAuth.prototype._prepareParameters = function(oauth_token, oauth_token_secret, method, url, extra_params) {
      var oauthParameters = {
        "oauth_timestamp": this._getTimestamp(),
        "oauth_nonce": this._getNonce(this._nonceSize),
        "oauth_version": this._version,
        "oauth_signature_method": this._signatureMethod,
        "oauth_consumer_key": this._consumerKey
      };
      if (oauth_token) {
        oauthParameters["oauth_token"] = oauth_token;
      }
      var sig;
      if (this._isEcho) {
        sig = this._getSignature("GET", this._verifyCredentials, this._normaliseRequestParams(oauthParameters), oauth_token_secret);
      } else {
        if (extra_params) {
          for (var key in extra_params) {
            if (extra_params.hasOwnProperty(key)) oauthParameters[key] = extra_params[key];
          }
        }
        var parsedUrl = URL2.parse(url, false);
        if (parsedUrl.query) {
          var key2;
          var extraParameters = querystring.parse(parsedUrl.query);
          for (var key in extraParameters) {
            var value = extraParameters[key];
            if (typeof value == "object") {
              for (key2 in value) {
                oauthParameters[key + "[" + key2 + "]"] = value[key2];
              }
            } else {
              oauthParameters[key] = value;
            }
          }
        }
        sig = this._getSignature(method, url, this._normaliseRequestParams(oauthParameters), oauth_token_secret);
      }
      var orderedParameters = this._sortRequestParams(this._makeArrayOfArgumentsHash(oauthParameters));
      orderedParameters[orderedParameters.length] = ["oauth_signature", sig];
      return orderedParameters;
    };
    exports2.OAuth.prototype._performSecureRequest = function(oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type, callback) {
      var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, extra_params);
      if (!post_content_type) {
        post_content_type = "application/x-www-form-urlencoded";
      }
      var parsedUrl = URL2.parse(url, false);
      if (parsedUrl.protocol == "http:" && !parsedUrl.port) parsedUrl.port = 80;
      if (parsedUrl.protocol == "https:" && !parsedUrl.port) parsedUrl.port = 443;
      var headers = {};
      var authorization = this._buildAuthorizationHeaders(orderedParameters);
      if (this._isEcho) {
        headers["X-Verify-Credentials-Authorization"] = authorization;
      } else {
        headers["Authorization"] = authorization;
      }
      headers["Host"] = parsedUrl.host;
      for (var key in this._headers) {
        if (this._headers.hasOwnProperty(key)) {
          headers[key] = this._headers[key];
        }
      }
      for (var key in extra_params) {
        if (this._isParameterNameAnOAuthParameter(key)) {
          delete extra_params[key];
        }
      }
      if ((method == "POST" || method == "PUT") && (post_body == null && extra_params != null)) {
        post_body = querystring.stringify(extra_params).replace(/\!/g, "%21").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
      }
      if (post_body) {
        if (Buffer.isBuffer(post_body)) {
          headers["Content-length"] = post_body.length;
        } else {
          headers["Content-length"] = Buffer.byteLength(post_body);
        }
      } else {
        headers["Content-length"] = 0;
      }
      headers["Content-Type"] = post_content_type;
      var path;
      if (!parsedUrl.pathname || parsedUrl.pathname == "") parsedUrl.pathname = "/";
      if (parsedUrl.query) path = parsedUrl.pathname + "?" + parsedUrl.query;
      else path = parsedUrl.pathname;
      var request;
      if (parsedUrl.protocol == "https:") {
        request = this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers, true);
      } else {
        request = this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers);
      }
      var clientOptions = this._clientOptions;
      if (callback) {
        var data = "";
        var self2 = this;
        var allowEarlyClose = OAuthUtils.isAnEarlyCloseHost(parsedUrl.hostname);
        var callbackCalled = false;
        var passBackControl = function(response) {
          if (!callbackCalled) {
            callbackCalled = true;
            if (response.statusCode >= 200 && response.statusCode <= 299) {
              callback(null, data, response);
            } else {
              if ((response.statusCode == 301 || response.statusCode == 302) && clientOptions.followRedirects && response.headers && response.headers.location) {
                self2._performSecureRequest(oauth_token, oauth_token_secret, method, response.headers.location, extra_params, post_body, post_content_type, callback);
              } else {
                callback({ statusCode: response.statusCode, data }, data, response);
              }
            }
          }
        };
        request.on("response", function(response) {
          response.setEncoding("utf8");
          response.on("data", function(chunk) {
            data += chunk;
          });
          response.on("end", function() {
            passBackControl(response);
          });
          response.on("close", function() {
            if (allowEarlyClose) {
              passBackControl(response);
            }
          });
        });
        request.on("error", function(err) {
          if (!callbackCalled) {
            callbackCalled = true;
            callback(err);
          }
        });
        if ((method == "POST" || method == "PUT") && post_body != null && post_body != "") {
          request.write(post_body);
        }
        request.end();
      } else {
        if ((method == "POST" || method == "PUT") && post_body != null && post_body != "") {
          request.write(post_body);
        }
        return request;
      }
      return;
    };
    exports2.OAuth.prototype.setClientOptions = function(options) {
      var key, mergedOptions = {}, hasOwnProperty = Object.prototype.hasOwnProperty;
      for (key in this._defaultClientOptions) {
        if (!hasOwnProperty.call(options, key)) {
          mergedOptions[key] = this._defaultClientOptions[key];
        } else {
          mergedOptions[key] = options[key];
        }
      }
      this._clientOptions = mergedOptions;
    };
    exports2.OAuth.prototype.getOAuthAccessToken = function(oauth_token, oauth_token_secret, oauth_verifier, callback) {
      var extraParams = {};
      if (typeof oauth_verifier == "function") {
        callback = oauth_verifier;
      } else {
        extraParams.oauth_verifier = oauth_verifier;
      }
      this._performSecureRequest(oauth_token, oauth_token_secret, this._clientOptions.accessTokenHttpMethod, this._accessUrl, extraParams, null, null, function(error, data, response) {
        if (error) callback(error);
        else {
          var results = querystring.parse(data);
          var oauth_access_token = results["oauth_token"];
          delete results["oauth_token"];
          var oauth_access_token_secret = results["oauth_token_secret"];
          delete results["oauth_token_secret"];
          callback(null, oauth_access_token, oauth_access_token_secret, results);
        }
      });
    };
    exports2.OAuth.prototype.getProtectedResource = function(url, method, oauth_token, oauth_token_secret, callback) {
      this._performSecureRequest(oauth_token, oauth_token_secret, method, url, null, "", null, callback);
    };
    exports2.OAuth.prototype.delete = function(url, oauth_token, oauth_token_secret, callback) {
      return this._performSecureRequest(oauth_token, oauth_token_secret, "DELETE", url, null, "", null, callback);
    };
    exports2.OAuth.prototype.get = function(url, oauth_token, oauth_token_secret, callback) {
      return this._performSecureRequest(oauth_token, oauth_token_secret, "GET", url, null, "", null, callback);
    };
    exports2.OAuth.prototype._putOrPost = function(method, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
      var extra_params = null;
      if (typeof post_content_type == "function") {
        callback = post_content_type;
        post_content_type = null;
      }
      if (typeof post_body != "string" && !Buffer.isBuffer(post_body)) {
        post_content_type = "application/x-www-form-urlencoded";
        extra_params = post_body;
        post_body = null;
      }
      return this._performSecureRequest(oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type, callback);
    };
    exports2.OAuth.prototype.put = function(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
      return this._putOrPost("PUT", url, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
    };
    exports2.OAuth.prototype.post = function(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
      return this._putOrPost("POST", url, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
    };
    exports2.OAuth.prototype.getOAuthRequestToken = function(extraParams, callback) {
      if (typeof extraParams == "function") {
        callback = extraParams;
        extraParams = {};
      }
      if (this._authorize_callback) {
        extraParams["oauth_callback"] = this._authorize_callback;
      }
      this._performSecureRequest(null, null, this._clientOptions.requestTokenHttpMethod, this._requestUrl, extraParams, null, null, function(error, data, response) {
        if (error) callback(error);
        else {
          var results = querystring.parse(data);
          var oauth_token = results["oauth_token"];
          var oauth_token_secret = results["oauth_token_secret"];
          delete results["oauth_token"];
          delete results["oauth_token_secret"];
          callback(null, oauth_token, oauth_token_secret, results);
        }
      });
    };
    exports2.OAuth.prototype.signUrl = function(url, oauth_token, oauth_token_secret, method) {
      if (method === void 0) {
        var method = "GET";
      }
      var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, {});
      var parsedUrl = URL2.parse(url, false);
      var query = "";
      for (var i = 0; i < orderedParameters.length; i++) {
        query += orderedParameters[i][0] + "=" + this._encodeData(orderedParameters[i][1]) + "&";
      }
      query = query.substring(0, query.length - 1);
      return parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname + "?" + query;
    };
    exports2.OAuth.prototype.authHeader = function(url, oauth_token, oauth_token_secret, method) {
      if (method === void 0) {
        var method = "GET";
      }
      var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, {});
      return this._buildAuthorizationHeaders(orderedParameters);
    };
  }
});

// node_modules/oauth/lib/oauth2.js
var require_oauth2 = __commonJS({
  "node_modules/oauth/lib/oauth2.js"(exports2) {
    var querystring = require("querystring");
    var crypto = require("crypto");
    var https = require("https");
    var http = require("http");
    var URL2 = require("url");
    var OAuthUtils = require_utils();
    exports2.OAuth2 = function(clientId, clientSecret, baseSite, authorizePath, accessTokenPath, customHeaders) {
      this._clientId = clientId;
      this._clientSecret = clientSecret;
      this._baseSite = baseSite;
      this._authorizeUrl = authorizePath || "/oauth/authorize";
      this._accessTokenUrl = accessTokenPath || "/oauth/access_token";
      this._accessTokenName = "access_token";
      this._authMethod = "Bearer";
      this._customHeaders = customHeaders || {};
      this._useAuthorizationHeaderForGET = false;
      this._agent = void 0;
    };
    exports2.OAuth2.prototype.setAgent = function(agent) {
      this._agent = agent;
    };
    exports2.OAuth2.prototype.setAccessTokenName = function(name) {
      this._accessTokenName = name;
    };
    exports2.OAuth2.prototype.setAuthMethod = function(authMethod) {
      this._authMethod = authMethod;
    };
    exports2.OAuth2.prototype.useAuthorizationHeaderforGET = function(useIt) {
      this._useAuthorizationHeaderForGET = useIt;
    };
    exports2.OAuth2.prototype._getAccessTokenUrl = function() {
      return this._baseSite + this._accessTokenUrl;
    };
    exports2.OAuth2.prototype.buildAuthHeader = function(token) {
      return this._authMethod + " " + token;
    };
    exports2.OAuth2.prototype._chooseHttpLibrary = function(parsedUrl) {
      var http_library = https;
      if (parsedUrl.protocol != "https:") {
        http_library = http;
      }
      return http_library;
    };
    exports2.OAuth2.prototype._request = function(method, url, headers, post_body, access_token, callback) {
      var parsedUrl = URL2.parse(url, true);
      if (parsedUrl.protocol == "https:" && !parsedUrl.port) {
        parsedUrl.port = 443;
      }
      var http_library = this._chooseHttpLibrary(parsedUrl);
      var realHeaders = {};
      for (var key in this._customHeaders) {
        realHeaders[key] = this._customHeaders[key];
      }
      if (headers) {
        for (var key in headers) {
          realHeaders[key] = headers[key];
        }
      }
      realHeaders["Host"] = parsedUrl.host;
      if (!realHeaders["User-Agent"]) {
        realHeaders["User-Agent"] = "Node-oauth";
      }
      if (post_body) {
        if (Buffer.isBuffer(post_body)) {
          realHeaders["Content-Length"] = post_body.length;
        } else {
          realHeaders["Content-Length"] = Buffer.byteLength(post_body);
        }
      } else {
        realHeaders["Content-length"] = 0;
      }
      if (access_token && !("Authorization" in realHeaders)) {
        if (!parsedUrl.query) parsedUrl.query = {};
        parsedUrl.query[this._accessTokenName] = access_token;
      }
      var queryStr = querystring.stringify(parsedUrl.query);
      if (queryStr) queryStr = "?" + queryStr;
      var options = {
        host: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + queryStr,
        method,
        headers: realHeaders
      };
      this._executeRequest(http_library, options, post_body, callback);
    };
    exports2.OAuth2.prototype._executeRequest = function(http_library, options, post_body, callback) {
      var allowEarlyClose = OAuthUtils.isAnEarlyCloseHost(options.host);
      var callbackCalled = false;
      function passBackControl(response, result2) {
        if (!callbackCalled) {
          callbackCalled = true;
          if (!(response.statusCode >= 200 && response.statusCode <= 299) && response.statusCode != 301 && response.statusCode != 302) {
            callback({ statusCode: response.statusCode, data: result2 });
          } else {
            callback(null, result2, response);
          }
        }
      }
      var result = "";
      if (this._agent) {
        options.agent = this._agent;
      }
      var request = http_library.request(options);
      request.on("response", function(response) {
        response.on("data", function(chunk) {
          result += chunk;
        });
        response.on("close", function(err) {
          if (allowEarlyClose) {
            passBackControl(response, result);
          }
        });
        response.addListener("end", function() {
          passBackControl(response, result);
        });
      });
      request.on("error", function(e) {
        if (!callbackCalled) {
          callbackCalled = true;
          callback(e);
        }
      });
      if ((options.method == "POST" || options.method == "PUT") && post_body) {
        request.write(post_body);
      }
      request.end();
    };
    exports2.OAuth2.prototype.getAuthorizeUrl = function(params) {
      var params = params || {};
      params["client_id"] = this._clientId;
      return this._baseSite + this._authorizeUrl + "?" + querystring.stringify(params);
    };
    exports2.OAuth2.prototype.getOAuthAccessToken = function(code, params, callback) {
      var params = params || {};
      params["client_id"] = this._clientId;
      params["client_secret"] = this._clientSecret;
      var codeParam = params.grant_type === "refresh_token" ? "refresh_token" : "code";
      params[codeParam] = code;
      var post_data = querystring.stringify(params);
      var post_headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      this._request("POST", this._getAccessTokenUrl(), post_headers, post_data, null, function(error, data, response) {
        if (error) callback(error);
        else {
          var results;
          try {
            results = JSON.parse(data);
          } catch (e) {
            results = querystring.parse(data);
          }
          var access_token = results["access_token"];
          var refresh_token = results["refresh_token"];
          delete results["refresh_token"];
          callback(null, access_token, refresh_token, results);
        }
      });
    };
    exports2.OAuth2.prototype.getProtectedResource = function(url, access_token, callback) {
      this._request("GET", url, {}, "", access_token, callback);
    };
    exports2.OAuth2.prototype.get = function(url, access_token, callback) {
      if (this._useAuthorizationHeaderForGET) {
        var headers = { "Authorization": this.buildAuthHeader(access_token) };
        access_token = null;
      } else {
        headers = {};
      }
      this._request("GET", url, headers, "", access_token, callback);
    };
  }
});

// node_modules/oauth/index.js
var require_oauth3 = __commonJS({
  "node_modules/oauth/index.js"(exports2) {
    exports2.OAuth = require_oauth().OAuth;
    exports2.OAuthEcho = require_oauth().OAuthEcho;
    exports2.OAuth2 = require_oauth2().OAuth2;
  }
});

// src/action/run.ts
var import_promises = require("node:fs/promises");
var import_node_path = require("node:path");

// src/github/releases.ts
var GITHUB_API_ORIGIN = "https://api.github.com";
var GITHUB_API_VERSION = "2026-03-10";
function repositoryParts(repository) {
  const match = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/.exec(repository);
  if (!match?.[1] || !match[2]) throw new Error("GitHub repository must use owner/name.");
  return { owner: match[1], name: match[2] };
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function requiredString(value, name) {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`GitHub returned invalid ${name}.`);
  return value;
}
function requiredInteger(value, name) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`GitHub returned invalid ${name}.`);
  }
  return value;
}
function visibilityFor(repository) {
  if (repository.private === true) return "private";
  if (repository.visibility === "internal") return "internal";
  return "public";
}
var GitHubReleaseReader = class {
  token;
  fetcher;
  constructor(options) {
    if (options.token.trim() === "") throw new Error("GitHub token must not be empty.");
    this.token = options.token;
    this.fetcher = options.fetch ?? fetch;
  }
  async read(request) {
    const { owner, name } = repositoryParts(request.repository);
    const repository = await this.getJson(`/repos/${owner}/${name}`, "repository");
    const release = await this.getJson(`/repos/${owner}/${name}/releases/${request.releaseId}`, "release");
    const repositoryId = requiredInteger(repository.id, "repository ID");
    const fullName = requiredString(repository.full_name, "repository full_name");
    if (fullName.toLowerCase() !== request.repository.toLowerCase()) {
      throw new Error("GitHub repository identity did not match the requested repository.");
    }
    const releaseId = requiredInteger(release.id, "release ID");
    if (releaseId !== request.releaseId)
      throw new Error("GitHub release identity did not match the requested release ID.");
    const body = release.body;
    if (body !== null && typeof body !== "string") throw new Error("GitHub returned invalid release body.");
    return {
      repositoryId,
      repository: fullName,
      releaseId,
      tag: requiredString(release.tag_name, "release tag"),
      releaseUrl: requiredString(release.html_url, "release URL"),
      body: body ?? "",
      draft: release.draft === true,
      prerelease: release.prerelease === true,
      visibility: visibilityFor(repository)
    };
  }
  async getJson(path, operation) {
    const url = new URL(path, GITHUB_API_ORIGIN);
    if (url.origin !== GITHUB_API_ORIGIN) throw new Error("GitHub release request escaped the official API host.");
    const headers = new Headers();
    headers.set("accept", "application/vnd.github+json");
    headers.set("authorization", `Bearer ${this.token}`);
    headers.set("x-github-api-version", GITHUB_API_VERSION);
    let response;
    try {
      response = await this.fetcher(url, { method: "GET", headers, redirect: "manual" });
    } catch {
      throw new Error(`GitHub ${operation} request failed.`);
    }
    if (response.status >= 300 && response.status < 400) {
      throw new Error(`GitHub ${operation} request refused a redirect.`);
    }
    if (response.status !== 200) throw new Error(`GitHub ${operation} request failed with HTTP ${response.status}.`);
    let parsed;
    try {
      parsed = await response.json();
    } catch {
      throw new Error(`GitHub returned malformed ${operation} JSON.`);
    }
    if (!isRecord(parsed)) throw new Error(`GitHub returned malformed ${operation} metadata.`);
    return parsed;
  }
};

// src/core/errors.ts
function isValidationIssueArray(value) {
  return Array.isArray(value);
}
var ReleaseSocialValidationError = class extends Error {
  issues;
  constructor(issue) {
    const issues = isValidationIssueArray(issue) ? issue : [issue];
    super(issues.map((item) => `${item.path}: ${item.message}`).join("; "));
    this.name = "ReleaseSocialValidationError";
    this.issues = issues;
  }
};
function validationError(code, path, message) {
  throw new ReleaseSocialValidationError({ code, path, message });
}

// src/core/config.ts
function isRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function assertRecord(value, path) {
  if (!isRecord2(value)) {
    validationError("invalid_object", path, "must be an object");
  }
  return value;
}
function assertExactKeys(value, allowed, path) {
  const allowedSet = new Set(allowed);
  const unknown = Object.keys(value).filter((key) => !allowedSet.has(key));
  if (unknown.length > 0) {
    validationError("unknown_field", path, `contains unsupported field(s): ${unknown.join(", ")}`);
  }
}
function parseTextVariant(value, path) {
  if (value === void 0) return void 0;
  if (value !== "short" && value !== "announcement") {
    validationError("invalid_text_variant", path, 'must be "short" or "announcement"');
  }
  return value;
}
function parseMissingAuthored(value) {
  if (value === void 0) return void 0;
  if (value !== "github-release-notes" && value !== "error" && value !== "skip") {
    validationError(
      "invalid_missing_authored_mode",
      "$.content.missingAuthored",
      'must be "github-release-notes", "error", or "skip"'
    );
  }
  return value;
}
function parseContent(value) {
  const record = assertRecord(value, "$.content");
  assertExactKeys(record, ["missingAuthored"], "$.content");
  const missingAuthored = parseMissingAuthored(record.missingAuthored);
  return missingAuthored === void 0 ? {} : { missingAuthored };
}
function parseX(value) {
  const record = assertRecord(value, "$.destinations.x");
  assertExactKeys(record, ["accountId", "text"], "$.destinations.x");
  if (typeof record.accountId !== "string" || !/^\d+$/.test(record.accountId)) {
    validationError(
      "invalid_x_account_id",
      "$.destinations.x.accountId",
      "must be a numeric user ID encoded as a string"
    );
  }
  const text = parseTextVariant(record.text, "$.destinations.x.text");
  return text === void 0 ? { accountId: record.accountId } : { accountId: record.accountId, text };
}
function parseApiVersion(value) {
  if (typeof value !== "string" || !/^\d{6}$/.test(value)) {
    validationError("invalid_linkedin_api_version", "$.destinations.linkedin.apiVersion", "must use YYYYMM");
  }
  const month = Number(value.slice(4));
  if (month < 1 || month > 12) {
    validationError("invalid_linkedin_api_version", "$.destinations.linkedin.apiVersion", "contains an invalid month");
  }
  return value;
}
function parseLinkedIn(value) {
  const record = assertRecord(value, "$.destinations.linkedin");
  assertExactKeys(record, ["author", "apiVersion", "text"], "$.destinations.linkedin");
  if (typeof record.author !== "string" || !/^urn:li:person:[^\s:]+$/.test(record.author)) {
    validationError("invalid_linkedin_author", "$.destinations.linkedin.author", "must match urn:li:person:...");
  }
  const apiVersion = parseApiVersion(record.apiVersion);
  const text = parseTextVariant(record.text, "$.destinations.linkedin.text");
  return text === void 0 ? { author: record.author, apiVersion } : { author: record.author, apiVersion, text };
}
function parseReleaseSocialConfig(input2) {
  const root = assertRecord(input2, "$");
  assertExactKeys(root, ["version", "content", "destinations"], "$");
  if (root.version !== 1) {
    validationError("unsupported_config_version", "$.version", "must be 1");
  }
  const destinations = assertRecord(root.destinations, "$.destinations");
  assertExactKeys(destinations, ["x", "linkedin"], "$.destinations");
  if (Object.keys(destinations).length === 0) {
    validationError("empty_destinations", "$.destinations", "must configure x and/or linkedin");
  }
  const parsed = {};
  if ("x" in destinations) parsed.x = parseX(destinations.x);
  if ("linkedin" in destinations) parsed.linkedin = parseLinkedIn(destinations.linkedin);
  const content = root.content === void 0 ? void 0 : parseContent(root.content);
  return content === void 0 ? { version: 1, destinations: parsed } : { version: 1, content, destinations: parsed };
}

// src/core/release-notes.ts
var VERSION_MARKER = "<!-- release-social:v1 -->";
var ANNOUNCEMENT_START = "<!-- announcement:start -->";
var ANNOUNCEMENT_END = "<!-- announcement:end -->";
var SKIP_MARKER = "<!-- social:skip -->";
function normalizeLineEndings(value) {
  return value.replace(/\r\n?/g, "\n");
}
function trimBoundaryWhitespace(value) {
  return value.trim();
}
function getFenceRanges(text) {
  const ranges = [];
  const lines = text.split("\n");
  let offset = 0;
  let open;
  for (const line of lines) {
    const match = /^\s*(`{3,}|~{3,})/.exec(line);
    if (match?.[1]) {
      const marker = match[1];
      const character = marker[0];
      if (open === void 0) {
        open = { start: offset, character, length: marker.length };
      } else if (character === open.character && marker.length >= open.length) {
        ranges.push({ start: open.start, end: offset + line.length });
        open = void 0;
      }
    }
    offset += line.length + 1;
  }
  if (open !== void 0) {
    ranges.push({ start: open.start, end: text.length });
  }
  return ranges;
}
function scanComments(text) {
  const starts = text.match(/<!--/g)?.length ?? 0;
  const tokens = [];
  const expression = /<!--[\s\S]*?-->/g;
  for (const match of text.matchAll(expression)) {
    if (match.index === void 0) continue;
    tokens.push({ start: match.index, end: match.index + match[0].length, raw: match[0] });
  }
  if (starts !== tokens.length) {
    validationError(
      "malformed_comment",
      "$.releaseNotes",
      "contains an unclosed or nested HTML comment; reserved markers must be complete and non-nested"
    );
  }
  return tokens;
}
function isInside(position, ranges) {
  return ranges.some((range) => position >= range.start && position <= range.end);
}
function isReservedComment(raw) {
  const inner = raw.slice(4, -3).trimStart();
  return inner.startsWith("release-social:") || inner.startsWith("announcement:") || inner.startsWith("social:");
}
function validatePlainText(value, path) {
  const text = trimBoundaryWhitespace(value);
  if (text === "") validationError("empty_prose", path, "must contain non-empty plain text");
  if (/\n[\t ]*\n/.test(text)) {
    validationError("multiple_paragraphs", path, "must contain exactly one paragraph");
  }
  if (/(^|\n)\s*(#{1,6}\s|[-+*]\s|>\s|\d+[.)]\s|```|~~~)/.test(text)) {
    validationError("markdown_in_prose", path, "must be plain text, not a Markdown block");
  }
  if (/`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|!?\[[^\]]+\]\([^)]*\)|<\/?[A-Za-z][^>]*>/.test(text)) {
    validationError("markup_in_prose", path, "must be plain text, not HTML or inline Markdown");
  }
  if (text.includes("\0")) validationError("invalid_prose", path, "must not contain NUL bytes");
  return text;
}
function findVisibleH2(text, fences, comments) {
  const headings = [];
  const lines = text.split("\n");
  let offset = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
      if (!isInside(offset, fences) && !isInside(offset, comments)) {
        headings.push({ title: trimmed.slice(3).trim(), start: offset, contentStart: offset + line.length + 1 });
      }
    }
    offset += line.length + 1;
  }
  return headings;
}
function sectionContent(text, heading, allHeadings) {
  const next = allHeadings.find((candidate) => candidate.start > heading.start);
  const end = next?.start ?? text.length;
  return text.slice(heading.contentStart, end).replace(/<!--[\s\S]*?-->/g, "").trim();
}
function inspectReleaseNotesContent(input2) {
  const text = normalizeLineEndings(input2);
  if (!/<!--\s*(?:release-social:|announcement:|social:)/.test(text)) return "missing";
  const fences = getFenceRanges(text);
  const comments = scanComments(text);
  const reserved = comments.filter((comment) => isReservedComment(comment.raw));
  for (const comment of reserved) {
    if (isInside(comment.start, fences)) {
      validationError(
        "marker_in_fence",
        "$.releaseNotes",
        "reserved release-social markers are not allowed inside fenced code"
      );
    }
  }
  const skipCount = reserved.filter((comment) => comment.raw === SKIP_MARKER).length;
  if (skipCount > 1) {
    validationError("duplicate_skip_marker", "$.releaseNotes", "must not contain more than one social:skip marker");
  }
  if (reserved.length === 1 && skipCount === 1) return "skip";
  return "authored";
}
function parseReleaseNotes(input2) {
  const text = normalizeLineEndings(input2);
  if (!text.startsWith(VERSION_MARKER)) {
    validationError("missing_version_marker", "$.releaseNotes", `must begin exactly with ${VERSION_MARKER}`);
  }
  const fences = getFenceRanges(text);
  const comments = scanComments(text);
  const supportedStandalone = /* @__PURE__ */ new Set([VERSION_MARKER, ANNOUNCEMENT_START, ANNOUNCEMENT_END, SKIP_MARKER]);
  const counts = /* @__PURE__ */ new Map();
  const socialBlocks = {};
  for (const comment of comments) {
    if (!isReservedComment(comment.raw)) continue;
    if (isInside(comment.start, fences)) {
      validationError(
        "marker_in_fence",
        "$.releaseNotes",
        "reserved release-social markers are not allowed inside fenced code"
      );
    }
    if (supportedStandalone.has(comment.raw)) {
      counts.set(comment.raw, (counts.get(comment.raw) ?? 0) + 1);
      continue;
    }
    const block = /^<!-- social:(short|x|linkedin)\n([\s\S]*?)\n?-->$/.exec(comment.raw);
    if (block?.[1] && block[2] !== void 0) {
      const name = block[1];
      if (socialBlocks[name] !== void 0) {
        validationError("duplicate_social_block", "$.releaseNotes", `contains more than one social:${name} block`);
      }
      socialBlocks[name] = validatePlainText(block[2], `$.releaseNotes.social.${name}`);
      continue;
    }
    validationError(
      "unsupported_reserved_marker",
      "$.releaseNotes",
      `contains malformed or unsupported reserved marker: ${comment.raw.split("\n", 1)[0] ?? comment.raw}`
    );
  }
  if ((counts.get(VERSION_MARKER) ?? 0) !== 1) {
    validationError("duplicate_version_marker", "$.releaseNotes", "must contain exactly one release-social:v1 marker");
  }
  if ((counts.get(ANNOUNCEMENT_START) ?? 0) !== 1 || (counts.get(ANNOUNCEMENT_END) ?? 0) !== 1) {
    validationError(
      "announcement_marker_count",
      "$.releaseNotes",
      "must contain exactly one announcement:start and announcement:end marker"
    );
  }
  if ((counts.get(SKIP_MARKER) ?? 0) > 1) {
    validationError("duplicate_skip_marker", "$.releaseNotes", "must not contain more than one social:skip marker");
  }
  if (socialBlocks.short === void 0) {
    validationError("missing_short_block", "$.releaseNotes", "must contain exactly one non-empty social:short block");
  }
  const start = text.indexOf(ANNOUNCEMENT_START);
  const end = text.indexOf(ANNOUNCEMENT_END);
  if (start >= end) {
    validationError("announcement_order", "$.releaseNotes", "announcement:start must occur before announcement:end");
  }
  const announcement = validatePlainText(
    text.slice(start + ANNOUNCEMENT_START.length, end),
    "$.releaseNotes.announcement"
  );
  const headings = findVisibleH2(text, fences, comments);
  const highlights = headings.filter((heading) => heading.title === "Highlights");
  const upgradeNotes = headings.filter((heading) => heading.title === "Upgrade notes");
  if (highlights.length !== 1) {
    validationError(
      "highlights_section_count",
      "$.releaseNotes",
      "must contain exactly one visible ## Highlights section"
    );
  }
  if (upgradeNotes.length !== 1) {
    validationError(
      "upgrade_notes_section_count",
      "$.releaseNotes",
      "must contain exactly one visible ## Upgrade notes section"
    );
  }
  const highlightsHeading = highlights[0];
  const upgradeHeading = upgradeNotes[0];
  if (highlightsHeading === void 0 || upgradeHeading === void 0) {
    validationError("missing_sections", "$.releaseNotes", "required sections are missing");
  }
  if (highlightsHeading.start >= upgradeHeading.start) {
    validationError("section_order", "$.releaseNotes", "## Highlights must appear before ## Upgrade notes");
  }
  const highlightsText = sectionContent(text, highlightsHeading, headings);
  const upgradeText = sectionContent(text, upgradeHeading, headings);
  if (highlightsText === "") {
    validationError("empty_highlights", "$.releaseNotes", "## Highlights must retain technical release details");
  }
  if (upgradeText === "") {
    validationError(
      "empty_upgrade_notes",
      "$.releaseNotes",
      "## Upgrade notes must describe upgrade impact or state that there are no breaking changes"
    );
  }
  const overrides = {};
  if (socialBlocks.x !== void 0) overrides.x = socialBlocks.x;
  if (socialBlocks.linkedin !== void 0) overrides.linkedin = socialBlocks.linkedin;
  return {
    announcement,
    short: socialBlocks.short,
    overrides,
    highlights: highlightsText,
    upgradeNotes: upgradeText,
    skip: (counts.get(SKIP_MARKER) ?? 0) === 1
  };
}

// src/core/render.ts
var import_node_crypto2 = require("node:crypto");

// src/core/fallback.ts
var import_node_crypto = require("node:crypto");

// src/core/platform-text.ts
var import_twitter_text = __toESM(require_dist2(), 1);
var { parseTweet } = import_twitter_text.default;
var X_MAX_WEIGHTED_LENGTH = 280;
var LINKEDIN_COMMENTARY_MAX_CHARACTERS = 3e3;
var LINKEDIN_RESERVED_CHARACTERS = /* @__PURE__ */ new Set([
  "|",
  "{",
  "}",
  "@",
  "[",
  "]",
  "(",
  ")",
  "<",
  ">",
  "#",
  "\\",
  "*",
  "_",
  "~"
]);
function measureXText(value) {
  const parsed = parseTweet(value);
  return {
    valid: parsed.valid && parsed.weightedLength <= X_MAX_WEIGHTED_LENGTH,
    weightedLength: parsed.weightedLength
  };
}
function escapeLinkedInCommentary(value) {
  let escaped = "";
  for (const character of value) {
    escaped += LINKEDIN_RESERVED_CHARACTERS.has(character) ? `\\${character}` : character;
  }
  return escaped;
}
function linkedInCharacterLength(value) {
  return Array.from(value).length;
}
function measureLinkedInText(value) {
  const commentary = escapeLinkedInCommentary(value);
  const sourceLength = linkedInCharacterLength(value);
  const encodedLength = linkedInCharacterLength(commentary);
  return {
    valid: sourceLength <= LINKEDIN_COMMENTARY_MAX_CHARACTERS && encodedLength <= LINKEDIN_COMMENTARY_MAX_CHARACTERS,
    sourceLength,
    encodedLength,
    commentary
  };
}
function destinationTextFits(destination, value) {
  return destination === "x" ? measureXText(value).valid : measureLinkedInText(value).valid;
}

// src/core/fallback.ts
var FENCE_PATTERN = /^\s*(`{3,}|~{3,})/;
var HTML_BLOCK_PATTERN = /<(script|style|iframe|object|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
var HTML_COMMENT_PATTERN = /<!--[\s\S]*?-->/g;
var MARKDOWN_LINK_PATTERN = /!?\[([^\]]*)\]\((?:[^()]|\([^)]*\))*\)/g;
var BARE_URL_PATTERN = /\bhttps?:\/\/[^\s)\]>]+/gi;
var MENTION_PATTERN = /@([A-Za-z0-9_][A-Za-z0-9_-]*)/g;
function normalizeLineEndings2(value) {
  return value.replace(/\r\n?/g, "\n");
}
function stripFencedCode(value) {
  const output = [];
  let fence;
  for (const line of value.split("\n")) {
    const match = FENCE_PATTERN.exec(line);
    if (match?.[1]) {
      const marker = match[1];
      const character = marker[0];
      if (fence === void 0) {
        fence = { character, length: marker.length };
        continue;
      }
      if (character === fence.character && marker.length >= fence.length) {
        fence = void 0;
      }
      continue;
    }
    if (fence === void 0) output.push(line);
  }
  return output.join("\n");
}
function neutralizeMentions(value) {
  return value.replace(MENTION_PATTERN, "$1");
}
function cleanInlineMarkdown(value) {
  return neutralizeMentions(
    value.replace(MARKDOWN_LINK_PATTERN, "$1").replace(BARE_URL_PATTERN, "").replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/__([^_]+)__/g, "$1").replace(/~~([^~]+)~~/g, "$1").replace(/[*_~]/g, "").replace(/\\([\\`*{}[\]()#+\-.!_>])/g, "$1").replace(/\s+/g, " ").trim()
  );
}
function isBoilerplateHeading(value) {
  const normalized = value.toLowerCase();
  return normalized === "what's changed" || normalized === "whats changed" || normalized === "new contributors" || normalized === "contributors" || normalized === "full changelog" || normalized === "changelog";
}
function isBoilerplateLine(value) {
  return /^full changelog\s*:/i.test(value) || /github\.com\/[^\s]+\/compare\//i.test(value) || /\bmade (?:his|her|their) first contribution\b/i.test(value);
}
function cleanChangeLine(value) {
  let cleaned = value.replace(/^\s*(?:[-+*]|\d+[.)])\s+/, "").replace(/\s+by\s+@[A-Za-z0-9_-]+\s+in\s+https?:\/\/\S+\s*$/i, "").replace(/\s+by\s+@[A-Za-z0-9_-]+\s*$/i, "");
  cleaned = cleanInlineMarkdown(cleaned);
  return cleaned;
}
function sentenceEntries(value) {
  const trimmed = value.trim();
  if (trimmed === "") return [];
  const matches = trimmed.match(/[^.!?]+(?:[.!?]+|$)/g) ?? [trimmed];
  return matches.map((entry) => entry.trim()).filter((entry) => entry !== "");
}
function extractGitHubReleaseChangeEntries(body) {
  const normalized = normalizeLineEndings2(body).replace(HTML_BLOCK_PATTERN, "").replace(HTML_COMMENT_PATTERN, "");
  const withoutCode = stripFencedCode(normalized);
  const entries = [];
  let skipContributorSection = false;
  for (const rawLine of withoutCode.split("\n")) {
    const trimmed = rawLine.trim();
    if (trimmed === "") continue;
    if (/^<\/?[A-Za-z][^>]*>/.test(trimmed) || /<\/?[A-Za-z][^>]*>/.test(trimmed)) {
      continue;
    }
    const heading = /^#{1,6}\s+(.+)$/.exec(trimmed);
    if (heading?.[1]) {
      const headingText = cleanInlineMarkdown(heading[1]);
      skipContributorSection = headingText.toLowerCase() === "new contributors" || headingText.toLowerCase() === "contributors";
      continue;
    }
    if (skipContributorSection) continue;
    if (isBoilerplateLine(trimmed)) continue;
    const cleaned = cleanChangeLine(trimmed);
    if (cleaned === "" || isBoilerplateHeading(cleaned)) continue;
    const isListItem = /^\s*(?:[-+*]|\d+[.)])\s+/.test(rawLine);
    if (isListItem) {
      entries.push(cleaned);
      continue;
    }
    entries.push(...sentenceEntries(cleaned));
  }
  return entries;
}
function fallbackContentDigest(body) {
  return (0, import_node_crypto.createHash)("sha256").update(normalizeLineEndings2(body), "utf8").digest("hex");
}
function neutralIntroduction(source) {
  return neutralizeMentions(`${source.repository} ${source.tag} is available.`);
}
function renderGitHubReleaseNotesFallback(destination, source) {
  const introduction = neutralIntroduction(source);
  const introductionText = `${introduction}

${source.releaseUrl}`;
  if (!destinationTextFits(destination, introductionText)) {
    validationError(
      "fallback_metadata_overflow",
      "$.source",
      `repository/tag metadata plus the canonical release URL cannot fit the ${destination} text limit`
    );
  }
  const entries = extractGitHubReleaseChangeEntries(source.body);
  let prose = introduction;
  let includedEntries = 0;
  for (const entry of entries) {
    const candidate = `${prose} ${entry}`;
    if (destinationTextFits(destination, `${candidate}

${source.releaseUrl}`)) {
      prose = candidate;
      includedEntries += 1;
    }
  }
  const omittedEntries = entries.length - includedEntries;
  const omissionReason = entries.length === 0 ? source.body.trim() === "" ? "empty_body" : "no_useful_content" : omittedEntries > 0 ? "budget" : "none";
  return {
    prose,
    textSource: {
      kind: "github_release_notes",
      contentDigest: fallbackContentDigest(source.body),
      includedEntries,
      omittedEntries,
      omissionReason
    }
  };
}

// src/core/source.ts
function isRecord3(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function requireRecord(value) {
  if (!isRecord3(value)) validationError("invalid_source", "$.source", "must be an object");
  return value;
}
function assertExactKeys2(value) {
  const allowed = /* @__PURE__ */ new Set([
    "repositoryId",
    "repository",
    "releaseId",
    "tag",
    "releaseUrl",
    "body",
    "draft",
    "prerelease",
    "visibility"
  ]);
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length > 0) {
    validationError("unknown_source_field", "$.source", `contains unsupported field(s): ${unknown.join(", ")}`);
  }
}
function parsePositiveSafeInteger(value, path) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    validationError("invalid_numeric_id", path, "must be a positive safe integer");
  }
  return value;
}
function parseVisibility(value) {
  if (value !== "public" && value !== "private" && value !== "internal") {
    validationError("invalid_visibility", "$.source.visibility", "must be public, private, or internal");
  }
  return value;
}
function validateReleaseUrl(repository, tag, value) {
  if (typeof value !== "string") {
    validationError("invalid_release_url", "$.source.releaseUrl", "must be a canonical public GitHub release URL");
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    validationError("invalid_release_url", "$.source.releaseUrl", "must be a valid URL");
  }
  if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username !== "" || url.password !== "" || url.search !== "" || url.hash !== "") {
    validationError(
      "invalid_release_url",
      "$.source.releaseUrl",
      "must be an https://github.com release URL without credentials, query, or fragment"
    );
  }
  const prefix = `/${repository}/releases/tag/`;
  if (!url.pathname.startsWith(prefix)) {
    validationError(
      "release_url_mismatch",
      "$.source.releaseUrl",
      "must belong to the source repository and use /releases/tag/<tag>"
    );
  }
  const encodedTag = url.pathname.slice(prefix.length);
  let decodedTag;
  try {
    decodedTag = decodeURIComponent(encodedTag);
  } catch {
    validationError("invalid_release_url", "$.source.releaseUrl", "contains an invalid encoded tag");
  }
  if (decodedTag !== tag) {
    validationError("release_url_mismatch", "$.source.releaseUrl", "tag does not match the canonical source tag");
  }
  return value;
}
function validateCanonicalSource(input2) {
  const record = requireRecord(input2);
  assertExactKeys2(record);
  const repositoryId = parsePositiveSafeInteger(record.repositoryId, "$.source.repositoryId");
  const releaseId = parsePositiveSafeInteger(record.releaseId, "$.source.releaseId");
  if (typeof record.repository !== "string" || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(record.repository)) {
    validationError("invalid_repository", "$.source.repository", "must use owner/name");
  }
  if (typeof record.tag !== "string" || record.tag.trim() === "") {
    validationError("invalid_tag", "$.source.tag", "must be a non-empty string");
  }
  if (typeof record.body !== "string") {
    validationError("invalid_body", "$.source.body", "must be a string");
  }
  if (typeof record.draft !== "boolean") {
    validationError("invalid_draft_flag", "$.source.draft", "must be boolean");
  }
  if (typeof record.prerelease !== "boolean") {
    validationError("invalid_prerelease_flag", "$.source.prerelease", "must be boolean");
  }
  const visibility = parseVisibility(record.visibility);
  const releaseUrl = validateReleaseUrl(record.repository, record.tag, record.releaseUrl);
  return {
    repositoryId,
    repository: record.repository,
    releaseId,
    tag: record.tag,
    releaseUrl,
    body: record.body,
    draft: record.draft,
    prerelease: record.prerelease,
    visibility
  };
}
function getSourceSkipReason(source) {
  if (source.draft) return "draft_release";
  if (source.prerelease) return "prerelease_release";
  if (source.visibility !== "public") return "source_not_public";
  return void 0;
}
function sourceIdentity(source) {
  return {
    repositoryId: source.repositoryId,
    repository: source.repository,
    releaseId: source.releaseId,
    tag: source.tag,
    releaseUrl: source.releaseUrl
  };
}

// src/core/types.ts
var DESTINATIONS = ["x", "linkedin"];

// src/core/render.ts
var PROVIDER_DEFAULT = {
  x: "short",
  linkedin: "announcement"
};
function isRecord4(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function exactKeys(record, allowed, path) {
  const expected = new Set(allowed);
  const unknown = Object.keys(record).filter((key) => !expected.has(key));
  const missing = allowed.filter((key) => !(key in record));
  if (unknown.length > 0 || missing.length > 0) {
    validationError(
      "invalid_plan_shape",
      path,
      `must contain exactly ${allowed.join(", ")}${unknown.length > 0 ? `; unsupported: ${unknown.join(", ")}` : ""}${missing.length > 0 ? `; missing: ${missing.join(", ")}` : ""}`
    );
  }
}
function assertNoExternalLink(prose, path) {
  if (/\b(?:https?:\/\/|www\.)/i.test(prose)) {
    validationError(
      "prose_contains_link",
      path,
      "must not contain links; the canonical GitHub release URL is appended by the renderer"
    );
  }
}
function accountIdentity(destination, config) {
  if (destination === "x") {
    const x = config.destinations.x;
    if (x === void 0) validationError("missing_destination_config", "$.destinations.x", "is not configured");
    return { destination: "x", accountId: x.accountId };
  }
  const linkedin = config.destinations.linkedin;
  if (linkedin === void 0) {
    validationError("missing_destination_config", "$.destinations.linkedin", "is not configured");
  }
  return {
    destination: "linkedin",
    author: linkedin.author,
    apiVersion: linkedin.apiVersion
  };
}
function configuredVariant(destination, config) {
  return destination === "x" ? config.destinations.x?.text : config.destinations.linkedin?.text;
}
function selectText(destination, config, notes) {
  const override = notes.overrides[destination];
  if (override !== void 0) return { prose: override, textSource: { kind: "provider_override" } };
  const configured = configuredVariant(destination, config);
  if (configured !== void 0) {
    return {
      prose: configured === "short" ? notes.short : notes.announcement,
      textSource: { kind: "configured_variant", variant: configured }
    };
  }
  const fallback = PROVIDER_DEFAULT[destination];
  return {
    prose: fallback === "short" ? notes.short : notes.announcement,
    textSource: { kind: "provider_default", variant: fallback }
  };
}
function digestFor(plan) {
  const account = plan.account.destination === "x" ? { destination: "x", accountId: plan.account.accountId } : {
    destination: "linkedin",
    author: plan.account.author,
    apiVersion: plan.account.apiVersion
  };
  const canonical = {
    schema: "release-social-plan:v1",
    version: plan.version,
    destination: plan.destination,
    account,
    textSource: plan.textSource,
    source: {
      repositoryId: plan.source.repositoryId,
      repository: plan.source.repository,
      releaseId: plan.source.releaseId,
      tag: plan.source.tag,
      releaseUrl: plan.source.releaseUrl
    },
    text: plan.text
  };
  return (0, import_node_crypto2.createHash)("sha256").update(JSON.stringify(canonical), "utf8").digest("hex");
}
function renderFallbackDestination(destination, config, source) {
  const selection = renderGitHubReleaseNotesFallback(destination, source);
  const prose = selection.prose.replace(/\r\n?/g, "\n").trim();
  assertNoExternalLink(prose, `$.releaseNotes.fallback.${destination}`);
  const text = `${prose}

${source.releaseUrl}`;
  const planWithoutDigest = {
    version: 1,
    destination,
    account: accountIdentity(destination, config),
    textSource: selection.textSource,
    text,
    source: sourceIdentity(source)
  };
  return { ...planWithoutDigest, digest: digestFor(planWithoutDigest) };
}
function renderDestination(destination, config, notes, source) {
  const selection = selectText(destination, config, notes);
  const prose = selection.prose.replace(/\r\n?/g, "\n").trim();
  assertNoExternalLink(prose, `$.releaseNotes.social.${destination}`);
  const text = `${prose}

${source.releaseUrl}`;
  const planWithoutDigest = {
    version: 1,
    destination,
    account: accountIdentity(destination, config),
    textSource: selection.textSource,
    text,
    source: sourceIdentity(source)
  };
  return { ...planWithoutDigest, digest: digestFor(planWithoutDigest) };
}
function createReleasePlan(sourceInput, configInput) {
  const config = parseReleaseSocialConfig(configInput);
  const source = validateCanonicalSource(sourceInput);
  const sourceSkip = getSourceSkipReason(source);
  if (sourceSkip !== void 0) return { status: "skipped", reason: sourceSkip };
  const contentState = inspectReleaseNotesContent(source.body);
  if (contentState === "skip") return { status: "skipped", reason: "announcement_opt_out" };
  if (contentState === "missing") {
    const mode = config.content?.missingAuthored ?? "github-release-notes";
    if (mode === "error") {
      validationError(
        "authored_content_missing",
        "$.releaseNotes",
        "authored release-social sections are absent and content.missingAuthored is set to error"
      );
    }
    if (mode === "skip") return { status: "skipped", reason: "authored_content_missing" };
    const fallbackPlans = [];
    for (const destination of DESTINATIONS) {
      if (config.destinations[destination] !== void 0) {
        fallbackPlans.push(renderFallbackDestination(destination, config, source));
      }
    }
    return { status: "ready", plans: fallbackPlans };
  }
  const notes = parseReleaseNotes(source.body);
  if (notes.skip) return { status: "skipped", reason: "announcement_opt_out" };
  const plans = [];
  for (const destination of DESTINATIONS) {
    if (config.destinations[destination] !== void 0) {
      plans.push(renderDestination(destination, config, notes, source));
    }
  }
  return { status: "ready", plans };
}
function parseIdentity(input2) {
  if (!isRecord4(input2)) validationError("invalid_plan_source", "$.plan.source", "must be an object");
  exactKeys(input2, ["repositoryId", "repository", "releaseId", "tag", "releaseUrl"], "$.plan.source");
  const validated = validateCanonicalSource({
    repositoryId: input2.repositoryId,
    repository: input2.repository,
    releaseId: input2.releaseId,
    tag: input2.tag,
    releaseUrl: input2.releaseUrl,
    body: "",
    draft: false,
    prerelease: false,
    visibility: "public"
  });
  return sourceIdentity(validated);
}
function parseTextSource(input2) {
  if (!isRecord4(input2) || typeof input2.kind !== "string") {
    validationError(
      "invalid_text_source",
      "$.plan.textSource",
      "must describe an authored or github_release_notes text source"
    );
  }
  if (input2.kind === "provider_override") {
    exactKeys(input2, ["kind"], "$.plan.textSource");
    return { kind: "provider_override" };
  }
  if (input2.kind === "configured_variant" || input2.kind === "provider_default") {
    exactKeys(input2, ["kind", "variant"], "$.plan.textSource");
    if (input2.variant !== "short" && input2.variant !== "announcement") {
      validationError("invalid_text_source", "$.plan.textSource.variant", "must be short or announcement");
    }
    return { kind: input2.kind, variant: input2.variant };
  }
  if (input2.kind === "github_release_notes") {
    exactKeys(
      input2,
      ["kind", "contentDigest", "includedEntries", "omittedEntries", "omissionReason"],
      "$.plan.textSource"
    );
    if (typeof input2.contentDigest !== "string" || !/^[0-9a-f]{64}$/.test(input2.contentDigest)) {
      validationError("invalid_text_source", "$.plan.textSource.contentDigest", "must be a lowercase SHA-256 digest");
    }
    if (typeof input2.includedEntries !== "number" || !Number.isSafeInteger(input2.includedEntries) || input2.includedEntries < 0 || typeof input2.omittedEntries !== "number" || !Number.isSafeInteger(input2.omittedEntries) || input2.omittedEntries < 0) {
      validationError("invalid_text_source", "$.plan.textSource", "entry counts must be non-negative safe integers");
    }
    if (input2.omissionReason !== "none" && input2.omissionReason !== "empty_body" && input2.omissionReason !== "no_useful_content" && input2.omissionReason !== "budget") {
      validationError("invalid_text_source", "$.plan.textSource.omissionReason", "contains an unsupported reason");
    }
    return {
      kind: "github_release_notes",
      contentDigest: input2.contentDigest,
      includedEntries: input2.includedEntries,
      omittedEntries: input2.omittedEntries,
      omissionReason: input2.omissionReason
    };
  }
  validationError("invalid_text_source", "$.plan.textSource.kind", "contains an unsupported text source");
}
function parseAccount(input2, destination) {
  if (!isRecord4(input2)) validationError("invalid_plan_account", "$.plan.account", "must be an object");
  if (destination === "x") {
    exactKeys(input2, ["destination", "accountId"], "$.plan.account");
    if (input2.destination !== "x" || typeof input2.accountId !== "string" || !/^\d+$/.test(input2.accountId)) {
      validationError(
        "invalid_plan_account",
        "$.plan.account",
        "must contain destination=x and a numeric accountId string"
      );
    }
    const account2 = { destination: "x", accountId: input2.accountId };
    return account2;
  }
  exactKeys(input2, ["destination", "author", "apiVersion"], "$.plan.account");
  if (input2.destination !== "linkedin" || typeof input2.author !== "string" || !/^urn:li:person:[^\s:]+$/.test(input2.author) || typeof input2.apiVersion !== "string" || !/^\d{6}$/.test(input2.apiVersion)) {
    validationError(
      "invalid_plan_account",
      "$.plan.account",
      "must contain the validated LinkedIn author and apiVersion"
    );
  }
  const month = Number(input2.apiVersion.slice(4));
  if (month < 1 || month > 12) {
    validationError("invalid_plan_account", "$.plan.account.apiVersion", "contains an invalid month");
  }
  const account = {
    destination: "linkedin",
    author: input2.author,
    apiVersion: input2.apiVersion
  };
  return account;
}
function validateRenderedPlan(input2) {
  if (!isRecord4(input2)) validationError("invalid_plan", "$.plan", "must be an object");
  exactKeys(input2, ["version", "destination", "account", "textSource", "text", "source", "digest"], "$.plan");
  if (input2.version !== 1) validationError("invalid_plan_version", "$.plan.version", "must be 1");
  if (input2.destination !== "x" && input2.destination !== "linkedin") {
    validationError("invalid_plan_destination", "$.plan.destination", "must be x or linkedin");
  }
  if (typeof input2.text !== "string") validationError("invalid_plan_text", "$.plan.text", "must be a string");
  if (typeof input2.digest !== "string" || !/^[0-9a-f]{64}$/.test(input2.digest)) {
    validationError("invalid_plan_digest", "$.plan.digest", "must be a lowercase SHA-256 digest");
  }
  const destination = input2.destination;
  const source = parseIdentity(input2.source);
  const account = parseAccount(input2.account, destination);
  const textSource = parseTextSource(input2.textSource);
  const suffix = `

${source.releaseUrl}`;
  if (!input2.text.endsWith(suffix)) {
    validationError(
      "invalid_plan_text",
      "$.plan.text",
      "must end with exactly one canonical release URL separated by one blank line"
    );
  }
  const prose = input2.text.slice(0, -suffix.length);
  if (prose === "" || prose.trim() !== prose) {
    validationError(
      "invalid_plan_text",
      "$.plan.text",
      "prose must be non-empty with boundary whitespace already trimmed"
    );
  }
  assertNoExternalLink(prose, "$.plan.text");
  if (input2.text.split(source.releaseUrl).length !== 2) {
    validationError("invalid_plan_text", "$.plan.text", "must contain the canonical release URL exactly once");
  }
  const planWithoutDigest = {
    version: 1,
    destination,
    account,
    textSource,
    text: input2.text,
    source
  };
  const expected = digestFor(planWithoutDigest);
  if (input2.digest !== expected) {
    validationError(
      "plan_digest_mismatch",
      "$.plan.digest",
      "does not match the canonical nonsecret plan inputs and final payload"
    );
  }
  return { ...planWithoutDigest, digest: input2.digest };
}

// src/github/state-store.ts
var import_node_crypto4 = require("node:crypto");

// src/publishing/errors.ts
var PublishingError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.name = "PublishingError";
    this.code = code;
  }
};

// src/publishing/ledger.ts
var import_node_crypto3 = require("node:crypto");

// src/publishing/types.ts
var PUBLISHING_SCHEMA_VERSION = 1;
var PUBLISHING_IMPLEMENTATION_ID = "release-social/publishing:v1";
var STATE_BRANCH = "release-social-state";
var STATE_PATH = "release-social-state-v1.json";

// src/publishing/ledger.ts
var DIGEST_PATTERN = /^[0-9a-f]{64}$/;
var UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var REPOSITORY_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
var MAX_TRANSITIONS = 1e5;
var TRANSITION_KINDS = [
  "append_pending",
  "record_published",
  "record_rejected",
  "reconcile_published",
  "reconcile_non_creation",
  "revise_plan"
];
function isRecord5(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function fail(message) {
  throw new PublishingError("state_corrupt", message);
}
function requireRecord2(value, path) {
  if (!isRecord5(value)) fail(`${path} must be an object.`);
  return value;
}
function requireString(value, path, maxLength = 1024) {
  if (typeof value !== "string" || value.length === 0 || value.length > maxLength) {
    fail(`${path} must be a non-empty bounded string.`);
  }
  return value;
}
function requireInteger(value, path) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    fail(`${path} must be a positive safe integer.`);
  }
  return value;
}
function requireExactKeys(record, keys, path) {
  const allowed = new Set(keys);
  const unknown = Object.keys(record).filter((key) => !allowed.has(key));
  const missing = keys.filter((key) => !(key in record));
  if (unknown.length > 0 || missing.length > 0) {
    fail(
      `${path} has an invalid shape${unknown.length > 0 ? `; unsupported: ${unknown.join(", ")}` : ""}${missing.length > 0 ? `; missing: ${missing.join(", ")}` : ""}.`
    );
  }
}
function requireTimestamp(value, path) {
  const timestamp = requireString(value, path, 64);
  if (!Number.isFinite(Date.parse(timestamp))) fail(`${path} must be an ISO-compatible timestamp.`);
  return timestamp;
}
function requireDigest(value, path) {
  const digest = requireString(value, path, 64);
  if (!DIGEST_PATTERN.test(digest)) fail(`${path} must be a lowercase SHA-256 digest.`);
  return digest;
}
function validateExecution(value, path) {
  const record = requireRecord2(value, path);
  const kind = requireString(record.kind, `${path}.kind`, 32);
  if (kind === "github_run") {
    requireExactKeys(record, ["kind", "repository", "runId", "url"], path);
    const repository = requireString(record.repository, `${path}.repository`, 256);
    if (!REPOSITORY_PATTERN.test(repository)) fail(`${path}.repository must use owner/name.`);
    const runId = requireInteger(record.runId, `${path}.runId`);
    const url = requireString(record.url, `${path}.url`, 512);
    if (url !== `https://github.com/${repository}/actions/runs/${runId}`) {
      fail(`${path}.url must be the canonical public GitHub Actions run URL.`);
    }
    return { kind: "github_run", repository, runId, url };
  }
  if (kind === "cli") {
    requireExactKeys(record, ["kind", "invocationId"], path);
    const invocationId = requireString(record.invocationId, `${path}.invocationId`, 128);
    if (!UUID_PATTERN.test(invocationId)) fail(`${path}.invocationId must be a UUID.`);
    return { kind: "cli", invocationId };
  }
  fail(`${path}.kind is unsupported.`);
}
function validateTerminal(value, state, destination, path) {
  if (state === "pending") {
    if (value !== void 0) fail(`${path} must be absent for a pending attempt.`);
    return void 0;
  }
  const record = requireRecord2(value, path);
  const kind = requireString(record.kind, `${path}.kind`, 32);
  if (state === "published") {
    requireExactKeys(record, ["kind", "providerId", "url", "recordedAt", "resolution"], path);
    if (kind !== "published") fail(`${path}.kind must be published.`);
    const providerId = requireString(record.providerId, `${path}.providerId`, 256);
    const url = requireString(record.url, `${path}.url`, 1024);
    validatePublicPost(destination, providerId, url);
    const recordedAt2 = requireTimestamp(record.recordedAt, `${path}.recordedAt`);
    if (record.resolution !== "provider" && record.resolution !== "operator_public_post") {
      fail(`${path}.resolution is unsupported.`);
    }
    return {
      kind: "published",
      providerId,
      url,
      recordedAt: recordedAt2,
      resolution: record.resolution
    };
  }
  requireExactKeys(record, ["kind", "retryEligible", "recordedAt", "resolution"], path);
  if (kind !== "rejected") fail(`${path}.kind must be rejected.`);
  if (typeof record.retryEligible !== "boolean") fail(`${path}.retryEligible must be boolean.`);
  const recordedAt = requireTimestamp(record.recordedAt, `${path}.recordedAt`);
  if (record.resolution !== "provider" && record.resolution !== "operator_non_creation") {
    fail(`${path}.resolution is unsupported.`);
  }
  return {
    kind: "rejected",
    retryEligible: record.retryEligible,
    recordedAt,
    resolution: record.resolution
  };
}
function validateAttempt(value, destination, expectedNumber, path) {
  const record = requireRecord2(value, path);
  const allowed = [
    "attemptNumber",
    "attemptId",
    "payloadDigest",
    "schemaVersion",
    "implementationId",
    "execution",
    "startedAt",
    "state"
  ];
  if ("terminal" in record) allowed.push("terminal");
  requireExactKeys(record, allowed, path);
  const attemptNumber = requireInteger(record.attemptNumber, `${path}.attemptNumber`);
  if (attemptNumber !== expectedNumber) fail(`${path}.attemptNumber must be monotonic and contiguous.`);
  const attemptId = requireString(record.attemptId, `${path}.attemptId`, 64);
  if (!UUID_PATTERN.test(attemptId)) fail(`${path}.attemptId must be a UUID.`);
  const payloadDigest = requireDigest(record.payloadDigest, `${path}.payloadDigest`);
  if (record.schemaVersion !== PUBLISHING_SCHEMA_VERSION) {
    throw new PublishingError("state_unsupported", `${path}.schemaVersion is unsupported.`);
  }
  if (record.implementationId !== PUBLISHING_IMPLEMENTATION_ID) {
    throw new PublishingError("state_unsupported", `${path}.implementationId is incompatible.`);
  }
  const execution = validateExecution(record.execution, `${path}.execution`);
  const startedAt = requireTimestamp(record.startedAt, `${path}.startedAt`);
  if (record.state !== "pending" && record.state !== "published" && record.state !== "rejected") {
    fail(`${path}.state is unsupported.`);
  }
  const terminal = validateTerminal(record.terminal, record.state, destination, `${path}.terminal`);
  return terminal === void 0 ? {
    attemptNumber,
    attemptId,
    payloadDigest,
    schemaVersion: 1,
    implementationId: PUBLISHING_IMPLEMENTATION_ID,
    execution,
    startedAt,
    state: record.state
  } : {
    attemptNumber,
    attemptId,
    payloadDigest,
    schemaVersion: 1,
    implementationId: PUBLISHING_IMPLEMENTATION_ID,
    execution,
    startedAt,
    state: record.state,
    terminal
  };
}
function validateRevision(value, record, expectedNumber, path) {
  const revision = requireRecord2(value, path);
  requireExactKeys(
    revision,
    ["revisionNumber", "fromAttemptNumber", "fromDigest", "toDigest", "createdAt", "execution"],
    path
  );
  const revisionNumber = requireInteger(revision.revisionNumber, `${path}.revisionNumber`);
  if (revisionNumber !== expectedNumber) fail(`${path}.revisionNumber must be monotonic and contiguous.`);
  const fromAttemptNumber = requireInteger(revision.fromAttemptNumber, `${path}.fromAttemptNumber`);
  const fromAttempt = record.attempts[fromAttemptNumber - 1];
  if (fromAttempt === void 0 || fromAttempt.state !== "rejected") {
    fail(`${path}.fromAttemptNumber must identify a rejected attempt.`);
  }
  const fromDigest = requireDigest(revision.fromDigest, `${path}.fromDigest`);
  if (fromDigest !== fromAttempt.payloadDigest) fail(`${path}.fromDigest must match the originating attempt.`);
  const toDigest = requireDigest(revision.toDigest, `${path}.toDigest`);
  if (toDigest === fromDigest) fail(`${path}.toDigest must differ from fromDigest.`);
  const createdAt = requireTimestamp(revision.createdAt, `${path}.createdAt`);
  const execution = validateExecution(revision.execution, `${path}.execution`);
  return { revisionNumber, fromAttemptNumber, fromDigest, toDigest, createdAt, execution };
}
function validateRecord(value, expectedKey, path) {
  const record = requireRecord2(value, path);
  requireExactKeys(
    record,
    ["key", "repositoryId", "releaseId", "repository", "destination", "accountIdentity", "attempts", "revisions"],
    path
  );
  const key = requireString(record.key, `${path}.key`, 64);
  if (key !== expectedKey || !DIGEST_PATTERN.test(key)) fail(`${path}.key is invalid.`);
  const repositoryId = requireInteger(record.repositoryId, `${path}.repositoryId`);
  const releaseId = requireInteger(record.releaseId, `${path}.releaseId`);
  const repository = requireString(record.repository, `${path}.repository`, 256);
  if (!REPOSITORY_PATTERN.test(repository)) fail(`${path}.repository must use owner/name.`);
  if (record.destination !== "x" && record.destination !== "linkedin") fail(`${path}.destination is unsupported.`);
  const destination = record.destination;
  const accountIdentity2 = requireString(record.accountIdentity, `${path}.accountIdentity`, 512);
  const calculatedKey = recordKey(repositoryId, releaseId, destination, accountIdentity2);
  if (calculatedKey !== key) fail(`${path}.key does not match its stable identity.`);
  if (!Array.isArray(record.attempts) || record.attempts.length === 0) {
    fail(`${path}.attempts must contain at least one attempt.`);
  }
  const attempts = record.attempts.map(
    (attempt, index) => validateAttempt(attempt, destination, index + 1, `${path}.attempts[${index}]`)
  );
  const publishedIndex = attempts.findIndex((attempt) => attempt.state === "published");
  if (publishedIndex >= 0 && publishedIndex !== attempts.length - 1) {
    fail(`${path}.attempts cannot continue after a published attempt.`);
  }
  const baseRecord = {
    key,
    repositoryId,
    releaseId,
    repository,
    destination,
    accountIdentity: accountIdentity2,
    attempts,
    revisions: []
  };
  if (!Array.isArray(record.revisions)) fail(`${path}.revisions must be an array.`);
  const revisions = record.revisions.map(
    (revision, index) => validateRevision(revision, baseRecord, index + 1, `${path}.revisions[${index}]`)
  );
  const revisedAttempts = /* @__PURE__ */ new Set();
  for (const revision of revisions) {
    if (revisedAttempts.has(revision.fromAttemptNumber)) {
      fail(`${path}.revisions may revise a rejected attempt only once.`);
    }
    revisedAttempts.add(revision.fromAttemptNumber);
  }
  return { ...baseRecord, revisions };
}
function validateTransition(value, index) {
  const path = `$.transitions[${index}]`;
  const record = requireRecord2(value, path);
  const keys = ["id", "kind", "at"];
  if ("recordKey" in record) keys.push("recordKey");
  if ("attemptId" in record) keys.push("attemptId");
  requireExactKeys(record, keys, path);
  const id = requireString(record.id, `${path}.id`, 128);
  if (!UUID_PATTERN.test(id)) fail(`${path}.id must be a UUID.`);
  const kindValue = requireString(record.kind, `${path}.kind`, 64);
  if (!TRANSITION_KINDS.includes(kindValue)) {
    fail(`${path}.kind is unsupported.`);
  }
  const kind = kindValue;
  const at = requireTimestamp(record.at, `${path}.at`);
  const transition = { id, kind, at };
  if (record.recordKey !== void 0) {
    const recordKeyValue = requireDigest(record.recordKey, `${path}.recordKey`);
    transition.recordKey = recordKeyValue;
  }
  if (record.attemptId !== void 0) {
    const attemptId = requireString(record.attemptId, `${path}.attemptId`, 64);
    if (!UUID_PATTERN.test(attemptId)) fail(`${path}.attemptId must be a UUID.`);
    transition.attemptId = attemptId;
  }
  return transition;
}
function sortCanonical(value) {
  if (Array.isArray(value)) return value.map((item) => sortCanonical(item));
  if (!isRecord5(value)) return value;
  const sorted = {};
  for (const key of Object.keys(value).sort()) {
    const child = value[key];
    if (child !== void 0) sorted[key] = sortCanonical(child);
  }
  return sorted;
}
function canonicalJson(value) {
  return JSON.stringify(sortCanonical(value));
}
function checksumFor(ledger) {
  return (0, import_node_crypto3.createHash)("sha256").update(canonicalJson(ledger), "utf8").digest("hex");
}
function sealLedger(ledger) {
  const withoutChecksum = {
    schemaVersion: ledger.schemaVersion,
    implementationId: ledger.implementationId,
    records: ledger.records,
    transitions: ledger.transitions
  };
  return { ...withoutChecksum, checksum: checksumFor(withoutChecksum) };
}
function createEmptyLedger() {
  return sealLedger({
    schemaVersion: PUBLISHING_SCHEMA_VERSION,
    implementationId: PUBLISHING_IMPLEMENTATION_ID,
    records: {},
    transitions: []
  });
}
function validateTransitionHistory(records, transitions) {
  const indexed = transitions.map((transition, index) => ({ transition, index }));
  for (const { transition } of indexed) {
    if (transition.recordKey === void 0 || transition.attemptId === void 0) {
      fail("Every publishing transition must reference an exact record and attempt.");
    }
    const record = records[transition.recordKey];
    if (record === void 0) fail("Publishing transition references a missing record.");
    if (!record.attempts.some((attempt) => attempt.attemptId === transition.attemptId)) {
      fail("Publishing transition references a missing attempt.");
    }
  }
  for (const [key, record] of Object.entries(records)) {
    for (const attempt of record.attempts) {
      const attemptTransitions = indexed.filter(
        ({ transition }) => transition.recordKey === key && transition.attemptId === attempt.attemptId
      );
      const pending = attemptTransitions.filter(({ transition }) => transition.kind === "append_pending");
      if (pending.length !== 1) {
        fail("Every publishing attempt must have exactly one append_pending transition.");
      }
      const pendingIndex = pending[0]?.index;
      if (pendingIndex === void 0) fail("Publishing attempt is missing its pending transition.");
      const terminalTransitions = attemptTransitions.filter(
        ({ transition }) => ["record_published", "record_rejected", "reconcile_published", "reconcile_non_creation"].includes(
          transition.kind
        )
      );
      if (attempt.state === "pending") {
        if (terminalTransitions.length !== 0) {
          fail("Pending publishing attempts cannot have terminal transitions.");
        }
      } else {
        const terminal = attempt.terminal;
        if (terminal === void 0) fail("Terminal publishing attempt is missing terminal metadata.");
        const expectedKind = terminal.kind === "published" ? terminal.resolution === "provider" ? "record_published" : "reconcile_published" : terminal.resolution === "provider" ? "record_rejected" : "reconcile_non_creation";
        if (terminalTransitions.length !== 1 || terminalTransitions[0]?.transition.kind !== expectedKind || terminalTransitions[0].index <= pendingIndex) {
          fail("Publishing attempt terminal transition history is inconsistent with its terminal state.");
        }
      }
      const revision = record.revisions.find((item) => item.fromAttemptNumber === attempt.attemptNumber);
      const revisionTransitions = attemptTransitions.filter(({ transition }) => transition.kind === "revise_plan");
      if (revision === void 0) {
        if (revisionTransitions.length !== 0) {
          fail("Publishing transition history contains an unbound plan revision.");
        }
      } else {
        if (revisionTransitions.length !== 1) {
          fail("Every plan revision must have exactly one revise_plan transition.");
        }
        const terminalIndex = terminalTransitions[0]?.index;
        if (terminalIndex === void 0 || revisionTransitions[0].index <= terminalIndex) {
          fail("Plan revision transition must follow the rejected terminal transition.");
        }
      }
    }
  }
}
function validateLedger(value) {
  const root = requireRecord2(value, "$");
  requireExactKeys(root, ["schemaVersion", "implementationId", "records", "transitions", "checksum"], "$");
  if (root.schemaVersion !== PUBLISHING_SCHEMA_VERSION) {
    throw new PublishingError("state_unsupported", "Publishing state schema version is unsupported.");
  }
  if (root.implementationId !== PUBLISHING_IMPLEMENTATION_ID) {
    throw new PublishingError("state_unsupported", "Publishing implementation identity is incompatible.");
  }
  const recordsValue = requireRecord2(root.records, "$.records");
  const records = {};
  for (const [key, record] of Object.entries(recordsValue)) {
    records[key] = validateRecord(record, key, `$.records.${key}`);
  }
  if (!Array.isArray(root.transitions) || root.transitions.length > MAX_TRANSITIONS) {
    fail("$.transitions must be a bounded array.");
  }
  const transitions = root.transitions.map((transition, index) => validateTransition(transition, index));
  const transitionIds = /* @__PURE__ */ new Set();
  for (const transition of transitions) {
    if (transitionIds.has(transition.id)) fail("$.transitions contains a duplicate transition id.");
    transitionIds.add(transition.id);
  }
  validateTransitionHistory(records, transitions);
  const checksum = requireDigest(root.checksum, "$.checksum");
  const ledger = {
    schemaVersion: 1,
    implementationId: PUBLISHING_IMPLEMENTATION_ID,
    records,
    transitions,
    checksum
  };
  const expected = sealLedger(ledger).checksum;
  if (checksum !== expected) fail("Publishing state checksum does not match the document contents.");
  return ledger;
}
function cloneLedger(ledger) {
  return structuredClone(ledger);
}
function appendTransition(ledger, metadata) {
  const next = cloneLedger(ledger);
  if (next.transitions.some((transition2) => transition2.id === metadata.id)) {
    return next;
  }
  const transition = {
    id: metadata.id,
    kind: metadata.kind,
    at: metadata.at
  };
  if (metadata.recordKey !== void 0) transition.recordKey = metadata.recordKey;
  if (metadata.attemptId !== void 0) transition.attemptId = metadata.attemptId;
  next.transitions.push(transition);
  return sealLedger(next);
}
function createTransitionId() {
  return (0, import_node_crypto3.randomUUID)();
}
function createAttemptId() {
  return (0, import_node_crypto3.randomUUID)();
}
function createGitHubRunExecutionIdentity(repository, runId) {
  return {
    kind: "github_run",
    repository,
    runId,
    url: `https://github.com/${repository}/actions/runs/${runId}`
  };
}
function accountIdentityForPlan(planInput) {
  const plan = validateRenderedPlan(planInput);
  return plan.account.destination === "x" ? plan.account.accountId : plan.account.author;
}
function recordKey(repositoryId, releaseId, destination, accountIdentity2) {
  return (0, import_node_crypto3.createHash)("sha256").update(String(repositoryId)).update("\0").update(String(releaseId)).update("\0").update(destination).update("\0").update(accountIdentity2).digest("hex");
}
function recordKeyForPlan(planInput) {
  const plan = validateRenderedPlan(planInput);
  return recordKey(plan.source.repositoryId, plan.source.releaseId, plan.destination, accountIdentityForPlan(plan));
}
function findRecordForPlan(ledger, planInput) {
  const plan = validateRenderedPlan(planInput);
  assertNoAccountConflict(ledger, plan);
  const record = ledger.records[recordKeyForPlan(plan)];
  if (record !== void 0 && record.repository !== plan.source.repository) {
    throw new PublishingError(
      "record_identity_conflict",
      "The publishing record repository identity does not match the validated source repository."
    );
  }
  return record;
}
function assertNoAccountConflict(ledger, planInput) {
  const plan = validateRenderedPlan(planInput);
  const accountIdentity2 = accountIdentityForPlan(plan);
  for (const record of Object.values(ledger.records)) {
    if (record.repositoryId === plan.source.repositoryId && record.releaseId === plan.source.releaseId && record.destination === plan.destination && record.accountIdentity !== accountIdentity2) {
      throw new PublishingError(
        "record_identity_conflict",
        "A publishing record already exists for this release and destination under a different account identity."
      );
    }
  }
}
function inspectPlanDisposition(ledger, planInput) {
  const plan = validateRenderedPlan(planInput);
  const record = findRecordForPlan(ledger, plan);
  if (record === void 0) return { kind: "new" };
  const latest = record.attempts.at(-1);
  if (latest === void 0) fail("Publishing record unexpectedly contains no attempts.");
  if (latest.state === "pending") return { kind: "unknown", attempt: latest };
  if (latest.state === "published") {
    if (latest.payloadDigest !== plan.digest) {
      throw new PublishingError(
        "published_plan_changed",
        "The release was already published for this destination with a different payload digest."
      );
    }
    const terminal2 = latest.terminal;
    if (terminal2?.kind !== "published") fail("Published attempt lacks published terminal state.");
    return { kind: "already_published", providerId: terminal2.providerId, url: terminal2.url };
  }
  const terminal = latest.terminal;
  if (terminal?.kind !== "rejected") fail("Rejected attempt lacks rejected terminal state.");
  if (latest.payloadDigest === plan.digest) {
    if (terminal.retryEligible) return { kind: "retry" };
    throw new PublishingError(
      "plan_revision_required",
      "The latest definitive rejection is not retryable with the same payload; an explicit plan revision is required."
    );
  }
  const revision = record.revisions.find((item) => item.fromAttemptNumber === latest.attemptNumber);
  if (revision?.toDigest === plan.digest) return { kind: "retry" };
  throw new PublishingError(
    "plan_revision_required",
    "The current payload digest differs from the latest rejected attempt and has not been explicitly revised."
  );
}
function sameExecution(left, right) {
  return canonicalJson(left) === canonicalJson(right);
}
function mutableRecord(ledger, key) {
  const next = cloneLedger(ledger);
  const record = next.records[key];
  if (record === void 0) throw new PublishingError("attempt_not_found", "Publishing record was not found.");
  return { next, record };
}
function appendPendingAttempt(ledger, planInput, execution, attemptId, startedAt) {
  const plan = validateRenderedPlan(planInput);
  validateExecution(execution, "$.execution");
  if (!UUID_PATTERN.test(attemptId)) fail("attemptId must be a UUID.");
  requireTimestamp(startedAt, "$.startedAt");
  const disposition = inspectPlanDisposition(ledger, plan);
  if (disposition.kind === "already_published") {
    throw new PublishingError("attempt_already_terminal", "This destination is already published.");
  }
  if (disposition.kind === "unknown") {
    throw new PublishingError("attempt_unknown", "A pending attempt already exists and is uncertain.");
  }
  const key = recordKeyForPlan(plan);
  const next = cloneLedger(ledger);
  let record = next.records[key];
  if (record === void 0) {
    record = {
      key,
      repositoryId: plan.source.repositoryId,
      releaseId: plan.source.releaseId,
      repository: plan.source.repository,
      destination: plan.destination,
      accountIdentity: accountIdentityForPlan(plan),
      attempts: [],
      revisions: []
    };
    next.records[key] = record;
  }
  const attempt = {
    attemptNumber: record.attempts.length + 1,
    attemptId,
    payloadDigest: plan.digest,
    schemaVersion: 1,
    implementationId: PUBLISHING_IMPLEMENTATION_ID,
    execution,
    startedAt,
    state: "pending"
  };
  record.attempts.push(attempt);
  return { ledger: sealLedger(next), attempt };
}
function requireOwnedPendingAttempt(ledger, recordKeyValue, attemptNumber, attemptId, execution) {
  const record = ledger.records[recordKeyValue];
  if (record === void 0) {
    throw new PublishingError("attempt_not_found", "The publishing record was not found.");
  }
  const attempt = record.attempts[attemptNumber - 1];
  if (attempt === void 0 || attempt.attemptId !== attemptId) {
    throw new PublishingError("attempt_not_found", "The exact publishing attempt was not found.");
  }
  if (attempt.state !== "pending") {
    throw new PublishingError("attempt_already_terminal", "The publishing attempt is no longer pending.");
  }
  if (record.attempts.at(-1)?.attemptId !== attemptId) {
    throw new PublishingError("attempt_not_owned", "The publishing attempt is no longer the active attempt.");
  }
  if (!sameExecution(attempt.execution, execution)) {
    throw new PublishingError("attempt_not_owned", "The publishing attempt belongs to another execution.");
  }
  return attempt;
}
function terminalizeAttempt(ledger, recordKeyValue, attemptNumber, attemptId, execution, terminal) {
  const { next, record } = mutableRecord(ledger, recordKeyValue);
  const attempt = record.attempts[attemptNumber - 1];
  if (attempt === void 0 || attempt.attemptId !== attemptId) {
    throw new PublishingError("attempt_not_found", "The exact publishing attempt was not found.");
  }
  if (attempt.state !== "pending") {
    if (attempt.terminal !== void 0 && canonicalJson(attempt.terminal) === canonicalJson(terminal)) {
      return sealLedger(next);
    }
    throw new PublishingError("attempt_already_terminal", "The attempt already has a different terminal resolution.");
  }
  if (record.attempts.at(-1)?.attemptId !== attemptId) {
    throw new PublishingError("attempt_not_owned", "The publishing attempt is no longer active.");
  }
  if (execution !== void 0 && !sameExecution(attempt.execution, execution)) {
    throw new PublishingError("attempt_not_owned", "The publishing attempt belongs to another execution.");
  }
  attempt.state = terminal.kind;
  attempt.terminal = terminal;
  return sealLedger(next);
}
function markAttemptPublished(ledger, recordKeyValue, attemptNumber, attemptId, execution, providerId, url, recordedAt) {
  const record = ledger.records[recordKeyValue];
  if (record === void 0) throw new PublishingError("attempt_not_found", "Publishing record was not found.");
  validatePublicPost(record.destination, providerId, url);
  requireTimestamp(recordedAt, "$.recordedAt");
  return terminalizeAttempt(ledger, recordKeyValue, attemptNumber, attemptId, execution, {
    kind: "published",
    providerId,
    url,
    recordedAt,
    resolution: "provider"
  });
}
function markAttemptRejected(ledger, recordKeyValue, attemptNumber, attemptId, execution, retryEligible, recordedAt) {
  requireTimestamp(recordedAt, "$.recordedAt");
  return terminalizeAttempt(ledger, recordKeyValue, attemptNumber, attemptId, execution, {
    kind: "rejected",
    retryEligible,
    recordedAt,
    resolution: "provider"
  });
}
function validatePublicPost(destination, providerId, url) {
  if (destination === "x") {
    if (!/^\d+$/.test(providerId) || url !== `https://x.com/i/web/status/${providerId}`) {
      throw new PublishingError("invalid_reconciliation", "X public post identity is not canonical.");
    }
    return;
  }
  if (!/^urn:li:(?:share|ugcPost):\d+$/.test(providerId) || url !== `https://www.linkedin.com/feed/update/${providerId}`) {
    throw new PublishingError("invalid_reconciliation", "LinkedIn public post identity is not canonical.");
  }
}

// src/github/state-store.ts
var API_ORIGIN = "https://api.github.com";
var API_VERSION = "2026-03-10";
var MAX_CONFLICT_RETRIES = 4;
var MAX_ANCESTRY_DEPTH = 128;
var GitHubHttpError = class extends Error {
  status;
  constructor(status, operation) {
    super(`GitHub ${operation} failed with HTTP ${status}.`);
    this.name = "GitHubHttpError";
    this.status = status;
  }
};
var GitHubTransportError = class extends Error {
  constructor(operation) {
    super(`GitHub ${operation} transport failed.`);
    this.name = "GitHubTransportError";
  }
};
function isRecord6(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function requireRecord3(value, operation) {
  if (!isRecord6(value)) {
    throw new PublishingError("state_corrupt", `GitHub returned malformed ${operation} metadata.`);
  }
  return value;
}
function requireSha(value, operation) {
  if (typeof value !== "string" || !/^[0-9a-f]{40}$/i.test(value)) {
    throw new PublishingError("state_corrupt", `GitHub returned an invalid SHA for ${operation}.`);
  }
  return value.toLowerCase();
}
function parseReference(value) {
  const root = requireRecord3(value, "reference");
  const object = requireRecord3(root.object, "reference object");
  return { sha: requireSha(object.sha, "reference") };
}
function parseCommit(value) {
  const root = requireRecord3(value, "commit");
  const sha = requireSha(root.sha, "commit");
  const tree = requireRecord3(root.tree, "commit tree");
  const treeSha = requireSha(tree.sha, "commit tree");
  if (!Array.isArray(root.parents)) {
    throw new PublishingError("state_corrupt", "GitHub commit parents are malformed.");
  }
  const parents = root.parents.map((parent, index) => {
    const item = requireRecord3(parent, `commit parent ${index}`);
    return requireSha(item.sha, `commit parent ${index}`);
  });
  if (parents.length > 1) {
    throw new PublishingError("state_corrupt", "Publishing state history must be linear.");
  }
  return { sha, treeSha, parents };
}
function parseTree(value) {
  const root = requireRecord3(value, "tree");
  const sha = requireSha(root.sha, "tree");
  if (root.truncated === true) {
    throw new PublishingError("state_corrupt", "Publishing state tree response was truncated.");
  }
  if (!Array.isArray(root.tree)) {
    throw new PublishingError("state_corrupt", "Publishing state tree entries are malformed.");
  }
  const entries = root.tree.map((entry, index) => {
    const item = requireRecord3(entry, `tree entry ${index}`);
    if (typeof item.path !== "string" || typeof item.mode !== "string" || typeof item.type !== "string") {
      throw new PublishingError("state_corrupt", "Publishing state tree entry metadata is malformed.");
    }
    return {
      path: item.path,
      mode: item.mode,
      type: item.type,
      sha: requireSha(item.sha, `tree entry ${index}`)
    };
  });
  return { sha, entries };
}
function parseBlob(value, expectedSha) {
  const root = requireRecord3(value, "blob");
  const sha = requireSha(root.sha, "blob");
  if (sha !== expectedSha) {
    throw new PublishingError("state_corrupt", "Publishing state blob SHA does not match its tree entry.");
  }
  if (root.encoding !== "base64" || typeof root.content !== "string") {
    throw new PublishingError("state_corrupt", "Publishing state blob encoding is unsupported.");
  }
  let bytes;
  try {
    bytes = Buffer.from(root.content.replace(/\s/g, ""), "base64");
  } catch {
    throw new PublishingError("state_corrupt", "Publishing state blob is not valid base64.");
  }
  const gitSha = (0, import_node_crypto4.createHash)("sha1").update(Buffer.from(`blob ${bytes.length}\0`, "utf8")).update(bytes).digest("hex");
  if (gitSha !== expectedSha) {
    throw new PublishingError("state_corrupt", "Publishing state blob checksum does not match Git metadata.");
  }
  return bytes.toString("utf8");
}
function parseCreatedSha(value, operation) {
  return requireSha(requireRecord3(value, operation).sha, operation);
}
function repositoryParts2(repository) {
  const match = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/.exec(repository);
  if (!match?.[1] || !match[2]) {
    throw new Error("GitHub repository must use owner/name.");
  }
  return { owner: match[1], name: match[2] };
}
var GitHubStateStore = class {
  token;
  fetcher;
  maxConflictRetries;
  owner;
  name;
  constructor(options) {
    const { owner, name } = repositoryParts2(options.repository);
    if (options.token.trim() === "") throw new Error("GitHub state-store token must not be empty.");
    this.owner = owner;
    this.name = name;
    this.token = options.token;
    this.fetcher = options.fetch ?? fetch;
    this.maxConflictRetries = options.maxConflictRetries ?? MAX_CONFLICT_RETRIES;
  }
  async initialize() {
    const existing = await this.getReference(true);
    if (existing !== void 0) {
      throw new PublishingError(
        "state_branch_exists",
        "release-social-state already exists; initialization will not overwrite existing history."
      );
    }
    const ledger = createEmptyLedger();
    const blobSha = await this.createBlob(canonicalJson(ledger) + "\n");
    const treeSha = await this.createTree(void 0, blobSha);
    const commitSha = await this.createCommit(treeSha, [], "Initialize release-social publishing state");
    try {
      const response = await this.request(
        `/repos/${this.owner}/${this.name}/git/refs`,
        {
          method: "POST",
          body: JSON.stringify({
            ref: `refs/heads/${STATE_BRANCH}`,
            sha: commitSha
          })
        },
        "create state reference"
      );
      if (response.status !== 201) {
        throw new GitHubHttpError(response.status, "create state reference");
      }
    } catch (error) {
      const located = await this.locateInitializedState(commitSha);
      if (located) return;
      if (error instanceof GitHubHttpError && (error.status === 409 || error.status === 422)) {
        throw new PublishingError(
          "state_branch_exists",
          "State initialization lost a race to an existing release-social-state branch."
        );
      }
      throw new PublishingError(
        "state_uncertain",
        "State-branch initialization could not be proven; do not recreate or overwrite it."
      );
    }
    if (!await this.locateInitializedState(commitSha)) {
      throw new PublishingError(
        "state_uncertain",
        "State initialization response succeeded but the exact initialized branch could not be read back."
      );
    }
  }
  async read() {
    return (await this.readSnapshot()).ledger;
  }
  async transition(metadata, apply) {
    for (let retry = 0; retry <= this.maxConflictRetries; retry += 1) {
      const snapshot = await this.readSnapshot();
      if (snapshot.ledger.transitions.some((transition) => transition.id === metadata.id)) {
        throw new PublishingError(
          "state_conflict",
          "The requested state transition identifier already exists in verified history."
        );
      }
      const mutation = apply(snapshot.ledger);
      const next = appendTransition(mutation.next, metadata);
      validateLedger(next);
      const blobSha = await this.createBlob(canonicalJson(next) + "\n");
      const treeSha = await this.createTree(snapshot.treeSha, blobSha);
      const commitSha = await this.createCommit(
        treeSha,
        [snapshot.headSha],
        `release-social state: ${metadata.kind.slice(0, 64)}`
      );
      let response;
      try {
        response = await this.request(
          `/repos/${this.owner}/${this.name}/git/refs/heads/${STATE_BRANCH}`,
          {
            method: "PATCH",
            body: JSON.stringify({ sha: commitSha, force: false })
          },
          "update state reference"
        );
      } catch {
        if (await this.verifyCommittedTransition(commitSha, metadata.id)) return mutation.value;
        throw new PublishingError(
          "state_uncertain",
          "GitHub state ref update had an uncertain transport outcome and the exact transition could not be proven."
        );
      }
      if (response.status === 200) {
        if (await this.verifyCommittedTransition(commitSha, metadata.id)) return mutation.value;
        throw new PublishingError(
          "state_uncertain",
          "GitHub accepted the state ref update but the exact transition could not be read back."
        );
      }
      if (response.status === 409 || response.status === 422) {
        const current = await this.getReference(false);
        if (current.sha !== snapshot.headSha) {
          continue;
        }
        throw new PublishingError(
          "state_conflict",
          "GitHub rejected a state ref update without a competing successor; transition was not applied."
        );
      }
      throw new PublishingError(
        "state_conflict",
        `GitHub rejected the state transition with HTTP ${response.status}; transition was not applied.`
      );
    }
    throw new PublishingError(
      "state_conflict",
      "Publishing state changed repeatedly during the transition; retry in a new explicit operation."
    );
  }
  async locateInitializedState(commitSha) {
    try {
      const ref = await this.getReference(true);
      if (ref?.sha !== commitSha) return false;
      const snapshot = await this.readSnapshot();
      return snapshot.headSha === commitSha && Object.keys(snapshot.ledger.records).length === 0 && snapshot.ledger.transitions.length === 0;
    } catch {
      return false;
    }
  }
  async verifyCommittedTransition(commitSha, transitionId) {
    try {
      const snapshot = await this.readSnapshot();
      if (!snapshot.ledger.transitions.some((transition) => transition.id === transitionId)) return false;
      return await this.isAncestor(snapshot.headSha, commitSha);
    } catch {
      return false;
    }
  }
  async isAncestor(headSha, targetSha) {
    let current = headSha;
    for (let depth = 0; depth < MAX_ANCESTRY_DEPTH; depth += 1) {
      if (current === targetSha) return true;
      const commit = await this.getCommit(current);
      const parent = commit.parents[0];
      if (parent === void 0) return false;
      current = parent;
    }
    return false;
  }
  async readSnapshot() {
    const ref = await this.getReference(false);
    const commit = await this.getCommit(ref.sha);
    if (commit.sha !== ref.sha) {
      throw new PublishingError("state_corrupt", "State reference does not resolve to the requested commit.");
    }
    const treeResponse = await this.request(
      `/repos/${this.owner}/${this.name}/git/trees/${commit.treeSha}?recursive=1`,
      { method: "GET" },
      "read state tree"
    );
    if (treeResponse.status !== 200) throw new GitHubHttpError(treeResponse.status, "read state tree");
    const tree = parseTree(await this.responseJson(treeResponse, "state tree"));
    if (tree.sha !== commit.treeSha) {
      throw new PublishingError("state_corrupt", "State commit tree SHA does not match the fetched tree.");
    }
    if (tree.entries.length !== 1 || tree.entries[0]?.path !== STATE_PATH || tree.entries[0]?.type !== "blob" || tree.entries[0]?.mode !== "100644") {
      throw new PublishingError(
        "state_corrupt",
        "release-social-state must remain data-only and contain exactly the expected state JSON file."
      );
    }
    const blobEntry = tree.entries[0];
    const blobResponse = await this.request(
      `/repos/${this.owner}/${this.name}/git/blobs/${blobEntry.sha}`,
      { method: "GET" },
      "read state blob"
    );
    if (blobResponse.status !== 200) throw new GitHubHttpError(blobResponse.status, "read state blob");
    const stateText = parseBlob(await this.responseJson(blobResponse, "state blob"), blobEntry.sha);
    let parsed;
    try {
      parsed = JSON.parse(stateText);
    } catch {
      throw new PublishingError("state_corrupt", "Publishing state JSON is malformed.");
    }
    return {
      ledger: validateLedger(parsed),
      headSha: ref.sha,
      treeSha: commit.treeSha
    };
  }
  async getReference(allowMissing) {
    const response = await this.request(
      `/repos/${this.owner}/${this.name}/git/ref/heads/${STATE_BRANCH}`,
      { method: "GET" },
      "read state reference"
    );
    if (response.status === 404) {
      if (allowMissing) return void 0;
      throw new PublishingError(
        "state_branch_missing",
        "release-social-state is missing. Initialize it explicitly before publishing."
      );
    }
    if (response.status !== 200) throw new GitHubHttpError(response.status, "read state reference");
    return parseReference(await this.responseJson(response, "state reference"));
  }
  async getCommit(sha) {
    const response = await this.request(
      `/repos/${this.owner}/${this.name}/git/commits/${sha}`,
      { method: "GET" },
      "read state commit"
    );
    if (response.status !== 200) throw new GitHubHttpError(response.status, "read state commit");
    return parseCommit(await this.responseJson(response, "state commit"));
  }
  async createBlob(content) {
    const response = await this.request(
      `/repos/${this.owner}/${this.name}/git/blobs`,
      {
        method: "POST",
        body: JSON.stringify({ content, encoding: "utf-8" })
      },
      "create state blob"
    );
    if (response.status !== 201) throw new GitHubHttpError(response.status, "create state blob");
    return parseCreatedSha(await this.responseJson(response, "created blob"), "created blob");
  }
  async createTree(baseTree, blobSha) {
    const body = {
      tree: [{ path: STATE_PATH, mode: "100644", type: "blob", sha: blobSha }]
    };
    if (baseTree !== void 0) body.base_tree = baseTree;
    const response = await this.request(
      `/repos/${this.owner}/${this.name}/git/trees`,
      { method: "POST", body: JSON.stringify(body) },
      "create state tree"
    );
    if (response.status !== 201) throw new GitHubHttpError(response.status, "create state tree");
    return parseCreatedSha(await this.responseJson(response, "created tree"), "created tree");
  }
  async createCommit(treeSha, parents, message) {
    const response = await this.request(
      `/repos/${this.owner}/${this.name}/git/commits`,
      {
        method: "POST",
        body: JSON.stringify({ message, tree: treeSha, parents })
      },
      "create state commit"
    );
    if (response.status !== 201) throw new GitHubHttpError(response.status, "create state commit");
    return parseCreatedSha(await this.responseJson(response, "created commit"), "created commit");
  }
  async responseJson(response, operation) {
    try {
      return await response.json();
    } catch {
      throw new PublishingError("state_corrupt", `GitHub returned malformed JSON for ${operation}.`);
    }
  }
  async request(path, init, operation) {
    const url = new URL(path, API_ORIGIN);
    if (url.origin !== API_ORIGIN) throw new Error("GitHub state-store request escaped the official API host.");
    const headers = new Headers(init.headers);
    headers.set("accept", "application/vnd.github+json");
    headers.set("authorization", `Bearer ${this.token}`);
    headers.set("content-type", "application/json");
    headers.set("x-github-api-version", API_VERSION);
    let response;
    try {
      response = await this.fetcher(url, {
        ...init,
        headers,
        redirect: "manual"
      });
    } catch {
      throw new GitHubTransportError(operation);
    }
    if (response.status >= 300 && response.status < 400) {
      throw new GitHubHttpError(response.status, `${operation} redirect`);
    }
    return response;
  }
};

// src/publishing/repository.ts
function bindProvider(binding) {
  const { provider, credentials } = binding;
  return {
    destination: provider.destination,
    prepare: (plan) => provider.prepare(plan),
    validate: (payload) => provider.validate(payload),
    preflight: (payload) => provider.preflight(credentials, payload),
    publish: (payload) => provider.publish(credentials, payload)
  };
}

// src/publishing/publisher.ts
function boundedDuration(start, end) {
  const duration = Math.max(0, Math.round(end - start));
  return Math.min(duration, 864e5);
}
function event(events, stage, status, start, end, code) {
  const item = { stage, status, durationMs: boundedDuration(start, end) };
  if (code !== void 0) item.code = code.slice(0, 80);
  events.push(item);
}
function blankResult(plan) {
  return {
    destination: plan.destination,
    status: "blocked",
    events: []
  };
}
function providerFor(plan, providers) {
  const provider = providers.find((item) => item.destination === plan.destination);
  if (provider === void 0) {
    throw new PublishingError("provider_missing", `No provider is bound for ${plan.destination}.`);
  }
  return provider;
}
function statusCode(error) {
  return error instanceof PublishingError ? error.code : "unexpected_failure";
}
function isUncertainStateError(error) {
  return error instanceof PublishingError && (error.code === "state_uncertain" || error.code === "attempt_unknown" || error.code === "attempt_already_terminal");
}
async function publishRelease(options) {
  const now = options.now ?? (() => (/* @__PURE__ */ new Date()).toISOString());
  const monotonicNow = options.monotonicNow ?? (() => performance.now());
  const initialLedger = await options.state.read();
  const results = [];
  const candidates = [];
  let blocked = false;
  for (const rawPlan of options.plans) {
    const validateStart = monotonicNow();
    let plan;
    const result = blankResult(rawPlan);
    results.push(result);
    try {
      plan = validateRenderedPlan(rawPlan);
      const disposition = inspectPlanDisposition(initialLedger, plan);
      if (disposition.kind === "already_published") {
        result.status = "already_published";
        result.postId = disposition.providerId;
        result.postUrl = disposition.url;
        event(result.events, "validate", "skipped", validateStart, monotonicNow(), "already_published");
        continue;
      }
      if (disposition.kind === "unknown") {
        result.status = "unknown";
        result.attemptNumber = disposition.attempt.attemptNumber;
        result.attemptId = disposition.attempt.attemptId;
        event(result.events, "validate", "blocked", validateStart, monotonicNow(), "attempt_unknown");
        blocked = true;
        continue;
      }
      const provider = providerFor(plan, options.providers);
      const payload = provider.prepare(plan);
      const validation = provider.validate(payload);
      if (!validation.ok) {
        result.status = "blocked";
        event(result.events, "validate", "failed", validateStart, monotonicNow(), "provider_validation_failed");
        blocked = true;
        continue;
      }
      event(result.events, "validate", "ok", validateStart, monotonicNow());
      candidates.push({ plan, provider, payload, result });
    } catch (error) {
      result.status = error instanceof PublishingError && error.code === "attempt_unknown" ? "unknown" : "blocked";
      event(result.events, "validate", "blocked", validateStart, monotonicNow(), statusCode(error));
      blocked = true;
    }
  }
  if (blocked) {
    for (const candidate of candidates) {
      candidate.result.status = "blocked";
      event(
        candidate.result.events,
        "preflight",
        "skipped",
        monotonicNow(),
        monotonicNow(),
        "run_blocked_before_preflight"
      );
    }
    return { results };
  }
  let preflightFailed = false;
  for (const candidate of candidates) {
    const start = monotonicNow();
    try {
      const preflight = await candidate.provider.preflight(candidate.payload);
      if (preflight.status !== "ready") {
        candidate.result.status = "blocked";
        event(candidate.result.events, "preflight", "failed", start, monotonicNow(), "preflight_rejected");
        preflightFailed = true;
      } else {
        event(candidate.result.events, "preflight", "ok", start, monotonicNow());
      }
    } catch {
      candidate.result.status = "blocked";
      event(candidate.result.events, "preflight", "failed", start, monotonicNow(), "preflight_failed");
      preflightFailed = true;
    }
  }
  if (preflightFailed) {
    for (const candidate of candidates) {
      if (candidate.result.events.some((item) => item.stage === "preflight" && item.status === "ok")) {
        candidate.result.status = "blocked";
        event(candidate.result.events, "pending", "skipped", monotonicNow(), monotonicNow(), "peer_preflight_failed");
      }
    }
    return { results };
  }
  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    if (candidate === void 0) continue;
    const key = recordKeyForPlan(candidate.plan);
    const attemptId = createAttemptId();
    const pendingStart = monotonicNow();
    let attemptNumber;
    try {
      const attempt = await options.state.transition(
        {
          id: createTransitionId(),
          kind: "append_pending",
          at: now(),
          recordKey: key,
          attemptId
        },
        (current) => {
          const appended = appendPendingAttempt(current, candidate.plan, options.execution, attemptId, now());
          return { next: appended.ledger, value: appended.attempt };
        }
      );
      attemptNumber = attempt.attemptNumber;
      candidate.result.attemptNumber = attemptNumber;
      candidate.result.attemptId = attemptId;
      event(candidate.result.events, "pending", "ok", pendingStart, monotonicNow());
    } catch (error) {
      candidate.result.status = isUncertainStateError(error) ? "unknown" : "blocked";
      event(candidate.result.events, "pending", "failed", pendingStart, monotonicNow(), statusCode(error));
      blockRemaining(candidates, index + 1, monotonicNow, "state_transition_failed");
      break;
    }
    const ownershipStart = monotonicNow();
    try {
      const current = await options.state.read();
      requireOwnedPendingAttempt(current, key, attemptNumber, attemptId, options.execution);
      event(candidate.result.events, "ownership", "ok", ownershipStart, monotonicNow());
    } catch (error) {
      candidate.result.status = "unknown";
      event(candidate.result.events, "ownership", "failed", ownershipStart, monotonicNow(), statusCode(error));
      blockRemaining(candidates, index + 1, monotonicNow, "attempt_ownership_lost");
      break;
    }
    const publishStart = monotonicNow();
    let publication;
    try {
      publication = await candidate.provider.publish(candidate.payload);
    } catch {
      candidate.result.status = "unknown";
      event(candidate.result.events, "publish", "failed", publishStart, monotonicNow(), "provider_threw");
      blockRemaining(candidates, index + 1, monotonicNow, "unknown_provider_outcome");
      break;
    }
    if (publication.status === "unknown") {
      candidate.result.status = "unknown";
      event(candidate.result.events, "publish", "failed", publishStart, monotonicNow(), "provider_outcome_unknown");
      blockRemaining(candidates, index + 1, monotonicNow, "unknown_provider_outcome");
      break;
    }
    event(candidate.result.events, "publish", "ok", publishStart, monotonicNow(), publication.status);
    const outcomeStart = monotonicNow();
    try {
      if (publication.status === "published") {
        await options.state.transition(
          {
            id: createTransitionId(),
            kind: "record_published",
            at: now(),
            recordKey: key,
            attemptId
          },
          (current) => ({
            next: markAttemptPublished(
              current,
              key,
              attemptNumber,
              attemptId,
              options.execution,
              publication.providerId,
              publication.url,
              now()
            ),
            value: void 0
          })
        );
        candidate.result.status = "published";
        candidate.result.postId = publication.providerId;
        candidate.result.postUrl = publication.url;
      } else {
        await options.state.transition(
          {
            id: createTransitionId(),
            kind: "record_rejected",
            at: now(),
            recordKey: key,
            attemptId
          },
          (current) => ({
            next: markAttemptRejected(
              current,
              key,
              attemptNumber,
              attemptId,
              options.execution,
              publication.retryClassification === "retryable",
              now()
            ),
            value: void 0
          })
        );
        candidate.result.status = "rejected";
      }
      event(candidate.result.events, "outcome", "ok", outcomeStart, monotonicNow());
    } catch (error) {
      candidate.result.status = "unknown";
      delete candidate.result.postId;
      delete candidate.result.postUrl;
      event(candidate.result.events, "outcome", "failed", outcomeStart, monotonicNow(), statusCode(error));
      blockRemaining(candidates, index + 1, monotonicNow, "outcome_not_durably_recorded");
      break;
    }
  }
  return { results };
}
function blockRemaining(candidates, startIndex, monotonicNow, code) {
  for (let index = startIndex; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    if (candidate === void 0 || candidate.result.status !== "blocked") continue;
    const at = monotonicNow();
    event(candidate.result.events, "pending", "skipped", at, at, code);
  }
}

// src/providers/linkedin/credentials.ts
function loadLinkedInCredentials(env = process.env) {
  const accessToken = env.LINKEDIN_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("Missing required LinkedIn credential environment variable: LINKEDIN_ACCESS_TOKEN");
  }
  return { accessToken };
}
function validateLinkedInCredentials(credentials) {
  return credentials.accessToken.trim() === "" ? ["LINKEDIN_ACCESS_TOKEN is empty."] : [];
}

// src/providers/linkedin/http.ts
var LINKEDIN_POSTS_URL = "https://api.linkedin.com/rest/posts";
var LINKEDIN_RESTLI_PROTOCOL_VERSION = "2.0.0";
function linkedInHeaders(credentials, apiVersion) {
  const headers = new Headers();
  headers.set("accept", "application/json");
  headers.set("authorization", `Bearer ${credentials.accessToken}`);
  headers.set("content-type", "application/json");
  headers.set("linkedin-version", apiVersion);
  headers.set("x-restli-protocol-version", LINKEDIN_RESTLI_PROTOCOL_VERSION);
  return headers;
}
async function fetchLinkedInWithTimeout(fetcher, init, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetcher(LINKEDIN_POSTS_URL, {
      ...init,
      redirect: "manual",
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

// src/providers/linkedin/provider.ts
var import_node_crypto5 = require("node:crypto");
var DEFAULT_TIMEOUT_MS = 1e4;
var MAX_DIAGNOSTIC_LENGTH = 320;
var POST_URN_PATTERN = /^urn:li:(?:share|ugcPost):\d+$/;
function validApiVersion(value) {
  if (!/^\d{6}$/.test(value)) return false;
  const month = Number(value.slice(4));
  return month >= 1 && month <= 12;
}
function approvalKey(credentials, payload) {
  return (0, import_node_crypto5.createHash)("sha256").update(credentials.accessToken).update("\0").update(payload.author).update("\0").update(payload.apiVersion).update("\0").update(payload.planDigest).update("\0").update(payload.text).update("\0").update(payload.commentary).digest("hex");
}
function sanitizeDiagnostic(value, credentials) {
  let result = value.replace(/authorization\s*[:=]\s*[^\r\n]+/gi, "Authorization: [REDACTED]");
  if (credentials.accessToken !== "") {
    result = result.split(credentials.accessToken).join("[REDACTED]");
  }
  return result.trim().slice(0, MAX_DIAGNOSTIC_LENGTH);
}
function retryAfterSuffix(response, credentials) {
  const retryAfter = response.headers.get("retry-after");
  if (!retryAfter) return "";
  return ` Retry-After: ${sanitizeDiagnostic(retryAfter, credentials).slice(0, 80)}.`;
}
function rejected(reason, retryClassification) {
  return { status: "rejected", reason, retryClassification };
}
function preflightRejected(reason, retryClassification) {
  return { status: "rejected", reason, retryClassification };
}
function safeErrorMessage(error, credentials) {
  if (error instanceof Error) return sanitizeDiagnostic(error.message, credentials);
  return "Unexpected transport failure.";
}
function statusReason(prefix, status, retryAfter) {
  return `${prefix} (HTTP ${status}).${retryAfter}`;
}
function isAmbiguousPostStatus(status) {
  return status >= 300 && status < 400 || status === 408 || status >= 500;
}
function postRequest(payload) {
  return {
    author: payload.author,
    commentary: payload.commentary,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: []
    },
    lifecycleState: "PUBLISHED"
  };
}
function postUrl(postUrn) {
  return `https://www.linkedin.com/feed/update/${postUrn}`;
}
var LinkedInProvider = class {
  destination = "linkedin";
  fetcher;
  timeoutMs;
  approvals = /* @__PURE__ */ new Set();
  constructor(options = {}) {
    this.fetcher = options.fetch ?? fetch;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }
  prepare(plan) {
    const validated = validateRenderedPlan(plan);
    if (validated.destination !== "linkedin" || validated.account.destination !== "linkedin") {
      throw new Error("LinkedIn provider requires a validated LinkedIn destination plan.");
    }
    return {
      destination: "linkedin",
      author: validated.account.author,
      apiVersion: validated.account.apiVersion,
      text: validated.text,
      commentary: escapeLinkedInCommentary(validated.text),
      planDigest: validated.digest
    };
  }
  validate(payload) {
    const errors = [];
    if (payload.destination !== "linkedin") errors.push("LinkedIn payload destination must be linkedin.");
    if (!/^urn:li:person:[^\s:]+$/.test(payload.author)) {
      errors.push("LinkedIn author must be a personal-profile URN matching urn:li:person:...");
    }
    if (!validApiVersion(payload.apiVersion)) errors.push("LinkedIn apiVersion must use a valid YYYYMM value.");
    if (!/^[0-9a-f]{64}$/.test(payload.planDigest)) {
      errors.push("LinkedIn payload planDigest must be a lowercase SHA-256 digest.");
    }
    if (payload.text.trim() === "") errors.push("LinkedIn commentary text must not be empty.");
    const expectedCommentary = escapeLinkedInCommentary(payload.text);
    if (payload.commentary !== expectedCommentary) {
      errors.push("LinkedIn commentary must be the literal-prose escaped form of the rendered text.");
    }
    const sourceLength = linkedInCharacterLength(payload.text);
    const encodedLength = linkedInCharacterLength(payload.commentary);
    if (sourceLength > LINKEDIN_COMMENTARY_MAX_CHARACTERS || encodedLength > LINKEDIN_COMMENTARY_MAX_CHARACTERS) {
      errors.push(
        `LinkedIn commentary exceeds the supported ${LINKEDIN_COMMENTARY_MAX_CHARACTERS}-character maximum after literal-text encoding.`
      );
    }
    return errors.length === 0 ? { ok: true } : { ok: false, errors };
  }
  async preflight(credentials, payload) {
    const validation = this.validate(payload);
    if (!validation.ok) {
      return preflightRejected(`Invalid LinkedIn payload: ${validation.errors.join(" ")}`, "permanent");
    }
    const credentialErrors = validateLinkedInCredentials(credentials);
    if (credentialErrors.length > 0) {
      return preflightRejected(credentialErrors.join(" "), "permanent");
    }
    this.approvals.add(approvalKey(credentials, payload));
    return { status: "ready" };
  }
  async publish(credentials, payload) {
    const validation = this.validate(payload);
    if (!validation.ok) {
      return rejected(`Invalid LinkedIn payload: ${validation.errors.join(" ")}`, "permanent");
    }
    const credentialErrors = validateLinkedInCredentials(credentials);
    if (credentialErrors.length > 0) {
      return rejected(credentialErrors.join(" "), "permanent");
    }
    const key = approvalKey(credentials, payload);
    if (!this.approvals.delete(key)) {
      return rejected(
        "LinkedIn publish requires a successful preflight for this exact payload and access token.",
        "permanent"
      );
    }
    let response;
    try {
      response = await fetchLinkedInWithTimeout(
        this.fetcher,
        {
          method: "POST",
          headers: linkedInHeaders(credentials, payload.apiVersion),
          body: JSON.stringify(postRequest(payload))
        },
        this.timeoutMs
      );
    } catch (error) {
      const detail = safeErrorMessage(error, credentials);
      return {
        status: "unknown",
        reason: `LinkedIn create request outcome is unknown after a transport failure${detail === "" ? "." : `: ${detail}`}`
      };
    }
    const retryAfter = retryAfterSuffix(response, credentials);
    if (response.status === 201) {
      const providerId = response.headers.get("x-restli-id")?.trim();
      if (!providerId || !POST_URN_PATTERN.test(providerId)) {
        return {
          status: "unknown",
          reason: "LinkedIn returned 201 without a usable x-restli-id; post creation cannot be ruled out."
        };
      }
      return {
        status: "published",
        providerId,
        url: postUrl(providerId)
      };
    }
    if (response.ok || isAmbiguousPostStatus(response.status)) {
      return {
        status: "unknown",
        reason: statusReason(
          "LinkedIn create request returned an ambiguous response; post creation cannot be ruled out",
          response.status,
          retryAfter
        )
      };
    }
    if (response.status === 429) {
      return rejected(
        statusReason(
          "LinkedIn create request was rate limited without confirmed creation",
          response.status,
          retryAfter
        ),
        "retryable"
      );
    }
    return rejected(
      statusReason("LinkedIn create request was rejected without confirmed creation", response.status, retryAfter),
      "permanent"
    );
  }
};
function createLinkedInProvider(options = {}) {
  return new LinkedInProvider(options);
}

// src/providers/x/credentials.ts
function loadXCredentials(env = process.env) {
  const apiKey = env.X_API_KEY;
  const apiSecret = env.X_API_SECRET;
  const accessToken = env.X_ACCESS_TOKEN;
  const accessTokenSecret = env.X_ACCESS_TOKEN_SECRET;
  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    const missing = [];
    if (!apiKey) missing.push("X_API_KEY");
    if (!apiSecret) missing.push("X_API_SECRET");
    if (!accessToken) missing.push("X_ACCESS_TOKEN");
    if (!accessTokenSecret) missing.push("X_ACCESS_TOKEN_SECRET");
    throw new Error(`Missing required X credential environment variable(s): ${missing.join(", ")}`);
  }
  return { apiKey, apiSecret, accessToken, accessTokenSecret };
}
function validateXCredentials(credentials) {
  const errors = [];
  if (credentials.apiKey.trim() === "") errors.push("X_API_KEY is empty.");
  if (credentials.apiSecret.trim() === "") errors.push("X_API_SECRET is empty.");
  if (credentials.accessToken.trim() === "") errors.push("X_ACCESS_TOKEN is empty.");
  if (credentials.accessTokenSecret.trim() === "") errors.push("X_ACCESS_TOKEN_SECRET is empty.");
  return errors;
}

// src/providers/x/http.ts
var import_oauth = __toESM(require_oauth3(), 1);
var X_API_ORIGIN = "https://api.x.com";
var X_ME_URL = `${X_API_ORIGIN}/2/users/me`;
var X_CREATE_POST_URL = `${X_API_ORIGIN}/2/tweets`;
var OAUTH_REQUEST_TOKEN_URL = `${X_API_ORIGIN}/oauth/request_token`;
var OAUTH_ACCESS_TOKEN_URL = `${X_API_ORIGIN}/oauth/access_token`;
function createAuthorizationHeader(credentials, url, method) {
  const oauth = new import_oauth.OAuth(
    OAUTH_REQUEST_TOKEN_URL,
    OAUTH_ACCESS_TOKEN_URL,
    credentials.apiKey,
    credentials.apiSecret,
    "1.0",
    null,
    "HMAC-SHA1"
  );
  return oauth.authHeader(url, credentials.accessToken, credentials.accessTokenSecret, method);
}
async function fetchWithTimeout(fetcher, url, init, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetcher(url, {
      ...init,
      redirect: "manual",
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

// src/providers/x/provider.ts
var import_node_crypto6 = require("node:crypto");
var DEFAULT_TIMEOUT_MS2 = 1e4;
var MAX_DIAGNOSTIC_LENGTH2 = 320;
function isRecord7(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function responseDataId(body) {
  try {
    const parsed = JSON.parse(body);
    if (!isRecord7(parsed) || !isRecord7(parsed.data)) return void 0;
    const id = parsed.data.id;
    if (typeof id !== "string" || !/^\d+$/.test(id)) return void 0;
    return id;
  } catch {
    return void 0;
  }
}
function authenticatedUserId(body) {
  return responseDataId(body);
}
function credentialsApprovalKey(credentials, payload) {
  return (0, import_node_crypto6.createHash)("sha256").update(credentials.apiKey).update("\0").update(credentials.apiSecret).update("\0").update(credentials.accessToken).update("\0").update(credentials.accessTokenSecret).update("\0").update(payload.accountId).update("\0").update(payload.planDigest).update("\0").update(payload.text).digest("hex");
}
function replaceControlCharacters(value) {
  let result = "";
  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0;
    const isControl = codePoint >= 0 && codePoint <= 8 || codePoint === 11 || codePoint === 12 || codePoint >= 14 && codePoint <= 31 || codePoint === 127;
    result += isControl ? " " : character;
  }
  return result;
}
function sanitizeDiagnostic2(value, credentials) {
  let result = value.replace(/authorization\s*[:=]\s*[^\r\n]+/gi, "Authorization: [REDACTED]");
  for (const secret of [
    credentials.apiKey,
    credentials.apiSecret,
    credentials.accessToken,
    credentials.accessTokenSecret
  ]) {
    if (secret !== "") result = result.split(secret).join("[REDACTED]");
  }
  return replaceControlCharacters(result).trim().slice(0, MAX_DIAGNOSTIC_LENGTH2);
}
async function responseBody(response) {
  try {
    return (await response.text()).slice(0, 4096);
  } catch {
    return "";
  }
}
function retryAfterSuffix2(response, credentials) {
  const retryAfter = response.headers.get("retry-after");
  if (!retryAfter) return "";
  return ` Retry-After: ${sanitizeDiagnostic2(retryAfter, credentials).slice(0, 80)}.`;
}
function rejected2(reason, retryClassification) {
  return { status: "rejected", reason, retryClassification };
}
function preflightRejected2(reason, retryClassification) {
  return { status: "rejected", reason, retryClassification };
}
function safeErrorMessage2(error, credentials) {
  if (error instanceof Error) {
    return sanitizeDiagnostic2(error.message, credentials);
  }
  return "Unexpected transport failure.";
}
function statusReason2(prefix, status, detail, retryAfter) {
  return `${prefix} (HTTP ${status})${detail === "" ? "" : `: ${detail}`}${retryAfter}`;
}
function isAmbiguousPostStatus2(status) {
  return status >= 300 && status < 400 || status === 408 || status >= 500;
}
var XProvider = class {
  destination = "x";
  fetcher;
  timeoutMs;
  approvals = /* @__PURE__ */ new Set();
  constructor(options = {}) {
    this.fetcher = options.fetch ?? fetch;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS2;
  }
  prepare(plan) {
    const validated = validateRenderedPlan(plan);
    if (validated.destination !== "x" || validated.account.destination !== "x") {
      throw new Error("X provider requires a validated X destination plan.");
    }
    return {
      destination: "x",
      accountId: validated.account.accountId,
      text: validated.text,
      planDigest: validated.digest
    };
  }
  validate(payload) {
    const errors = [];
    if (payload.destination !== "x") errors.push("X payload destination must be x.");
    if (!/^\d+$/.test(payload.accountId)) errors.push("X accountId must be a numeric user ID.");
    if (!/^[0-9a-f]{64}$/.test(payload.planDigest))
      errors.push("X payload planDigest must be a lowercase SHA-256 digest.");
    if (payload.text.trim() === "") errors.push("X post text must not be empty.");
    const metrics = measureXText(payload.text);
    if (!metrics.valid) {
      errors.push(
        `X post text is ${metrics.weightedLength} weighted characters; the supported maximum is ${X_MAX_WEIGHTED_LENGTH}.`
      );
    }
    return errors.length === 0 ? { ok: true } : { ok: false, errors };
  }
  async preflight(credentials, payload) {
    const validation = this.validate(payload);
    if (!validation.ok) {
      return preflightRejected2(`Invalid X payload: ${validation.errors.join(" ")}`, "permanent");
    }
    const credentialErrors = validateXCredentials(credentials);
    if (credentialErrors.length > 0) {
      return preflightRejected2(credentialErrors.join(" "), "permanent");
    }
    let response;
    try {
      response = await fetchWithTimeout(
        this.fetcher,
        X_ME_URL,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            authorization: createAuthorizationHeader(credentials, X_ME_URL, "GET")
          }
        },
        this.timeoutMs
      );
    } catch (error) {
      const detail2 = safeErrorMessage2(error, credentials);
      return preflightRejected2(
        `X identity verification failed before publication${detail2 === "" ? "." : `: ${detail2}`}`,
        "retryable"
      );
    }
    const body = await responseBody(response);
    const detail = sanitizeDiagnostic2(body, credentials);
    const retryAfter = retryAfterSuffix2(response, credentials);
    if (response.status >= 300 && response.status < 400) {
      return preflightRejected2(
        statusReason2("X identity verification refused an API redirect", response.status, detail, retryAfter),
        "permanent"
      );
    }
    if (response.status === 429 || response.status >= 500) {
      return preflightRejected2(
        statusReason2("X identity verification is temporarily unavailable", response.status, detail, retryAfter),
        "retryable"
      );
    }
    if (!response.ok) {
      return preflightRejected2(
        statusReason2("X identity verification was rejected", response.status, detail, retryAfter),
        "permanent"
      );
    }
    const userId = authenticatedUserId(body);
    if (userId === void 0) {
      return preflightRejected2("X identity verification returned a malformed success response.", "retryable");
    }
    if (userId !== payload.accountId) {
      return preflightRejected2(
        `Authenticated X account ID ${userId} does not match configured accountId ${payload.accountId}.`,
        "permanent"
      );
    }
    this.approvals.add(credentialsApprovalKey(credentials, payload));
    return { status: "ready" };
  }
  async publish(credentials, payload) {
    const validation = this.validate(payload);
    if (!validation.ok) {
      return rejected2(`Invalid X payload: ${validation.errors.join(" ")}`, "permanent");
    }
    const credentialErrors = validateXCredentials(credentials);
    if (credentialErrors.length > 0) {
      return rejected2(credentialErrors.join(" "), "permanent");
    }
    const approvalKey2 = credentialsApprovalKey(credentials, payload);
    if (!this.approvals.delete(approvalKey2)) {
      return rejected2(
        "X publish requires a successful live preflight for this account and credential set before the create request.",
        "permanent"
      );
    }
    const body = JSON.stringify({ text: payload.text });
    let response;
    try {
      response = await fetchWithTimeout(
        this.fetcher,
        X_CREATE_POST_URL,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            authorization: createAuthorizationHeader(credentials, X_CREATE_POST_URL, "POST"),
            "content-type": "application/json"
          },
          body
        },
        this.timeoutMs
      );
    } catch (error) {
      const detail2 = safeErrorMessage2(error, credentials);
      return {
        status: "unknown",
        reason: `X create request outcome is unknown after a transport failure${detail2 === "" ? "." : `: ${detail2}`}`
      };
    }
    const bodyText = await responseBody(response);
    const detail = sanitizeDiagnostic2(bodyText, credentials);
    const retryAfter = retryAfterSuffix2(response, credentials);
    if (response.ok) {
      const providerId = responseDataId(bodyText);
      if (providerId === void 0) {
        return {
          status: "unknown",
          reason: "X returned a success status without a valid post ID; post creation cannot be ruled out."
        };
      }
      return {
        status: "published",
        providerId,
        url: `https://x.com/i/web/status/${providerId}`
      };
    }
    if (isAmbiguousPostStatus2(response.status)) {
      return {
        status: "unknown",
        reason: statusReason2(
          "X create request returned an ambiguous response; post creation cannot be ruled out",
          response.status,
          detail,
          retryAfter
        )
      };
    }
    if (response.status === 429) {
      return rejected2(
        statusReason2("X create request was rate limited without creating a post", response.status, detail, retryAfter),
        "retryable"
      );
    }
    return rejected2(
      statusReason2("X create request was rejected without creating a post", response.status, detail, retryAfter),
      "permanent"
    );
  }
};
function createXProvider(options = {}) {
  return new XProvider(options);
}

// src/cli/application.ts
function accountLabel(plan) {
  return plan.account.destination === "x" ? plan.account.accountId : plan.account.author;
}
function contentDiagnostics(plan) {
  if (plan.textSource.kind !== "github_release_notes") return [];
  const diagnostics = [`included_entries=${plan.textSource.includedEntries}`];
  diagnostics.push(`omitted_entries=${plan.textSource.omittedEntries}`);
  diagnostics.push(`omission_reason=${plan.textSource.omissionReason}`);
  return diagnostics;
}
function contentSource(plan) {
  if (plan.textSource.kind === "github_release_notes") return "github-release-notes";
  if (plan.textSource.kind === "provider_override") return "provider-override";
  return `${plan.textSource.kind.replaceAll("_", "-")}:${plan.textSource.variant}`;
}
function prepareRelease(source, config) {
  const planned = createReleasePlan(source, config);
  if (planned.status === "skipped") {
    return { status: "skipped", skipReason: planned.reason, destinations: [], plans: [] };
  }
  const destinations = planned.plans.map((plan) => {
    if (plan.destination === "x") {
      const provider2 = createXProvider();
      const payload2 = provider2.prepare(plan);
      const validation2 = provider2.validate(payload2);
      return {
        destination: "x",
        account: accountLabel(plan),
        text: plan.text,
        digest: plan.digest,
        contentSource: contentSource(plan),
        diagnostics: contentDiagnostics(plan),
        validation: validation2.ok ? { ok: true, errors: [] } : { ok: false, errors: validation2.errors }
      };
    }
    const provider = createLinkedInProvider();
    const payload = provider.prepare(plan);
    const validation = provider.validate(payload);
    return {
      destination: "linkedin",
      account: accountLabel(plan),
      text: plan.text,
      digest: plan.digest,
      contentSource: contentSource(plan),
      diagnostics: contentDiagnostics(plan),
      validation: validation.ok ? { ok: true, errors: [] } : { ok: false, errors: validation.errors }
    };
  });
  return { status: "ready", destinations, plans: planned.plans };
}
async function publishPrepared(options) {
  const prepared = prepareRelease(options.source, options.config);
  if (prepared.status === "skipped") return { aggregate: "skipped", prepared };
  if (prepared.destinations.some((destination) => !destination.validation.ok)) {
    return { aggregate: "failed", prepared };
  }
  const env = options.env ?? process.env;
  const bindings = options.bindings ?? prepared.plans.map((plan) => {
    if (plan.destination === "x") {
      return bindProvider({
        provider: createXProvider(options.fetch === void 0 ? {} : { fetch: options.fetch }),
        credentials: loadXCredentials(env)
      });
    }
    return bindProvider({
      provider: createLinkedInProvider(options.fetch === void 0 ? {} : { fetch: options.fetch }),
      credentials: loadLinkedInCredentials(env)
    });
  });
  const state = options.state ?? new GitHubStateStore({
    repository: options.repository,
    token: options.githubToken,
    ...options.fetch === void 0 ? {} : { fetch: options.fetch }
  });
  const publications = (await publishRelease({
    plans: prepared.plans,
    providers: bindings,
    state,
    execution: options.execution
  })).results;
  const statuses = publications.map((item) => item.status);
  let aggregate = "success";
  if (statuses.some((status) => status === "unknown")) aggregate = "unknown";
  else if (statuses.some((status) => status === "rejected" || status === "blocked")) aggregate = "partial";
  return { aggregate, prepared, publications };
}
function actionExecution(repository, runId) {
  return createGitHubRunExecutionIdentity(repository, runId);
}

// src/action/run.ts
var MAX_OUTPUT = 12e3;
function input(name, required = false) {
  const envName = `INPUT_${name.replaceAll("-", "_").toUpperCase()}`;
  const value = process.env[envName]?.trim() ?? "";
  if (required && value === "") throw new Error(`Action input ${name} is required.`);
  return value;
}
function positiveInteger(value, name) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new Error(`Action input ${name} must be a positive integer.`);
  return parsed;
}
async function trustedConfigPath(configPath) {
  const workspace = process.env.GITHUB_WORKSPACE;
  if (!workspace) throw new Error("GITHUB_WORKSPACE is required.");
  if ((0, import_node_path.isAbsolute)(configPath)) throw new Error("config-path must be repository-relative.");
  const workspaceReal = await (0, import_promises.realpath)(workspace);
  const candidate = (0, import_node_path.resolve)(workspaceReal, configPath);
  const candidateReal = await (0, import_promises.realpath)(candidate);
  const rel = (0, import_node_path.relative)(workspaceReal, candidateReal);
  if (rel === "" || rel.startsWith("..") || (0, import_node_path.isAbsolute)(rel)) {
    throw new Error("config-path must resolve to a file inside GITHUB_WORKSPACE.");
  }
  return candidateReal;
}
async function readConfig(configPath) {
  const path = await trustedConfigPath(configPath);
  const text = await (0, import_promises.readFile)(path, "utf8");
  if (text.length > 1e6) throw new Error("Configuration file is too large.");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Configuration file is not valid JSON.");
  }
}
function bounded(value) {
  const json = JSON.stringify(value);
  if (json.length <= MAX_OUTPUT) return json;
  return JSON.stringify({ error: "output_truncated", preview: json.slice(0, MAX_OUTPUT) });
}
function outputValue(value) {
  if (typeof value === "string") return value.replace(/[\r\n]+/g, " ").slice(0, MAX_OUTPUT);
  return bounded(value);
}
async function setOutput(name, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  await (0, import_promises.appendFile)(outputPath, `${name}=${outputValue(value)}
`, "utf8");
}
function previewValue(prepared) {
  if (prepared.status === "skipped") return { status: "skipped", reason: prepared.skipReason };
  return {
    status: "ready",
    destinations: prepared.destinations.map((item) => ({
      destination: item.destination,
      account: item.account,
      text: item.text,
      digest: item.digest,
      contentSource: item.contentSource,
      diagnostics: item.diagnostics,
      validation: item.validation
    }))
  };
}
async function runAction() {
  try {
    const mode = input("mode") || "preview";
    if (mode !== "preview" && mode !== "publish") throw new Error("mode must be preview or publish.");
    const repository = input("repository", true);
    const releaseId = positiveInteger(input("release-id", true), "release-id");
    const configPath = input("config-path", true);
    const token = input("token", true);
    const config = await readConfig(configPath);
    const source = await new GitHubReleaseReader({ token }).read({ repository, releaseId });
    const prepared = prepareRelease(source, config);
    if (mode === "preview") {
      const result2 = previewValue(prepared);
      await setOutput("result", result2);
      await setOutput("aggregate", prepared.status === "skipped" ? "skipped" : "success");
      process.stdout.write(bounded(result2) + "\n");
      return prepared.status === "ready" && prepared.destinations.some((item) => !item.validation.ok) ? 1 : 0;
    }
    const runId = positiveInteger(process.env.GITHUB_RUN_ID ?? "", "GITHUB_RUN_ID");
    const result = await publishPrepared({
      source,
      config,
      repository,
      githubToken: token,
      execution: actionExecution(repository, runId),
      env: process.env
    });
    const output = {
      aggregate: result.aggregate,
      destinations: result.publications ?? []
    };
    await setOutput("result", output);
    await setOutput("aggregate", result.aggregate);
    process.stdout.write(bounded(output) + "\n");
    return result.aggregate === "success" || result.aggregate === "skipped" ? 0 : 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown action failure.";
    const output = { error: message.slice(0, 1e3) };
    await setOutput("result", output);
    await setOutput("aggregate", "failed");
    process.stderr.write(bounded(output) + "\n");
    return 1;
  }
}

// src/action/main.ts
void runAction().then((exitCode) => {
  process.exitCode = exitCode;
}).catch((error) => {
  const message = error instanceof Error ? error.message : "Unexpected action failure.";
  process.stderr.write(JSON.stringify({ error: message.slice(0, 1e3) }) + "\n");
  process.exitCode = 1;
});
