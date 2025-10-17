import { esm_default, parse } from "./esm-wU2t5WA2.js";
import { visit } from "./lib-BrG50sSv.js";

//#region node_modules/hast-util-is-element/lib/index.js
/**
* Generate a check from a test.
*
* Useful if you’re going to test many nodes, for example when creating a
* utility where something else passes a compatible test.
*
* The created function is a bit faster because it expects valid input only:
* an `element`, `index`, and `parent`.
*
* @param test
*   A test for a specific element.
* @returns
*   A check.
*/
const convertElement = (function(test) {
	if (test === null || test === void 0) return element;
	if (typeof test === "string") return tagNameFactory(test);
	if (typeof test === "object") return anyFactory(test);
	if (typeof test === "function") return castFactory(test);
	throw new Error("Expected function, string, or array as `test`");
});
/**
* Handle multiple tests.
*
* @param {Array<TestFunction | string>} tests
* @returns {Check}
*/
function anyFactory(tests) {
	/** @type {Array<Check>} */
	const checks = [];
	let index = -1;
	while (++index < tests.length) checks[index] = convertElement(tests[index]);
	return castFactory(any);
	/**
	* @this {unknown}
	* @type {TestFunction}
	*/
	function any(...parameters) {
		let index$1 = -1;
		while (++index$1 < checks.length) if (checks[index$1].apply(this, parameters)) return true;
		return false;
	}
}
/**
* Turn a string into a test for an element with a certain type.
*
* @param {string} check
* @returns {Check}
*/
function tagNameFactory(check) {
	return castFactory(tagName);
	/**
	* @param {Element} element
	* @returns {boolean}
	*/
	function tagName(element$1) {
		return element$1.tagName === check;
	}
}
/**
* Turn a custom test into a test for an element that passes that test.
*
* @param {TestFunction} testFunction
* @returns {Check}
*/
function castFactory(testFunction) {
	return check;
	/**
	* @this {unknown}
	* @type {Check}
	*/
	function check(value, index, parent) {
		return Boolean(looksLikeAnElement(value) && testFunction.call(this, value, typeof index === "number" ? index : void 0, parent || void 0));
	}
}
/**
* Make sure something is an element.
*
* @param {unknown} element
* @returns {element is Element}
*/
function element(element$1) {
	return Boolean(element$1 && typeof element$1 === "object" && "type" in element$1 && element$1.type === "element" && "tagName" in element$1 && typeof element$1.tagName === "string");
}
/**
* @param {unknown} value
* @returns {value is Element}
*/
function looksLikeAnElement(value) {
	return value !== null && typeof value === "object" && "type" in value && "tagName" in value;
}

//#endregion
//#region node_modules/is-absolute-url/index.js
var ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
var WINDOWS_PATH_REGEX = /^[a-zA-Z]:\\/;
function isAbsoluteUrl(url) {
	if (typeof url !== "string") throw new TypeError(`Expected a \`string\`, got \`${typeof url}\``);
	if (WINDOWS_PATH_REGEX.test(url)) return false;
	return ABSOLUTE_URL_REGEX.test(url);
}

//#endregion
//#region node_modules/rehype-external-links/lib/index.js
var defaultProtocols = ["http", "https"];
var defaultRel = ["nofollow"];
/** @type {Options} */
var emptyOptions = {};
/**
* Automatically add `rel` (and `target`?) to external links.
*
* ###### Notes
*
* You should [likely not configure `target`][css-tricks].
*
* You should at least set `rel` to `['nofollow']`.
* When using a `target`, add `noopener` and `noreferrer` to avoid exploitation
* of the `window.opener` API.
*
* When using a `target`, you should set `content` to adhere to accessibility
* guidelines by giving users advanced warning when opening a new window.
*
* [css-tricks]: https://css-tricks.com/use-target_blank/
*
* @param {Readonly<Options> | null | undefined} [options]
*   Configuration (optional).
* @returns
*   Transform.
*/
function rehypeExternalLinks(options) {
	const settings = options || emptyOptions;
	const protocols = settings.protocols || defaultProtocols;
	const is = convertElement(settings.test);
	/**
	* Transform.
	*
	* @param {Root} tree
	*   Tree.
	* @returns {undefined}
	*   Nothing.
	*/
	return function(tree) {
		visit(tree, "element", function(node, index, parent) {
			if (node.tagName === "a" && typeof node.properties.href === "string" && is(node, index, parent)) {
				const url = node.properties.href;
				if (isAbsoluteUrl(url) ? protocols.includes(url.slice(0, url.indexOf(":"))) : url.startsWith("//")) {
					const contentRaw = createIfNeeded(settings.content, node);
					const content = contentRaw && !Array.isArray(contentRaw) ? [contentRaw] : contentRaw;
					const relRaw = createIfNeeded(settings.rel, node) || defaultRel;
					const rel = typeof relRaw === "string" ? parse(relRaw) : relRaw;
					const target = createIfNeeded(settings.target, node);
					const properties = createIfNeeded(settings.properties, node);
					if (properties) Object.assign(node.properties, esm_default(properties));
					if (rel.length > 0) node.properties.rel = [...rel];
					if (target) node.properties.target = target;
					if (content) {
						const properties$1 = createIfNeeded(settings.contentProperties, node) || {};
						node.children.push({
							type: "element",
							tagName: "span",
							properties: esm_default(properties$1),
							children: esm_default(content)
						});
					}
				}
			}
		});
	};
}
/**
* Call a function to get a return value or use the value.
*
* @template T
*   Type of value.
* @param {T} value
*   Value.
* @param {Element} element
*   Element.
* @returns {T extends Function ? ReturnType<T> : T}
*   Result.
*/
function createIfNeeded(value, element$1) {
	return typeof value === "function" ? value(element$1) : value;
}

//#endregion
export { rehypeExternalLinks as default };
//# sourceMappingURL=rehype-external-links.js.map