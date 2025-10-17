//#region node_modules/space-separated-tokens/index.js
/**
* Parse space-separated tokens to an array of strings.
*
* @param {string} value
*   Space-separated tokens.
* @returns {Array<string>}
*   List of tokens.
*/
function parse(value) {
	const input = String(value || "").trim();
	return input ? input.split(/[ \t\n\r\f]+/g) : [];
}
/**
* Serialize an array of strings as space separated-tokens.
*
* @param {Array<string|number>} values
*   List of tokens.
* @returns {string}
*   Space-separated tokens.
*/
function stringify(values) {
	return values.join(" ").trim();
}

//#endregion
//#region node_modules/@ungap/structured-clone/esm/types.js
const VOID = -1;
const PRIMITIVE = 0;
const ARRAY = 1;
const OBJECT = 2;
const DATE = 3;
const REGEXP = 4;
const MAP = 5;
const SET = 6;
const ERROR = 7;
const BIGINT = 8;

//#endregion
//#region node_modules/@ungap/structured-clone/esm/deserialize.js
var env = typeof self === "object" ? self : globalThis;
var deserializer = ($, _) => {
	const as = (out, index) => {
		$.set(index, out);
		return out;
	};
	const unpair = (index) => {
		if ($.has(index)) return $.get(index);
		const [type, value] = _[index];
		switch (type) {
			case PRIMITIVE:
			case VOID: return as(value, index);
			case ARRAY: {
				const arr = as([], index);
				for (const index$1 of value) arr.push(unpair(index$1));
				return arr;
			}
			case OBJECT: {
				const object = as({}, index);
				for (const [key, index$1] of value) object[unpair(key)] = unpair(index$1);
				return object;
			}
			case DATE: return as(new Date(value), index);
			case REGEXP: {
				const { source, flags } = value;
				return as(new RegExp(source, flags), index);
			}
			case MAP: {
				const map = as(/* @__PURE__ */ new Map(), index);
				for (const [key, index$1] of value) map.set(unpair(key), unpair(index$1));
				return map;
			}
			case SET: {
				const set = as(/* @__PURE__ */ new Set(), index);
				for (const index$1 of value) set.add(unpair(index$1));
				return set;
			}
			case ERROR: {
				const { name, message } = value;
				return as(new env[name](message), index);
			}
			case BIGINT: return as(BigInt(value), index);
			case "BigInt": return as(Object(BigInt(value)), index);
			case "ArrayBuffer": return as(new Uint8Array(value).buffer, value);
			case "DataView": {
				const { buffer } = new Uint8Array(value);
				return as(new DataView(buffer), value);
			}
		}
		return as(new env[type](value), index);
	};
	return unpair;
};
/**
* @typedef {Array<string,any>} Record a type representation
*/
/**
* Returns a deserialized value from a serialized array of Records.
* @param {Record[]} serialized a previously serialized value.
* @returns {any}
*/
const deserialize = (serialized) => deserializer(/* @__PURE__ */ new Map(), serialized)(0);

//#endregion
//#region node_modules/@ungap/structured-clone/esm/serialize.js
var EMPTY = "";
var { toString } = {};
var { keys } = Object;
var typeOf = (value) => {
	const type = typeof value;
	if (type !== "object" || !value) return [PRIMITIVE, type];
	const asString = toString.call(value).slice(8, -1);
	switch (asString) {
		case "Array": return [ARRAY, EMPTY];
		case "Object": return [OBJECT, EMPTY];
		case "Date": return [DATE, EMPTY];
		case "RegExp": return [REGEXP, EMPTY];
		case "Map": return [MAP, EMPTY];
		case "Set": return [SET, EMPTY];
		case "DataView": return [ARRAY, asString];
	}
	if (asString.includes("Array")) return [ARRAY, asString];
	if (asString.includes("Error")) return [ERROR, asString];
	return [OBJECT, asString];
};
var shouldSkip = ([TYPE, type]) => TYPE === PRIMITIVE && (type === "function" || type === "symbol");
var serializer = (strict, json, $, _) => {
	const as = (out, value) => {
		const index = _.push(out) - 1;
		$.set(value, index);
		return index;
	};
	const pair = (value) => {
		if ($.has(value)) return $.get(value);
		let [TYPE, type] = typeOf(value);
		switch (TYPE) {
			case PRIMITIVE: {
				let entry = value;
				switch (type) {
					case "bigint":
						TYPE = BIGINT;
						entry = value.toString();
						break;
					case "function":
					case "symbol":
						if (strict) throw new TypeError("unable to serialize " + type);
						entry = null;
						break;
					case "undefined": return as([VOID], value);
				}
				return as([TYPE, entry], value);
			}
			case ARRAY: {
				if (type) {
					let spread = value;
					if (type === "DataView") spread = new Uint8Array(value.buffer);
					else if (type === "ArrayBuffer") spread = new Uint8Array(value);
					return as([type, [...spread]], value);
				}
				const arr = [];
				const index = as([TYPE, arr], value);
				for (const entry of value) arr.push(pair(entry));
				return index;
			}
			case OBJECT: {
				if (type) switch (type) {
					case "BigInt": return as([type, value.toString()], value);
					case "Boolean":
					case "Number":
					case "String": return as([type, value.valueOf()], value);
				}
				if (json && "toJSON" in value) return pair(value.toJSON());
				const entries = [];
				const index = as([TYPE, entries], value);
				for (const key of keys(value)) if (strict || !shouldSkip(typeOf(value[key]))) entries.push([pair(key), pair(value[key])]);
				return index;
			}
			case DATE: return as([TYPE, value.toISOString()], value);
			case REGEXP: {
				const { source, flags } = value;
				return as([TYPE, {
					source,
					flags
				}], value);
			}
			case MAP: {
				const entries = [];
				const index = as([TYPE, entries], value);
				for (const [key, entry] of value) if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry)))) entries.push([pair(key), pair(entry)]);
				return index;
			}
			case SET: {
				const entries = [];
				const index = as([TYPE, entries], value);
				for (const entry of value) if (strict || !shouldSkip(typeOf(entry))) entries.push(pair(entry));
				return index;
			}
		}
		const { message } = value;
		return as([TYPE, {
			name: type,
			message
		}], value);
	};
	return pair;
};
/**
* @typedef {Array<string,any>} Record a type representation
*/
/**
* Returns an array of serialized Records.
* @param {any} value a serializable value.
* @param {{json?: boolean, lossy?: boolean}?} options an object with a `lossy` or `json` property that,
*  if `true`, will not throw errors on incompatible types, and behave more
*  like JSON stringify would behave. Symbol and Function will be discarded.
* @returns {Record[]}
*/
const serialize = (value, { json, lossy } = {}) => {
	const _ = [];
	return serializer(!(json || lossy), !!json, /* @__PURE__ */ new Map(), _)(value), _;
};

//#endregion
//#region node_modules/@ungap/structured-clone/esm/index.js
/**
* @typedef {Array<string,any>} Record a type representation
*/
/**
* Returns an array of serialized Records.
* @param {any} any a serializable value.
* @param {{transfer?: any[], json?: boolean, lossy?: boolean}?} options an object with
* a transfer option (ignored when polyfilled) and/or non standard fields that
* fallback to the polyfill if present.
* @returns {Record[]}
*/
var esm_default = typeof structuredClone === "function" ? (any, options) => options && ("json" in options || "lossy" in options) ? deserialize(serialize(any, options)) : structuredClone(any) : (any, options) => deserialize(serialize(any, options));

//#endregion
export { esm_default, parse, stringify };
//# sourceMappingURL=esm-wU2t5WA2.js.map