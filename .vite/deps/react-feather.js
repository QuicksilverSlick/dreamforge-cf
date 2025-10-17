import { __commonJS, __toESM } from "./chunk-DbKvDyjX.js";
import { require_react } from "./react-Dzmm40ca.js";

//#region node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js
var require_react_is_development = /* @__PURE__ */ __commonJS({ "node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js": ((exports) => {
	(function() {
		var hasSymbol = typeof Symbol === "function" && Symbol.for;
		var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103;
		var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106;
		var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107;
		var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108;
		var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114;
		var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109;
		var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110;
		var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 60111;
		var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111;
		var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112;
		var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113;
		var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for("react.suspense_list") : 60120;
		var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115;
		var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
		var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for("react.block") : 60121;
		var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for("react.fundamental") : 60117;
		var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118;
		var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 60119;
		function isValidElementType(type) {
			return typeof type === "string" || typeof type === "function" || type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
		}
		function typeOf(object) {
			if (typeof object === "object" && object !== null) {
				var $$typeof = object.$$typeof;
				switch ($$typeof) {
					case REACT_ELEMENT_TYPE:
						var type = object.type;
						switch (type) {
							case REACT_ASYNC_MODE_TYPE:
							case REACT_CONCURRENT_MODE_TYPE:
							case REACT_FRAGMENT_TYPE:
							case REACT_PROFILER_TYPE:
							case REACT_STRICT_MODE_TYPE:
							case REACT_SUSPENSE_TYPE: return type;
							default:
								var $$typeofType = type && type.$$typeof;
								switch ($$typeofType) {
									case REACT_CONTEXT_TYPE:
									case REACT_FORWARD_REF_TYPE:
									case REACT_LAZY_TYPE:
									case REACT_MEMO_TYPE:
									case REACT_PROVIDER_TYPE: return $$typeofType;
									default: return $$typeof;
								}
						}
					case REACT_PORTAL_TYPE: return $$typeof;
				}
			}
		}
		var AsyncMode = REACT_ASYNC_MODE_TYPE;
		var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
		var ContextConsumer = REACT_CONTEXT_TYPE;
		var ContextProvider = REACT_PROVIDER_TYPE;
		var Element = REACT_ELEMENT_TYPE;
		var ForwardRef = REACT_FORWARD_REF_TYPE;
		var Fragment = REACT_FRAGMENT_TYPE;
		var Lazy = REACT_LAZY_TYPE;
		var Memo = REACT_MEMO_TYPE;
		var Portal = REACT_PORTAL_TYPE;
		var Profiler = REACT_PROFILER_TYPE;
		var StrictMode = REACT_STRICT_MODE_TYPE;
		var Suspense = REACT_SUSPENSE_TYPE;
		var hasWarnedAboutDeprecatedIsAsyncMode = false;
		function isAsyncMode(object) {
			if (!hasWarnedAboutDeprecatedIsAsyncMode) {
				hasWarnedAboutDeprecatedIsAsyncMode = true;
				console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
			}
			return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
		}
		function isConcurrentMode(object) {
			return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
		}
		function isContextConsumer(object) {
			return typeOf(object) === REACT_CONTEXT_TYPE;
		}
		function isContextProvider(object) {
			return typeOf(object) === REACT_PROVIDER_TYPE;
		}
		function isElement(object) {
			return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
		}
		function isForwardRef(object) {
			return typeOf(object) === REACT_FORWARD_REF_TYPE;
		}
		function isFragment(object) {
			return typeOf(object) === REACT_FRAGMENT_TYPE;
		}
		function isLazy(object) {
			return typeOf(object) === REACT_LAZY_TYPE;
		}
		function isMemo(object) {
			return typeOf(object) === REACT_MEMO_TYPE;
		}
		function isPortal(object) {
			return typeOf(object) === REACT_PORTAL_TYPE;
		}
		function isProfiler(object) {
			return typeOf(object) === REACT_PROFILER_TYPE;
		}
		function isStrictMode(object) {
			return typeOf(object) === REACT_STRICT_MODE_TYPE;
		}
		function isSuspense(object) {
			return typeOf(object) === REACT_SUSPENSE_TYPE;
		}
		exports.AsyncMode = AsyncMode;
		exports.ConcurrentMode = ConcurrentMode;
		exports.ContextConsumer = ContextConsumer;
		exports.ContextProvider = ContextProvider;
		exports.Element = Element;
		exports.ForwardRef = ForwardRef;
		exports.Fragment = Fragment;
		exports.Lazy = Lazy;
		exports.Memo = Memo;
		exports.Portal = Portal;
		exports.Profiler = Profiler;
		exports.StrictMode = StrictMode;
		exports.Suspense = Suspense;
		exports.isAsyncMode = isAsyncMode;
		exports.isConcurrentMode = isConcurrentMode;
		exports.isContextConsumer = isContextConsumer;
		exports.isContextProvider = isContextProvider;
		exports.isElement = isElement;
		exports.isForwardRef = isForwardRef;
		exports.isFragment = isFragment;
		exports.isLazy = isLazy;
		exports.isMemo = isMemo;
		exports.isPortal = isPortal;
		exports.isProfiler = isProfiler;
		exports.isStrictMode = isStrictMode;
		exports.isSuspense = isSuspense;
		exports.isValidElementType = isValidElementType;
		exports.typeOf = typeOf;
	})();
}) });

//#endregion
//#region node_modules/prop-types/node_modules/react-is/index.js
var require_react_is = /* @__PURE__ */ __commonJS({ "node_modules/prop-types/node_modules/react-is/index.js": ((exports, module) => {
	module.exports = require_react_is_development();
}) });

//#endregion
//#region node_modules/object-assign/index.js
var require_object_assign = /* @__PURE__ */ __commonJS({ "node_modules/object-assign/index.js": ((exports, module) => {
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	function toObject(val) {
		if (val === null || val === void 0) throw new TypeError("Object.assign cannot be called with null or undefined");
		return Object(val);
	}
	function shouldUseNative() {
		try {
			if (!Object.assign) return false;
			var test1 = /* @__PURE__ */ new String("abc");
			test1[5] = "de";
			if (Object.getOwnPropertyNames(test1)[0] === "5") return false;
			var test2 = {};
			for (var i = 0; i < 10; i++) test2["_" + String.fromCharCode(i)] = i;
			if (Object.getOwnPropertyNames(test2).map(function(n) {
				return test2[n];
			}).join("") !== "0123456789") return false;
			var test3 = {};
			"abcdefghijklmnopqrst".split("").forEach(function(letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") return false;
			return true;
		} catch (err) {
			return false;
		}
	}
	module.exports = shouldUseNative() ? Object.assign : function(target, source) {
		var from;
		var to = toObject(target);
		var symbols;
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
			for (var key in from) if (hasOwnProperty.call(from, key)) to[key] = from[key];
			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) if (propIsEnumerable.call(from, symbols[i])) to[symbols[i]] = from[symbols[i]];
			}
		}
		return to;
	};
}) });

//#endregion
//#region node_modules/prop-types/lib/ReactPropTypesSecret.js
var require_ReactPropTypesSecret = /* @__PURE__ */ __commonJS({ "node_modules/prop-types/lib/ReactPropTypesSecret.js": ((exports, module) => {
	var ReactPropTypesSecret$2 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
	module.exports = ReactPropTypesSecret$2;
}) });

//#endregion
//#region node_modules/prop-types/lib/has.js
var require_has = /* @__PURE__ */ __commonJS({ "node_modules/prop-types/lib/has.js": ((exports, module) => {
	module.exports = Function.call.bind(Object.prototype.hasOwnProperty);
}) });

//#endregion
//#region node_modules/prop-types/checkPropTypes.js
var require_checkPropTypes = /* @__PURE__ */ __commonJS({ "node_modules/prop-types/checkPropTypes.js": ((exports, module) => {
	var printWarning$1 = function() {};
	var ReactPropTypesSecret$1 = require_ReactPropTypesSecret();
	var loggedTypeFailures = {};
	var has$1 = require_has();
	printWarning$1 = function(text) {
		var message = "Warning: " + text;
		if (typeof console !== "undefined") console.error(message);
		try {
			throw new Error(message);
		} catch (x) {}
	};
	/**
	* Assert that the values match with the type specs.
	* Error messages are memorized and will only be shown once.
	*
	* @param {object} typeSpecs Map of name to a ReactPropType
	* @param {object} values Runtime values that need to be type-checked
	* @param {string} location e.g. "prop", "context", "child context"
	* @param {string} componentName Name of the component for error messages.
	* @param {?Function} getStack Returns the component stack.
	* @private
	*/
	function checkPropTypes$1(typeSpecs, values, location, componentName, getStack) {
		for (var typeSpecName in typeSpecs) if (has$1(typeSpecs, typeSpecName)) {
			var error;
			try {
				if (typeof typeSpecs[typeSpecName] !== "function") {
					var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
					err.name = "Invariant Violation";
					throw err;
				}
				error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
			} catch (ex) {
				error = ex;
			}
			if (error && !(error instanceof Error)) printWarning$1((componentName || "React class") + ": type specification of " + location + " `" + typeSpecName + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof error + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).");
			if (error instanceof Error && !(error.message in loggedTypeFailures)) {
				loggedTypeFailures[error.message] = true;
				var stack = getStack ? getStack() : "";
				printWarning$1("Failed " + location + " type: " + error.message + (stack != null ? stack : ""));
			}
		}
	}
	/**
	* Resets warning cache when testing.
	*
	* @private
	*/
	checkPropTypes$1.resetWarningCache = function() {
		loggedTypeFailures = {};
	};
	module.exports = checkPropTypes$1;
}) });

//#endregion
//#region node_modules/prop-types/factoryWithTypeCheckers.js
var require_factoryWithTypeCheckers = /* @__PURE__ */ __commonJS({ "node_modules/prop-types/factoryWithTypeCheckers.js": ((exports, module) => {
	var ReactIs$1 = require_react_is();
	var assign = require_object_assign();
	var ReactPropTypesSecret = require_ReactPropTypesSecret();
	var has = require_has();
	var checkPropTypes = require_checkPropTypes();
	var printWarning = function() {};
	printWarning = function(text) {
		var message = "Warning: " + text;
		if (typeof console !== "undefined") console.error(message);
		try {
			throw new Error(message);
		} catch (x) {}
	};
	function emptyFunctionThatReturnsNull() {
		return null;
	}
	module.exports = function(isValidElement, throwOnDirectAccess$1) {
		var ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
		var FAUX_ITERATOR_SYMBOL = "@@iterator";
		/**
		* Returns the iterator method function contained on the iterable object.
		*
		* Be sure to invoke the function with the iterable as context:
		*
		*     var iteratorFn = getIteratorFn(myIterable);
		*     if (iteratorFn) {
		*       var iterator = iteratorFn.call(myIterable);
		*       ...
		*     }
		*
		* @param {?object} maybeIterable
		* @return {?function}
		*/
		function getIteratorFn(maybeIterable) {
			var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
			if (typeof iteratorFn === "function") return iteratorFn;
		}
		/**
		* Collection of methods that allow declaration and validation of props that are
		* supplied to React components. Example usage:
		*
		*   var Props = require('ReactPropTypes');
		*   var MyArticle = React.createClass({
		*     propTypes: {
		*       // An optional string prop named "description".
		*       description: Props.string,
		*
		*       // A required enum prop named "category".
		*       category: Props.oneOf(['News','Photos']).isRequired,
		*
		*       // A prop named "dialog" that requires an instance of Dialog.
		*       dialog: Props.instanceOf(Dialog).isRequired
		*     },
		*     render: function() { ... }
		*   });
		*
		* A more formal specification of how these methods are used:
		*
		*   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
		*   decl := ReactPropTypes.{type}(.isRequired)?
		*
		* Each and every declaration produces a function with the same signature. This
		* allows the creation of custom validation functions. For example:
		*
		*  var MyLink = React.createClass({
		*    propTypes: {
		*      // An optional string or URI prop named "href".
		*      href: function(props, propName, componentName) {
		*        var propValue = props[propName];
		*        if (propValue != null && typeof propValue !== 'string' &&
		*            !(propValue instanceof URI)) {
		*          return new Error(
		*            'Expected a string or an URI for ' + propName + ' in ' +
		*            componentName
		*          );
		*        }
		*      }
		*    },
		*    render: function() {...}
		*  });
		*
		* @internal
		*/
		var ANONYMOUS = "<<anonymous>>";
		var ReactPropTypes = {
			array: createPrimitiveTypeChecker("array"),
			bigint: createPrimitiveTypeChecker("bigint"),
			bool: createPrimitiveTypeChecker("boolean"),
			func: createPrimitiveTypeChecker("function"),
			number: createPrimitiveTypeChecker("number"),
			object: createPrimitiveTypeChecker("object"),
			string: createPrimitiveTypeChecker("string"),
			symbol: createPrimitiveTypeChecker("symbol"),
			any: createAnyTypeChecker(),
			arrayOf: createArrayOfTypeChecker,
			element: createElementTypeChecker(),
			elementType: createElementTypeTypeChecker(),
			instanceOf: createInstanceTypeChecker,
			node: createNodeChecker(),
			objectOf: createObjectOfTypeChecker,
			oneOf: createEnumTypeChecker,
			oneOfType: createUnionTypeChecker,
			shape: createShapeTypeChecker,
			exact: createStrictShapeTypeChecker
		};
		/**
		* inlined Object.is polyfill to avoid requiring consumers ship their own
		* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
		*/
		function is(x, y) {
			if (x === y) return x !== 0 || 1 / x === 1 / y;
			else return x !== x && y !== y;
		}
		/**
		* We use an Error-like object for backward compatibility as people may call
		* PropTypes directly and inspect their output. However, we don't use real
		* Errors anymore. We don't inspect their stack anyway, and creating them
		* is prohibitively expensive if they are created too often, such as what
		* happens in oneOfType() for any type before the one that matched.
		*/
		function PropTypeError(message, data) {
			this.message = message;
			this.data = data && typeof data === "object" ? data : {};
			this.stack = "";
		}
		PropTypeError.prototype = Error.prototype;
		function createChainableTypeChecker(validate) {
			var manualPropTypeCallCache = {};
			var manualPropTypeWarningCount = 0;
			function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
				componentName = componentName || ANONYMOUS;
				propFullName = propFullName || propName;
				if (secret !== ReactPropTypesSecret) {
					if (throwOnDirectAccess$1) {
						var err = /* @__PURE__ */ new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");
						err.name = "Invariant Violation";
						throw err;
					} else if (typeof console !== "undefined") {
						var cacheKey = componentName + ":" + propName;
						if (!manualPropTypeCallCache[cacheKey] && manualPropTypeWarningCount < 3) {
							printWarning("You are manually calling a React.PropTypes validation function for the `" + propFullName + "` prop on `" + componentName + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details.");
							manualPropTypeCallCache[cacheKey] = true;
							manualPropTypeWarningCount++;
						}
					}
				}
				if (props[propName] == null) {
					if (isRequired) {
						if (props[propName] === null) return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required " + ("in `" + componentName + "`, but its value is `null`."));
						return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required in " + ("`" + componentName + "`, but its value is `undefined`."));
					}
					return null;
				} else return validate(props, propName, componentName, location, propFullName);
			}
			var chainedCheckType = checkType.bind(null, false);
			chainedCheckType.isRequired = checkType.bind(null, true);
			return chainedCheckType;
		}
		function createPrimitiveTypeChecker(expectedType) {
			function validate(props, propName, componentName, location, propFullName, secret) {
				var propValue = props[propName];
				if (getPropType(propValue) !== expectedType) {
					var preciseType = getPreciseType(propValue);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + preciseType + "` supplied to `" + componentName + "`, expected ") + ("`" + expectedType + "`."), { expectedType });
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createAnyTypeChecker() {
			return createChainableTypeChecker(emptyFunctionThatReturnsNull);
		}
		function createArrayOfTypeChecker(typeChecker) {
			function validate(props, propName, componentName, location, propFullName) {
				if (typeof typeChecker !== "function") return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside arrayOf.");
				var propValue = props[propName];
				if (!Array.isArray(propValue)) {
					var propType = getPropType(propValue);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an array."));
				}
				for (var i = 0; i < propValue.length; i++) {
					var error = typeChecker(propValue, i, componentName, location, propFullName + "[" + i + "]", ReactPropTypesSecret);
					if (error instanceof Error) return error;
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createElementTypeChecker() {
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				if (!isValidElement(propValue)) {
					var propType = getPropType(propValue);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement."));
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createElementTypeTypeChecker() {
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				if (!ReactIs$1.isValidElementType(propValue)) {
					var propType = getPropType(propValue);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement type."));
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createInstanceTypeChecker(expectedClass) {
			function validate(props, propName, componentName, location, propFullName) {
				if (!(props[propName] instanceof expectedClass)) {
					var expectedClassName = expectedClass.name || ANONYMOUS;
					var actualClassName = getClassName(props[propName]);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + actualClassName + "` supplied to `" + componentName + "`, expected ") + ("instance of `" + expectedClassName + "`."));
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createEnumTypeChecker(expectedValues) {
			if (!Array.isArray(expectedValues)) {
				if (arguments.length > 1) printWarning("Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).");
				else printWarning("Invalid argument supplied to oneOf, expected an array.");
				return emptyFunctionThatReturnsNull;
			}
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				for (var i = 0; i < expectedValues.length; i++) if (is(propValue, expectedValues[i])) return null;
				var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
					if (getPreciseType(value) === "symbol") return String(value);
					return value;
				});
				return new PropTypeError("Invalid " + location + " `" + propFullName + "` of value `" + String(propValue) + "` " + ("supplied to `" + componentName + "`, expected one of " + valuesString + "."));
			}
			return createChainableTypeChecker(validate);
		}
		function createObjectOfTypeChecker(typeChecker) {
			function validate(props, propName, componentName, location, propFullName) {
				if (typeof typeChecker !== "function") return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside objectOf.");
				var propValue = props[propName];
				var propType = getPropType(propValue);
				if (propType !== "object") return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an object."));
				for (var key in propValue) if (has(propValue, key)) {
					var error = typeChecker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
					if (error instanceof Error) return error;
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createUnionTypeChecker(arrayOfTypeCheckers) {
			if (!Array.isArray(arrayOfTypeCheckers)) {
				printWarning("Invalid argument supplied to oneOfType, expected an instance of array.");
				return emptyFunctionThatReturnsNull;
			}
			for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
				var checker = arrayOfTypeCheckers[i];
				if (typeof checker !== "function") {
					printWarning("Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + getPostfixForTypeWarning(checker) + " at index " + i + ".");
					return emptyFunctionThatReturnsNull;
				}
			}
			function validate(props, propName, componentName, location, propFullName) {
				var expectedTypes = [];
				for (var i$1 = 0; i$1 < arrayOfTypeCheckers.length; i$1++) {
					var checker$1 = arrayOfTypeCheckers[i$1];
					var checkerResult = checker$1(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
					if (checkerResult == null) return null;
					if (checkerResult.data && has(checkerResult.data, "expectedType")) expectedTypes.push(checkerResult.data.expectedType);
				}
				var expectedTypesMessage = expectedTypes.length > 0 ? ", expected one of type [" + expectedTypes.join(", ") + "]" : "";
				return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`" + expectedTypesMessage + "."));
			}
			return createChainableTypeChecker(validate);
		}
		function createNodeChecker() {
			function validate(props, propName, componentName, location, propFullName) {
				if (!isNode(props[propName])) return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`, expected a ReactNode."));
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function invalidValidatorError(componentName, location, propFullName, key, type) {
			return new PropTypeError((componentName || "React class") + ": " + location + " type `" + propFullName + "." + key + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + type + "`.");
		}
		function createShapeTypeChecker(shapeTypes) {
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				var propType = getPropType(propValue);
				if (propType !== "object") return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
				for (var key in shapeTypes) {
					var checker = shapeTypes[key];
					if (typeof checker !== "function") return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
					var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
					if (error) return error;
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createStrictShapeTypeChecker(shapeTypes) {
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				var propType = getPropType(propValue);
				if (propType !== "object") return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
				for (var key in assign({}, props[propName], shapeTypes)) {
					var checker = shapeTypes[key];
					if (has(shapeTypes, key) && typeof checker !== "function") return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
					if (!checker) return new PropTypeError("Invalid " + location + " `" + propFullName + "` key `" + key + "` supplied to `" + componentName + "`.\nBad object: " + JSON.stringify(props[propName], null, "  ") + "\nValid keys: " + JSON.stringify(Object.keys(shapeTypes), null, "  "));
					var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
					if (error) return error;
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function isNode(propValue) {
			switch (typeof propValue) {
				case "number":
				case "string":
				case "undefined": return true;
				case "boolean": return !propValue;
				case "object":
					if (Array.isArray(propValue)) return propValue.every(isNode);
					if (propValue === null || isValidElement(propValue)) return true;
					var iteratorFn = getIteratorFn(propValue);
					if (iteratorFn) {
						var iterator = iteratorFn.call(propValue);
						var step;
						if (iteratorFn !== propValue.entries) {
							while (!(step = iterator.next()).done) if (!isNode(step.value)) return false;
						} else while (!(step = iterator.next()).done) {
							var entry = step.value;
							if (entry) {
								if (!isNode(entry[1])) return false;
							}
						}
					} else return false;
					return true;
				default: return false;
			}
		}
		function isSymbol(propType, propValue) {
			if (propType === "symbol") return true;
			if (!propValue) return false;
			if (propValue["@@toStringTag"] === "Symbol") return true;
			if (typeof Symbol === "function" && propValue instanceof Symbol) return true;
			return false;
		}
		function getPropType(propValue) {
			var propType = typeof propValue;
			if (Array.isArray(propValue)) return "array";
			if (propValue instanceof RegExp) return "object";
			if (isSymbol(propType, propValue)) return "symbol";
			return propType;
		}
		function getPreciseType(propValue) {
			if (typeof propValue === "undefined" || propValue === null) return "" + propValue;
			var propType = getPropType(propValue);
			if (propType === "object") {
				if (propValue instanceof Date) return "date";
				else if (propValue instanceof RegExp) return "regexp";
			}
			return propType;
		}
		function getPostfixForTypeWarning(value) {
			var type = getPreciseType(value);
			switch (type) {
				case "array":
				case "object": return "an " + type;
				case "boolean":
				case "date":
				case "regexp": return "a " + type;
				default: return type;
			}
		}
		function getClassName(propValue) {
			if (!propValue.constructor || !propValue.constructor.name) return ANONYMOUS;
			return propValue.constructor.name;
		}
		ReactPropTypes.checkPropTypes = checkPropTypes;
		ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
		ReactPropTypes.PropTypes = ReactPropTypes;
		return ReactPropTypes;
	};
}) });

//#endregion
//#region node_modules/prop-types/index.js
var require_prop_types = /* @__PURE__ */ __commonJS({ "node_modules/prop-types/index.js": ((exports, module) => {
	var ReactIs = require_react_is();
	var throwOnDirectAccess = true;
	module.exports = require_factoryWithTypeCheckers()(ReactIs.isElement, throwOnDirectAccess);
}) });

//#endregion
//#region node_modules/react-feather/dist/icons/activity.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_prop_types$286 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$286() {
	_extends$286 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$286.apply(this, arguments);
}
function _objectWithoutProperties$286(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$286(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$286(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Activity = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$286(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$286({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" }));
});
Activity.propTypes = {
	color: import_prop_types$286.default.string,
	size: import_prop_types$286.default.oneOfType([import_prop_types$286.default.string, import_prop_types$286.default.number])
};
Activity.displayName = "Activity";
var activity_default = Activity;

//#endregion
//#region node_modules/react-feather/dist/icons/airplay.js
var import_prop_types$285 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$285() {
	_extends$285 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$285.apply(this, arguments);
}
function _objectWithoutProperties$285(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$285(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$285(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Airplay = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$285(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$285({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" }), /* @__PURE__ */ import_react.createElement("polygon", { points: "12 15 17 21 7 21 12 15" }));
});
Airplay.propTypes = {
	color: import_prop_types$285.default.string,
	size: import_prop_types$285.default.oneOfType([import_prop_types$285.default.string, import_prop_types$285.default.number])
};
Airplay.displayName = "Airplay";
var airplay_default = Airplay;

//#endregion
//#region node_modules/react-feather/dist/icons/alert-circle.js
var import_prop_types$284 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$284() {
	_extends$284 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$284.apply(this, arguments);
}
function _objectWithoutProperties$284(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$284(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$284(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var AlertCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$284(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$284({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "8",
		x2: "12",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "16",
		x2: "12.01",
		y2: "16"
	}));
});
AlertCircle.propTypes = {
	color: import_prop_types$284.default.string,
	size: import_prop_types$284.default.oneOfType([import_prop_types$284.default.string, import_prop_types$284.default.number])
};
AlertCircle.displayName = "AlertCircle";
var alert_circle_default = AlertCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/alert-octagon.js
var import_prop_types$283 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$283() {
	_extends$283 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$283.apply(this, arguments);
}
function _objectWithoutProperties$283(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$283(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$283(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var AlertOctagon = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$283(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$283({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "8",
		x2: "12",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "16",
		x2: "12.01",
		y2: "16"
	}));
});
AlertOctagon.propTypes = {
	color: import_prop_types$283.default.string,
	size: import_prop_types$283.default.oneOfType([import_prop_types$283.default.string, import_prop_types$283.default.number])
};
AlertOctagon.displayName = "AlertOctagon";
var alert_octagon_default = AlertOctagon;

//#endregion
//#region node_modules/react-feather/dist/icons/alert-triangle.js
var import_prop_types$282 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$282() {
	_extends$282 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$282.apply(this, arguments);
}
function _objectWithoutProperties$282(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$282(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$282(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var AlertTriangle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$282(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$282({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "9",
		x2: "12",
		y2: "13"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "17",
		x2: "12.01",
		y2: "17"
	}));
});
AlertTriangle.propTypes = {
	color: import_prop_types$282.default.string,
	size: import_prop_types$282.default.oneOfType([import_prop_types$282.default.string, import_prop_types$282.default.number])
};
AlertTriangle.displayName = "AlertTriangle";
var alert_triangle_default = AlertTriangle;

//#endregion
//#region node_modules/react-feather/dist/icons/align-center.js
var import_prop_types$281 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$281() {
	_extends$281 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$281.apply(this, arguments);
}
function _objectWithoutProperties$281(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$281(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$281(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var AlignCenter = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$281(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$281({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "18",
		y1: "10",
		x2: "6",
		y2: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "6",
		x2: "3",
		y2: "6"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "14",
		x2: "3",
		y2: "14"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "18",
		y1: "18",
		x2: "6",
		y2: "18"
	}));
});
AlignCenter.propTypes = {
	color: import_prop_types$281.default.string,
	size: import_prop_types$281.default.oneOfType([import_prop_types$281.default.string, import_prop_types$281.default.number])
};
AlignCenter.displayName = "AlignCenter";
var align_center_default = AlignCenter;

//#endregion
//#region node_modules/react-feather/dist/icons/align-justify.js
var import_prop_types$280 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$280() {
	_extends$280 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$280.apply(this, arguments);
}
function _objectWithoutProperties$280(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$280(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$280(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var AlignJustify = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$280(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$280({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "10",
		x2: "3",
		y2: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "6",
		x2: "3",
		y2: "6"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "14",
		x2: "3",
		y2: "14"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "18",
		x2: "3",
		y2: "18"
	}));
});
AlignJustify.propTypes = {
	color: import_prop_types$280.default.string,
	size: import_prop_types$280.default.oneOfType([import_prop_types$280.default.string, import_prop_types$280.default.number])
};
AlignJustify.displayName = "AlignJustify";
var align_justify_default = AlignJustify;

//#endregion
//#region node_modules/react-feather/dist/icons/align-left.js
var import_prop_types$279 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$279() {
	_extends$279 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$279.apply(this, arguments);
}
function _objectWithoutProperties$279(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$279(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$279(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var AlignLeft = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$279(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$279({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "17",
		y1: "10",
		x2: "3",
		y2: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "6",
		x2: "3",
		y2: "6"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "14",
		x2: "3",
		y2: "14"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "17",
		y1: "18",
		x2: "3",
		y2: "18"
	}));
});
AlignLeft.propTypes = {
	color: import_prop_types$279.default.string,
	size: import_prop_types$279.default.oneOfType([import_prop_types$279.default.string, import_prop_types$279.default.number])
};
AlignLeft.displayName = "AlignLeft";
var align_left_default = AlignLeft;

//#endregion
//#region node_modules/react-feather/dist/icons/align-right.js
var import_prop_types$278 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$278() {
	_extends$278 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$278.apply(this, arguments);
}
function _objectWithoutProperties$278(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$278(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$278(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var AlignRight = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$278(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$278({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "10",
		x2: "7",
		y2: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "6",
		x2: "3",
		y2: "6"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "14",
		x2: "3",
		y2: "14"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "18",
		x2: "7",
		y2: "18"
	}));
});
AlignRight.propTypes = {
	color: import_prop_types$278.default.string,
	size: import_prop_types$278.default.oneOfType([import_prop_types$278.default.string, import_prop_types$278.default.number])
};
AlignRight.displayName = "AlignRight";
var align_right_default = AlignRight;

//#endregion
//#region node_modules/react-feather/dist/icons/anchor.js
var import_prop_types$277 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$277() {
	_extends$277 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$277.apply(this, arguments);
}
function _objectWithoutProperties$277(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$277(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$277(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Anchor = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$277(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$277({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "5",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "22",
		x2: "12",
		y2: "8"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M5 12H2a10 10 0 0 0 20 0h-3" }));
});
Anchor.propTypes = {
	color: import_prop_types$277.default.string,
	size: import_prop_types$277.default.oneOfType([import_prop_types$277.default.string, import_prop_types$277.default.number])
};
Anchor.displayName = "Anchor";
var anchor_default = Anchor;

//#endregion
//#region node_modules/react-feather/dist/icons/aperture.js
var import_prop_types$276 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$276() {
	_extends$276 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$276.apply(this, arguments);
}
function _objectWithoutProperties$276(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$276(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$276(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Aperture = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$276(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$276({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "14.31",
		y1: "8",
		x2: "20.05",
		y2: "17.94"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9.69",
		y1: "8",
		x2: "21.17",
		y2: "8"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "7.38",
		y1: "12",
		x2: "13.12",
		y2: "2.06"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9.69",
		y1: "16",
		x2: "3.95",
		y2: "6.06"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "14.31",
		y1: "16",
		x2: "2.83",
		y2: "16"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16.62",
		y1: "12",
		x2: "10.88",
		y2: "21.94"
	}));
});
Aperture.propTypes = {
	color: import_prop_types$276.default.string,
	size: import_prop_types$276.default.oneOfType([import_prop_types$276.default.string, import_prop_types$276.default.number])
};
Aperture.displayName = "Aperture";
var aperture_default = Aperture;

//#endregion
//#region node_modules/react-feather/dist/icons/archive.js
var import_prop_types$275 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$275() {
	_extends$275 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$275.apply(this, arguments);
}
function _objectWithoutProperties$275(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$275(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$275(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Archive = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$275(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$275({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "21 8 21 21 3 21 3 8" }), /* @__PURE__ */ import_react.createElement("rect", {
		x: "1",
		y: "3",
		width: "22",
		height: "5"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "10",
		y1: "12",
		x2: "14",
		y2: "12"
	}));
});
Archive.propTypes = {
	color: import_prop_types$275.default.string,
	size: import_prop_types$275.default.oneOfType([import_prop_types$275.default.string, import_prop_types$275.default.number])
};
Archive.displayName = "Archive";
var archive_default = Archive;

//#endregion
//#region node_modules/react-feather/dist/icons/arrow-down-circle.js
var import_prop_types$274 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$274() {
	_extends$274 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$274.apply(this, arguments);
}
function _objectWithoutProperties$274(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$274(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$274(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ArrowDownCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$274(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$274({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "8 12 12 16 16 12" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "8",
		x2: "12",
		y2: "16"
	}));
});
ArrowDownCircle.propTypes = {
	color: import_prop_types$274.default.string,
	size: import_prop_types$274.default.oneOfType([import_prop_types$274.default.string, import_prop_types$274.default.number])
};
ArrowDownCircle.displayName = "ArrowDownCircle";
var arrow_down_circle_default = ArrowDownCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/arrow-down-left.js
var import_prop_types$273 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$273() {
	_extends$273 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$273.apply(this, arguments);
}
function _objectWithoutProperties$273(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$273(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$273(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ArrowDownLeft = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$273(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$273({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "17",
		y1: "7",
		x2: "7",
		y2: "17"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "17 17 7 17 7 7" }));
});
ArrowDownLeft.propTypes = {
	color: import_prop_types$273.default.string,
	size: import_prop_types$273.default.oneOfType([import_prop_types$273.default.string, import_prop_types$273.default.number])
};
ArrowDownLeft.displayName = "ArrowDownLeft";
var arrow_down_left_default = ArrowDownLeft;

//#endregion
//#region node_modules/react-feather/dist/icons/arrow-down-right.js
var import_prop_types$272 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$272() {
	_extends$272 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$272.apply(this, arguments);
}
function _objectWithoutProperties$272(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$272(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$272(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ArrowDownRight = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$272(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$272({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "7",
		y1: "7",
		x2: "17",
		y2: "17"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "17 7 17 17 7 17" }));
});
ArrowDownRight.propTypes = {
	color: import_prop_types$272.default.string,
	size: import_prop_types$272.default.oneOfType([import_prop_types$272.default.string, import_prop_types$272.default.number])
};
ArrowDownRight.displayName = "ArrowDownRight";
var arrow_down_right_default = ArrowDownRight;

//#endregion
//#region node_modules/react-feather/dist/icons/arrow-down.js
var import_prop_types$271 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$271() {
	_extends$271 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$271.apply(this, arguments);
}
function _objectWithoutProperties$271(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$271(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$271(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ArrowDown = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$271(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$271({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "5",
		x2: "12",
		y2: "19"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "19 12 12 19 5 12" }));
});
ArrowDown.propTypes = {
	color: import_prop_types$271.default.string,
	size: import_prop_types$271.default.oneOfType([import_prop_types$271.default.string, import_prop_types$271.default.number])
};
ArrowDown.displayName = "ArrowDown";
var arrow_down_default = ArrowDown;

//#endregion
//#region node_modules/react-feather/dist/icons/arrow-left-circle.js
var import_prop_types$270 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$270() {
	_extends$270 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$270.apply(this, arguments);
}
function _objectWithoutProperties$270(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$270(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$270(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ArrowLeftCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$270(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$270({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "12 8 8 12 12 16" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16",
		y1: "12",
		x2: "8",
		y2: "12"
	}));
});
ArrowLeftCircle.propTypes = {
	color: import_prop_types$270.default.string,
	size: import_prop_types$270.default.oneOfType([import_prop_types$270.default.string, import_prop_types$270.default.number])
};
ArrowLeftCircle.displayName = "ArrowLeftCircle";
var arrow_left_circle_default = ArrowLeftCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/arrow-left.js
var import_prop_types$269 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$269() {
	_extends$269 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$269.apply(this, arguments);
}
function _objectWithoutProperties$269(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$269(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$269(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ArrowLeft = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$269(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$269({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "19",
		y1: "12",
		x2: "5",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "12 19 5 12 12 5" }));
});
ArrowLeft.propTypes = {
	color: import_prop_types$269.default.string,
	size: import_prop_types$269.default.oneOfType([import_prop_types$269.default.string, import_prop_types$269.default.number])
};
ArrowLeft.displayName = "ArrowLeft";
var arrow_left_default = ArrowLeft;

//#endregion
//#region node_modules/react-feather/dist/icons/arrow-right-circle.js
var import_prop_types$268 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$268() {
	_extends$268 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$268.apply(this, arguments);
}
function _objectWithoutProperties$268(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$268(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$268(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ArrowRightCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$268(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$268({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "12 16 16 12 12 8" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "12",
		x2: "16",
		y2: "12"
	}));
});
ArrowRightCircle.propTypes = {
	color: import_prop_types$268.default.string,
	size: import_prop_types$268.default.oneOfType([import_prop_types$268.default.string, import_prop_types$268.default.number])
};
ArrowRightCircle.displayName = "ArrowRightCircle";
var arrow_right_circle_default = ArrowRightCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/arrow-right.js
var import_prop_types$267 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$267() {
	_extends$267 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$267.apply(this, arguments);
}
function _objectWithoutProperties$267(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$267(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$267(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ArrowRight = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$267(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$267({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "5",
		y1: "12",
		x2: "19",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "12 5 19 12 12 19" }));
});
ArrowRight.propTypes = {
	color: import_prop_types$267.default.string,
	size: import_prop_types$267.default.oneOfType([import_prop_types$267.default.string, import_prop_types$267.default.number])
};
ArrowRight.displayName = "ArrowRight";
var arrow_right_default = ArrowRight;

//#endregion
//#region node_modules/react-feather/dist/icons/arrow-up-circle.js
var import_prop_types$266 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$266() {
	_extends$266 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$266.apply(this, arguments);
}
function _objectWithoutProperties$266(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$266(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$266(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ArrowUpCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$266(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$266({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "16 12 12 8 8 12" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "16",
		x2: "12",
		y2: "8"
	}));
});
ArrowUpCircle.propTypes = {
	color: import_prop_types$266.default.string,
	size: import_prop_types$266.default.oneOfType([import_prop_types$266.default.string, import_prop_types$266.default.number])
};
ArrowUpCircle.displayName = "ArrowUpCircle";
var arrow_up_circle_default = ArrowUpCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/arrow-up-left.js
var import_prop_types$265 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$265() {
	_extends$265 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$265.apply(this, arguments);
}
function _objectWithoutProperties$265(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$265(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$265(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ArrowUpLeft = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$265(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$265({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "17",
		y1: "17",
		x2: "7",
		y2: "7"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "7 17 7 7 17 7" }));
});
ArrowUpLeft.propTypes = {
	color: import_prop_types$265.default.string,
	size: import_prop_types$265.default.oneOfType([import_prop_types$265.default.string, import_prop_types$265.default.number])
};
ArrowUpLeft.displayName = "ArrowUpLeft";
var arrow_up_left_default = ArrowUpLeft;

//#endregion
//#region node_modules/react-feather/dist/icons/arrow-up-right.js
var import_prop_types$264 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$264() {
	_extends$264 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$264.apply(this, arguments);
}
function _objectWithoutProperties$264(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$264(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$264(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ArrowUpRight = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$264(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$264({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "7",
		y1: "17",
		x2: "17",
		y2: "7"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "7 7 17 7 17 17" }));
});
ArrowUpRight.propTypes = {
	color: import_prop_types$264.default.string,
	size: import_prop_types$264.default.oneOfType([import_prop_types$264.default.string, import_prop_types$264.default.number])
};
ArrowUpRight.displayName = "ArrowUpRight";
var arrow_up_right_default = ArrowUpRight;

//#endregion
//#region node_modules/react-feather/dist/icons/arrow-up.js
var import_prop_types$263 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$263() {
	_extends$263 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$263.apply(this, arguments);
}
function _objectWithoutProperties$263(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$263(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$263(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ArrowUp = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$263(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$263({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "19",
		x2: "12",
		y2: "5"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "5 12 12 5 19 12" }));
});
ArrowUp.propTypes = {
	color: import_prop_types$263.default.string,
	size: import_prop_types$263.default.oneOfType([import_prop_types$263.default.string, import_prop_types$263.default.number])
};
ArrowUp.displayName = "ArrowUp";
var arrow_up_default = ArrowUp;

//#endregion
//#region node_modules/react-feather/dist/icons/at-sign.js
var import_prop_types$262 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$262() {
	_extends$262 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$262.apply(this, arguments);
}
function _objectWithoutProperties$262(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$262(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$262(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var AtSign = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$262(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$262({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "4"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" }));
});
AtSign.propTypes = {
	color: import_prop_types$262.default.string,
	size: import_prop_types$262.default.oneOfType([import_prop_types$262.default.string, import_prop_types$262.default.number])
};
AtSign.displayName = "AtSign";
var at_sign_default = AtSign;

//#endregion
//#region node_modules/react-feather/dist/icons/award.js
var import_prop_types$261 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$261() {
	_extends$261 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$261.apply(this, arguments);
}
function _objectWithoutProperties$261(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$261(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$261(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Award = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$261(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$261({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "8",
		r: "7"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "8.21 13.89 7 23 12 20 17 23 15.79 13.88" }));
});
Award.propTypes = {
	color: import_prop_types$261.default.string,
	size: import_prop_types$261.default.oneOfType([import_prop_types$261.default.string, import_prop_types$261.default.number])
};
Award.displayName = "Award";
var award_default = Award;

//#endregion
//#region node_modules/react-feather/dist/icons/bar-chart-2.js
var import_prop_types$260 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$260() {
	_extends$260 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$260.apply(this, arguments);
}
function _objectWithoutProperties$260(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$260(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$260(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var BarChart2 = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$260(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$260({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "18",
		y1: "20",
		x2: "18",
		y2: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "20",
		x2: "12",
		y2: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "6",
		y1: "20",
		x2: "6",
		y2: "14"
	}));
});
BarChart2.propTypes = {
	color: import_prop_types$260.default.string,
	size: import_prop_types$260.default.oneOfType([import_prop_types$260.default.string, import_prop_types$260.default.number])
};
BarChart2.displayName = "BarChart2";
var bar_chart_2_default = BarChart2;

//#endregion
//#region node_modules/react-feather/dist/icons/bar-chart.js
var import_prop_types$259 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$259() {
	_extends$259 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$259.apply(this, arguments);
}
function _objectWithoutProperties$259(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$259(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$259(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var BarChart = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$259(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$259({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "20",
		x2: "12",
		y2: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "18",
		y1: "20",
		x2: "18",
		y2: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "6",
		y1: "20",
		x2: "6",
		y2: "16"
	}));
});
BarChart.propTypes = {
	color: import_prop_types$259.default.string,
	size: import_prop_types$259.default.oneOfType([import_prop_types$259.default.string, import_prop_types$259.default.number])
};
BarChart.displayName = "BarChart";
var bar_chart_default = BarChart;

//#endregion
//#region node_modules/react-feather/dist/icons/battery-charging.js
var import_prop_types$258 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$258() {
	_extends$258 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$258.apply(this, arguments);
}
function _objectWithoutProperties$258(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$258(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$258(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var BatteryCharging = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$258(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$258({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "23",
		y1: "13",
		x2: "23",
		y2: "11"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "11 6 7 12 13 12 9 18" }));
});
BatteryCharging.propTypes = {
	color: import_prop_types$258.default.string,
	size: import_prop_types$258.default.oneOfType([import_prop_types$258.default.string, import_prop_types$258.default.number])
};
BatteryCharging.displayName = "BatteryCharging";
var battery_charging_default = BatteryCharging;

//#endregion
//#region node_modules/react-feather/dist/icons/battery.js
var import_prop_types$257 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$257() {
	_extends$257 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$257.apply(this, arguments);
}
function _objectWithoutProperties$257(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$257(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$257(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Battery = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$257(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$257({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "1",
		y: "6",
		width: "18",
		height: "12",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "23",
		y1: "13",
		x2: "23",
		y2: "11"
	}));
});
Battery.propTypes = {
	color: import_prop_types$257.default.string,
	size: import_prop_types$257.default.oneOfType([import_prop_types$257.default.string, import_prop_types$257.default.number])
};
Battery.displayName = "Battery";
var battery_default = Battery;

//#endregion
//#region node_modules/react-feather/dist/icons/bell-off.js
var import_prop_types$256 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$256() {
	_extends$256 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$256.apply(this, arguments);
}
function _objectWithoutProperties$256(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$256(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$256(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var BellOff = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$256(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$256({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" }), /* @__PURE__ */ import_react.createElement("path", { d: "M18.63 13A17.89 17.89 0 0 1 18 8" }), /* @__PURE__ */ import_react.createElement("path", { d: "M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" }), /* @__PURE__ */ import_react.createElement("path", { d: "M18 8a6 6 0 0 0-9.33-5" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "1",
		x2: "23",
		y2: "23"
	}));
});
BellOff.propTypes = {
	color: import_prop_types$256.default.string,
	size: import_prop_types$256.default.oneOfType([import_prop_types$256.default.string, import_prop_types$256.default.number])
};
BellOff.displayName = "BellOff";
var bell_off_default = BellOff;

//#endregion
//#region node_modules/react-feather/dist/icons/bell.js
var import_prop_types$255 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$255() {
	_extends$255 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$255.apply(this, arguments);
}
function _objectWithoutProperties$255(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$255(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$255(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Bell = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$255(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$255({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }), /* @__PURE__ */ import_react.createElement("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" }));
});
Bell.propTypes = {
	color: import_prop_types$255.default.string,
	size: import_prop_types$255.default.oneOfType([import_prop_types$255.default.string, import_prop_types$255.default.number])
};
Bell.displayName = "Bell";
var bell_default = Bell;

//#endregion
//#region node_modules/react-feather/dist/icons/bluetooth.js
var import_prop_types$254 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$254() {
	_extends$254 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$254.apply(this, arguments);
}
function _objectWithoutProperties$254(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$254(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$254(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Bluetooth = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$254(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$254({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" }));
});
Bluetooth.propTypes = {
	color: import_prop_types$254.default.string,
	size: import_prop_types$254.default.oneOfType([import_prop_types$254.default.string, import_prop_types$254.default.number])
};
Bluetooth.displayName = "Bluetooth";
var bluetooth_default = Bluetooth;

//#endregion
//#region node_modules/react-feather/dist/icons/bold.js
var import_prop_types$253 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$253() {
	_extends$253 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$253.apply(this, arguments);
}
function _objectWithoutProperties$253(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$253(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$253(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Bold = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$253(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$253({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" }));
});
Bold.propTypes = {
	color: import_prop_types$253.default.string,
	size: import_prop_types$253.default.oneOfType([import_prop_types$253.default.string, import_prop_types$253.default.number])
};
Bold.displayName = "Bold";
var bold_default = Bold;

//#endregion
//#region node_modules/react-feather/dist/icons/book-open.js
var import_prop_types$252 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$252() {
	_extends$252 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$252.apply(this, arguments);
}
function _objectWithoutProperties$252(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$252(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$252(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var BookOpen = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$252(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$252({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" }));
});
BookOpen.propTypes = {
	color: import_prop_types$252.default.string,
	size: import_prop_types$252.default.oneOfType([import_prop_types$252.default.string, import_prop_types$252.default.number])
};
BookOpen.displayName = "BookOpen";
var book_open_default = BookOpen;

//#endregion
//#region node_modules/react-feather/dist/icons/book.js
var import_prop_types$251 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$251() {
	_extends$251 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$251.apply(this, arguments);
}
function _objectWithoutProperties$251(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$251(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$251(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Book = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$251(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$251({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20" }), /* @__PURE__ */ import_react.createElement("path", { d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" }));
});
Book.propTypes = {
	color: import_prop_types$251.default.string,
	size: import_prop_types$251.default.oneOfType([import_prop_types$251.default.string, import_prop_types$251.default.number])
};
Book.displayName = "Book";
var book_default = Book;

//#endregion
//#region node_modules/react-feather/dist/icons/bookmark.js
var import_prop_types$250 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$250() {
	_extends$250 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$250.apply(this, arguments);
}
function _objectWithoutProperties$250(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$250(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$250(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Bookmark = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$250(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$250({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }));
});
Bookmark.propTypes = {
	color: import_prop_types$250.default.string,
	size: import_prop_types$250.default.oneOfType([import_prop_types$250.default.string, import_prop_types$250.default.number])
};
Bookmark.displayName = "Bookmark";
var bookmark_default = Bookmark;

//#endregion
//#region node_modules/react-feather/dist/icons/box.js
var import_prop_types$249 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$249() {
	_extends$249 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$249.apply(this, arguments);
}
function _objectWithoutProperties$249(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$249(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$249(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Box = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$249(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$249({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "22.08",
		x2: "12",
		y2: "12"
	}));
});
Box.propTypes = {
	color: import_prop_types$249.default.string,
	size: import_prop_types$249.default.oneOfType([import_prop_types$249.default.string, import_prop_types$249.default.number])
};
Box.displayName = "Box";
var box_default = Box;

//#endregion
//#region node_modules/react-feather/dist/icons/briefcase.js
var import_prop_types$248 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$248() {
	_extends$248 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$248.apply(this, arguments);
}
function _objectWithoutProperties$248(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$248(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$248(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Briefcase = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$248(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$248({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "2",
		y: "7",
		width: "20",
		height: "14",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" }));
});
Briefcase.propTypes = {
	color: import_prop_types$248.default.string,
	size: import_prop_types$248.default.oneOfType([import_prop_types$248.default.string, import_prop_types$248.default.number])
};
Briefcase.displayName = "Briefcase";
var briefcase_default = Briefcase;

//#endregion
//#region node_modules/react-feather/dist/icons/calendar.js
var import_prop_types$247 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$247() {
	_extends$247 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$247.apply(this, arguments);
}
function _objectWithoutProperties$247(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$247(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$247(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Calendar = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$247(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$247({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "4",
		width: "18",
		height: "18",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16",
		y1: "2",
		x2: "16",
		y2: "6"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "2",
		x2: "8",
		y2: "6"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "3",
		y1: "10",
		x2: "21",
		y2: "10"
	}));
});
Calendar.propTypes = {
	color: import_prop_types$247.default.string,
	size: import_prop_types$247.default.oneOfType([import_prop_types$247.default.string, import_prop_types$247.default.number])
};
Calendar.displayName = "Calendar";
var calendar_default = Calendar;

//#endregion
//#region node_modules/react-feather/dist/icons/camera-off.js
var import_prop_types$246 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$246() {
	_extends$246 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$246.apply(this, arguments);
}
function _objectWithoutProperties$246(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$246(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$246(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CameraOff = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$246(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$246({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "1",
		x2: "23",
		y2: "23"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56" }));
});
CameraOff.propTypes = {
	color: import_prop_types$246.default.string,
	size: import_prop_types$246.default.oneOfType([import_prop_types$246.default.string, import_prop_types$246.default.number])
};
CameraOff.displayName = "CameraOff";
var camera_off_default = CameraOff;

//#endregion
//#region node_modules/react-feather/dist/icons/camera.js
var import_prop_types$245 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$245() {
	_extends$245 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$245.apply(this, arguments);
}
function _objectWithoutProperties$245(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$245(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$245(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Camera = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$245(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$245({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "13",
		r: "4"
	}));
});
Camera.propTypes = {
	color: import_prop_types$245.default.string,
	size: import_prop_types$245.default.oneOfType([import_prop_types$245.default.string, import_prop_types$245.default.number])
};
Camera.displayName = "Camera";
var camera_default = Camera;

//#endregion
//#region node_modules/react-feather/dist/icons/cast.js
var import_prop_types$244 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$244() {
	_extends$244 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$244.apply(this, arguments);
}
function _objectWithoutProperties$244(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$244(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$244(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Cast = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$244(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$244({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "2",
		y1: "20",
		x2: "2.01",
		y2: "20"
	}));
});
Cast.propTypes = {
	color: import_prop_types$244.default.string,
	size: import_prop_types$244.default.oneOfType([import_prop_types$244.default.string, import_prop_types$244.default.number])
};
Cast.displayName = "Cast";
var cast_default = Cast;

//#endregion
//#region node_modules/react-feather/dist/icons/check-circle.js
var import_prop_types$243 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$243() {
	_extends$243 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$243.apply(this, arguments);
}
function _objectWithoutProperties$243(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$243(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$243(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CheckCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$243(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$243({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "22 4 12 14.01 9 11.01" }));
});
CheckCircle.propTypes = {
	color: import_prop_types$243.default.string,
	size: import_prop_types$243.default.oneOfType([import_prop_types$243.default.string, import_prop_types$243.default.number])
};
CheckCircle.displayName = "CheckCircle";
var check_circle_default = CheckCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/check-square.js
var import_prop_types$242 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$242() {
	_extends$242 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$242.apply(this, arguments);
}
function _objectWithoutProperties$242(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$242(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$242(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CheckSquare = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$242(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$242({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "9 11 12 14 22 4" }), /* @__PURE__ */ import_react.createElement("path", { d: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" }));
});
CheckSquare.propTypes = {
	color: import_prop_types$242.default.string,
	size: import_prop_types$242.default.oneOfType([import_prop_types$242.default.string, import_prop_types$242.default.number])
};
CheckSquare.displayName = "CheckSquare";
var check_square_default = CheckSquare;

//#endregion
//#region node_modules/react-feather/dist/icons/check.js
var import_prop_types$241 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$241() {
	_extends$241 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$241.apply(this, arguments);
}
function _objectWithoutProperties$241(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$241(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$241(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Check = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$241(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$241({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "20 6 9 17 4 12" }));
});
Check.propTypes = {
	color: import_prop_types$241.default.string,
	size: import_prop_types$241.default.oneOfType([import_prop_types$241.default.string, import_prop_types$241.default.number])
};
Check.displayName = "Check";
var check_default = Check;

//#endregion
//#region node_modules/react-feather/dist/icons/chevron-down.js
var import_prop_types$240 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$240() {
	_extends$240 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$240.apply(this, arguments);
}
function _objectWithoutProperties$240(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$240(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$240(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ChevronDown = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$240(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$240({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "6 9 12 15 18 9" }));
});
ChevronDown.propTypes = {
	color: import_prop_types$240.default.string,
	size: import_prop_types$240.default.oneOfType([import_prop_types$240.default.string, import_prop_types$240.default.number])
};
ChevronDown.displayName = "ChevronDown";
var chevron_down_default = ChevronDown;

//#endregion
//#region node_modules/react-feather/dist/icons/chevron-left.js
var import_prop_types$239 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$239() {
	_extends$239 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$239.apply(this, arguments);
}
function _objectWithoutProperties$239(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$239(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$239(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ChevronLeft = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$239(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$239({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "15 18 9 12 15 6" }));
});
ChevronLeft.propTypes = {
	color: import_prop_types$239.default.string,
	size: import_prop_types$239.default.oneOfType([import_prop_types$239.default.string, import_prop_types$239.default.number])
};
ChevronLeft.displayName = "ChevronLeft";
var chevron_left_default = ChevronLeft;

//#endregion
//#region node_modules/react-feather/dist/icons/chevron-right.js
var import_prop_types$238 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$238() {
	_extends$238 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$238.apply(this, arguments);
}
function _objectWithoutProperties$238(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$238(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$238(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ChevronRight = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$238(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$238({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "9 18 15 12 9 6" }));
});
ChevronRight.propTypes = {
	color: import_prop_types$238.default.string,
	size: import_prop_types$238.default.oneOfType([import_prop_types$238.default.string, import_prop_types$238.default.number])
};
ChevronRight.displayName = "ChevronRight";
var chevron_right_default = ChevronRight;

//#endregion
//#region node_modules/react-feather/dist/icons/chevron-up.js
var import_prop_types$237 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$237() {
	_extends$237 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$237.apply(this, arguments);
}
function _objectWithoutProperties$237(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$237(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$237(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ChevronUp = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$237(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$237({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "18 15 12 9 6 15" }));
});
ChevronUp.propTypes = {
	color: import_prop_types$237.default.string,
	size: import_prop_types$237.default.oneOfType([import_prop_types$237.default.string, import_prop_types$237.default.number])
};
ChevronUp.displayName = "ChevronUp";
var chevron_up_default = ChevronUp;

//#endregion
//#region node_modules/react-feather/dist/icons/chevrons-down.js
var import_prop_types$236 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$236() {
	_extends$236 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$236.apply(this, arguments);
}
function _objectWithoutProperties$236(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$236(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$236(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ChevronsDown = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$236(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$236({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "7 13 12 18 17 13" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "7 6 12 11 17 6" }));
});
ChevronsDown.propTypes = {
	color: import_prop_types$236.default.string,
	size: import_prop_types$236.default.oneOfType([import_prop_types$236.default.string, import_prop_types$236.default.number])
};
ChevronsDown.displayName = "ChevronsDown";
var chevrons_down_default = ChevronsDown;

//#endregion
//#region node_modules/react-feather/dist/icons/chevrons-left.js
var import_prop_types$235 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$235() {
	_extends$235 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$235.apply(this, arguments);
}
function _objectWithoutProperties$235(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$235(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$235(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ChevronsLeft = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$235(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$235({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "11 17 6 12 11 7" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "18 17 13 12 18 7" }));
});
ChevronsLeft.propTypes = {
	color: import_prop_types$235.default.string,
	size: import_prop_types$235.default.oneOfType([import_prop_types$235.default.string, import_prop_types$235.default.number])
};
ChevronsLeft.displayName = "ChevronsLeft";
var chevrons_left_default = ChevronsLeft;

//#endregion
//#region node_modules/react-feather/dist/icons/chevrons-right.js
var import_prop_types$234 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$234() {
	_extends$234 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$234.apply(this, arguments);
}
function _objectWithoutProperties$234(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$234(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$234(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ChevronsRight = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$234(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$234({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "13 17 18 12 13 7" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "6 17 11 12 6 7" }));
});
ChevronsRight.propTypes = {
	color: import_prop_types$234.default.string,
	size: import_prop_types$234.default.oneOfType([import_prop_types$234.default.string, import_prop_types$234.default.number])
};
ChevronsRight.displayName = "ChevronsRight";
var chevrons_right_default = ChevronsRight;

//#endregion
//#region node_modules/react-feather/dist/icons/chevrons-up.js
var import_prop_types$233 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$233() {
	_extends$233 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$233.apply(this, arguments);
}
function _objectWithoutProperties$233(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$233(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$233(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ChevronsUp = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$233(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$233({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "17 11 12 6 7 11" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "17 18 12 13 7 18" }));
});
ChevronsUp.propTypes = {
	color: import_prop_types$233.default.string,
	size: import_prop_types$233.default.oneOfType([import_prop_types$233.default.string, import_prop_types$233.default.number])
};
ChevronsUp.displayName = "ChevronsUp";
var chevrons_up_default = ChevronsUp;

//#endregion
//#region node_modules/react-feather/dist/icons/chrome.js
var import_prop_types$232 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$232() {
	_extends$232 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$232.apply(this, arguments);
}
function _objectWithoutProperties$232(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$232(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$232(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Chrome = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$232(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$232({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21.17",
		y1: "8",
		x2: "12",
		y2: "8"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "3.95",
		y1: "6.06",
		x2: "8.54",
		y2: "14"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "10.88",
		y1: "21.94",
		x2: "15.46",
		y2: "14"
	}));
});
Chrome.propTypes = {
	color: import_prop_types$232.default.string,
	size: import_prop_types$232.default.oneOfType([import_prop_types$232.default.string, import_prop_types$232.default.number])
};
Chrome.displayName = "Chrome";
var chrome_default = Chrome;

//#endregion
//#region node_modules/react-feather/dist/icons/circle.js
var import_prop_types$231 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$231() {
	_extends$231 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$231.apply(this, arguments);
}
function _objectWithoutProperties$231(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$231(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$231(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Circle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$231(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$231({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}));
});
Circle.propTypes = {
	color: import_prop_types$231.default.string,
	size: import_prop_types$231.default.oneOfType([import_prop_types$231.default.string, import_prop_types$231.default.number])
};
Circle.displayName = "Circle";
var circle_default = Circle;

//#endregion
//#region node_modules/react-feather/dist/icons/clipboard.js
var import_prop_types$230 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$230() {
	_extends$230 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$230.apply(this, arguments);
}
function _objectWithoutProperties$230(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$230(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$230(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Clipboard = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$230(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$230({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }), /* @__PURE__ */ import_react.createElement("rect", {
		x: "8",
		y: "2",
		width: "8",
		height: "4",
		rx: "1",
		ry: "1"
	}));
});
Clipboard.propTypes = {
	color: import_prop_types$230.default.string,
	size: import_prop_types$230.default.oneOfType([import_prop_types$230.default.string, import_prop_types$230.default.number])
};
Clipboard.displayName = "Clipboard";
var clipboard_default = Clipboard;

//#endregion
//#region node_modules/react-feather/dist/icons/clock.js
var import_prop_types$229 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$229() {
	_extends$229 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$229.apply(this, arguments);
}
function _objectWithoutProperties$229(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$229(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$229(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Clock = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$229(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$229({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "12 6 12 12 16 14" }));
});
Clock.propTypes = {
	color: import_prop_types$229.default.string,
	size: import_prop_types$229.default.oneOfType([import_prop_types$229.default.string, import_prop_types$229.default.number])
};
Clock.displayName = "Clock";
var clock_default = Clock;

//#endregion
//#region node_modules/react-feather/dist/icons/cloud-drizzle.js
var import_prop_types$228 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$228() {
	_extends$228 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$228.apply(this, arguments);
}
function _objectWithoutProperties$228(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$228(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$228(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CloudDrizzle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$228(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$228({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "19",
		x2: "8",
		y2: "21"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "13",
		x2: "8",
		y2: "15"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16",
		y1: "19",
		x2: "16",
		y2: "21"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16",
		y1: "13",
		x2: "16",
		y2: "15"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "21",
		x2: "12",
		y2: "23"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "15",
		x2: "12",
		y2: "17"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" }));
});
CloudDrizzle.propTypes = {
	color: import_prop_types$228.default.string,
	size: import_prop_types$228.default.oneOfType([import_prop_types$228.default.string, import_prop_types$228.default.number])
};
CloudDrizzle.displayName = "CloudDrizzle";
var cloud_drizzle_default = CloudDrizzle;

//#endregion
//#region node_modules/react-feather/dist/icons/cloud-lightning.js
var import_prop_types$227 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$227() {
	_extends$227 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$227.apply(this, arguments);
}
function _objectWithoutProperties$227(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$227(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$227(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CloudLightning = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$227(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$227({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "13 11 9 17 15 17 11 23" }));
});
CloudLightning.propTypes = {
	color: import_prop_types$227.default.string,
	size: import_prop_types$227.default.oneOfType([import_prop_types$227.default.string, import_prop_types$227.default.number])
};
CloudLightning.displayName = "CloudLightning";
var cloud_lightning_default = CloudLightning;

//#endregion
//#region node_modules/react-feather/dist/icons/cloud-off.js
var import_prop_types$226 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$226() {
	_extends$226 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$226.apply(this, arguments);
}
function _objectWithoutProperties$226(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$226(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$226(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CloudOff = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$226(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$226({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "1",
		x2: "23",
		y2: "23"
	}));
});
CloudOff.propTypes = {
	color: import_prop_types$226.default.string,
	size: import_prop_types$226.default.oneOfType([import_prop_types$226.default.string, import_prop_types$226.default.number])
};
CloudOff.displayName = "CloudOff";
var cloud_off_default = CloudOff;

//#endregion
//#region node_modules/react-feather/dist/icons/cloud-rain.js
var import_prop_types$225 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$225() {
	_extends$225 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$225.apply(this, arguments);
}
function _objectWithoutProperties$225(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$225(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$225(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CloudRain = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$225(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$225({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16",
		y1: "13",
		x2: "16",
		y2: "21"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "13",
		x2: "8",
		y2: "21"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "15",
		x2: "12",
		y2: "23"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" }));
});
CloudRain.propTypes = {
	color: import_prop_types$225.default.string,
	size: import_prop_types$225.default.oneOfType([import_prop_types$225.default.string, import_prop_types$225.default.number])
};
CloudRain.displayName = "CloudRain";
var cloud_rain_default = CloudRain;

//#endregion
//#region node_modules/react-feather/dist/icons/cloud-snow.js
var import_prop_types$224 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$224() {
	_extends$224 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$224.apply(this, arguments);
}
function _objectWithoutProperties$224(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$224(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$224(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CloudSnow = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$224(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$224({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "16",
		x2: "8.01",
		y2: "16"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "20",
		x2: "8.01",
		y2: "20"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "18",
		x2: "12.01",
		y2: "18"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "22",
		x2: "12.01",
		y2: "22"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16",
		y1: "16",
		x2: "16.01",
		y2: "16"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16",
		y1: "20",
		x2: "16.01",
		y2: "20"
	}));
});
CloudSnow.propTypes = {
	color: import_prop_types$224.default.string,
	size: import_prop_types$224.default.oneOfType([import_prop_types$224.default.string, import_prop_types$224.default.number])
};
CloudSnow.displayName = "CloudSnow";
var cloud_snow_default = CloudSnow;

//#endregion
//#region node_modules/react-feather/dist/icons/cloud.js
var import_prop_types$223 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$223() {
	_extends$223 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$223.apply(this, arguments);
}
function _objectWithoutProperties$223(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$223(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$223(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Cloud = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$223(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$223({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" }));
});
Cloud.propTypes = {
	color: import_prop_types$223.default.string,
	size: import_prop_types$223.default.oneOfType([import_prop_types$223.default.string, import_prop_types$223.default.number])
};
Cloud.displayName = "Cloud";
var cloud_default = Cloud;

//#endregion
//#region node_modules/react-feather/dist/icons/code.js
var import_prop_types$222 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$222() {
	_extends$222 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$222.apply(this, arguments);
}
function _objectWithoutProperties$222(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$222(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$222(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Code = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$222(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$222({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "16 18 22 12 16 6" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "8 6 2 12 8 18" }));
});
Code.propTypes = {
	color: import_prop_types$222.default.string,
	size: import_prop_types$222.default.oneOfType([import_prop_types$222.default.string, import_prop_types$222.default.number])
};
Code.displayName = "Code";
var code_default = Code;

//#endregion
//#region node_modules/react-feather/dist/icons/codepen.js
var import_prop_types$221 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$221() {
	_extends$221 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$221.apply(this, arguments);
}
function _objectWithoutProperties$221(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$221(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$221(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Codepen = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$221(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$221({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "22",
		x2: "12",
		y2: "15.5"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "22 8.5 12 15.5 2 8.5" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "2 15.5 12 8.5 22 15.5" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "2",
		x2: "12",
		y2: "8.5"
	}));
});
Codepen.propTypes = {
	color: import_prop_types$221.default.string,
	size: import_prop_types$221.default.oneOfType([import_prop_types$221.default.string, import_prop_types$221.default.number])
};
Codepen.displayName = "Codepen";
var codepen_default = Codepen;

//#endregion
//#region node_modules/react-feather/dist/icons/codesandbox.js
var import_prop_types$220 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$220() {
	_extends$220 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$220.apply(this, arguments);
}
function _objectWithoutProperties$220(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$220(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$220(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Codesandbox = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$220(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$220({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "7.5 4.21 12 6.81 16.5 4.21" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "7.5 19.79 7.5 14.6 3 12" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "21 12 16.5 14.6 16.5 19.79" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "22.08",
		x2: "12",
		y2: "12"
	}));
});
Codesandbox.propTypes = {
	color: import_prop_types$220.default.string,
	size: import_prop_types$220.default.oneOfType([import_prop_types$220.default.string, import_prop_types$220.default.number])
};
Codesandbox.displayName = "Codesandbox";
var codesandbox_default = Codesandbox;

//#endregion
//#region node_modules/react-feather/dist/icons/coffee.js
var import_prop_types$219 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$219() {
	_extends$219 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$219.apply(this, arguments);
}
function _objectWithoutProperties$219(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$219(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$219(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Coffee = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$219(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$219({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M18 8h1a4 4 0 0 1 0 8h-1" }), /* @__PURE__ */ import_react.createElement("path", { d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "6",
		y1: "1",
		x2: "6",
		y2: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "10",
		y1: "1",
		x2: "10",
		y2: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "14",
		y1: "1",
		x2: "14",
		y2: "4"
	}));
});
Coffee.propTypes = {
	color: import_prop_types$219.default.string,
	size: import_prop_types$219.default.oneOfType([import_prop_types$219.default.string, import_prop_types$219.default.number])
};
Coffee.displayName = "Coffee";
var coffee_default = Coffee;

//#endregion
//#region node_modules/react-feather/dist/icons/columns.js
var import_prop_types$218 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$218() {
	_extends$218 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$218.apply(this, arguments);
}
function _objectWithoutProperties$218(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$218(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$218(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Columns = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$218(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$218({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18" }));
});
Columns.propTypes = {
	color: import_prop_types$218.default.string,
	size: import_prop_types$218.default.oneOfType([import_prop_types$218.default.string, import_prop_types$218.default.number])
};
Columns.displayName = "Columns";
var columns_default = Columns;

//#endregion
//#region node_modules/react-feather/dist/icons/command.js
var import_prop_types$217 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$217() {
	_extends$217 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$217.apply(this, arguments);
}
function _objectWithoutProperties$217(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$217(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$217(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Command = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$217(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$217({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" }));
});
Command.propTypes = {
	color: import_prop_types$217.default.string,
	size: import_prop_types$217.default.oneOfType([import_prop_types$217.default.string, import_prop_types$217.default.number])
};
Command.displayName = "Command";
var command_default = Command;

//#endregion
//#region node_modules/react-feather/dist/icons/compass.js
var import_prop_types$216 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$216() {
	_extends$216 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$216.apply(this, arguments);
}
function _objectWithoutProperties$216(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$216(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$216(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Compass = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$216(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$216({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("polygon", { points: "16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" }));
});
Compass.propTypes = {
	color: import_prop_types$216.default.string,
	size: import_prop_types$216.default.oneOfType([import_prop_types$216.default.string, import_prop_types$216.default.number])
};
Compass.displayName = "Compass";
var compass_default = Compass;

//#endregion
//#region node_modules/react-feather/dist/icons/copy.js
var import_prop_types$215 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$215() {
	_extends$215 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$215.apply(this, arguments);
}
function _objectWithoutProperties$215(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$215(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$215(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Copy = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$215(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$215({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "9",
		y: "9",
		width: "13",
		height: "13",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }));
});
Copy.propTypes = {
	color: import_prop_types$215.default.string,
	size: import_prop_types$215.default.oneOfType([import_prop_types$215.default.string, import_prop_types$215.default.number])
};
Copy.displayName = "Copy";
var copy_default = Copy;

//#endregion
//#region node_modules/react-feather/dist/icons/corner-down-left.js
var import_prop_types$214 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$214() {
	_extends$214 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$214.apply(this, arguments);
}
function _objectWithoutProperties$214(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$214(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$214(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CornerDownLeft = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$214(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$214({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "9 10 4 15 9 20" }), /* @__PURE__ */ import_react.createElement("path", { d: "M20 4v7a4 4 0 0 1-4 4H4" }));
});
CornerDownLeft.propTypes = {
	color: import_prop_types$214.default.string,
	size: import_prop_types$214.default.oneOfType([import_prop_types$214.default.string, import_prop_types$214.default.number])
};
CornerDownLeft.displayName = "CornerDownLeft";
var corner_down_left_default = CornerDownLeft;

//#endregion
//#region node_modules/react-feather/dist/icons/corner-down-right.js
var import_prop_types$213 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$213() {
	_extends$213 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$213.apply(this, arguments);
}
function _objectWithoutProperties$213(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$213(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$213(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CornerDownRight = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$213(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$213({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "15 10 20 15 15 20" }), /* @__PURE__ */ import_react.createElement("path", { d: "M4 4v7a4 4 0 0 0 4 4h12" }));
});
CornerDownRight.propTypes = {
	color: import_prop_types$213.default.string,
	size: import_prop_types$213.default.oneOfType([import_prop_types$213.default.string, import_prop_types$213.default.number])
};
CornerDownRight.displayName = "CornerDownRight";
var corner_down_right_default = CornerDownRight;

//#endregion
//#region node_modules/react-feather/dist/icons/corner-left-down.js
var import_prop_types$212 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$212() {
	_extends$212 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$212.apply(this, arguments);
}
function _objectWithoutProperties$212(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$212(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$212(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CornerLeftDown = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$212(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$212({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "14 15 9 20 4 15" }), /* @__PURE__ */ import_react.createElement("path", { d: "M20 4h-7a4 4 0 0 0-4 4v12" }));
});
CornerLeftDown.propTypes = {
	color: import_prop_types$212.default.string,
	size: import_prop_types$212.default.oneOfType([import_prop_types$212.default.string, import_prop_types$212.default.number])
};
CornerLeftDown.displayName = "CornerLeftDown";
var corner_left_down_default = CornerLeftDown;

//#endregion
//#region node_modules/react-feather/dist/icons/corner-left-up.js
var import_prop_types$211 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$211() {
	_extends$211 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$211.apply(this, arguments);
}
function _objectWithoutProperties$211(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$211(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$211(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CornerLeftUp = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$211(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$211({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "14 9 9 4 4 9" }), /* @__PURE__ */ import_react.createElement("path", { d: "M20 20h-7a4 4 0 0 1-4-4V4" }));
});
CornerLeftUp.propTypes = {
	color: import_prop_types$211.default.string,
	size: import_prop_types$211.default.oneOfType([import_prop_types$211.default.string, import_prop_types$211.default.number])
};
CornerLeftUp.displayName = "CornerLeftUp";
var corner_left_up_default = CornerLeftUp;

//#endregion
//#region node_modules/react-feather/dist/icons/corner-right-down.js
var import_prop_types$210 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$210() {
	_extends$210 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$210.apply(this, arguments);
}
function _objectWithoutProperties$210(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$210(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$210(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CornerRightDown = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$210(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$210({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "10 15 15 20 20 15" }), /* @__PURE__ */ import_react.createElement("path", { d: "M4 4h7a4 4 0 0 1 4 4v12" }));
});
CornerRightDown.propTypes = {
	color: import_prop_types$210.default.string,
	size: import_prop_types$210.default.oneOfType([import_prop_types$210.default.string, import_prop_types$210.default.number])
};
CornerRightDown.displayName = "CornerRightDown";
var corner_right_down_default = CornerRightDown;

//#endregion
//#region node_modules/react-feather/dist/icons/corner-right-up.js
var import_prop_types$209 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$209() {
	_extends$209 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$209.apply(this, arguments);
}
function _objectWithoutProperties$209(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$209(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$209(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CornerRightUp = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$209(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$209({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "10 9 15 4 20 9" }), /* @__PURE__ */ import_react.createElement("path", { d: "M4 20h7a4 4 0 0 0 4-4V4" }));
});
CornerRightUp.propTypes = {
	color: import_prop_types$209.default.string,
	size: import_prop_types$209.default.oneOfType([import_prop_types$209.default.string, import_prop_types$209.default.number])
};
CornerRightUp.displayName = "CornerRightUp";
var corner_right_up_default = CornerRightUp;

//#endregion
//#region node_modules/react-feather/dist/icons/corner-up-left.js
var import_prop_types$208 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$208() {
	_extends$208 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$208.apply(this, arguments);
}
function _objectWithoutProperties$208(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$208(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$208(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CornerUpLeft = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$208(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$208({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "9 14 4 9 9 4" }), /* @__PURE__ */ import_react.createElement("path", { d: "M20 20v-7a4 4 0 0 0-4-4H4" }));
});
CornerUpLeft.propTypes = {
	color: import_prop_types$208.default.string,
	size: import_prop_types$208.default.oneOfType([import_prop_types$208.default.string, import_prop_types$208.default.number])
};
CornerUpLeft.displayName = "CornerUpLeft";
var corner_up_left_default = CornerUpLeft;

//#endregion
//#region node_modules/react-feather/dist/icons/corner-up-right.js
var import_prop_types$207 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$207() {
	_extends$207 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$207.apply(this, arguments);
}
function _objectWithoutProperties$207(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$207(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$207(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CornerUpRight = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$207(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$207({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "15 14 20 9 15 4" }), /* @__PURE__ */ import_react.createElement("path", { d: "M4 20v-7a4 4 0 0 1 4-4h12" }));
});
CornerUpRight.propTypes = {
	color: import_prop_types$207.default.string,
	size: import_prop_types$207.default.oneOfType([import_prop_types$207.default.string, import_prop_types$207.default.number])
};
CornerUpRight.displayName = "CornerUpRight";
var corner_up_right_default = CornerUpRight;

//#endregion
//#region node_modules/react-feather/dist/icons/cpu.js
var import_prop_types$206 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$206() {
	_extends$206 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$206.apply(this, arguments);
}
function _objectWithoutProperties$206(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$206(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$206(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Cpu = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$206(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$206({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "4",
		y: "4",
		width: "16",
		height: "16",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("rect", {
		x: "9",
		y: "9",
		width: "6",
		height: "6"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "1",
		x2: "9",
		y2: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "15",
		y1: "1",
		x2: "15",
		y2: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "20",
		x2: "9",
		y2: "23"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "15",
		y1: "20",
		x2: "15",
		y2: "23"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "20",
		y1: "9",
		x2: "23",
		y2: "9"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "20",
		y1: "14",
		x2: "23",
		y2: "14"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "9",
		x2: "4",
		y2: "9"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "14",
		x2: "4",
		y2: "14"
	}));
});
Cpu.propTypes = {
	color: import_prop_types$206.default.string,
	size: import_prop_types$206.default.oneOfType([import_prop_types$206.default.string, import_prop_types$206.default.number])
};
Cpu.displayName = "Cpu";
var cpu_default = Cpu;

//#endregion
//#region node_modules/react-feather/dist/icons/credit-card.js
var import_prop_types$205 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$205() {
	_extends$205 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$205.apply(this, arguments);
}
function _objectWithoutProperties$205(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$205(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$205(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var CreditCard = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$205(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$205({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "1",
		y: "4",
		width: "22",
		height: "16",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "10",
		x2: "23",
		y2: "10"
	}));
});
CreditCard.propTypes = {
	color: import_prop_types$205.default.string,
	size: import_prop_types$205.default.oneOfType([import_prop_types$205.default.string, import_prop_types$205.default.number])
};
CreditCard.displayName = "CreditCard";
var credit_card_default = CreditCard;

//#endregion
//#region node_modules/react-feather/dist/icons/crop.js
var import_prop_types$204 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$204() {
	_extends$204 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$204.apply(this, arguments);
}
function _objectWithoutProperties$204(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$204(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$204(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Crop = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$204(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$204({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M6.13 1L6 16a2 2 0 0 0 2 2h15" }), /* @__PURE__ */ import_react.createElement("path", { d: "M1 6.13L16 6a2 2 0 0 1 2 2v15" }));
});
Crop.propTypes = {
	color: import_prop_types$204.default.string,
	size: import_prop_types$204.default.oneOfType([import_prop_types$204.default.string, import_prop_types$204.default.number])
};
Crop.displayName = "Crop";
var crop_default = Crop;

//#endregion
//#region node_modules/react-feather/dist/icons/crosshair.js
var import_prop_types$203 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$203() {
	_extends$203 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$203.apply(this, arguments);
}
function _objectWithoutProperties$203(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$203(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$203(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Crosshair = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$203(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$203({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "22",
		y1: "12",
		x2: "18",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "6",
		y1: "12",
		x2: "2",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "6",
		x2: "12",
		y2: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "22",
		x2: "12",
		y2: "18"
	}));
});
Crosshair.propTypes = {
	color: import_prop_types$203.default.string,
	size: import_prop_types$203.default.oneOfType([import_prop_types$203.default.string, import_prop_types$203.default.number])
};
Crosshair.displayName = "Crosshair";
var crosshair_default = Crosshair;

//#endregion
//#region node_modules/react-feather/dist/icons/database.js
var import_prop_types$202 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$202() {
	_extends$202 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$202.apply(this, arguments);
}
function _objectWithoutProperties$202(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$202(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$202(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Database = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$202(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$202({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("ellipse", {
		cx: "12",
		cy: "5",
		rx: "9",
		ry: "3"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" }), /* @__PURE__ */ import_react.createElement("path", { d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" }));
});
Database.propTypes = {
	color: import_prop_types$202.default.string,
	size: import_prop_types$202.default.oneOfType([import_prop_types$202.default.string, import_prop_types$202.default.number])
};
Database.displayName = "Database";
var database_default = Database;

//#endregion
//#region node_modules/react-feather/dist/icons/delete.js
var import_prop_types$201 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$201() {
	_extends$201 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$201.apply(this, arguments);
}
function _objectWithoutProperties$201(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$201(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$201(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Delete = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$201(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$201({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "18",
		y1: "9",
		x2: "12",
		y2: "15"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "9",
		x2: "18",
		y2: "15"
	}));
});
Delete.propTypes = {
	color: import_prop_types$201.default.string,
	size: import_prop_types$201.default.oneOfType([import_prop_types$201.default.string, import_prop_types$201.default.number])
};
Delete.displayName = "Delete";
var delete_default = Delete;

//#endregion
//#region node_modules/react-feather/dist/icons/disc.js
var import_prop_types$200 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$200() {
	_extends$200 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$200.apply(this, arguments);
}
function _objectWithoutProperties$200(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$200(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$200(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Disc = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$200(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$200({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "3"
	}));
});
Disc.propTypes = {
	color: import_prop_types$200.default.string,
	size: import_prop_types$200.default.oneOfType([import_prop_types$200.default.string, import_prop_types$200.default.number])
};
Disc.displayName = "Disc";
var disc_default = Disc;

//#endregion
//#region node_modules/react-feather/dist/icons/divide-circle.js
var import_prop_types$199 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$199() {
	_extends$199 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$199.apply(this, arguments);
}
function _objectWithoutProperties$199(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$199(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$199(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var DivideCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$199(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$199({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "12",
		x2: "16",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "16",
		x2: "12",
		y2: "16"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "8",
		x2: "12",
		y2: "8"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}));
});
DivideCircle.propTypes = {
	color: import_prop_types$199.default.string,
	size: import_prop_types$199.default.oneOfType([import_prop_types$199.default.string, import_prop_types$199.default.number])
};
DivideCircle.displayName = "DivideCircle";
var divide_circle_default = DivideCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/divide-square.js
var import_prop_types$198 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$198() {
	_extends$198 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$198.apply(this, arguments);
}
function _objectWithoutProperties$198(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$198(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$198(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var DivideSquare = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$198(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$198({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "3",
		width: "18",
		height: "18",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "12",
		x2: "16",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "16",
		x2: "12",
		y2: "16"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "8",
		x2: "12",
		y2: "8"
	}));
});
DivideSquare.propTypes = {
	color: import_prop_types$198.default.string,
	size: import_prop_types$198.default.oneOfType([import_prop_types$198.default.string, import_prop_types$198.default.number])
};
DivideSquare.displayName = "DivideSquare";
var divide_square_default = DivideSquare;

//#endregion
//#region node_modules/react-feather/dist/icons/divide.js
var import_prop_types$197 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$197() {
	_extends$197 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$197.apply(this, arguments);
}
function _objectWithoutProperties$197(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$197(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$197(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Divide = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$197(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$197({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "6",
		r: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "5",
		y1: "12",
		x2: "19",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "18",
		r: "2"
	}));
});
Divide.propTypes = {
	color: import_prop_types$197.default.string,
	size: import_prop_types$197.default.oneOfType([import_prop_types$197.default.string, import_prop_types$197.default.number])
};
Divide.displayName = "Divide";
var divide_default = Divide;

//#endregion
//#region node_modules/react-feather/dist/icons/dollar-sign.js
var import_prop_types$196 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$196() {
	_extends$196 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$196.apply(this, arguments);
}
function _objectWithoutProperties$196(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$196(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$196(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var DollarSign = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$196(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$196({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "1",
		x2: "12",
		y2: "23"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }));
});
DollarSign.propTypes = {
	color: import_prop_types$196.default.string,
	size: import_prop_types$196.default.oneOfType([import_prop_types$196.default.string, import_prop_types$196.default.number])
};
DollarSign.displayName = "DollarSign";
var dollar_sign_default = DollarSign;

//#endregion
//#region node_modules/react-feather/dist/icons/download-cloud.js
var import_prop_types$195 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$195() {
	_extends$195 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$195.apply(this, arguments);
}
function _objectWithoutProperties$195(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$195(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$195(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var DownloadCloud = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$195(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$195({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "8 17 12 21 16 17" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "12",
		x2: "12",
		y2: "21"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" }));
});
DownloadCloud.propTypes = {
	color: import_prop_types$195.default.string,
	size: import_prop_types$195.default.oneOfType([import_prop_types$195.default.string, import_prop_types$195.default.number])
};
DownloadCloud.displayName = "DownloadCloud";
var download_cloud_default = DownloadCloud;

//#endregion
//#region node_modules/react-feather/dist/icons/download.js
var import_prop_types$194 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$194() {
	_extends$194 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$194.apply(this, arguments);
}
function _objectWithoutProperties$194(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$194(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$194(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Download = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$194(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$194({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "7 10 12 15 17 10" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "15",
		x2: "12",
		y2: "3"
	}));
});
Download.propTypes = {
	color: import_prop_types$194.default.string,
	size: import_prop_types$194.default.oneOfType([import_prop_types$194.default.string, import_prop_types$194.default.number])
};
Download.displayName = "Download";
var download_default = Download;

//#endregion
//#region node_modules/react-feather/dist/icons/dribbble.js
var import_prop_types$193 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$193() {
	_extends$193 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$193.apply(this, arguments);
}
function _objectWithoutProperties$193(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$193(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$193(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Dribbble = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$193(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$193({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" }));
});
Dribbble.propTypes = {
	color: import_prop_types$193.default.string,
	size: import_prop_types$193.default.oneOfType([import_prop_types$193.default.string, import_prop_types$193.default.number])
};
Dribbble.displayName = "Dribbble";
var dribbble_default = Dribbble;

//#endregion
//#region node_modules/react-feather/dist/icons/droplet.js
var import_prop_types$192 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$192() {
	_extends$192 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$192.apply(this, arguments);
}
function _objectWithoutProperties$192(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$192(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$192(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Droplet = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$192(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$192({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" }));
});
Droplet.propTypes = {
	color: import_prop_types$192.default.string,
	size: import_prop_types$192.default.oneOfType([import_prop_types$192.default.string, import_prop_types$192.default.number])
};
Droplet.displayName = "Droplet";
var droplet_default = Droplet;

//#endregion
//#region node_modules/react-feather/dist/icons/edit-2.js
var import_prop_types$191 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$191() {
	_extends$191 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$191.apply(this, arguments);
}
function _objectWithoutProperties$191(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$191(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$191(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Edit2 = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$191(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$191({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" }));
});
Edit2.propTypes = {
	color: import_prop_types$191.default.string,
	size: import_prop_types$191.default.oneOfType([import_prop_types$191.default.string, import_prop_types$191.default.number])
};
Edit2.displayName = "Edit2";
var edit_2_default = Edit2;

//#endregion
//#region node_modules/react-feather/dist/icons/edit-3.js
var import_prop_types$190 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$190() {
	_extends$190 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$190.apply(this, arguments);
}
function _objectWithoutProperties$190(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$190(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$190(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Edit3 = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$190(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$190({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M12 20h9" }), /* @__PURE__ */ import_react.createElement("path", { d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" }));
});
Edit3.propTypes = {
	color: import_prop_types$190.default.string,
	size: import_prop_types$190.default.oneOfType([import_prop_types$190.default.string, import_prop_types$190.default.number])
};
Edit3.displayName = "Edit3";
var edit_3_default = Edit3;

//#endregion
//#region node_modules/react-feather/dist/icons/edit.js
var import_prop_types$189 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$189() {
	_extends$189 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$189.apply(this, arguments);
}
function _objectWithoutProperties$189(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$189(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$189(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Edit = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$189(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$189({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ import_react.createElement("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" }));
});
Edit.propTypes = {
	color: import_prop_types$189.default.string,
	size: import_prop_types$189.default.oneOfType([import_prop_types$189.default.string, import_prop_types$189.default.number])
};
Edit.displayName = "Edit";
var edit_default = Edit;

//#endregion
//#region node_modules/react-feather/dist/icons/external-link.js
var import_prop_types$188 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$188() {
	_extends$188 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$188.apply(this, arguments);
}
function _objectWithoutProperties$188(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$188(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$188(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ExternalLink = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$188(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$188({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "15 3 21 3 21 9" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "10",
		y1: "14",
		x2: "21",
		y2: "3"
	}));
});
ExternalLink.propTypes = {
	color: import_prop_types$188.default.string,
	size: import_prop_types$188.default.oneOfType([import_prop_types$188.default.string, import_prop_types$188.default.number])
};
ExternalLink.displayName = "ExternalLink";
var external_link_default = ExternalLink;

//#endregion
//#region node_modules/react-feather/dist/icons/eye-off.js
var import_prop_types$187 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$187() {
	_extends$187 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$187.apply(this, arguments);
}
function _objectWithoutProperties$187(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$187(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$187(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var EyeOff = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$187(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$187({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "1",
		x2: "23",
		y2: "23"
	}));
});
EyeOff.propTypes = {
	color: import_prop_types$187.default.string,
	size: import_prop_types$187.default.oneOfType([import_prop_types$187.default.string, import_prop_types$187.default.number])
};
EyeOff.displayName = "EyeOff";
var eye_off_default = EyeOff;

//#endregion
//#region node_modules/react-feather/dist/icons/eye.js
var import_prop_types$186 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$186() {
	_extends$186 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$186.apply(this, arguments);
}
function _objectWithoutProperties$186(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$186(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$186(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Eye = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$186(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$186({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "3"
	}));
});
Eye.propTypes = {
	color: import_prop_types$186.default.string,
	size: import_prop_types$186.default.oneOfType([import_prop_types$186.default.string, import_prop_types$186.default.number])
};
Eye.displayName = "Eye";
var eye_default = Eye;

//#endregion
//#region node_modules/react-feather/dist/icons/facebook.js
var import_prop_types$185 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$185() {
	_extends$185 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$185.apply(this, arguments);
}
function _objectWithoutProperties$185(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$185(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$185(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Facebook = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$185(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$185({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" }));
});
Facebook.propTypes = {
	color: import_prop_types$185.default.string,
	size: import_prop_types$185.default.oneOfType([import_prop_types$185.default.string, import_prop_types$185.default.number])
};
Facebook.displayName = "Facebook";
var facebook_default = Facebook;

//#endregion
//#region node_modules/react-feather/dist/icons/fast-forward.js
var import_prop_types$184 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$184() {
	_extends$184 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$184.apply(this, arguments);
}
function _objectWithoutProperties$184(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$184(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$184(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var FastForward = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$184(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$184({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "13 19 22 12 13 5 13 19" }), /* @__PURE__ */ import_react.createElement("polygon", { points: "2 19 11 12 2 5 2 19" }));
});
FastForward.propTypes = {
	color: import_prop_types$184.default.string,
	size: import_prop_types$184.default.oneOfType([import_prop_types$184.default.string, import_prop_types$184.default.number])
};
FastForward.displayName = "FastForward";
var fast_forward_default = FastForward;

//#endregion
//#region node_modules/react-feather/dist/icons/feather.js
var import_prop_types$183 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$183() {
	_extends$183 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$183.apply(this, arguments);
}
function _objectWithoutProperties$183(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$183(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$183(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Feather = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$183(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$183({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16",
		y1: "8",
		x2: "2",
		y2: "22"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "17.5",
		y1: "15",
		x2: "9",
		y2: "15"
	}));
});
Feather.propTypes = {
	color: import_prop_types$183.default.string,
	size: import_prop_types$183.default.oneOfType([import_prop_types$183.default.string, import_prop_types$183.default.number])
};
Feather.displayName = "Feather";
var feather_default = Feather;

//#endregion
//#region node_modules/react-feather/dist/icons/figma.js
var import_prop_types$182 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$182() {
	_extends$182 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$182.apply(this, arguments);
}
function _objectWithoutProperties$182(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$182(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$182(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Figma = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$182(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$182({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" }));
});
Figma.propTypes = {
	color: import_prop_types$182.default.string,
	size: import_prop_types$182.default.oneOfType([import_prop_types$182.default.string, import_prop_types$182.default.number])
};
Figma.displayName = "Figma";
var figma_default = Figma;

//#endregion
//#region node_modules/react-feather/dist/icons/file-minus.js
var import_prop_types$181 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$181() {
	_extends$181 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$181.apply(this, arguments);
}
function _objectWithoutProperties$181(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$181(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$181(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var FileMinus = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$181(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$181({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "14 2 14 8 20 8" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "15",
		x2: "15",
		y2: "15"
	}));
});
FileMinus.propTypes = {
	color: import_prop_types$181.default.string,
	size: import_prop_types$181.default.oneOfType([import_prop_types$181.default.string, import_prop_types$181.default.number])
};
FileMinus.displayName = "FileMinus";
var file_minus_default = FileMinus;

//#endregion
//#region node_modules/react-feather/dist/icons/file-plus.js
var import_prop_types$180 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$180() {
	_extends$180 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$180.apply(this, arguments);
}
function _objectWithoutProperties$180(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$180(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$180(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var FilePlus = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$180(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$180({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "14 2 14 8 20 8" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "18",
		x2: "12",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "15",
		x2: "15",
		y2: "15"
	}));
});
FilePlus.propTypes = {
	color: import_prop_types$180.default.string,
	size: import_prop_types$180.default.oneOfType([import_prop_types$180.default.string, import_prop_types$180.default.number])
};
FilePlus.displayName = "FilePlus";
var file_plus_default = FilePlus;

//#endregion
//#region node_modules/react-feather/dist/icons/file-text.js
var import_prop_types$179 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$179() {
	_extends$179 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$179.apply(this, arguments);
}
function _objectWithoutProperties$179(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$179(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$179(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var FileText = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$179(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$179({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "14 2 14 8 20 8" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16",
		y1: "13",
		x2: "8",
		y2: "13"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16",
		y1: "17",
		x2: "8",
		y2: "17"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "10 9 9 9 8 9" }));
});
FileText.propTypes = {
	color: import_prop_types$179.default.string,
	size: import_prop_types$179.default.oneOfType([import_prop_types$179.default.string, import_prop_types$179.default.number])
};
FileText.displayName = "FileText";
var file_text_default = FileText;

//#endregion
//#region node_modules/react-feather/dist/icons/file.js
var import_prop_types$178 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$178() {
	_extends$178 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$178.apply(this, arguments);
}
function _objectWithoutProperties$178(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$178(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$178(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var File = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$178(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$178({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "13 2 13 9 20 9" }));
});
File.propTypes = {
	color: import_prop_types$178.default.string,
	size: import_prop_types$178.default.oneOfType([import_prop_types$178.default.string, import_prop_types$178.default.number])
};
File.displayName = "File";
var file_default = File;

//#endregion
//#region node_modules/react-feather/dist/icons/film.js
var import_prop_types$177 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$177() {
	_extends$177 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$177.apply(this, arguments);
}
function _objectWithoutProperties$177(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$177(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$177(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Film = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$177(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$177({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "2",
		y: "2",
		width: "20",
		height: "20",
		rx: "2.18",
		ry: "2.18"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "7",
		y1: "2",
		x2: "7",
		y2: "22"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "17",
		y1: "2",
		x2: "17",
		y2: "22"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "2",
		y1: "12",
		x2: "22",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "2",
		y1: "7",
		x2: "7",
		y2: "7"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "2",
		y1: "17",
		x2: "7",
		y2: "17"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "17",
		y1: "17",
		x2: "22",
		y2: "17"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "17",
		y1: "7",
		x2: "22",
		y2: "7"
	}));
});
Film.propTypes = {
	color: import_prop_types$177.default.string,
	size: import_prop_types$177.default.oneOfType([import_prop_types$177.default.string, import_prop_types$177.default.number])
};
Film.displayName = "Film";
var film_default = Film;

//#endregion
//#region node_modules/react-feather/dist/icons/filter.js
var import_prop_types$176 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$176() {
	_extends$176 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$176.apply(this, arguments);
}
function _objectWithoutProperties$176(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$176(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$176(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Filter = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$176(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$176({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" }));
});
Filter.propTypes = {
	color: import_prop_types$176.default.string,
	size: import_prop_types$176.default.oneOfType([import_prop_types$176.default.string, import_prop_types$176.default.number])
};
Filter.displayName = "Filter";
var filter_default = Filter;

//#endregion
//#region node_modules/react-feather/dist/icons/flag.js
var import_prop_types$175 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$175() {
	_extends$175 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$175.apply(this, arguments);
}
function _objectWithoutProperties$175(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$175(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$175(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Flag = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$175(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$175({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4",
		y1: "22",
		x2: "4",
		y2: "15"
	}));
});
Flag.propTypes = {
	color: import_prop_types$175.default.string,
	size: import_prop_types$175.default.oneOfType([import_prop_types$175.default.string, import_prop_types$175.default.number])
};
Flag.displayName = "Flag";
var flag_default = Flag;

//#endregion
//#region node_modules/react-feather/dist/icons/folder-minus.js
var import_prop_types$174 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$174() {
	_extends$174 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$174.apply(this, arguments);
}
function _objectWithoutProperties$174(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$174(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$174(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var FolderMinus = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$174(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$174({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "14",
		x2: "15",
		y2: "14"
	}));
});
FolderMinus.propTypes = {
	color: import_prop_types$174.default.string,
	size: import_prop_types$174.default.oneOfType([import_prop_types$174.default.string, import_prop_types$174.default.number])
};
FolderMinus.displayName = "FolderMinus";
var folder_minus_default = FolderMinus;

//#endregion
//#region node_modules/react-feather/dist/icons/folder-plus.js
var import_prop_types$173 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$173() {
	_extends$173 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$173.apply(this, arguments);
}
function _objectWithoutProperties$173(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$173(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$173(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var FolderPlus = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$173(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$173({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "11",
		x2: "12",
		y2: "17"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "14",
		x2: "15",
		y2: "14"
	}));
});
FolderPlus.propTypes = {
	color: import_prop_types$173.default.string,
	size: import_prop_types$173.default.oneOfType([import_prop_types$173.default.string, import_prop_types$173.default.number])
};
FolderPlus.displayName = "FolderPlus";
var folder_plus_default = FolderPlus;

//#endregion
//#region node_modules/react-feather/dist/icons/folder.js
var import_prop_types$172 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$172() {
	_extends$172 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$172.apply(this, arguments);
}
function _objectWithoutProperties$172(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$172(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$172(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Folder = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$172(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$172({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }));
});
Folder.propTypes = {
	color: import_prop_types$172.default.string,
	size: import_prop_types$172.default.oneOfType([import_prop_types$172.default.string, import_prop_types$172.default.number])
};
Folder.displayName = "Folder";
var folder_default = Folder;

//#endregion
//#region node_modules/react-feather/dist/icons/framer.js
var import_prop_types$171 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$171() {
	_extends$171 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$171.apply(this, arguments);
}
function _objectWithoutProperties$171(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$171(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$171(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Framer = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$171(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$171({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M5 16V9h14V2H5l14 14h-7m-7 0l7 7v-7m-7 0h7" }));
});
Framer.propTypes = {
	color: import_prop_types$171.default.string,
	size: import_prop_types$171.default.oneOfType([import_prop_types$171.default.string, import_prop_types$171.default.number])
};
Framer.displayName = "Framer";
var framer_default = Framer;

//#endregion
//#region node_modules/react-feather/dist/icons/frown.js
var import_prop_types$170 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$170() {
	_extends$170 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$170.apply(this, arguments);
}
function _objectWithoutProperties$170(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$170(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$170(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Frown = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$170(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$170({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M16 16s-1.5-2-4-2-4 2-4 2" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "9",
		x2: "9.01",
		y2: "9"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "15",
		y1: "9",
		x2: "15.01",
		y2: "9"
	}));
});
Frown.propTypes = {
	color: import_prop_types$170.default.string,
	size: import_prop_types$170.default.oneOfType([import_prop_types$170.default.string, import_prop_types$170.default.number])
};
Frown.displayName = "Frown";
var frown_default = Frown;

//#endregion
//#region node_modules/react-feather/dist/icons/gift.js
var import_prop_types$169 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$169() {
	_extends$169 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$169.apply(this, arguments);
}
function _objectWithoutProperties$169(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$169(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$169(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Gift = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$169(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$169({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "20 12 20 22 4 22 4 12" }), /* @__PURE__ */ import_react.createElement("rect", {
		x: "2",
		y: "7",
		width: "20",
		height: "5"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "22",
		x2: "12",
		y2: "7"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" }));
});
Gift.propTypes = {
	color: import_prop_types$169.default.string,
	size: import_prop_types$169.default.oneOfType([import_prop_types$169.default.string, import_prop_types$169.default.number])
};
Gift.displayName = "Gift";
var gift_default = Gift;

//#endregion
//#region node_modules/react-feather/dist/icons/git-branch.js
var import_prop_types$168 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$168() {
	_extends$168 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$168.apply(this, arguments);
}
function _objectWithoutProperties$168(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$168(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$168(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var GitBranch = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$168(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$168({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "6",
		y1: "3",
		x2: "6",
		y2: "15"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "18",
		cy: "6",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "6",
		cy: "18",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M18 9a9 9 0 0 1-9 9" }));
});
GitBranch.propTypes = {
	color: import_prop_types$168.default.string,
	size: import_prop_types$168.default.oneOfType([import_prop_types$168.default.string, import_prop_types$168.default.number])
};
GitBranch.displayName = "GitBranch";
var git_branch_default = GitBranch;

//#endregion
//#region node_modules/react-feather/dist/icons/git-commit.js
var import_prop_types$167 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$167() {
	_extends$167 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$167.apply(this, arguments);
}
function _objectWithoutProperties$167(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$167(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$167(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var GitCommit = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$167(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$167({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1.05",
		y1: "12",
		x2: "7",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "17.01",
		y1: "12",
		x2: "22.96",
		y2: "12"
	}));
});
GitCommit.propTypes = {
	color: import_prop_types$167.default.string,
	size: import_prop_types$167.default.oneOfType([import_prop_types$167.default.string, import_prop_types$167.default.number])
};
GitCommit.displayName = "GitCommit";
var git_commit_default = GitCommit;

//#endregion
//#region node_modules/react-feather/dist/icons/git-merge.js
var import_prop_types$166 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$166() {
	_extends$166 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$166.apply(this, arguments);
}
function _objectWithoutProperties$166(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$166(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$166(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var GitMerge = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$166(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$166({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "18",
		cy: "18",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "6",
		cy: "6",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M6 21V9a9 9 0 0 0 9 9" }));
});
GitMerge.propTypes = {
	color: import_prop_types$166.default.string,
	size: import_prop_types$166.default.oneOfType([import_prop_types$166.default.string, import_prop_types$166.default.number])
};
GitMerge.displayName = "GitMerge";
var git_merge_default = GitMerge;

//#endregion
//#region node_modules/react-feather/dist/icons/git-pull-request.js
var import_prop_types$165 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$165() {
	_extends$165 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$165.apply(this, arguments);
}
function _objectWithoutProperties$165(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$165(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$165(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var GitPullRequest = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$165(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$165({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "18",
		cy: "18",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "6",
		cy: "6",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M13 6h3a2 2 0 0 1 2 2v7" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "6",
		y1: "9",
		x2: "6",
		y2: "21"
	}));
});
GitPullRequest.propTypes = {
	color: import_prop_types$165.default.string,
	size: import_prop_types$165.default.oneOfType([import_prop_types$165.default.string, import_prop_types$165.default.number])
};
GitPullRequest.displayName = "GitPullRequest";
var git_pull_request_default = GitPullRequest;

//#endregion
//#region node_modules/react-feather/dist/icons/github.js
var import_prop_types$164 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$164() {
	_extends$164 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$164.apply(this, arguments);
}
function _objectWithoutProperties$164(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$164(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$164(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var GitHub = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$164(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$164({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" }));
});
GitHub.propTypes = {
	color: import_prop_types$164.default.string,
	size: import_prop_types$164.default.oneOfType([import_prop_types$164.default.string, import_prop_types$164.default.number])
};
GitHub.displayName = "GitHub";
var github_default = GitHub;

//#endregion
//#region node_modules/react-feather/dist/icons/gitlab.js
var import_prop_types$163 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$163() {
	_extends$163 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$163.apply(this, arguments);
}
function _objectWithoutProperties$163(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$163(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$163(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Gitlab = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$163(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$163({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" }));
});
Gitlab.propTypes = {
	color: import_prop_types$163.default.string,
	size: import_prop_types$163.default.oneOfType([import_prop_types$163.default.string, import_prop_types$163.default.number])
};
Gitlab.displayName = "Gitlab";
var gitlab_default = Gitlab;

//#endregion
//#region node_modules/react-feather/dist/icons/globe.js
var import_prop_types$162 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$162() {
	_extends$162 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$162.apply(this, arguments);
}
function _objectWithoutProperties$162(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$162(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$162(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Globe = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$162(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$162({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "2",
		y1: "12",
		x2: "22",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" }));
});
Globe.propTypes = {
	color: import_prop_types$162.default.string,
	size: import_prop_types$162.default.oneOfType([import_prop_types$162.default.string, import_prop_types$162.default.number])
};
Globe.displayName = "Globe";
var globe_default = Globe;

//#endregion
//#region node_modules/react-feather/dist/icons/grid.js
var import_prop_types$161 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$161() {
	_extends$161 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$161.apply(this, arguments);
}
function _objectWithoutProperties$161(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$161(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$161(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Grid = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$161(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$161({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "3",
		width: "7",
		height: "7"
	}), /* @__PURE__ */ import_react.createElement("rect", {
		x: "14",
		y: "3",
		width: "7",
		height: "7"
	}), /* @__PURE__ */ import_react.createElement("rect", {
		x: "14",
		y: "14",
		width: "7",
		height: "7"
	}), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "14",
		width: "7",
		height: "7"
	}));
});
Grid.propTypes = {
	color: import_prop_types$161.default.string,
	size: import_prop_types$161.default.oneOfType([import_prop_types$161.default.string, import_prop_types$161.default.number])
};
Grid.displayName = "Grid";
var grid_default = Grid;

//#endregion
//#region node_modules/react-feather/dist/icons/hard-drive.js
var import_prop_types$160 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$160() {
	_extends$160 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$160.apply(this, arguments);
}
function _objectWithoutProperties$160(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$160(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$160(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var HardDrive = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$160(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$160({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "22",
		y1: "12",
		x2: "2",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "6",
		y1: "16",
		x2: "6.01",
		y2: "16"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "10",
		y1: "16",
		x2: "10.01",
		y2: "16"
	}));
});
HardDrive.propTypes = {
	color: import_prop_types$160.default.string,
	size: import_prop_types$160.default.oneOfType([import_prop_types$160.default.string, import_prop_types$160.default.number])
};
HardDrive.displayName = "HardDrive";
var hard_drive_default = HardDrive;

//#endregion
//#region node_modules/react-feather/dist/icons/hash.js
var import_prop_types$159 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$159() {
	_extends$159 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$159.apply(this, arguments);
}
function _objectWithoutProperties$159(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$159(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$159(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Hash = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$159(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$159({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4",
		y1: "9",
		x2: "20",
		y2: "9"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4",
		y1: "15",
		x2: "20",
		y2: "15"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "10",
		y1: "3",
		x2: "8",
		y2: "21"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16",
		y1: "3",
		x2: "14",
		y2: "21"
	}));
});
Hash.propTypes = {
	color: import_prop_types$159.default.string,
	size: import_prop_types$159.default.oneOfType([import_prop_types$159.default.string, import_prop_types$159.default.number])
};
Hash.displayName = "Hash";
var hash_default = Hash;

//#endregion
//#region node_modules/react-feather/dist/icons/headphones.js
var import_prop_types$158 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$158() {
	_extends$158 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$158.apply(this, arguments);
}
function _objectWithoutProperties$158(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$158(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$158(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Headphones = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$158(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$158({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M3 18v-6a9 9 0 0 1 18 0v6" }), /* @__PURE__ */ import_react.createElement("path", { d: "M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" }));
});
Headphones.propTypes = {
	color: import_prop_types$158.default.string,
	size: import_prop_types$158.default.oneOfType([import_prop_types$158.default.string, import_prop_types$158.default.number])
};
Headphones.displayName = "Headphones";
var headphones_default = Headphones;

//#endregion
//#region node_modules/react-feather/dist/icons/heart.js
var import_prop_types$157 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$157() {
	_extends$157 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$157.apply(this, arguments);
}
function _objectWithoutProperties$157(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$157(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$157(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Heart = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$157(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$157({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }));
});
Heart.propTypes = {
	color: import_prop_types$157.default.string,
	size: import_prop_types$157.default.oneOfType([import_prop_types$157.default.string, import_prop_types$157.default.number])
};
Heart.displayName = "Heart";
var heart_default = Heart;

//#endregion
//#region node_modules/react-feather/dist/icons/help-circle.js
var import_prop_types$156 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$156() {
	_extends$156 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$156.apply(this, arguments);
}
function _objectWithoutProperties$156(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$156(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$156(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var HelpCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$156(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$156({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "17",
		x2: "12.01",
		y2: "17"
	}));
});
HelpCircle.propTypes = {
	color: import_prop_types$156.default.string,
	size: import_prop_types$156.default.oneOfType([import_prop_types$156.default.string, import_prop_types$156.default.number])
};
HelpCircle.displayName = "HelpCircle";
var help_circle_default = HelpCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/hexagon.js
var import_prop_types$155 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$155() {
	_extends$155 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$155.apply(this, arguments);
}
function _objectWithoutProperties$155(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$155(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$155(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Hexagon = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$155(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$155({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }));
});
Hexagon.propTypes = {
	color: import_prop_types$155.default.string,
	size: import_prop_types$155.default.oneOfType([import_prop_types$155.default.string, import_prop_types$155.default.number])
};
Hexagon.displayName = "Hexagon";
var hexagon_default = Hexagon;

//#endregion
//#region node_modules/react-feather/dist/icons/home.js
var import_prop_types$154 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$154() {
	_extends$154 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$154.apply(this, arguments);
}
function _objectWithoutProperties$154(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$154(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$154(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Home = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$154(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$154({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "9 22 9 12 15 12 15 22" }));
});
Home.propTypes = {
	color: import_prop_types$154.default.string,
	size: import_prop_types$154.default.oneOfType([import_prop_types$154.default.string, import_prop_types$154.default.number])
};
Home.displayName = "Home";
var home_default = Home;

//#endregion
//#region node_modules/react-feather/dist/icons/image.js
var import_prop_types$153 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$153() {
	_extends$153 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$153.apply(this, arguments);
}
function _objectWithoutProperties$153(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$153(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$153(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Image = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$153(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$153({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "3",
		width: "18",
		height: "18",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "8.5",
		cy: "8.5",
		r: "1.5"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "21 15 16 10 5 21" }));
});
Image.propTypes = {
	color: import_prop_types$153.default.string,
	size: import_prop_types$153.default.oneOfType([import_prop_types$153.default.string, import_prop_types$153.default.number])
};
Image.displayName = "Image";
var image_default = Image;

//#endregion
//#region node_modules/react-feather/dist/icons/inbox.js
var import_prop_types$152 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$152() {
	_extends$152 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$152.apply(this, arguments);
}
function _objectWithoutProperties$152(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$152(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$152(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Inbox = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$152(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$152({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12" }), /* @__PURE__ */ import_react.createElement("path", { d: "M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" }));
});
Inbox.propTypes = {
	color: import_prop_types$152.default.string,
	size: import_prop_types$152.default.oneOfType([import_prop_types$152.default.string, import_prop_types$152.default.number])
};
Inbox.displayName = "Inbox";
var inbox_default = Inbox;

//#endregion
//#region node_modules/react-feather/dist/icons/info.js
var import_prop_types$151 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$151() {
	_extends$151 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$151.apply(this, arguments);
}
function _objectWithoutProperties$151(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$151(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$151(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Info = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$151(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$151({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "16",
		x2: "12",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "8",
		x2: "12.01",
		y2: "8"
	}));
});
Info.propTypes = {
	color: import_prop_types$151.default.string,
	size: import_prop_types$151.default.oneOfType([import_prop_types$151.default.string, import_prop_types$151.default.number])
};
Info.displayName = "Info";
var info_default = Info;

//#endregion
//#region node_modules/react-feather/dist/icons/instagram.js
var import_prop_types$150 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$150() {
	_extends$150 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$150.apply(this, arguments);
}
function _objectWithoutProperties$150(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$150(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$150(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Instagram = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$150(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$150({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "2",
		y: "2",
		width: "20",
		height: "20",
		rx: "5",
		ry: "5"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "17.5",
		y1: "6.5",
		x2: "17.51",
		y2: "6.5"
	}));
});
Instagram.propTypes = {
	color: import_prop_types$150.default.string,
	size: import_prop_types$150.default.oneOfType([import_prop_types$150.default.string, import_prop_types$150.default.number])
};
Instagram.displayName = "Instagram";
var instagram_default = Instagram;

//#endregion
//#region node_modules/react-feather/dist/icons/italic.js
var import_prop_types$149 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$149() {
	_extends$149 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$149.apply(this, arguments);
}
function _objectWithoutProperties$149(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$149(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$149(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Italic = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$149(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$149({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "19",
		y1: "4",
		x2: "10",
		y2: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "14",
		y1: "20",
		x2: "5",
		y2: "20"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "15",
		y1: "4",
		x2: "9",
		y2: "20"
	}));
});
Italic.propTypes = {
	color: import_prop_types$149.default.string,
	size: import_prop_types$149.default.oneOfType([import_prop_types$149.default.string, import_prop_types$149.default.number])
};
Italic.displayName = "Italic";
var italic_default = Italic;

//#endregion
//#region node_modules/react-feather/dist/icons/key.js
var import_prop_types$148 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$148() {
	_extends$148 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$148.apply(this, arguments);
}
function _objectWithoutProperties$148(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$148(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$148(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Key = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$148(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$148({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" }));
});
Key.propTypes = {
	color: import_prop_types$148.default.string,
	size: import_prop_types$148.default.oneOfType([import_prop_types$148.default.string, import_prop_types$148.default.number])
};
Key.displayName = "Key";
var key_default = Key;

//#endregion
//#region node_modules/react-feather/dist/icons/layers.js
var import_prop_types$147 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$147() {
	_extends$147 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$147.apply(this, arguments);
}
function _objectWithoutProperties$147(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$147(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$147(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Layers = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$147(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$147({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "2 17 12 22 22 17" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "2 12 12 17 22 12" }));
});
Layers.propTypes = {
	color: import_prop_types$147.default.string,
	size: import_prop_types$147.default.oneOfType([import_prop_types$147.default.string, import_prop_types$147.default.number])
};
Layers.displayName = "Layers";
var layers_default = Layers;

//#endregion
//#region node_modules/react-feather/dist/icons/layout.js
var import_prop_types$146 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$146() {
	_extends$146 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$146.apply(this, arguments);
}
function _objectWithoutProperties$146(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$146(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$146(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Layout = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$146(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$146({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "3",
		width: "18",
		height: "18",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "3",
		y1: "9",
		x2: "21",
		y2: "9"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "21",
		x2: "9",
		y2: "9"
	}));
});
Layout.propTypes = {
	color: import_prop_types$146.default.string,
	size: import_prop_types$146.default.oneOfType([import_prop_types$146.default.string, import_prop_types$146.default.number])
};
Layout.displayName = "Layout";
var layout_default = Layout;

//#endregion
//#region node_modules/react-feather/dist/icons/life-buoy.js
var import_prop_types$145 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$145() {
	_extends$145 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$145.apply(this, arguments);
}
function _objectWithoutProperties$145(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$145(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$145(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var LifeBuoy = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$145(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$145({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4.93",
		y1: "4.93",
		x2: "9.17",
		y2: "9.17"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "14.83",
		y1: "14.83",
		x2: "19.07",
		y2: "19.07"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "14.83",
		y1: "9.17",
		x2: "19.07",
		y2: "4.93"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "14.83",
		y1: "9.17",
		x2: "18.36",
		y2: "5.64"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4.93",
		y1: "19.07",
		x2: "9.17",
		y2: "14.83"
	}));
});
LifeBuoy.propTypes = {
	color: import_prop_types$145.default.string,
	size: import_prop_types$145.default.oneOfType([import_prop_types$145.default.string, import_prop_types$145.default.number])
};
LifeBuoy.displayName = "LifeBuoy";
var life_buoy_default = LifeBuoy;

//#endregion
//#region node_modules/react-feather/dist/icons/link-2.js
var import_prop_types$144 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$144() {
	_extends$144 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$144.apply(this, arguments);
}
function _objectWithoutProperties$144(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$144(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$144(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Link2 = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$144(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$144({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "12",
		x2: "16",
		y2: "12"
	}));
});
Link2.propTypes = {
	color: import_prop_types$144.default.string,
	size: import_prop_types$144.default.oneOfType([import_prop_types$144.default.string, import_prop_types$144.default.number])
};
Link2.displayName = "Link2";
var link_2_default = Link2;

//#endregion
//#region node_modules/react-feather/dist/icons/link.js
var import_prop_types$143 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$143() {
	_extends$143 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$143.apply(this, arguments);
}
function _objectWithoutProperties$143(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$143(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$143(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Link = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$143(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$143({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }), /* @__PURE__ */ import_react.createElement("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" }));
});
Link.propTypes = {
	color: import_prop_types$143.default.string,
	size: import_prop_types$143.default.oneOfType([import_prop_types$143.default.string, import_prop_types$143.default.number])
};
Link.displayName = "Link";
var link_default = Link;

//#endregion
//#region node_modules/react-feather/dist/icons/linkedin.js
var import_prop_types$142 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$142() {
	_extends$142 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$142.apply(this, arguments);
}
function _objectWithoutProperties$142(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$142(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$142(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Linkedin = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$142(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$142({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" }), /* @__PURE__ */ import_react.createElement("rect", {
		x: "2",
		y: "9",
		width: "4",
		height: "12"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "4",
		cy: "4",
		r: "2"
	}));
});
Linkedin.propTypes = {
	color: import_prop_types$142.default.string,
	size: import_prop_types$142.default.oneOfType([import_prop_types$142.default.string, import_prop_types$142.default.number])
};
Linkedin.displayName = "Linkedin";
var linkedin_default = Linkedin;

//#endregion
//#region node_modules/react-feather/dist/icons/list.js
var import_prop_types$141 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$141() {
	_extends$141 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$141.apply(this, arguments);
}
function _objectWithoutProperties$141(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$141(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$141(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var List = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$141(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$141({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "6",
		x2: "21",
		y2: "6"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "12",
		x2: "21",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "18",
		x2: "21",
		y2: "18"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "3",
		y1: "6",
		x2: "3.01",
		y2: "6"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "3",
		y1: "12",
		x2: "3.01",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "3",
		y1: "18",
		x2: "3.01",
		y2: "18"
	}));
});
List.propTypes = {
	color: import_prop_types$141.default.string,
	size: import_prop_types$141.default.oneOfType([import_prop_types$141.default.string, import_prop_types$141.default.number])
};
List.displayName = "List";
var list_default = List;

//#endregion
//#region node_modules/react-feather/dist/icons/loader.js
var import_prop_types$140 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$140() {
	_extends$140 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$140.apply(this, arguments);
}
function _objectWithoutProperties$140(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$140(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$140(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Loader = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$140(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$140({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "2",
		x2: "12",
		y2: "6"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "18",
		x2: "12",
		y2: "22"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4.93",
		y1: "4.93",
		x2: "7.76",
		y2: "7.76"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16.24",
		y1: "16.24",
		x2: "19.07",
		y2: "19.07"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "2",
		y1: "12",
		x2: "6",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "18",
		y1: "12",
		x2: "22",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4.93",
		y1: "19.07",
		x2: "7.76",
		y2: "16.24"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16.24",
		y1: "7.76",
		x2: "19.07",
		y2: "4.93"
	}));
});
Loader.propTypes = {
	color: import_prop_types$140.default.string,
	size: import_prop_types$140.default.oneOfType([import_prop_types$140.default.string, import_prop_types$140.default.number])
};
Loader.displayName = "Loader";
var loader_default = Loader;

//#endregion
//#region node_modules/react-feather/dist/icons/lock.js
var import_prop_types$139 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$139() {
	_extends$139 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$139.apply(this, arguments);
}
function _objectWithoutProperties$139(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$139(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$139(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Lock = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$139(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$139({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "11",
		width: "18",
		height: "11",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }));
});
Lock.propTypes = {
	color: import_prop_types$139.default.string,
	size: import_prop_types$139.default.oneOfType([import_prop_types$139.default.string, import_prop_types$139.default.number])
};
Lock.displayName = "Lock";
var lock_default = Lock;

//#endregion
//#region node_modules/react-feather/dist/icons/log-in.js
var import_prop_types$138 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$138() {
	_extends$138 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$138.apply(this, arguments);
}
function _objectWithoutProperties$138(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$138(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$138(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var LogIn = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$138(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$138({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "10 17 15 12 10 7" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "15",
		y1: "12",
		x2: "3",
		y2: "12"
	}));
});
LogIn.propTypes = {
	color: import_prop_types$138.default.string,
	size: import_prop_types$138.default.oneOfType([import_prop_types$138.default.string, import_prop_types$138.default.number])
};
LogIn.displayName = "LogIn";
var log_in_default = LogIn;

//#endregion
//#region node_modules/react-feather/dist/icons/log-out.js
var import_prop_types$137 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$137() {
	_extends$137 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$137.apply(this, arguments);
}
function _objectWithoutProperties$137(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$137(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$137(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var LogOut = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$137(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$137({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "16 17 21 12 16 7" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "12",
		x2: "9",
		y2: "12"
	}));
});
LogOut.propTypes = {
	color: import_prop_types$137.default.string,
	size: import_prop_types$137.default.oneOfType([import_prop_types$137.default.string, import_prop_types$137.default.number])
};
LogOut.displayName = "LogOut";
var log_out_default = LogOut;

//#endregion
//#region node_modules/react-feather/dist/icons/mail.js
var import_prop_types$136 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$136() {
	_extends$136 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$136.apply(this, arguments);
}
function _objectWithoutProperties$136(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$136(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$136(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Mail = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$136(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$136({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "22,6 12,13 2,6" }));
});
Mail.propTypes = {
	color: import_prop_types$136.default.string,
	size: import_prop_types$136.default.oneOfType([import_prop_types$136.default.string, import_prop_types$136.default.number])
};
Mail.displayName = "Mail";
var mail_default = Mail;

//#endregion
//#region node_modules/react-feather/dist/icons/map-pin.js
var import_prop_types$135 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$135() {
	_extends$135 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$135.apply(this, arguments);
}
function _objectWithoutProperties$135(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$135(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$135(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var MapPin = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$135(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$135({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "10",
		r: "3"
	}));
});
MapPin.propTypes = {
	color: import_prop_types$135.default.string,
	size: import_prop_types$135.default.oneOfType([import_prop_types$135.default.string, import_prop_types$135.default.number])
};
MapPin.displayName = "MapPin";
var map_pin_default = MapPin;

//#endregion
//#region node_modules/react-feather/dist/icons/map.js
var import_prop_types$134 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$134() {
	_extends$134 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$134.apply(this, arguments);
}
function _objectWithoutProperties$134(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$134(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$134(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Map = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$134(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$134({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "2",
		x2: "8",
		y2: "18"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16",
		y1: "6",
		x2: "16",
		y2: "22"
	}));
});
Map.propTypes = {
	color: import_prop_types$134.default.string,
	size: import_prop_types$134.default.oneOfType([import_prop_types$134.default.string, import_prop_types$134.default.number])
};
Map.displayName = "Map";
var map_default = Map;

//#endregion
//#region node_modules/react-feather/dist/icons/maximize-2.js
var import_prop_types$133 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$133() {
	_extends$133 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$133.apply(this, arguments);
}
function _objectWithoutProperties$133(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$133(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$133(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Maximize2 = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$133(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$133({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "15 3 21 3 21 9" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "9 21 3 21 3 15" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "3",
		x2: "14",
		y2: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "3",
		y1: "21",
		x2: "10",
		y2: "14"
	}));
});
Maximize2.propTypes = {
	color: import_prop_types$133.default.string,
	size: import_prop_types$133.default.oneOfType([import_prop_types$133.default.string, import_prop_types$133.default.number])
};
Maximize2.displayName = "Maximize2";
var maximize_2_default = Maximize2;

//#endregion
//#region node_modules/react-feather/dist/icons/maximize.js
var import_prop_types$132 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$132() {
	_extends$132 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$132.apply(this, arguments);
}
function _objectWithoutProperties$132(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$132(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$132(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Maximize = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$132(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$132({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" }));
});
Maximize.propTypes = {
	color: import_prop_types$132.default.string,
	size: import_prop_types$132.default.oneOfType([import_prop_types$132.default.string, import_prop_types$132.default.number])
};
Maximize.displayName = "Maximize";
var maximize_default = Maximize;

//#endregion
//#region node_modules/react-feather/dist/icons/meh.js
var import_prop_types$131 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$131() {
	_extends$131 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$131.apply(this, arguments);
}
function _objectWithoutProperties$131(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$131(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$131(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Meh = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$131(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$131({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "15",
		x2: "16",
		y2: "15"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "9",
		x2: "9.01",
		y2: "9"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "15",
		y1: "9",
		x2: "15.01",
		y2: "9"
	}));
});
Meh.propTypes = {
	color: import_prop_types$131.default.string,
	size: import_prop_types$131.default.oneOfType([import_prop_types$131.default.string, import_prop_types$131.default.number])
};
Meh.displayName = "Meh";
var meh_default = Meh;

//#endregion
//#region node_modules/react-feather/dist/icons/menu.js
var import_prop_types$130 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$130() {
	_extends$130 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$130.apply(this, arguments);
}
function _objectWithoutProperties$130(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$130(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$130(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Menu = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$130(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$130({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "3",
		y1: "12",
		x2: "21",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "3",
		y1: "6",
		x2: "21",
		y2: "6"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "3",
		y1: "18",
		x2: "21",
		y2: "18"
	}));
});
Menu.propTypes = {
	color: import_prop_types$130.default.string,
	size: import_prop_types$130.default.oneOfType([import_prop_types$130.default.string, import_prop_types$130.default.number])
};
Menu.displayName = "Menu";
var menu_default = Menu;

//#endregion
//#region node_modules/react-feather/dist/icons/message-circle.js
var import_prop_types$129 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$129() {
	_extends$129 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$129.apply(this, arguments);
}
function _objectWithoutProperties$129(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$129(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$129(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var MessageCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$129(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$129({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" }));
});
MessageCircle.propTypes = {
	color: import_prop_types$129.default.string,
	size: import_prop_types$129.default.oneOfType([import_prop_types$129.default.string, import_prop_types$129.default.number])
};
MessageCircle.displayName = "MessageCircle";
var message_circle_default = MessageCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/message-square.js
var import_prop_types$128 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$128() {
	_extends$128 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$128.apply(this, arguments);
}
function _objectWithoutProperties$128(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$128(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$128(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var MessageSquare = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$128(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$128({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }));
});
MessageSquare.propTypes = {
	color: import_prop_types$128.default.string,
	size: import_prop_types$128.default.oneOfType([import_prop_types$128.default.string, import_prop_types$128.default.number])
};
MessageSquare.displayName = "MessageSquare";
var message_square_default = MessageSquare;

//#endregion
//#region node_modules/react-feather/dist/icons/mic-off.js
var import_prop_types$127 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$127() {
	_extends$127 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$127.apply(this, arguments);
}
function _objectWithoutProperties$127(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$127(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$127(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var MicOff = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$127(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$127({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "1",
		x2: "23",
		y2: "23"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" }), /* @__PURE__ */ import_react.createElement("path", { d: "M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "19",
		x2: "12",
		y2: "23"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "23",
		x2: "16",
		y2: "23"
	}));
});
MicOff.propTypes = {
	color: import_prop_types$127.default.string,
	size: import_prop_types$127.default.oneOfType([import_prop_types$127.default.string, import_prop_types$127.default.number])
};
MicOff.displayName = "MicOff";
var mic_off_default = MicOff;

//#endregion
//#region node_modules/react-feather/dist/icons/mic.js
var import_prop_types$126 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$126() {
	_extends$126 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$126.apply(this, arguments);
}
function _objectWithoutProperties$126(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$126(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$126(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Mic = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$126(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$126({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "19",
		x2: "12",
		y2: "23"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "23",
		x2: "16",
		y2: "23"
	}));
});
Mic.propTypes = {
	color: import_prop_types$126.default.string,
	size: import_prop_types$126.default.oneOfType([import_prop_types$126.default.string, import_prop_types$126.default.number])
};
Mic.displayName = "Mic";
var mic_default = Mic;

//#endregion
//#region node_modules/react-feather/dist/icons/minimize-2.js
var import_prop_types$125 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$125() {
	_extends$125 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$125.apply(this, arguments);
}
function _objectWithoutProperties$125(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$125(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$125(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Minimize2 = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$125(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$125({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "4 14 10 14 10 20" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "20 10 14 10 14 4" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "14",
		y1: "10",
		x2: "21",
		y2: "3"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "3",
		y1: "21",
		x2: "10",
		y2: "14"
	}));
});
Minimize2.propTypes = {
	color: import_prop_types$125.default.string,
	size: import_prop_types$125.default.oneOfType([import_prop_types$125.default.string, import_prop_types$125.default.number])
};
Minimize2.displayName = "Minimize2";
var minimize_2_default = Minimize2;

//#endregion
//#region node_modules/react-feather/dist/icons/minimize.js
var import_prop_types$124 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$124() {
	_extends$124 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$124.apply(this, arguments);
}
function _objectWithoutProperties$124(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$124(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$124(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Minimize = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$124(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$124({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" }));
});
Minimize.propTypes = {
	color: import_prop_types$124.default.string,
	size: import_prop_types$124.default.oneOfType([import_prop_types$124.default.string, import_prop_types$124.default.number])
};
Minimize.displayName = "Minimize";
var minimize_default = Minimize;

//#endregion
//#region node_modules/react-feather/dist/icons/minus-circle.js
var import_prop_types$123 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$123() {
	_extends$123 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$123.apply(this, arguments);
}
function _objectWithoutProperties$123(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$123(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$123(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var MinusCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$123(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$123({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "12",
		x2: "16",
		y2: "12"
	}));
});
MinusCircle.propTypes = {
	color: import_prop_types$123.default.string,
	size: import_prop_types$123.default.oneOfType([import_prop_types$123.default.string, import_prop_types$123.default.number])
};
MinusCircle.displayName = "MinusCircle";
var minus_circle_default = MinusCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/minus-square.js
var import_prop_types$122 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$122() {
	_extends$122 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$122.apply(this, arguments);
}
function _objectWithoutProperties$122(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$122(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$122(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var MinusSquare = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$122(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$122({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "3",
		width: "18",
		height: "18",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "12",
		x2: "16",
		y2: "12"
	}));
});
MinusSquare.propTypes = {
	color: import_prop_types$122.default.string,
	size: import_prop_types$122.default.oneOfType([import_prop_types$122.default.string, import_prop_types$122.default.number])
};
MinusSquare.displayName = "MinusSquare";
var minus_square_default = MinusSquare;

//#endregion
//#region node_modules/react-feather/dist/icons/minus.js
var import_prop_types$121 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$121() {
	_extends$121 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$121.apply(this, arguments);
}
function _objectWithoutProperties$121(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$121(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$121(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Minus = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$121(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$121({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "5",
		y1: "12",
		x2: "19",
		y2: "12"
	}));
});
Minus.propTypes = {
	color: import_prop_types$121.default.string,
	size: import_prop_types$121.default.oneOfType([import_prop_types$121.default.string, import_prop_types$121.default.number])
};
Minus.displayName = "Minus";
var minus_default = Minus;

//#endregion
//#region node_modules/react-feather/dist/icons/monitor.js
var import_prop_types$120 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$120() {
	_extends$120 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$120.apply(this, arguments);
}
function _objectWithoutProperties$120(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$120(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$120(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Monitor = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$120(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$120({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "2",
		y: "3",
		width: "20",
		height: "14",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "21",
		x2: "16",
		y2: "21"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "17",
		x2: "12",
		y2: "21"
	}));
});
Monitor.propTypes = {
	color: import_prop_types$120.default.string,
	size: import_prop_types$120.default.oneOfType([import_prop_types$120.default.string, import_prop_types$120.default.number])
};
Monitor.displayName = "Monitor";
var monitor_default = Monitor;

//#endregion
//#region node_modules/react-feather/dist/icons/moon.js
var import_prop_types$119 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$119() {
	_extends$119 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$119.apply(this, arguments);
}
function _objectWithoutProperties$119(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$119(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$119(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Moon = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$119(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$119({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }));
});
Moon.propTypes = {
	color: import_prop_types$119.default.string,
	size: import_prop_types$119.default.oneOfType([import_prop_types$119.default.string, import_prop_types$119.default.number])
};
Moon.displayName = "Moon";
var moon_default = Moon;

//#endregion
//#region node_modules/react-feather/dist/icons/more-horizontal.js
var import_prop_types$118 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$118() {
	_extends$118 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$118.apply(this, arguments);
}
function _objectWithoutProperties$118(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$118(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$118(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var MoreHorizontal = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$118(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$118({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "1"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "19",
		cy: "12",
		r: "1"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "5",
		cy: "12",
		r: "1"
	}));
});
MoreHorizontal.propTypes = {
	color: import_prop_types$118.default.string,
	size: import_prop_types$118.default.oneOfType([import_prop_types$118.default.string, import_prop_types$118.default.number])
};
MoreHorizontal.displayName = "MoreHorizontal";
var more_horizontal_default = MoreHorizontal;

//#endregion
//#region node_modules/react-feather/dist/icons/more-vertical.js
var import_prop_types$117 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$117() {
	_extends$117 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$117.apply(this, arguments);
}
function _objectWithoutProperties$117(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$117(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$117(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var MoreVertical = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$117(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$117({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "1"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "5",
		r: "1"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "19",
		r: "1"
	}));
});
MoreVertical.propTypes = {
	color: import_prop_types$117.default.string,
	size: import_prop_types$117.default.oneOfType([import_prop_types$117.default.string, import_prop_types$117.default.number])
};
MoreVertical.displayName = "MoreVertical";
var more_vertical_default = MoreVertical;

//#endregion
//#region node_modules/react-feather/dist/icons/mouse-pointer.js
var import_prop_types$116 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$116() {
	_extends$116 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$116.apply(this, arguments);
}
function _objectWithoutProperties$116(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$116(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$116(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var MousePointer = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$116(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$116({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M13 13l6 6" }));
});
MousePointer.propTypes = {
	color: import_prop_types$116.default.string,
	size: import_prop_types$116.default.oneOfType([import_prop_types$116.default.string, import_prop_types$116.default.number])
};
MousePointer.displayName = "MousePointer";
var mouse_pointer_default = MousePointer;

//#endregion
//#region node_modules/react-feather/dist/icons/move.js
var import_prop_types$115 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$115() {
	_extends$115 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$115.apply(this, arguments);
}
function _objectWithoutProperties$115(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$115(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$115(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Move = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$115(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$115({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "5 9 2 12 5 15" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "9 5 12 2 15 5" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "15 19 12 22 9 19" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "19 9 22 12 19 15" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "2",
		y1: "12",
		x2: "22",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "2",
		x2: "12",
		y2: "22"
	}));
});
Move.propTypes = {
	color: import_prop_types$115.default.string,
	size: import_prop_types$115.default.oneOfType([import_prop_types$115.default.string, import_prop_types$115.default.number])
};
Move.displayName = "Move";
var move_default = Move;

//#endregion
//#region node_modules/react-feather/dist/icons/music.js
var import_prop_types$114 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$114() {
	_extends$114 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$114.apply(this, arguments);
}
function _objectWithoutProperties$114(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$114(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$114(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Music = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$114(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$114({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M9 18V5l12-2v13" }), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "6",
		cy: "18",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "18",
		cy: "16",
		r: "3"
	}));
});
Music.propTypes = {
	color: import_prop_types$114.default.string,
	size: import_prop_types$114.default.oneOfType([import_prop_types$114.default.string, import_prop_types$114.default.number])
};
Music.displayName = "Music";
var music_default = Music;

//#endregion
//#region node_modules/react-feather/dist/icons/navigation-2.js
var import_prop_types$113 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$113() {
	_extends$113 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$113.apply(this, arguments);
}
function _objectWithoutProperties$113(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$113(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$113(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Navigation2 = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$113(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$113({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "12 2 19 21 12 17 5 21 12 2" }));
});
Navigation2.propTypes = {
	color: import_prop_types$113.default.string,
	size: import_prop_types$113.default.oneOfType([import_prop_types$113.default.string, import_prop_types$113.default.number])
};
Navigation2.displayName = "Navigation2";
var navigation_2_default = Navigation2;

//#endregion
//#region node_modules/react-feather/dist/icons/navigation.js
var import_prop_types$112 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$112() {
	_extends$112 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$112.apply(this, arguments);
}
function _objectWithoutProperties$112(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$112(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$112(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Navigation = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$112(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$112({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "3 11 22 2 13 21 11 13 3 11" }));
});
Navigation.propTypes = {
	color: import_prop_types$112.default.string,
	size: import_prop_types$112.default.oneOfType([import_prop_types$112.default.string, import_prop_types$112.default.number])
};
Navigation.displayName = "Navigation";
var navigation_default = Navigation;

//#endregion
//#region node_modules/react-feather/dist/icons/octagon.js
var import_prop_types$111 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$111() {
	_extends$111 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$111.apply(this, arguments);
}
function _objectWithoutProperties$111(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$111(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$111(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Octagon = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$111(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$111({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" }));
});
Octagon.propTypes = {
	color: import_prop_types$111.default.string,
	size: import_prop_types$111.default.oneOfType([import_prop_types$111.default.string, import_prop_types$111.default.number])
};
Octagon.displayName = "Octagon";
var octagon_default = Octagon;

//#endregion
//#region node_modules/react-feather/dist/icons/package.js
var import_prop_types$110 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$110() {
	_extends$110 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$110.apply(this, arguments);
}
function _objectWithoutProperties$110(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$110(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$110(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Package = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$110(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$110({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16.5",
		y1: "9.4",
		x2: "7.5",
		y2: "4.21"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "22.08",
		x2: "12",
		y2: "12"
	}));
});
Package.propTypes = {
	color: import_prop_types$110.default.string,
	size: import_prop_types$110.default.oneOfType([import_prop_types$110.default.string, import_prop_types$110.default.number])
};
Package.displayName = "Package";
var package_default = Package;

//#endregion
//#region node_modules/react-feather/dist/icons/paperclip.js
var import_prop_types$109 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$109() {
	_extends$109 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$109.apply(this, arguments);
}
function _objectWithoutProperties$109(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$109(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$109(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Paperclip = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$109(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$109({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" }));
});
Paperclip.propTypes = {
	color: import_prop_types$109.default.string,
	size: import_prop_types$109.default.oneOfType([import_prop_types$109.default.string, import_prop_types$109.default.number])
};
Paperclip.displayName = "Paperclip";
var paperclip_default = Paperclip;

//#endregion
//#region node_modules/react-feather/dist/icons/pause-circle.js
var import_prop_types$108 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$108() {
	_extends$108 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$108.apply(this, arguments);
}
function _objectWithoutProperties$108(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$108(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$108(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var PauseCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$108(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$108({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "10",
		y1: "15",
		x2: "10",
		y2: "9"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "14",
		y1: "15",
		x2: "14",
		y2: "9"
	}));
});
PauseCircle.propTypes = {
	color: import_prop_types$108.default.string,
	size: import_prop_types$108.default.oneOfType([import_prop_types$108.default.string, import_prop_types$108.default.number])
};
PauseCircle.displayName = "PauseCircle";
var pause_circle_default = PauseCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/pause.js
var import_prop_types$107 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$107() {
	_extends$107 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$107.apply(this, arguments);
}
function _objectWithoutProperties$107(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$107(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$107(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Pause = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$107(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$107({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "6",
		y: "4",
		width: "4",
		height: "16"
	}), /* @__PURE__ */ import_react.createElement("rect", {
		x: "14",
		y: "4",
		width: "4",
		height: "16"
	}));
});
Pause.propTypes = {
	color: import_prop_types$107.default.string,
	size: import_prop_types$107.default.oneOfType([import_prop_types$107.default.string, import_prop_types$107.default.number])
};
Pause.displayName = "Pause";
var pause_default = Pause;

//#endregion
//#region node_modules/react-feather/dist/icons/pen-tool.js
var import_prop_types$106 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$106() {
	_extends$106 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$106.apply(this, arguments);
}
function _objectWithoutProperties$106(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$106(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$106(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var PenTool = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$106(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$106({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M12 19l7-7 3 3-7 7-3-3z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M2 2l7.586 7.586" }), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "11",
		cy: "11",
		r: "2"
	}));
});
PenTool.propTypes = {
	color: import_prop_types$106.default.string,
	size: import_prop_types$106.default.oneOfType([import_prop_types$106.default.string, import_prop_types$106.default.number])
};
PenTool.displayName = "PenTool";
var pen_tool_default = PenTool;

//#endregion
//#region node_modules/react-feather/dist/icons/percent.js
var import_prop_types$105 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$105() {
	_extends$105 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$105.apply(this, arguments);
}
function _objectWithoutProperties$105(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$105(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$105(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Percent = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$105(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$105({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "19",
		y1: "5",
		x2: "5",
		y2: "19"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "6.5",
		cy: "6.5",
		r: "2.5"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "17.5",
		cy: "17.5",
		r: "2.5"
	}));
});
Percent.propTypes = {
	color: import_prop_types$105.default.string,
	size: import_prop_types$105.default.oneOfType([import_prop_types$105.default.string, import_prop_types$105.default.number])
};
Percent.displayName = "Percent";
var percent_default = Percent;

//#endregion
//#region node_modules/react-feather/dist/icons/phone-call.js
var import_prop_types$104 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$104() {
	_extends$104 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$104.apply(this, arguments);
}
function _objectWithoutProperties$104(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$104(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$104(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var PhoneCall = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$104(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$104({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }));
});
PhoneCall.propTypes = {
	color: import_prop_types$104.default.string,
	size: import_prop_types$104.default.oneOfType([import_prop_types$104.default.string, import_prop_types$104.default.number])
};
PhoneCall.displayName = "PhoneCall";
var phone_call_default = PhoneCall;

//#endregion
//#region node_modules/react-feather/dist/icons/phone-forwarded.js
var import_prop_types$103 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$103() {
	_extends$103 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$103.apply(this, arguments);
}
function _objectWithoutProperties$103(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$103(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$103(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var PhoneForwarded = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$103(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$103({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "19 1 23 5 19 9" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "15",
		y1: "5",
		x2: "23",
		y2: "5"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }));
});
PhoneForwarded.propTypes = {
	color: import_prop_types$103.default.string,
	size: import_prop_types$103.default.oneOfType([import_prop_types$103.default.string, import_prop_types$103.default.number])
};
PhoneForwarded.displayName = "PhoneForwarded";
var phone_forwarded_default = PhoneForwarded;

//#endregion
//#region node_modules/react-feather/dist/icons/phone-incoming.js
var import_prop_types$102 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$102() {
	_extends$102 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$102.apply(this, arguments);
}
function _objectWithoutProperties$102(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$102(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$102(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var PhoneIncoming = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$102(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$102({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "16 2 16 8 22 8" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "23",
		y1: "1",
		x2: "16",
		y2: "8"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }));
});
PhoneIncoming.propTypes = {
	color: import_prop_types$102.default.string,
	size: import_prop_types$102.default.oneOfType([import_prop_types$102.default.string, import_prop_types$102.default.number])
};
PhoneIncoming.displayName = "PhoneIncoming";
var phone_incoming_default = PhoneIncoming;

//#endregion
//#region node_modules/react-feather/dist/icons/phone-missed.js
var import_prop_types$101 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$101() {
	_extends$101 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$101.apply(this, arguments);
}
function _objectWithoutProperties$101(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$101(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$101(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var PhoneMissed = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$101(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$101({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "23",
		y1: "1",
		x2: "17",
		y2: "7"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "17",
		y1: "1",
		x2: "23",
		y2: "7"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }));
});
PhoneMissed.propTypes = {
	color: import_prop_types$101.default.string,
	size: import_prop_types$101.default.oneOfType([import_prop_types$101.default.string, import_prop_types$101.default.number])
};
PhoneMissed.displayName = "PhoneMissed";
var phone_missed_default = PhoneMissed;

//#endregion
//#region node_modules/react-feather/dist/icons/phone-off.js
var import_prop_types$100 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$100() {
	_extends$100 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$100.apply(this, arguments);
}
function _objectWithoutProperties$100(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$100(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$100(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var PhoneOff = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$100(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$100({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "23",
		y1: "1",
		x2: "1",
		y2: "23"
	}));
});
PhoneOff.propTypes = {
	color: import_prop_types$100.default.string,
	size: import_prop_types$100.default.oneOfType([import_prop_types$100.default.string, import_prop_types$100.default.number])
};
PhoneOff.displayName = "PhoneOff";
var phone_off_default = PhoneOff;

//#endregion
//#region node_modules/react-feather/dist/icons/phone-outgoing.js
var import_prop_types$99 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$99() {
	_extends$99 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$99.apply(this, arguments);
}
function _objectWithoutProperties$99(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$99(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$99(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var PhoneOutgoing = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$99(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$99({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "23 7 23 1 17 1" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "16",
		y1: "8",
		x2: "23",
		y2: "1"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }));
});
PhoneOutgoing.propTypes = {
	color: import_prop_types$99.default.string,
	size: import_prop_types$99.default.oneOfType([import_prop_types$99.default.string, import_prop_types$99.default.number])
};
PhoneOutgoing.displayName = "PhoneOutgoing";
var phone_outgoing_default = PhoneOutgoing;

//#endregion
//#region node_modules/react-feather/dist/icons/phone.js
var import_prop_types$98 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$98() {
	_extends$98 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$98.apply(this, arguments);
}
function _objectWithoutProperties$98(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$98(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$98(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Phone = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$98(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$98({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }));
});
Phone.propTypes = {
	color: import_prop_types$98.default.string,
	size: import_prop_types$98.default.oneOfType([import_prop_types$98.default.string, import_prop_types$98.default.number])
};
Phone.displayName = "Phone";
var phone_default = Phone;

//#endregion
//#region node_modules/react-feather/dist/icons/pie-chart.js
var import_prop_types$97 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$97() {
	_extends$97 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$97.apply(this, arguments);
}
function _objectWithoutProperties$97(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$97(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$97(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var PieChart = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$97(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$97({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21.21 15.89A10 10 0 1 1 8 2.83" }), /* @__PURE__ */ import_react.createElement("path", { d: "M22 12A10 10 0 0 0 12 2v10z" }));
});
PieChart.propTypes = {
	color: import_prop_types$97.default.string,
	size: import_prop_types$97.default.oneOfType([import_prop_types$97.default.string, import_prop_types$97.default.number])
};
PieChart.displayName = "PieChart";
var pie_chart_default = PieChart;

//#endregion
//#region node_modules/react-feather/dist/icons/play-circle.js
var import_prop_types$96 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$96() {
	_extends$96 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$96.apply(this, arguments);
}
function _objectWithoutProperties$96(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$96(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$96(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var PlayCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$96(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$96({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("polygon", { points: "10 8 16 12 10 16 10 8" }));
});
PlayCircle.propTypes = {
	color: import_prop_types$96.default.string,
	size: import_prop_types$96.default.oneOfType([import_prop_types$96.default.string, import_prop_types$96.default.number])
};
PlayCircle.displayName = "PlayCircle";
var play_circle_default = PlayCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/play.js
var import_prop_types$95 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$95() {
	_extends$95 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$95.apply(this, arguments);
}
function _objectWithoutProperties$95(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$95(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$95(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Play = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$95(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$95({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "5 3 19 12 5 21 5 3" }));
});
Play.propTypes = {
	color: import_prop_types$95.default.string,
	size: import_prop_types$95.default.oneOfType([import_prop_types$95.default.string, import_prop_types$95.default.number])
};
Play.displayName = "Play";
var play_default = Play;

//#endregion
//#region node_modules/react-feather/dist/icons/plus-circle.js
var import_prop_types$94 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$94() {
	_extends$94 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$94.apply(this, arguments);
}
function _objectWithoutProperties$94(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$94(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$94(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var PlusCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$94(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$94({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "8",
		x2: "12",
		y2: "16"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "12",
		x2: "16",
		y2: "12"
	}));
});
PlusCircle.propTypes = {
	color: import_prop_types$94.default.string,
	size: import_prop_types$94.default.oneOfType([import_prop_types$94.default.string, import_prop_types$94.default.number])
};
PlusCircle.displayName = "PlusCircle";
var plus_circle_default = PlusCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/plus-square.js
var import_prop_types$93 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$93() {
	_extends$93 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$93.apply(this, arguments);
}
function _objectWithoutProperties$93(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$93(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$93(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var PlusSquare = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$93(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$93({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "3",
		width: "18",
		height: "18",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "8",
		x2: "12",
		y2: "16"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "12",
		x2: "16",
		y2: "12"
	}));
});
PlusSquare.propTypes = {
	color: import_prop_types$93.default.string,
	size: import_prop_types$93.default.oneOfType([import_prop_types$93.default.string, import_prop_types$93.default.number])
};
PlusSquare.displayName = "PlusSquare";
var plus_square_default = PlusSquare;

//#endregion
//#region node_modules/react-feather/dist/icons/plus.js
var import_prop_types$92 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$92() {
	_extends$92 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$92.apply(this, arguments);
}
function _objectWithoutProperties$92(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$92(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$92(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Plus = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$92(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$92({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "5",
		x2: "12",
		y2: "19"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "5",
		y1: "12",
		x2: "19",
		y2: "12"
	}));
});
Plus.propTypes = {
	color: import_prop_types$92.default.string,
	size: import_prop_types$92.default.oneOfType([import_prop_types$92.default.string, import_prop_types$92.default.number])
};
Plus.displayName = "Plus";
var plus_default = Plus;

//#endregion
//#region node_modules/react-feather/dist/icons/pocket.js
var import_prop_types$91 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$91() {
	_extends$91 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$91.apply(this, arguments);
}
function _objectWithoutProperties$91(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$91(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$91(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Pocket = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$91(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$91({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "8 10 12 14 16 10" }));
});
Pocket.propTypes = {
	color: import_prop_types$91.default.string,
	size: import_prop_types$91.default.oneOfType([import_prop_types$91.default.string, import_prop_types$91.default.number])
};
Pocket.displayName = "Pocket";
var pocket_default = Pocket;

//#endregion
//#region node_modules/react-feather/dist/icons/power.js
var import_prop_types$90 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$90() {
	_extends$90 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$90.apply(this, arguments);
}
function _objectWithoutProperties$90(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$90(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$90(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Power = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$90(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$90({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M18.36 6.64a9 9 0 1 1-12.73 0" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "2",
		x2: "12",
		y2: "12"
	}));
});
Power.propTypes = {
	color: import_prop_types$90.default.string,
	size: import_prop_types$90.default.oneOfType([import_prop_types$90.default.string, import_prop_types$90.default.number])
};
Power.displayName = "Power";
var power_default = Power;

//#endregion
//#region node_modules/react-feather/dist/icons/printer.js
var import_prop_types$89 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$89() {
	_extends$89 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$89.apply(this, arguments);
}
function _objectWithoutProperties$89(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$89(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$89(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Printer = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$89(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$89({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "6 9 6 2 18 2 18 9" }), /* @__PURE__ */ import_react.createElement("path", { d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" }), /* @__PURE__ */ import_react.createElement("rect", {
		x: "6",
		y: "14",
		width: "12",
		height: "8"
	}));
});
Printer.propTypes = {
	color: import_prop_types$89.default.string,
	size: import_prop_types$89.default.oneOfType([import_prop_types$89.default.string, import_prop_types$89.default.number])
};
Printer.displayName = "Printer";
var printer_default = Printer;

//#endregion
//#region node_modules/react-feather/dist/icons/radio.js
var import_prop_types$88 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$88() {
	_extends$88 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$88.apply(this, arguments);
}
function _objectWithoutProperties$88(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$88(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$88(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Radio = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$88(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$88({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "2"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" }));
});
Radio.propTypes = {
	color: import_prop_types$88.default.string,
	size: import_prop_types$88.default.oneOfType([import_prop_types$88.default.string, import_prop_types$88.default.number])
};
Radio.displayName = "Radio";
var radio_default = Radio;

//#endregion
//#region node_modules/react-feather/dist/icons/refresh-ccw.js
var import_prop_types$87 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$87() {
	_extends$87 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$87.apply(this, arguments);
}
function _objectWithoutProperties$87(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$87(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$87(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var RefreshCcw = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$87(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$87({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "1 4 1 10 7 10" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "23 20 23 14 17 14" }), /* @__PURE__ */ import_react.createElement("path", { d: "M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" }));
});
RefreshCcw.propTypes = {
	color: import_prop_types$87.default.string,
	size: import_prop_types$87.default.oneOfType([import_prop_types$87.default.string, import_prop_types$87.default.number])
};
RefreshCcw.displayName = "RefreshCcw";
var refresh_ccw_default = RefreshCcw;

//#endregion
//#region node_modules/react-feather/dist/icons/refresh-cw.js
var import_prop_types$86 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$86() {
	_extends$86 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$86.apply(this, arguments);
}
function _objectWithoutProperties$86(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$86(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$86(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var RefreshCw = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$86(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$86({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "23 4 23 10 17 10" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "1 20 1 14 7 14" }), /* @__PURE__ */ import_react.createElement("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" }));
});
RefreshCw.propTypes = {
	color: import_prop_types$86.default.string,
	size: import_prop_types$86.default.oneOfType([import_prop_types$86.default.string, import_prop_types$86.default.number])
};
RefreshCw.displayName = "RefreshCw";
var refresh_cw_default = RefreshCw;

//#endregion
//#region node_modules/react-feather/dist/icons/repeat.js
var import_prop_types$85 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$85() {
	_extends$85 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$85.apply(this, arguments);
}
function _objectWithoutProperties$85(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$85(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$85(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Repeat = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$85(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$85({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "17 1 21 5 17 9" }), /* @__PURE__ */ import_react.createElement("path", { d: "M3 11V9a4 4 0 0 1 4-4h14" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "7 23 3 19 7 15" }), /* @__PURE__ */ import_react.createElement("path", { d: "M21 13v2a4 4 0 0 1-4 4H3" }));
});
Repeat.propTypes = {
	color: import_prop_types$85.default.string,
	size: import_prop_types$85.default.oneOfType([import_prop_types$85.default.string, import_prop_types$85.default.number])
};
Repeat.displayName = "Repeat";
var repeat_default = Repeat;

//#endregion
//#region node_modules/react-feather/dist/icons/rewind.js
var import_prop_types$84 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$84() {
	_extends$84 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$84.apply(this, arguments);
}
function _objectWithoutProperties$84(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$84(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$84(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Rewind = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$84(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$84({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "11 19 2 12 11 5 11 19" }), /* @__PURE__ */ import_react.createElement("polygon", { points: "22 19 13 12 22 5 22 19" }));
});
Rewind.propTypes = {
	color: import_prop_types$84.default.string,
	size: import_prop_types$84.default.oneOfType([import_prop_types$84.default.string, import_prop_types$84.default.number])
};
Rewind.displayName = "Rewind";
var rewind_default = Rewind;

//#endregion
//#region node_modules/react-feather/dist/icons/rotate-ccw.js
var import_prop_types$83 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$83() {
	_extends$83 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$83.apply(this, arguments);
}
function _objectWithoutProperties$83(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$83(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$83(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var RotateCcw = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$83(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$83({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "1 4 1 10 7 10" }), /* @__PURE__ */ import_react.createElement("path", { d: "M3.51 15a9 9 0 1 0 2.13-9.36L1 10" }));
});
RotateCcw.propTypes = {
	color: import_prop_types$83.default.string,
	size: import_prop_types$83.default.oneOfType([import_prop_types$83.default.string, import_prop_types$83.default.number])
};
RotateCcw.displayName = "RotateCcw";
var rotate_ccw_default = RotateCcw;

//#endregion
//#region node_modules/react-feather/dist/icons/rotate-cw.js
var import_prop_types$82 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$82() {
	_extends$82 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$82.apply(this, arguments);
}
function _objectWithoutProperties$82(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$82(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$82(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var RotateCw = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$82(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$82({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "23 4 23 10 17 10" }), /* @__PURE__ */ import_react.createElement("path", { d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" }));
});
RotateCw.propTypes = {
	color: import_prop_types$82.default.string,
	size: import_prop_types$82.default.oneOfType([import_prop_types$82.default.string, import_prop_types$82.default.number])
};
RotateCw.displayName = "RotateCw";
var rotate_cw_default = RotateCw;

//#endregion
//#region node_modules/react-feather/dist/icons/rss.js
var import_prop_types$81 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$81() {
	_extends$81 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$81.apply(this, arguments);
}
function _objectWithoutProperties$81(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$81(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$81(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Rss = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$81(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$81({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M4 11a9 9 0 0 1 9 9" }), /* @__PURE__ */ import_react.createElement("path", { d: "M4 4a16 16 0 0 1 16 16" }), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "5",
		cy: "19",
		r: "1"
	}));
});
Rss.propTypes = {
	color: import_prop_types$81.default.string,
	size: import_prop_types$81.default.oneOfType([import_prop_types$81.default.string, import_prop_types$81.default.number])
};
Rss.displayName = "Rss";
var rss_default = Rss;

//#endregion
//#region node_modules/react-feather/dist/icons/save.js
var import_prop_types$80 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$80() {
	_extends$80 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$80.apply(this, arguments);
}
function _objectWithoutProperties$80(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$80(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$80(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Save = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$80(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$80({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "17 21 17 13 7 13 7 21" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "7 3 7 8 15 8" }));
});
Save.propTypes = {
	color: import_prop_types$80.default.string,
	size: import_prop_types$80.default.oneOfType([import_prop_types$80.default.string, import_prop_types$80.default.number])
};
Save.displayName = "Save";
var save_default = Save;

//#endregion
//#region node_modules/react-feather/dist/icons/scissors.js
var import_prop_types$79 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$79() {
	_extends$79 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$79.apply(this, arguments);
}
function _objectWithoutProperties$79(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$79(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$79(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Scissors = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$79(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$79({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "6",
		cy: "6",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "6",
		cy: "18",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "20",
		y1: "4",
		x2: "8.12",
		y2: "15.88"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "14.47",
		y1: "14.48",
		x2: "20",
		y2: "20"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8.12",
		y1: "8.12",
		x2: "12",
		y2: "12"
	}));
});
Scissors.propTypes = {
	color: import_prop_types$79.default.string,
	size: import_prop_types$79.default.oneOfType([import_prop_types$79.default.string, import_prop_types$79.default.number])
};
Scissors.displayName = "Scissors";
var scissors_default = Scissors;

//#endregion
//#region node_modules/react-feather/dist/icons/search.js
var import_prop_types$78 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$78() {
	_extends$78 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$78.apply(this, arguments);
}
function _objectWithoutProperties$78(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$78(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$78(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Search = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$78(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$78({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "11",
		cy: "11",
		r: "8"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "21",
		x2: "16.65",
		y2: "16.65"
	}));
});
Search.propTypes = {
	color: import_prop_types$78.default.string,
	size: import_prop_types$78.default.oneOfType([import_prop_types$78.default.string, import_prop_types$78.default.number])
};
Search.displayName = "Search";
var search_default = Search;

//#endregion
//#region node_modules/react-feather/dist/icons/send.js
var import_prop_types$77 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$77() {
	_extends$77 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$77.apply(this, arguments);
}
function _objectWithoutProperties$77(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$77(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$77(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Send = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$77(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$77({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "22",
		y1: "2",
		x2: "11",
		y2: "13"
	}), /* @__PURE__ */ import_react.createElement("polygon", { points: "22 2 15 22 11 13 2 9 22 2" }));
});
Send.propTypes = {
	color: import_prop_types$77.default.string,
	size: import_prop_types$77.default.oneOfType([import_prop_types$77.default.string, import_prop_types$77.default.number])
};
Send.displayName = "Send";
var send_default = Send;

//#endregion
//#region node_modules/react-feather/dist/icons/server.js
var import_prop_types$76 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$76() {
	_extends$76 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$76.apply(this, arguments);
}
function _objectWithoutProperties$76(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$76(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$76(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Server = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$76(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$76({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "2",
		y: "2",
		width: "20",
		height: "8",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("rect", {
		x: "2",
		y: "14",
		width: "20",
		height: "8",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "6",
		y1: "6",
		x2: "6.01",
		y2: "6"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "6",
		y1: "18",
		x2: "6.01",
		y2: "18"
	}));
});
Server.propTypes = {
	color: import_prop_types$76.default.string,
	size: import_prop_types$76.default.oneOfType([import_prop_types$76.default.string, import_prop_types$76.default.number])
};
Server.displayName = "Server";
var server_default = Server;

//#endregion
//#region node_modules/react-feather/dist/icons/settings.js
var import_prop_types$75 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$75() {
	_extends$75 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$75.apply(this, arguments);
}
function _objectWithoutProperties$75(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$75(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$75(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Settings = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$75(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$75({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" }));
});
Settings.propTypes = {
	color: import_prop_types$75.default.string,
	size: import_prop_types$75.default.oneOfType([import_prop_types$75.default.string, import_prop_types$75.default.number])
};
Settings.displayName = "Settings";
var settings_default = Settings;

//#endregion
//#region node_modules/react-feather/dist/icons/share-2.js
var import_prop_types$74 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$74() {
	_extends$74 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$74.apply(this, arguments);
}
function _objectWithoutProperties$74(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$74(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$74(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Share2 = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$74(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$74({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "18",
		cy: "5",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "6",
		cy: "12",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "18",
		cy: "19",
		r: "3"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8.59",
		y1: "13.51",
		x2: "15.42",
		y2: "17.49"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "15.41",
		y1: "6.51",
		x2: "8.59",
		y2: "10.49"
	}));
});
Share2.propTypes = {
	color: import_prop_types$74.default.string,
	size: import_prop_types$74.default.oneOfType([import_prop_types$74.default.string, import_prop_types$74.default.number])
};
Share2.displayName = "Share2";
var share_2_default = Share2;

//#endregion
//#region node_modules/react-feather/dist/icons/share.js
var import_prop_types$73 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$73() {
	_extends$73 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$73.apply(this, arguments);
}
function _objectWithoutProperties$73(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$73(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$73(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Share = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$73(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$73({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "16 6 12 2 8 6" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "2",
		x2: "12",
		y2: "15"
	}));
});
Share.propTypes = {
	color: import_prop_types$73.default.string,
	size: import_prop_types$73.default.oneOfType([import_prop_types$73.default.string, import_prop_types$73.default.number])
};
Share.displayName = "Share";
var share_default = Share;

//#endregion
//#region node_modules/react-feather/dist/icons/shield-off.js
var import_prop_types$72 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$72() {
	_extends$72 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$72.apply(this, arguments);
}
function _objectWithoutProperties$72(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$72(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$72(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ShieldOff = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$72(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$72({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18" }), /* @__PURE__ */ import_react.createElement("path", { d: "M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "1",
		x2: "23",
		y2: "23"
	}));
});
ShieldOff.propTypes = {
	color: import_prop_types$72.default.string,
	size: import_prop_types$72.default.oneOfType([import_prop_types$72.default.string, import_prop_types$72.default.number])
};
ShieldOff.displayName = "ShieldOff";
var shield_off_default = ShieldOff;

//#endregion
//#region node_modules/react-feather/dist/icons/shield.js
var import_prop_types$71 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$71() {
	_extends$71 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$71.apply(this, arguments);
}
function _objectWithoutProperties$71(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$71(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$71(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Shield = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$71(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$71({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }));
});
Shield.propTypes = {
	color: import_prop_types$71.default.string,
	size: import_prop_types$71.default.oneOfType([import_prop_types$71.default.string, import_prop_types$71.default.number])
};
Shield.displayName = "Shield";
var shield_default = Shield;

//#endregion
//#region node_modules/react-feather/dist/icons/shopping-bag.js
var import_prop_types$70 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$70() {
	_extends$70 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$70.apply(this, arguments);
}
function _objectWithoutProperties$70(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$70(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$70(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ShoppingBag = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$70(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$70({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "3",
		y1: "6",
		x2: "21",
		y2: "6"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M16 10a4 4 0 0 1-8 0" }));
});
ShoppingBag.propTypes = {
	color: import_prop_types$70.default.string,
	size: import_prop_types$70.default.oneOfType([import_prop_types$70.default.string, import_prop_types$70.default.number])
};
ShoppingBag.displayName = "ShoppingBag";
var shopping_bag_default = ShoppingBag;

//#endregion
//#region node_modules/react-feather/dist/icons/shopping-cart.js
var import_prop_types$69 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$69() {
	_extends$69 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$69.apply(this, arguments);
}
function _objectWithoutProperties$69(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$69(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$69(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ShoppingCart = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$69(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$69({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "9",
		cy: "21",
		r: "1"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "20",
		cy: "21",
		r: "1"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" }));
});
ShoppingCart.propTypes = {
	color: import_prop_types$69.default.string,
	size: import_prop_types$69.default.oneOfType([import_prop_types$69.default.string, import_prop_types$69.default.number])
};
ShoppingCart.displayName = "ShoppingCart";
var shopping_cart_default = ShoppingCart;

//#endregion
//#region node_modules/react-feather/dist/icons/shuffle.js
var import_prop_types$68 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$68() {
	_extends$68 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$68.apply(this, arguments);
}
function _objectWithoutProperties$68(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$68(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$68(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Shuffle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$68(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$68({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "16 3 21 3 21 8" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4",
		y1: "20",
		x2: "21",
		y2: "3"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "21 16 21 21 16 21" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "15",
		y1: "15",
		x2: "21",
		y2: "21"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4",
		y1: "4",
		x2: "9",
		y2: "9"
	}));
});
Shuffle.propTypes = {
	color: import_prop_types$68.default.string,
	size: import_prop_types$68.default.oneOfType([import_prop_types$68.default.string, import_prop_types$68.default.number])
};
Shuffle.displayName = "Shuffle";
var shuffle_default = Shuffle;

//#endregion
//#region node_modules/react-feather/dist/icons/sidebar.js
var import_prop_types$67 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$67() {
	_extends$67 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$67.apply(this, arguments);
}
function _objectWithoutProperties$67(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$67(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$67(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Sidebar = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$67(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$67({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "3",
		width: "18",
		height: "18",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "3",
		x2: "9",
		y2: "21"
	}));
});
Sidebar.propTypes = {
	color: import_prop_types$67.default.string,
	size: import_prop_types$67.default.oneOfType([import_prop_types$67.default.string, import_prop_types$67.default.number])
};
Sidebar.displayName = "Sidebar";
var sidebar_default = Sidebar;

//#endregion
//#region node_modules/react-feather/dist/icons/skip-back.js
var import_prop_types$66 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$66() {
	_extends$66 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$66.apply(this, arguments);
}
function _objectWithoutProperties$66(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$66(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$66(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var SkipBack = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$66(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$66({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "19 20 9 12 19 4 19 20" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "5",
		y1: "19",
		x2: "5",
		y2: "5"
	}));
});
SkipBack.propTypes = {
	color: import_prop_types$66.default.string,
	size: import_prop_types$66.default.oneOfType([import_prop_types$66.default.string, import_prop_types$66.default.number])
};
SkipBack.displayName = "SkipBack";
var skip_back_default = SkipBack;

//#endregion
//#region node_modules/react-feather/dist/icons/skip-forward.js
var import_prop_types$65 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$65() {
	_extends$65 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$65.apply(this, arguments);
}
function _objectWithoutProperties$65(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$65(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$65(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var SkipForward = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$65(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$65({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "5 4 15 12 5 20 5 4" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "19",
		y1: "5",
		x2: "19",
		y2: "19"
	}));
});
SkipForward.propTypes = {
	color: import_prop_types$65.default.string,
	size: import_prop_types$65.default.oneOfType([import_prop_types$65.default.string, import_prop_types$65.default.number])
};
SkipForward.displayName = "SkipForward";
var skip_forward_default = SkipForward;

//#endregion
//#region node_modules/react-feather/dist/icons/slack.js
var import_prop_types$64 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$64() {
	_extends$64 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$64.apply(this, arguments);
}
function _objectWithoutProperties$64(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$64(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$64(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Slack = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$64(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$64({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" }), /* @__PURE__ */ import_react.createElement("path", { d: "M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" }));
});
Slack.propTypes = {
	color: import_prop_types$64.default.string,
	size: import_prop_types$64.default.oneOfType([import_prop_types$64.default.string, import_prop_types$64.default.number])
};
Slack.displayName = "Slack";
var slack_default = Slack;

//#endregion
//#region node_modules/react-feather/dist/icons/slash.js
var import_prop_types$63 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$63() {
	_extends$63 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$63.apply(this, arguments);
}
function _objectWithoutProperties$63(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$63(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$63(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Slash = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$63(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$63({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4.93",
		y1: "4.93",
		x2: "19.07",
		y2: "19.07"
	}));
});
Slash.propTypes = {
	color: import_prop_types$63.default.string,
	size: import_prop_types$63.default.oneOfType([import_prop_types$63.default.string, import_prop_types$63.default.number])
};
Slash.displayName = "Slash";
var slash_default = Slash;

//#endregion
//#region node_modules/react-feather/dist/icons/sliders.js
var import_prop_types$62 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$62() {
	_extends$62 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$62.apply(this, arguments);
}
function _objectWithoutProperties$62(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$62(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$62(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Sliders = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$62(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$62({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4",
		y1: "21",
		x2: "4",
		y2: "14"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4",
		y1: "10",
		x2: "4",
		y2: "3"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "21",
		x2: "12",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "8",
		x2: "12",
		y2: "3"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "20",
		y1: "21",
		x2: "20",
		y2: "16"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "20",
		y1: "12",
		x2: "20",
		y2: "3"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "14",
		x2: "7",
		y2: "14"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "8",
		x2: "15",
		y2: "8"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "17",
		y1: "16",
		x2: "23",
		y2: "16"
	}));
});
Sliders.propTypes = {
	color: import_prop_types$62.default.string,
	size: import_prop_types$62.default.oneOfType([import_prop_types$62.default.string, import_prop_types$62.default.number])
};
Sliders.displayName = "Sliders";
var sliders_default = Sliders;

//#endregion
//#region node_modules/react-feather/dist/icons/smartphone.js
var import_prop_types$61 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$61() {
	_extends$61 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$61.apply(this, arguments);
}
function _objectWithoutProperties$61(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$61(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$61(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Smartphone = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$61(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$61({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "5",
		y: "2",
		width: "14",
		height: "20",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "18",
		x2: "12.01",
		y2: "18"
	}));
});
Smartphone.propTypes = {
	color: import_prop_types$61.default.string,
	size: import_prop_types$61.default.oneOfType([import_prop_types$61.default.string, import_prop_types$61.default.number])
};
Smartphone.displayName = "Smartphone";
var smartphone_default = Smartphone;

//#endregion
//#region node_modules/react-feather/dist/icons/smile.js
var import_prop_types$60 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$60() {
	_extends$60 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$60.apply(this, arguments);
}
function _objectWithoutProperties$60(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$60(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$60(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Smile = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$60(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$60({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M8 14s1.5 2 4 2 4-2 4-2" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "9",
		x2: "9.01",
		y2: "9"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "15",
		y1: "9",
		x2: "15.01",
		y2: "9"
	}));
});
Smile.propTypes = {
	color: import_prop_types$60.default.string,
	size: import_prop_types$60.default.oneOfType([import_prop_types$60.default.string, import_prop_types$60.default.number])
};
Smile.displayName = "Smile";
var smile_default = Smile;

//#endregion
//#region node_modules/react-feather/dist/icons/speaker.js
var import_prop_types$59 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$59() {
	_extends$59 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$59.apply(this, arguments);
}
function _objectWithoutProperties$59(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$59(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$59(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Speaker = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$59(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$59({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "4",
		y: "2",
		width: "16",
		height: "20",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "14",
		r: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "6",
		x2: "12.01",
		y2: "6"
	}));
});
Speaker.propTypes = {
	color: import_prop_types$59.default.string,
	size: import_prop_types$59.default.oneOfType([import_prop_types$59.default.string, import_prop_types$59.default.number])
};
Speaker.displayName = "Speaker";
var speaker_default = Speaker;

//#endregion
//#region node_modules/react-feather/dist/icons/square.js
var import_prop_types$58 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$58() {
	_extends$58 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$58.apply(this, arguments);
}
function _objectWithoutProperties$58(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$58(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$58(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Square = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$58(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$58({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "3",
		width: "18",
		height: "18",
		rx: "2",
		ry: "2"
	}));
});
Square.propTypes = {
	color: import_prop_types$58.default.string,
	size: import_prop_types$58.default.oneOfType([import_prop_types$58.default.string, import_prop_types$58.default.number])
};
Square.displayName = "Square";
var square_default = Square;

//#endregion
//#region node_modules/react-feather/dist/icons/star.js
var import_prop_types$57 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$57() {
	_extends$57 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$57.apply(this, arguments);
}
function _objectWithoutProperties$57(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$57(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$57(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Star = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$57(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$57({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }));
});
Star.propTypes = {
	color: import_prop_types$57.default.string,
	size: import_prop_types$57.default.oneOfType([import_prop_types$57.default.string, import_prop_types$57.default.number])
};
Star.displayName = "Star";
var star_default = Star;

//#endregion
//#region node_modules/react-feather/dist/icons/stop-circle.js
var import_prop_types$56 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$56() {
	_extends$56 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$56.apply(this, arguments);
}
function _objectWithoutProperties$56(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$56(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$56(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var StopCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$56(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$56({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("rect", {
		x: "9",
		y: "9",
		width: "6",
		height: "6"
	}));
});
StopCircle.propTypes = {
	color: import_prop_types$56.default.string,
	size: import_prop_types$56.default.oneOfType([import_prop_types$56.default.string, import_prop_types$56.default.number])
};
StopCircle.displayName = "StopCircle";
var stop_circle_default = StopCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/sun.js
var import_prop_types$55 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$55() {
	_extends$55 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$55.apply(this, arguments);
}
function _objectWithoutProperties$55(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$55(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$55(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Sun = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$55(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$55({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "5"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "1",
		x2: "12",
		y2: "3"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "21",
		x2: "12",
		y2: "23"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4.22",
		y1: "4.22",
		x2: "5.64",
		y2: "5.64"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "18.36",
		y1: "18.36",
		x2: "19.78",
		y2: "19.78"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "12",
		x2: "3",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "12",
		x2: "23",
		y2: "12"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4.22",
		y1: "19.78",
		x2: "5.64",
		y2: "18.36"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "18.36",
		y1: "5.64",
		x2: "19.78",
		y2: "4.22"
	}));
});
Sun.propTypes = {
	color: import_prop_types$55.default.string,
	size: import_prop_types$55.default.oneOfType([import_prop_types$55.default.string, import_prop_types$55.default.number])
};
Sun.displayName = "Sun";
var sun_default = Sun;

//#endregion
//#region node_modules/react-feather/dist/icons/sunrise.js
var import_prop_types$54 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$54() {
	_extends$54 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$54.apply(this, arguments);
}
function _objectWithoutProperties$54(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$54(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$54(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Sunrise = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$54(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$54({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M17 18a5 5 0 0 0-10 0" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "2",
		x2: "12",
		y2: "9"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4.22",
		y1: "10.22",
		x2: "5.64",
		y2: "11.64"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "18",
		x2: "3",
		y2: "18"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "18",
		x2: "23",
		y2: "18"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "18.36",
		y1: "11.64",
		x2: "19.78",
		y2: "10.22"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "23",
		y1: "22",
		x2: "1",
		y2: "22"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "8 6 12 2 16 6" }));
});
Sunrise.propTypes = {
	color: import_prop_types$54.default.string,
	size: import_prop_types$54.default.oneOfType([import_prop_types$54.default.string, import_prop_types$54.default.number])
};
Sunrise.displayName = "Sunrise";
var sunrise_default = Sunrise;

//#endregion
//#region node_modules/react-feather/dist/icons/sunset.js
var import_prop_types$53 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$53() {
	_extends$53 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$53.apply(this, arguments);
}
function _objectWithoutProperties$53(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$53(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$53(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Sunset = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$53(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$53({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M17 18a5 5 0 0 0-10 0" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "9",
		x2: "12",
		y2: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4.22",
		y1: "10.22",
		x2: "5.64",
		y2: "11.64"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "18",
		x2: "3",
		y2: "18"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "18",
		x2: "23",
		y2: "18"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "18.36",
		y1: "11.64",
		x2: "19.78",
		y2: "10.22"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "23",
		y1: "22",
		x2: "1",
		y2: "22"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "16 5 12 9 8 5" }));
});
Sunset.propTypes = {
	color: import_prop_types$53.default.string,
	size: import_prop_types$53.default.oneOfType([import_prop_types$53.default.string, import_prop_types$53.default.number])
};
Sunset.displayName = "Sunset";
var sunset_default = Sunset;

//#endregion
//#region node_modules/react-feather/dist/icons/table.js
var import_prop_types$52 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$52() {
	_extends$52 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$52.apply(this, arguments);
}
function _objectWithoutProperties$52(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$52(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$52(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Table = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$52(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$52({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" }));
});
Table.propTypes = {
	color: import_prop_types$52.default.string,
	size: import_prop_types$52.default.oneOfType([import_prop_types$52.default.string, import_prop_types$52.default.number])
};
Table.displayName = "Table";
var table_default = Table;

//#endregion
//#region node_modules/react-feather/dist/icons/tablet.js
var import_prop_types$51 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$51() {
	_extends$51 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$51.apply(this, arguments);
}
function _objectWithoutProperties$51(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$51(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$51(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Tablet = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$51(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$51({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "4",
		y: "2",
		width: "16",
		height: "20",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "18",
		x2: "12.01",
		y2: "18"
	}));
});
Tablet.propTypes = {
	color: import_prop_types$51.default.string,
	size: import_prop_types$51.default.oneOfType([import_prop_types$51.default.string, import_prop_types$51.default.number])
};
Tablet.displayName = "Tablet";
var tablet_default = Tablet;

//#endregion
//#region node_modules/react-feather/dist/icons/tag.js
var import_prop_types$50 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$50() {
	_extends$50 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$50.apply(this, arguments);
}
function _objectWithoutProperties$50(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$50(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$50(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Tag = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$50(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$50({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "7",
		y1: "7",
		x2: "7.01",
		y2: "7"
	}));
});
Tag.propTypes = {
	color: import_prop_types$50.default.string,
	size: import_prop_types$50.default.oneOfType([import_prop_types$50.default.string, import_prop_types$50.default.number])
};
Tag.displayName = "Tag";
var tag_default = Tag;

//#endregion
//#region node_modules/react-feather/dist/icons/target.js
var import_prop_types$49 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$49() {
	_extends$49 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$49.apply(this, arguments);
}
function _objectWithoutProperties$49(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$49(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$49(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Target = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$49(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$49({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "6"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "2"
	}));
});
Target.propTypes = {
	color: import_prop_types$49.default.string,
	size: import_prop_types$49.default.oneOfType([import_prop_types$49.default.string, import_prop_types$49.default.number])
};
Target.displayName = "Target";
var target_default = Target;

//#endregion
//#region node_modules/react-feather/dist/icons/terminal.js
var import_prop_types$48 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$48() {
	_extends$48 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$48.apply(this, arguments);
}
function _objectWithoutProperties$48(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$48(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$48(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Terminal = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$48(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$48({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "4 17 10 11 4 5" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "19",
		x2: "20",
		y2: "19"
	}));
});
Terminal.propTypes = {
	color: import_prop_types$48.default.string,
	size: import_prop_types$48.default.oneOfType([import_prop_types$48.default.string, import_prop_types$48.default.number])
};
Terminal.displayName = "Terminal";
var terminal_default = Terminal;

//#endregion
//#region node_modules/react-feather/dist/icons/thermometer.js
var import_prop_types$47 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$47() {
	_extends$47 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$47.apply(this, arguments);
}
function _objectWithoutProperties$47(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$47(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$47(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Thermometer = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$47(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$47({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" }));
});
Thermometer.propTypes = {
	color: import_prop_types$47.default.string,
	size: import_prop_types$47.default.oneOfType([import_prop_types$47.default.string, import_prop_types$47.default.number])
};
Thermometer.displayName = "Thermometer";
var thermometer_default = Thermometer;

//#endregion
//#region node_modules/react-feather/dist/icons/thumbs-down.js
var import_prop_types$46 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$46() {
	_extends$46 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$46.apply(this, arguments);
}
function _objectWithoutProperties$46(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$46(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$46(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ThumbsDown = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$46(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$46({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" }));
});
ThumbsDown.propTypes = {
	color: import_prop_types$46.default.string,
	size: import_prop_types$46.default.oneOfType([import_prop_types$46.default.string, import_prop_types$46.default.number])
};
ThumbsDown.displayName = "ThumbsDown";
var thumbs_down_default = ThumbsDown;

//#endregion
//#region node_modules/react-feather/dist/icons/thumbs-up.js
var import_prop_types$45 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$45() {
	_extends$45 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$45.apply(this, arguments);
}
function _objectWithoutProperties$45(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$45(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$45(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ThumbsUp = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$45(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$45({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" }));
});
ThumbsUp.propTypes = {
	color: import_prop_types$45.default.string,
	size: import_prop_types$45.default.oneOfType([import_prop_types$45.default.string, import_prop_types$45.default.number])
};
ThumbsUp.displayName = "ThumbsUp";
var thumbs_up_default = ThumbsUp;

//#endregion
//#region node_modules/react-feather/dist/icons/toggle-left.js
var import_prop_types$44 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$44() {
	_extends$44 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$44.apply(this, arguments);
}
function _objectWithoutProperties$44(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$44(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$44(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ToggleLeft = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$44(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$44({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "1",
		y: "5",
		width: "22",
		height: "14",
		rx: "7",
		ry: "7"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "8",
		cy: "12",
		r: "3"
	}));
});
ToggleLeft.propTypes = {
	color: import_prop_types$44.default.string,
	size: import_prop_types$44.default.oneOfType([import_prop_types$44.default.string, import_prop_types$44.default.number])
};
ToggleLeft.displayName = "ToggleLeft";
var toggle_left_default = ToggleLeft;

//#endregion
//#region node_modules/react-feather/dist/icons/toggle-right.js
var import_prop_types$43 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$43() {
	_extends$43 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$43.apply(this, arguments);
}
function _objectWithoutProperties$43(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$43(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$43(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ToggleRight = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$43(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$43({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "1",
		y: "5",
		width: "22",
		height: "14",
		rx: "7",
		ry: "7"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "16",
		cy: "12",
		r: "3"
	}));
});
ToggleRight.propTypes = {
	color: import_prop_types$43.default.string,
	size: import_prop_types$43.default.oneOfType([import_prop_types$43.default.string, import_prop_types$43.default.number])
};
ToggleRight.displayName = "ToggleRight";
var toggle_right_default = ToggleRight;

//#endregion
//#region node_modules/react-feather/dist/icons/tool.js
var import_prop_types$42 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$42() {
	_extends$42 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$42.apply(this, arguments);
}
function _objectWithoutProperties$42(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$42(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$42(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Tool = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$42(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$42({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }));
});
Tool.propTypes = {
	color: import_prop_types$42.default.string,
	size: import_prop_types$42.default.oneOfType([import_prop_types$42.default.string, import_prop_types$42.default.number])
};
Tool.displayName = "Tool";
var tool_default = Tool;

//#endregion
//#region node_modules/react-feather/dist/icons/trash-2.js
var import_prop_types$41 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$41() {
	_extends$41 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$41.apply(this, arguments);
}
function _objectWithoutProperties$41(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$41(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$41(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Trash2 = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$41(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$41({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ import_react.createElement("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "10",
		y1: "11",
		x2: "10",
		y2: "17"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "14",
		y1: "11",
		x2: "14",
		y2: "17"
	}));
});
Trash2.propTypes = {
	color: import_prop_types$41.default.string,
	size: import_prop_types$41.default.oneOfType([import_prop_types$41.default.string, import_prop_types$41.default.number])
};
Trash2.displayName = "Trash2";
var trash_2_default = Trash2;

//#endregion
//#region node_modules/react-feather/dist/icons/trash.js
var import_prop_types$40 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$40() {
	_extends$40 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$40.apply(this, arguments);
}
function _objectWithoutProperties$40(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$40(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$40(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Trash = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$40(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$40({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ import_react.createElement("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }));
});
Trash.propTypes = {
	color: import_prop_types$40.default.string,
	size: import_prop_types$40.default.oneOfType([import_prop_types$40.default.string, import_prop_types$40.default.number])
};
Trash.displayName = "Trash";
var trash_default = Trash;

//#endregion
//#region node_modules/react-feather/dist/icons/trello.js
var import_prop_types$39 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$39() {
	_extends$39 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$39.apply(this, arguments);
}
function _objectWithoutProperties$39(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$39(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$39(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Trello = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$39(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$39({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "3",
		width: "18",
		height: "18",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("rect", {
		x: "7",
		y: "7",
		width: "3",
		height: "9"
	}), /* @__PURE__ */ import_react.createElement("rect", {
		x: "14",
		y: "7",
		width: "3",
		height: "5"
	}));
});
Trello.propTypes = {
	color: import_prop_types$39.default.string,
	size: import_prop_types$39.default.oneOfType([import_prop_types$39.default.string, import_prop_types$39.default.number])
};
Trello.displayName = "Trello";
var trello_default = Trello;

//#endregion
//#region node_modules/react-feather/dist/icons/trending-down.js
var import_prop_types$38 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$38() {
	_extends$38 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$38.apply(this, arguments);
}
function _objectWithoutProperties$38(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$38(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$38(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var TrendingDown = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$38(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$38({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "23 18 13.5 8.5 8.5 13.5 1 6" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "17 18 23 18 23 12" }));
});
TrendingDown.propTypes = {
	color: import_prop_types$38.default.string,
	size: import_prop_types$38.default.oneOfType([import_prop_types$38.default.string, import_prop_types$38.default.number])
};
TrendingDown.displayName = "TrendingDown";
var trending_down_default = TrendingDown;

//#endregion
//#region node_modules/react-feather/dist/icons/trending-up.js
var import_prop_types$37 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$37() {
	_extends$37 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$37.apply(this, arguments);
}
function _objectWithoutProperties$37(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$37(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$37(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var TrendingUp = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$37(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$37({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "23 6 13.5 15.5 8.5 10.5 1 18" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "17 6 23 6 23 12" }));
});
TrendingUp.propTypes = {
	color: import_prop_types$37.default.string,
	size: import_prop_types$37.default.oneOfType([import_prop_types$37.default.string, import_prop_types$37.default.number])
};
TrendingUp.displayName = "TrendingUp";
var trending_up_default = TrendingUp;

//#endregion
//#region node_modules/react-feather/dist/icons/triangle.js
var import_prop_types$36 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$36() {
	_extends$36 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$36.apply(this, arguments);
}
function _objectWithoutProperties$36(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$36(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$36(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Triangle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$36(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$36({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }));
});
Triangle.propTypes = {
	color: import_prop_types$36.default.string,
	size: import_prop_types$36.default.oneOfType([import_prop_types$36.default.string, import_prop_types$36.default.number])
};
Triangle.displayName = "Triangle";
var triangle_default = Triangle;

//#endregion
//#region node_modules/react-feather/dist/icons/truck.js
var import_prop_types$35 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$35() {
	_extends$35 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$35.apply(this, arguments);
}
function _objectWithoutProperties$35(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$35(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$35(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Truck = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$35(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$35({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "1",
		y: "3",
		width: "15",
		height: "13"
	}), /* @__PURE__ */ import_react.createElement("polygon", { points: "16 8 20 8 23 11 23 16 16 16 16 8" }), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "5.5",
		cy: "18.5",
		r: "2.5"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "18.5",
		cy: "18.5",
		r: "2.5"
	}));
});
Truck.propTypes = {
	color: import_prop_types$35.default.string,
	size: import_prop_types$35.default.oneOfType([import_prop_types$35.default.string, import_prop_types$35.default.number])
};
Truck.displayName = "Truck";
var truck_default = Truck;

//#endregion
//#region node_modules/react-feather/dist/icons/tv.js
var import_prop_types$34 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$34() {
	_extends$34 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$34.apply(this, arguments);
}
function _objectWithoutProperties$34(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$34(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$34(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Tv = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$34(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$34({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "2",
		y: "7",
		width: "20",
		height: "15",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "17 2 12 7 7 2" }));
});
Tv.propTypes = {
	color: import_prop_types$34.default.string,
	size: import_prop_types$34.default.oneOfType([import_prop_types$34.default.string, import_prop_types$34.default.number])
};
Tv.displayName = "Tv";
var tv_default = Tv;

//#endregion
//#region node_modules/react-feather/dist/icons/twitch.js
var import_prop_types$33 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$33() {
	_extends$33 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$33.apply(this, arguments);
}
function _objectWithoutProperties$33(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$33(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$33(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Twitch = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$33(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$33({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" }));
});
Twitch.propTypes = {
	color: import_prop_types$33.default.string,
	size: import_prop_types$33.default.oneOfType([import_prop_types$33.default.string, import_prop_types$33.default.number])
};
Twitch.displayName = "Twitch";
var twitch_default = Twitch;

//#endregion
//#region node_modules/react-feather/dist/icons/twitter.js
var import_prop_types$32 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$32() {
	_extends$32 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$32.apply(this, arguments);
}
function _objectWithoutProperties$32(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$32(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$32(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Twitter = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$32(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$32({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" }));
});
Twitter.propTypes = {
	color: import_prop_types$32.default.string,
	size: import_prop_types$32.default.oneOfType([import_prop_types$32.default.string, import_prop_types$32.default.number])
};
Twitter.displayName = "Twitter";
var twitter_default = Twitter;

//#endregion
//#region node_modules/react-feather/dist/icons/type.js
var import_prop_types$31 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$31() {
	_extends$31 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$31.apply(this, arguments);
}
function _objectWithoutProperties$31(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$31(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$31(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Type = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$31(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$31({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "4 7 4 4 20 4 20 7" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "20",
		x2: "15",
		y2: "20"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "4",
		x2: "12",
		y2: "20"
	}));
});
Type.propTypes = {
	color: import_prop_types$31.default.string,
	size: import_prop_types$31.default.oneOfType([import_prop_types$31.default.string, import_prop_types$31.default.number])
};
Type.displayName = "Type";
var type_default = Type;

//#endregion
//#region node_modules/react-feather/dist/icons/umbrella.js
var import_prop_types$30 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$30() {
	_extends$30 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$30.apply(this, arguments);
}
function _objectWithoutProperties$30(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$30(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$30(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Umbrella = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$30(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$30({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7" }));
});
Umbrella.propTypes = {
	color: import_prop_types$30.default.string,
	size: import_prop_types$30.default.oneOfType([import_prop_types$30.default.string, import_prop_types$30.default.number])
};
Umbrella.displayName = "Umbrella";
var umbrella_default = Umbrella;

//#endregion
//#region node_modules/react-feather/dist/icons/underline.js
var import_prop_types$29 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$29() {
	_extends$29 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$29.apply(this, arguments);
}
function _objectWithoutProperties$29(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$29(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$29(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Underline = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$29(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$29({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "4",
		y1: "21",
		x2: "20",
		y2: "21"
	}));
});
Underline.propTypes = {
	color: import_prop_types$29.default.string,
	size: import_prop_types$29.default.oneOfType([import_prop_types$29.default.string, import_prop_types$29.default.number])
};
Underline.displayName = "Underline";
var underline_default = Underline;

//#endregion
//#region node_modules/react-feather/dist/icons/unlock.js
var import_prop_types$28 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$28() {
	_extends$28 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$28.apply(this, arguments);
}
function _objectWithoutProperties$28(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$28(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$28(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Unlock = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$28(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$28({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "11",
		width: "18",
		height: "11",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M7 11V7a5 5 0 0 1 9.9-1" }));
});
Unlock.propTypes = {
	color: import_prop_types$28.default.string,
	size: import_prop_types$28.default.oneOfType([import_prop_types$28.default.string, import_prop_types$28.default.number])
};
Unlock.displayName = "Unlock";
var unlock_default = Unlock;

//#endregion
//#region node_modules/react-feather/dist/icons/upload-cloud.js
var import_prop_types$27 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$27() {
	_extends$27 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$27.apply(this, arguments);
}
function _objectWithoutProperties$27(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$27(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$27(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var UploadCloud = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$27(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$27({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "16 16 12 12 8 16" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "12",
		x2: "12",
		y2: "21"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "16 16 12 12 8 16" }));
});
UploadCloud.propTypes = {
	color: import_prop_types$27.default.string,
	size: import_prop_types$27.default.oneOfType([import_prop_types$27.default.string, import_prop_types$27.default.number])
};
UploadCloud.displayName = "UploadCloud";
var upload_cloud_default = UploadCloud;

//#endregion
//#region node_modules/react-feather/dist/icons/upload.js
var import_prop_types$26 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$26() {
	_extends$26 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$26.apply(this, arguments);
}
function _objectWithoutProperties$26(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$26(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$26(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Upload = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$26(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$26({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "17 8 12 3 7 8" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "3",
		x2: "12",
		y2: "15"
	}));
});
Upload.propTypes = {
	color: import_prop_types$26.default.string,
	size: import_prop_types$26.default.oneOfType([import_prop_types$26.default.string, import_prop_types$26.default.number])
};
Upload.displayName = "Upload";
var upload_default = Upload;

//#endregion
//#region node_modules/react-feather/dist/icons/user-check.js
var import_prop_types$25 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$25() {
	_extends$25 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$25.apply(this, arguments);
}
function _objectWithoutProperties$25(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$25(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$25(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var UserCheck = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$25(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$25({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "8.5",
		cy: "7",
		r: "4"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "17 11 19 13 23 9" }));
});
UserCheck.propTypes = {
	color: import_prop_types$25.default.string,
	size: import_prop_types$25.default.oneOfType([import_prop_types$25.default.string, import_prop_types$25.default.number])
};
UserCheck.displayName = "UserCheck";
var user_check_default = UserCheck;

//#endregion
//#region node_modules/react-feather/dist/icons/user-minus.js
var import_prop_types$24 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$24() {
	_extends$24 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$24.apply(this, arguments);
}
function _objectWithoutProperties$24(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$24(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$24(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var UserMinus = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$24(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$24({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "8.5",
		cy: "7",
		r: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "23",
		y1: "11",
		x2: "17",
		y2: "11"
	}));
});
UserMinus.propTypes = {
	color: import_prop_types$24.default.string,
	size: import_prop_types$24.default.oneOfType([import_prop_types$24.default.string, import_prop_types$24.default.number])
};
UserMinus.displayName = "UserMinus";
var user_minus_default = UserMinus;

//#endregion
//#region node_modules/react-feather/dist/icons/user-plus.js
var import_prop_types$23 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$23() {
	_extends$23 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$23.apply(this, arguments);
}
function _objectWithoutProperties$23(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$23(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$23(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var UserPlus = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$23(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$23({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "8.5",
		cy: "7",
		r: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "20",
		y1: "8",
		x2: "20",
		y2: "14"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "23",
		y1: "11",
		x2: "17",
		y2: "11"
	}));
});
UserPlus.propTypes = {
	color: import_prop_types$23.default.string,
	size: import_prop_types$23.default.oneOfType([import_prop_types$23.default.string, import_prop_types$23.default.number])
};
UserPlus.displayName = "UserPlus";
var user_plus_default = UserPlus;

//#endregion
//#region node_modules/react-feather/dist/icons/user-x.js
var import_prop_types$22 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$22() {
	_extends$22 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$22.apply(this, arguments);
}
function _objectWithoutProperties$22(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$22(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$22(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var UserX = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$22(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$22({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "8.5",
		cy: "7",
		r: "4"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "18",
		y1: "8",
		x2: "23",
		y2: "13"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "23",
		y1: "8",
		x2: "18",
		y2: "13"
	}));
});
UserX.propTypes = {
	color: import_prop_types$22.default.string,
	size: import_prop_types$22.default.oneOfType([import_prop_types$22.default.string, import_prop_types$22.default.number])
};
UserX.displayName = "UserX";
var user_x_default = UserX;

//#endregion
//#region node_modules/react-feather/dist/icons/user.js
var import_prop_types$21 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$21() {
	_extends$21 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$21.apply(this, arguments);
}
function _objectWithoutProperties$21(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$21(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$21(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var User = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$21(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$21({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "7",
		r: "4"
	}));
});
User.propTypes = {
	color: import_prop_types$21.default.string,
	size: import_prop_types$21.default.oneOfType([import_prop_types$21.default.string, import_prop_types$21.default.number])
};
User.displayName = "User";
var user_default = User;

//#endregion
//#region node_modules/react-feather/dist/icons/users.js
var import_prop_types$20 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$20() {
	_extends$20 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$20.apply(this, arguments);
}
function _objectWithoutProperties$20(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$20(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$20(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Users = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$20(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$20({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "9",
		cy: "7",
		r: "4"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), /* @__PURE__ */ import_react.createElement("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }));
});
Users.propTypes = {
	color: import_prop_types$20.default.string,
	size: import_prop_types$20.default.oneOfType([import_prop_types$20.default.string, import_prop_types$20.default.number])
};
Users.displayName = "Users";
var users_default = Users;

//#endregion
//#region node_modules/react-feather/dist/icons/video-off.js
var import_prop_types$19 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$19() {
	_extends$19 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$19.apply(this, arguments);
}
function _objectWithoutProperties$19(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$19(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$19(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var VideoOff = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$19(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$19({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "1",
		x2: "23",
		y2: "23"
	}));
});
VideoOff.propTypes = {
	color: import_prop_types$19.default.string,
	size: import_prop_types$19.default.oneOfType([import_prop_types$19.default.string, import_prop_types$19.default.number])
};
VideoOff.displayName = "VideoOff";
var video_off_default = VideoOff;

//#endregion
//#region node_modules/react-feather/dist/icons/video.js
var import_prop_types$18 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$18() {
	_extends$18 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$18.apply(this, arguments);
}
function _objectWithoutProperties$18(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$18(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$18(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Video = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$18(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$18({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "23 7 16 12 23 17 23 7" }), /* @__PURE__ */ import_react.createElement("rect", {
		x: "1",
		y: "5",
		width: "15",
		height: "14",
		rx: "2",
		ry: "2"
	}));
});
Video.propTypes = {
	color: import_prop_types$18.default.string,
	size: import_prop_types$18.default.oneOfType([import_prop_types$18.default.string, import_prop_types$18.default.number])
};
Video.displayName = "Video";
var video_default = Video;

//#endregion
//#region node_modules/react-feather/dist/icons/voicemail.js
var import_prop_types$17 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$17() {
	_extends$17 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$17.apply(this, arguments);
}
function _objectWithoutProperties$17(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$17(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$17(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Voicemail = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$17(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$17({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "5.5",
		cy: "11.5",
		r: "4.5"
	}), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "18.5",
		cy: "11.5",
		r: "4.5"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "5.5",
		y1: "16",
		x2: "18.5",
		y2: "16"
	}));
});
Voicemail.propTypes = {
	color: import_prop_types$17.default.string,
	size: import_prop_types$17.default.oneOfType([import_prop_types$17.default.string, import_prop_types$17.default.number])
};
Voicemail.displayName = "Voicemail";
var voicemail_default = Voicemail;

//#endregion
//#region node_modules/react-feather/dist/icons/volume-1.js
var import_prop_types$16 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$16() {
	_extends$16 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$16.apply(this, arguments);
}
function _objectWithoutProperties$16(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$16(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$16(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Volume1 = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$16(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$16({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }), /* @__PURE__ */ import_react.createElement("path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07" }));
});
Volume1.propTypes = {
	color: import_prop_types$16.default.string,
	size: import_prop_types$16.default.oneOfType([import_prop_types$16.default.string, import_prop_types$16.default.number])
};
Volume1.displayName = "Volume1";
var volume_1_default = Volume1;

//#endregion
//#region node_modules/react-feather/dist/icons/volume-2.js
var import_prop_types$15 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$15() {
	_extends$15 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$15.apply(this, arguments);
}
function _objectWithoutProperties$15(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$15(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$15(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Volume2 = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$15(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$15({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }), /* @__PURE__ */ import_react.createElement("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" }));
});
Volume2.propTypes = {
	color: import_prop_types$15.default.string,
	size: import_prop_types$15.default.oneOfType([import_prop_types$15.default.string, import_prop_types$15.default.number])
};
Volume2.displayName = "Volume2";
var volume_2_default = Volume2;

//#endregion
//#region node_modules/react-feather/dist/icons/volume-x.js
var import_prop_types$14 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$14() {
	_extends$14 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$14.apply(this, arguments);
}
function _objectWithoutProperties$14(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$14(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$14(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var VolumeX = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$14(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$14({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "23",
		y1: "9",
		x2: "17",
		y2: "15"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "17",
		y1: "9",
		x2: "23",
		y2: "15"
	}));
});
VolumeX.propTypes = {
	color: import_prop_types$14.default.string,
	size: import_prop_types$14.default.oneOfType([import_prop_types$14.default.string, import_prop_types$14.default.number])
};
VolumeX.displayName = "VolumeX";
var volume_x_default = VolumeX;

//#endregion
//#region node_modules/react-feather/dist/icons/volume.js
var import_prop_types$13 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$13() {
	_extends$13 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$13.apply(this, arguments);
}
function _objectWithoutProperties$13(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$13(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$13(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Volume = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$13(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$13({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }));
});
Volume.propTypes = {
	color: import_prop_types$13.default.string,
	size: import_prop_types$13.default.oneOfType([import_prop_types$13.default.string, import_prop_types$13.default.number])
};
Volume.displayName = "Volume";
var volume_default = Volume;

//#endregion
//#region node_modules/react-feather/dist/icons/watch.js
var import_prop_types$12 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$12() {
	_extends$12 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$12.apply(this, arguments);
}
function _objectWithoutProperties$12(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$12(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$12(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Watch = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$12(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$12({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "7"
	}), /* @__PURE__ */ import_react.createElement("polyline", { points: "12 9 12 12 13.5 13.5" }), /* @__PURE__ */ import_react.createElement("path", { d: "M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83" }));
});
Watch.propTypes = {
	color: import_prop_types$12.default.string,
	size: import_prop_types$12.default.oneOfType([import_prop_types$12.default.string, import_prop_types$12.default.number])
};
Watch.displayName = "Watch";
var watch_default = Watch;

//#endregion
//#region node_modules/react-feather/dist/icons/wifi-off.js
var import_prop_types$11 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$11() {
	_extends$11 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$11.apply(this, arguments);
}
function _objectWithoutProperties$11(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$11(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$11(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var WifiOff = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$11(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$11({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "1",
		x2: "23",
		y2: "23"
	}), /* @__PURE__ */ import_react.createElement("path", { d: "M16.72 11.06A10.94 10.94 0 0 1 19 12.55" }), /* @__PURE__ */ import_react.createElement("path", { d: "M5 12.55a10.94 10.94 0 0 1 5.17-2.39" }), /* @__PURE__ */ import_react.createElement("path", { d: "M10.71 5.05A16 16 0 0 1 22.58 9" }), /* @__PURE__ */ import_react.createElement("path", { d: "M1.42 9a15.91 15.91 0 0 1 4.7-2.88" }), /* @__PURE__ */ import_react.createElement("path", { d: "M8.53 16.11a6 6 0 0 1 6.95 0" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "20",
		x2: "12.01",
		y2: "20"
	}));
});
WifiOff.propTypes = {
	color: import_prop_types$11.default.string,
	size: import_prop_types$11.default.oneOfType([import_prop_types$11.default.string, import_prop_types$11.default.number])
};
WifiOff.displayName = "WifiOff";
var wifi_off_default = WifiOff;

//#endregion
//#region node_modules/react-feather/dist/icons/wifi.js
var import_prop_types$10 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$10() {
	_extends$10 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$10.apply(this, arguments);
}
function _objectWithoutProperties$10(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$10(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$10(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Wifi = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$10(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$10({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M5 12.55a11 11 0 0 1 14.08 0" }), /* @__PURE__ */ import_react.createElement("path", { d: "M1.42 9a16 16 0 0 1 21.16 0" }), /* @__PURE__ */ import_react.createElement("path", { d: "M8.53 16.11a6 6 0 0 1 6.95 0" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "12",
		y1: "20",
		x2: "12.01",
		y2: "20"
	}));
});
Wifi.propTypes = {
	color: import_prop_types$10.default.string,
	size: import_prop_types$10.default.oneOfType([import_prop_types$10.default.string, import_prop_types$10.default.number])
};
Wifi.displayName = "Wifi";
var wifi_default = Wifi;

//#endregion
//#region node_modules/react-feather/dist/icons/wind.js
var import_prop_types$9 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$9() {
	_extends$9 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$9.apply(this, arguments);
}
function _objectWithoutProperties$9(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$9(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$9(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Wind = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$9(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$9({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" }));
});
Wind.propTypes = {
	color: import_prop_types$9.default.string,
	size: import_prop_types$9.default.oneOfType([import_prop_types$9.default.string, import_prop_types$9.default.number])
};
Wind.displayName = "Wind";
var wind_default = Wind;

//#endregion
//#region node_modules/react-feather/dist/icons/x-circle.js
var import_prop_types$8 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$8() {
	_extends$8 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$8.apply(this, arguments);
}
function _objectWithoutProperties$8(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$8(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$8(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var XCircle = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$8(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$8({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "12",
		cy: "12",
		r: "10"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "15",
		y1: "9",
		x2: "9",
		y2: "15"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "9",
		x2: "15",
		y2: "15"
	}));
});
XCircle.propTypes = {
	color: import_prop_types$8.default.string,
	size: import_prop_types$8.default.oneOfType([import_prop_types$8.default.string, import_prop_types$8.default.number])
};
XCircle.displayName = "XCircle";
var x_circle_default = XCircle;

//#endregion
//#region node_modules/react-feather/dist/icons/x-octagon.js
var import_prop_types$7 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$7() {
	_extends$7 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$7.apply(this, arguments);
}
function _objectWithoutProperties$7(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$7(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$7(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var XOctagon = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$7(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$7({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "15",
		y1: "9",
		x2: "9",
		y2: "15"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "9",
		x2: "15",
		y2: "15"
	}));
});
XOctagon.propTypes = {
	color: import_prop_types$7.default.string,
	size: import_prop_types$7.default.oneOfType([import_prop_types$7.default.string, import_prop_types$7.default.number])
};
XOctagon.displayName = "XOctagon";
var x_octagon_default = XOctagon;

//#endregion
//#region node_modules/react-feather/dist/icons/x-square.js
var import_prop_types$6 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$6() {
	_extends$6 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$6.apply(this, arguments);
}
function _objectWithoutProperties$6(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$6(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$6(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var XSquare = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$6(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$6({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("rect", {
		x: "3",
		y: "3",
		width: "18",
		height: "18",
		rx: "2",
		ry: "2"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "9",
		y1: "9",
		x2: "15",
		y2: "15"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "15",
		y1: "9",
		x2: "9",
		y2: "15"
	}));
});
XSquare.propTypes = {
	color: import_prop_types$6.default.string,
	size: import_prop_types$6.default.oneOfType([import_prop_types$6.default.string, import_prop_types$6.default.number])
};
XSquare.displayName = "XSquare";
var x_square_default = XSquare;

//#endregion
//#region node_modules/react-feather/dist/icons/x.js
var import_prop_types$5 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$5() {
	_extends$5 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$5.apply(this, arguments);
}
function _objectWithoutProperties$5(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$5(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$5(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var X = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$5(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$5({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("line", {
		x1: "18",
		y1: "6",
		x2: "6",
		y2: "18"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "6",
		y1: "6",
		x2: "18",
		y2: "18"
	}));
});
X.propTypes = {
	color: import_prop_types$5.default.string,
	size: import_prop_types$5.default.oneOfType([import_prop_types$5.default.string, import_prop_types$5.default.number])
};
X.displayName = "X";
var x_default = X;

//#endregion
//#region node_modules/react-feather/dist/icons/youtube.js
var import_prop_types$4 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$4() {
	_extends$4 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$4.apply(this, arguments);
}
function _objectWithoutProperties$4(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$4(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$4(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Youtube = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$4(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$4({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("path", { d: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" }), /* @__PURE__ */ import_react.createElement("polygon", { points: "9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" }));
});
Youtube.propTypes = {
	color: import_prop_types$4.default.string,
	size: import_prop_types$4.default.oneOfType([import_prop_types$4.default.string, import_prop_types$4.default.number])
};
Youtube.displayName = "Youtube";
var youtube_default = Youtube;

//#endregion
//#region node_modules/react-feather/dist/icons/zap-off.js
var import_prop_types$3 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$3() {
	_extends$3 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$3.apply(this, arguments);
}
function _objectWithoutProperties$3(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$3(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$3(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ZapOff = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$3(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$3({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polyline", { points: "12.41 6.75 13 2 10.57 4.92" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "18.57 12.91 21 10 15.66 10" }), /* @__PURE__ */ import_react.createElement("polyline", { points: "8 8 3 14 12 14 11 22 16 16" }), /* @__PURE__ */ import_react.createElement("line", {
		x1: "1",
		y1: "1",
		x2: "23",
		y2: "23"
	}));
});
ZapOff.propTypes = {
	color: import_prop_types$3.default.string,
	size: import_prop_types$3.default.oneOfType([import_prop_types$3.default.string, import_prop_types$3.default.number])
};
ZapOff.displayName = "ZapOff";
var zap_off_default = ZapOff;

//#endregion
//#region node_modules/react-feather/dist/icons/zap.js
var import_prop_types$2 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$2() {
	_extends$2 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$2.apply(this, arguments);
}
function _objectWithoutProperties$2(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$2(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$2(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var Zap = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$2(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$2({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }));
});
Zap.propTypes = {
	color: import_prop_types$2.default.string,
	size: import_prop_types$2.default.oneOfType([import_prop_types$2.default.string, import_prop_types$2.default.number])
};
Zap.displayName = "Zap";
var zap_default = Zap;

//#endregion
//#region node_modules/react-feather/dist/icons/zoom-in.js
var import_prop_types$1 = /* @__PURE__ */ __toESM(require_prop_types());
function _extends$1() {
	_extends$1 = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$1.apply(this, arguments);
}
function _objectWithoutProperties$1(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$1(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$1(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ZoomIn = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties$1(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends$1({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "11",
		cy: "11",
		r: "8"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "21",
		x2: "16.65",
		y2: "16.65"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "11",
		y1: "8",
		x2: "11",
		y2: "14"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "11",
		x2: "14",
		y2: "11"
	}));
});
ZoomIn.propTypes = {
	color: import_prop_types$1.default.string,
	size: import_prop_types$1.default.oneOfType([import_prop_types$1.default.string, import_prop_types$1.default.number])
};
ZoomIn.displayName = "ZoomIn";
var zoom_in_default = ZoomIn;

//#endregion
//#region node_modules/react-feather/dist/icons/zoom-out.js
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types());
function _extends() {
	_extends = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends.apply(this, arguments);
}
function _objectWithoutProperties(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
var ZoomOut = (0, import_react.forwardRef)(function(_ref, ref) {
	var _ref$color = _ref.color, color = _ref$color === void 0 ? "currentColor" : _ref$color, _ref$size = _ref.size, size = _ref$size === void 0 ? 24 : _ref$size, rest = _objectWithoutProperties(_ref, ["color", "size"]);
	return /* @__PURE__ */ import_react.createElement("svg", _extends({
		ref,
		xmlns: "http://www.w3.org/2000/svg",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: color,
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	}, rest), /* @__PURE__ */ import_react.createElement("circle", {
		cx: "11",
		cy: "11",
		r: "8"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "21",
		y1: "21",
		x2: "16.65",
		y2: "16.65"
	}), /* @__PURE__ */ import_react.createElement("line", {
		x1: "8",
		y1: "11",
		x2: "14",
		y2: "11"
	}));
});
ZoomOut.propTypes = {
	color: import_prop_types.default.string,
	size: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.number])
};
ZoomOut.displayName = "ZoomOut";
var zoom_out_default = ZoomOut;

//#endregion
export { activity_default as Activity, airplay_default as Airplay, alert_circle_default as AlertCircle, alert_octagon_default as AlertOctagon, alert_triangle_default as AlertTriangle, align_center_default as AlignCenter, align_justify_default as AlignJustify, align_left_default as AlignLeft, align_right_default as AlignRight, anchor_default as Anchor, aperture_default as Aperture, archive_default as Archive, arrow_down_default as ArrowDown, arrow_down_circle_default as ArrowDownCircle, arrow_down_left_default as ArrowDownLeft, arrow_down_right_default as ArrowDownRight, arrow_left_default as ArrowLeft, arrow_left_circle_default as ArrowLeftCircle, arrow_right_default as ArrowRight, arrow_right_circle_default as ArrowRightCircle, arrow_up_default as ArrowUp, arrow_up_circle_default as ArrowUpCircle, arrow_up_left_default as ArrowUpLeft, arrow_up_right_default as ArrowUpRight, at_sign_default as AtSign, award_default as Award, bar_chart_default as BarChart, bar_chart_2_default as BarChart2, battery_default as Battery, battery_charging_default as BatteryCharging, bell_default as Bell, bell_off_default as BellOff, bluetooth_default as Bluetooth, bold_default as Bold, book_default as Book, book_open_default as BookOpen, bookmark_default as Bookmark, box_default as Box, briefcase_default as Briefcase, calendar_default as Calendar, camera_default as Camera, camera_off_default as CameraOff, cast_default as Cast, check_default as Check, check_circle_default as CheckCircle, check_square_default as CheckSquare, chevron_down_default as ChevronDown, chevron_left_default as ChevronLeft, chevron_right_default as ChevronRight, chevron_up_default as ChevronUp, chevrons_down_default as ChevronsDown, chevrons_left_default as ChevronsLeft, chevrons_right_default as ChevronsRight, chevrons_up_default as ChevronsUp, chrome_default as Chrome, circle_default as Circle, clipboard_default as Clipboard, clock_default as Clock, cloud_default as Cloud, cloud_drizzle_default as CloudDrizzle, cloud_lightning_default as CloudLightning, cloud_off_default as CloudOff, cloud_rain_default as CloudRain, cloud_snow_default as CloudSnow, code_default as Code, codepen_default as Codepen, codesandbox_default as Codesandbox, coffee_default as Coffee, columns_default as Columns, command_default as Command, compass_default as Compass, copy_default as Copy, corner_down_left_default as CornerDownLeft, corner_down_right_default as CornerDownRight, corner_left_down_default as CornerLeftDown, corner_left_up_default as CornerLeftUp, corner_right_down_default as CornerRightDown, corner_right_up_default as CornerRightUp, corner_up_left_default as CornerUpLeft, corner_up_right_default as CornerUpRight, cpu_default as Cpu, credit_card_default as CreditCard, crop_default as Crop, crosshair_default as Crosshair, database_default as Database, delete_default as Delete, disc_default as Disc, divide_default as Divide, divide_circle_default as DivideCircle, divide_square_default as DivideSquare, dollar_sign_default as DollarSign, download_default as Download, download_cloud_default as DownloadCloud, dribbble_default as Dribbble, droplet_default as Droplet, edit_default as Edit, edit_2_default as Edit2, edit_3_default as Edit3, external_link_default as ExternalLink, eye_default as Eye, eye_off_default as EyeOff, facebook_default as Facebook, fast_forward_default as FastForward, feather_default as Feather, figma_default as Figma, file_default as File, file_minus_default as FileMinus, file_plus_default as FilePlus, file_text_default as FileText, film_default as Film, filter_default as Filter, flag_default as Flag, folder_default as Folder, folder_minus_default as FolderMinus, folder_plus_default as FolderPlus, framer_default as Framer, frown_default as Frown, gift_default as Gift, git_branch_default as GitBranch, git_commit_default as GitCommit, github_default as GitHub, git_merge_default as GitMerge, git_pull_request_default as GitPullRequest, gitlab_default as Gitlab, globe_default as Globe, grid_default as Grid, hard_drive_default as HardDrive, hash_default as Hash, headphones_default as Headphones, heart_default as Heart, help_circle_default as HelpCircle, hexagon_default as Hexagon, home_default as Home, image_default as Image, inbox_default as Inbox, info_default as Info, instagram_default as Instagram, italic_default as Italic, key_default as Key, layers_default as Layers, layout_default as Layout, life_buoy_default as LifeBuoy, link_default as Link, link_2_default as Link2, linkedin_default as Linkedin, list_default as List, loader_default as Loader, lock_default as Lock, log_in_default as LogIn, log_out_default as LogOut, mail_default as Mail, map_default as Map, map_pin_default as MapPin, maximize_default as Maximize, maximize_2_default as Maximize2, meh_default as Meh, menu_default as Menu, message_circle_default as MessageCircle, message_square_default as MessageSquare, mic_default as Mic, mic_off_default as MicOff, minimize_default as Minimize, minimize_2_default as Minimize2, minus_default as Minus, minus_circle_default as MinusCircle, minus_square_default as MinusSquare, monitor_default as Monitor, moon_default as Moon, more_horizontal_default as MoreHorizontal, more_vertical_default as MoreVertical, mouse_pointer_default as MousePointer, move_default as Move, music_default as Music, navigation_default as Navigation, navigation_2_default as Navigation2, octagon_default as Octagon, package_default as Package, paperclip_default as Paperclip, pause_default as Pause, pause_circle_default as PauseCircle, pen_tool_default as PenTool, percent_default as Percent, phone_default as Phone, phone_call_default as PhoneCall, phone_forwarded_default as PhoneForwarded, phone_incoming_default as PhoneIncoming, phone_missed_default as PhoneMissed, phone_off_default as PhoneOff, phone_outgoing_default as PhoneOutgoing, pie_chart_default as PieChart, play_default as Play, play_circle_default as PlayCircle, plus_default as Plus, plus_circle_default as PlusCircle, plus_square_default as PlusSquare, pocket_default as Pocket, power_default as Power, printer_default as Printer, radio_default as Radio, refresh_ccw_default as RefreshCcw, refresh_cw_default as RefreshCw, repeat_default as Repeat, rewind_default as Rewind, rotate_ccw_default as RotateCcw, rotate_cw_default as RotateCw, rss_default as Rss, save_default as Save, scissors_default as Scissors, search_default as Search, send_default as Send, server_default as Server, settings_default as Settings, share_default as Share, share_2_default as Share2, shield_default as Shield, shield_off_default as ShieldOff, shopping_bag_default as ShoppingBag, shopping_cart_default as ShoppingCart, shuffle_default as Shuffle, sidebar_default as Sidebar, skip_back_default as SkipBack, skip_forward_default as SkipForward, slack_default as Slack, slash_default as Slash, sliders_default as Sliders, smartphone_default as Smartphone, smile_default as Smile, speaker_default as Speaker, square_default as Square, star_default as Star, stop_circle_default as StopCircle, sun_default as Sun, sunrise_default as Sunrise, sunset_default as Sunset, table_default as Table, tablet_default as Tablet, tag_default as Tag, target_default as Target, terminal_default as Terminal, thermometer_default as Thermometer, thumbs_down_default as ThumbsDown, thumbs_up_default as ThumbsUp, toggle_left_default as ToggleLeft, toggle_right_default as ToggleRight, tool_default as Tool, trash_default as Trash, trash_2_default as Trash2, trello_default as Trello, trending_down_default as TrendingDown, trending_up_default as TrendingUp, triangle_default as Triangle, truck_default as Truck, tv_default as Tv, twitch_default as Twitch, twitter_default as Twitter, type_default as Type, umbrella_default as Umbrella, underline_default as Underline, unlock_default as Unlock, upload_default as Upload, upload_cloud_default as UploadCloud, user_default as User, user_check_default as UserCheck, user_minus_default as UserMinus, user_plus_default as UserPlus, user_x_default as UserX, users_default as Users, video_default as Video, video_off_default as VideoOff, voicemail_default as Voicemail, volume_default as Volume, volume_1_default as Volume1, volume_2_default as Volume2, volume_x_default as VolumeX, watch_default as Watch, wifi_default as Wifi, wifi_off_default as WifiOff, wind_default as Wind, x_default as X, x_circle_default as XCircle, x_octagon_default as XOctagon, x_square_default as XSquare, youtube_default as Youtube, zap_default as Zap, zap_off_default as ZapOff, zoom_in_default as ZoomIn, zoom_out_default as ZoomOut };
//# sourceMappingURL=react-feather.js.map