import { $, CancellationTokenSource as CancellationTokenSource$1, Codicon, Color, DeferredPromise, Disposable, DisposableStore, EditorAction, EditorContextKeys, Event, GoToLineNLS, ICodeEditorService, ICommandService, IConfigurationService, IContextKeyService, IDialogService, IInstantiationService, IKeybindingService, ILanguageFeaturesService, ILanguageService, ILogService, INotificationService, IQuickInputService, IStorageService, ITelemetryService, InspectTokensNLS, ItemActivation, LRUCache, MutableDisposable, NullState, OverviewRulerLane, QuickCommandNLS, QuickHelpNLS, QuickOutlineNLS, Range$1, Registry, SymbolKinds, ThemeIcon, ToggleHighContrastNLS, TokenMetadata, TokenizationRegistry, WillSaveStateReason, addDisposableListener, append, createMatches, createSingleCallFunction, findLast, format, fuzzyScore, getAriaLabelForSymbol, getCodeEditor, isCancellationError, isDark, isDiffEditor, isFunction, isHighContrast, isIOS, isLocalizedString, isWindows, localize, matchesContiguousSubString, matchesPrefix, matchesWords, nullTokenize, nullTokenizeEncoded, or, overviewRulerRangeHighlight, registerEditorAction, registerEditorContribution, reset, sep, status, stripIcons, stripWildcards, themeColorFromId, timeout, toDisposable, trim } from "./standaloneStrings-CqRzS2r_.js";
import { IOutlineModelService, ReferencesController, toErrorMessage } from "./editor.all-BtyBR764.js";
import { CancellationTokenSource, Emitter, Extensions, HC_BLACK_THEME_NAME, HC_LIGHT_THEME_NAME, IStandaloneThemeService, KeyCode, KeyMod, MarkerSeverity, MarkerTag, Position, Range, Selection, SelectionDirection, Token, Uri, VS_DARK_THEME_NAME, VS_LIGHT_THEME_NAME, editor, editor_api_exports, languages } from "./editor.api-DrIbOK3t.js";
import "./monaco.contribution-DzPgoHMO.js";
import "/home/bishop/projects/dreamforge/node_modules/monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.css";
import "/home/bishop/projects/dreamforge/node_modules/monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.css";

//#region node_modules/monaco-editor/esm/vs/basic-languages/_.contribution.js
/*!-----------------------------------------------------------------------------
* Copyright (c) Microsoft Corporation. All rights reserved.
* Version: 0.52.2(404545bded1df6ffa41ea0af4e8ddb219018c6c1)
* Released under the MIT license
* https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
*-----------------------------------------------------------------------------*/
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$3 = Object.getOwnPropertyNames;
var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
var __copyProps$3 = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames$3(from)) if (!__hasOwnProp$3.call(to, key) && key !== except) __defProp$3(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc$3(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __reExport$3 = (target, mod, secondTarget) => (__copyProps$3(target, mod, "default"), secondTarget && __copyProps$3(secondTarget, mod, "default"));
var monaco_editor_core_exports$3 = {};
__reExport$3(monaco_editor_core_exports$3, editor_api_exports);
var languageDefinitions = {};
var lazyLanguageLoaders = {};
var LazyLanguageLoader = class _LazyLanguageLoader {
	static getOrCreate(languageId) {
		if (!lazyLanguageLoaders[languageId]) lazyLanguageLoaders[languageId] = new _LazyLanguageLoader(languageId);
		return lazyLanguageLoaders[languageId];
	}
	constructor(languageId) {
		this._languageId = languageId;
		this._loadingTriggered = false;
		this._lazyLoadPromise = new Promise((resolve, reject) => {
			this._lazyLoadPromiseResolve = resolve;
			this._lazyLoadPromiseReject = reject;
		});
	}
	load() {
		if (!this._loadingTriggered) {
			this._loadingTriggered = true;
			languageDefinitions[this._languageId].loader().then((mod) => this._lazyLoadPromiseResolve(mod), (err) => this._lazyLoadPromiseReject(err));
		}
		return this._lazyLoadPromise;
	}
};
function registerLanguage(def) {
	const languageId = def.id;
	languageDefinitions[languageId] = def;
	monaco_editor_core_exports$3.languages.register(def);
	const lazyLanguageLoader = LazyLanguageLoader.getOrCreate(languageId);
	monaco_editor_core_exports$3.languages.registerTokensProviderFactory(languageId, { create: async () => {
		return (await lazyLanguageLoader.load()).language;
	} });
	monaco_editor_core_exports$3.languages.onLanguageEncountered(languageId, async () => {
		const mod = await lazyLanguageLoader.load();
		monaco_editor_core_exports$3.languages.setLanguageConfiguration(languageId, mod.conf);
	});
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/abap/abap.contribution.js
registerLanguage({
	id: "abap",
	extensions: [".abap"],
	aliases: ["abap", "ABAP"],
	loader: () => {
		return import("./abap-TRFnE3UP.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/apex/apex.contribution.js
registerLanguage({
	id: "apex",
	extensions: [".cls"],
	aliases: ["Apex", "apex"],
	mimetypes: ["text/x-apex-source", "text/x-apex"],
	loader: () => {
		return import("./apex-eZOfItum.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/azcli/azcli.contribution.js
registerLanguage({
	id: "azcli",
	extensions: [".azcli"],
	aliases: ["Azure CLI", "azcli"],
	loader: () => {
		return import("./azcli-D_sx8are.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/bat/bat.contribution.js
registerLanguage({
	id: "bat",
	extensions: [".bat", ".cmd"],
	aliases: ["Batch", "bat"],
	loader: () => {
		return import("./bat-v7zf2rFt.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/bicep/bicep.contribution.js
registerLanguage({
	id: "bicep",
	extensions: [".bicep"],
	aliases: ["Bicep"],
	loader: () => {
		return import("./bicep-DxszFb5Z.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/cameligo/cameligo.contribution.js
registerLanguage({
	id: "cameligo",
	extensions: [".mligo"],
	aliases: ["Cameligo"],
	loader: () => {
		return import("./cameligo-BRf01uaW.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/clojure/clojure.contribution.js
registerLanguage({
	id: "clojure",
	extensions: [
		".clj",
		".cljs",
		".cljc",
		".edn"
	],
	aliases: ["clojure", "Clojure"],
	loader: () => {
		return import("./clojure-HX59VWV6.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/coffee/coffee.contribution.js
registerLanguage({
	id: "coffeescript",
	extensions: [".coffee"],
	aliases: [
		"CoffeeScript",
		"coffeescript",
		"coffee"
	],
	mimetypes: ["text/x-coffeescript", "text/coffeescript"],
	loader: () => {
		return import("./coffee-DcGDqX2k.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution.js
registerLanguage({
	id: "c",
	extensions: [".c", ".h"],
	aliases: ["C", "c"],
	loader: () => {
		return import("./cpp-D4G668ib.js");
	}
});
registerLanguage({
	id: "cpp",
	extensions: [
		".cpp",
		".cc",
		".cxx",
		".hpp",
		".hh",
		".hxx"
	],
	aliases: [
		"C++",
		"Cpp",
		"cpp"
	],
	loader: () => {
		return import("./cpp-D4G668ib.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution.js
registerLanguage({
	id: "csharp",
	extensions: [
		".cs",
		".csx",
		".cake"
	],
	aliases: ["C#", "csharp"],
	loader: () => {
		return import("./csharp-rd-XuNWf.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/csp/csp.contribution.js
registerLanguage({
	id: "csp",
	extensions: [".csp"],
	aliases: ["CSP", "csp"],
	loader: () => {
		return import("./csp-BuNT8PP3.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/css/css.contribution.js
registerLanguage({
	id: "css",
	extensions: [".css"],
	aliases: ["CSS", "css"],
	mimetypes: ["text/css"],
	loader: () => {
		return import("./css-BFYPwKxb.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/cypher/cypher.contribution.js
registerLanguage({
	id: "cypher",
	extensions: [".cypher", ".cyp"],
	aliases: ["Cypher", "OpenCypher"],
	loader: () => {
		return import("./cypher-EShw4vNE.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/dart/dart.contribution.js
registerLanguage({
	id: "dart",
	extensions: [".dart"],
	aliases: ["Dart", "dart"],
	mimetypes: ["text/x-dart-source", "text/x-dart"],
	loader: () => {
		return import("./dart-DJZtAnVD.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/dockerfile/dockerfile.contribution.js
registerLanguage({
	id: "dockerfile",
	extensions: [".dockerfile"],
	filenames: ["Dockerfile"],
	aliases: ["Dockerfile"],
	loader: () => {
		return import("./dockerfile--9Z6l-Ci.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/ecl/ecl.contribution.js
registerLanguage({
	id: "ecl",
	extensions: [".ecl"],
	aliases: [
		"ECL",
		"Ecl",
		"ecl"
	],
	loader: () => {
		return import("./ecl-CI39skOY.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/elixir/elixir.contribution.js
registerLanguage({
	id: "elixir",
	extensions: [".ex", ".exs"],
	aliases: [
		"Elixir",
		"elixir",
		"ex"
	],
	loader: () => {
		return import("./elixir-Katob37n.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/flow9/flow9.contribution.js
registerLanguage({
	id: "flow9",
	extensions: [".flow"],
	aliases: [
		"Flow9",
		"Flow",
		"flow9",
		"flow"
	],
	loader: () => {
		return import("./flow9-pJrmElgk.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/fsharp/fsharp.contribution.js
registerLanguage({
	id: "fsharp",
	extensions: [
		".fs",
		".fsi",
		".ml",
		".mli",
		".fsx",
		".fsscript"
	],
	aliases: [
		"F#",
		"FSharp",
		"fsharp"
	],
	loader: () => {
		return import("./fsharp-DmkdJPLs.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/freemarker2/freemarker2.contribution.js
registerLanguage({
	id: "freemarker2",
	extensions: [
		".ftl",
		".ftlh",
		".ftlx"
	],
	aliases: ["FreeMarker2", "Apache FreeMarker2"],
	loader: () => {
		return import("./freemarker2-CQeVBlCe.js").then((m) => m.TagAutoInterpolationDollar);
	}
});
registerLanguage({
	id: "freemarker2.tag-angle.interpolation-dollar",
	aliases: ["FreeMarker2 (Angle/Dollar)", "Apache FreeMarker2 (Angle/Dollar)"],
	loader: () => {
		return import("./freemarker2-CQeVBlCe.js").then((m) => m.TagAngleInterpolationDollar);
	}
});
registerLanguage({
	id: "freemarker2.tag-bracket.interpolation-dollar",
	aliases: ["FreeMarker2 (Bracket/Dollar)", "Apache FreeMarker2 (Bracket/Dollar)"],
	loader: () => {
		return import("./freemarker2-CQeVBlCe.js").then((m) => m.TagBracketInterpolationDollar);
	}
});
registerLanguage({
	id: "freemarker2.tag-angle.interpolation-bracket",
	aliases: ["FreeMarker2 (Angle/Bracket)", "Apache FreeMarker2 (Angle/Bracket)"],
	loader: () => {
		return import("./freemarker2-CQeVBlCe.js").then((m) => m.TagAngleInterpolationBracket);
	}
});
registerLanguage({
	id: "freemarker2.tag-bracket.interpolation-bracket",
	aliases: ["FreeMarker2 (Bracket/Bracket)", "Apache FreeMarker2 (Bracket/Bracket)"],
	loader: () => {
		return import("./freemarker2-CQeVBlCe.js").then((m) => m.TagBracketInterpolationBracket);
	}
});
registerLanguage({
	id: "freemarker2.tag-auto.interpolation-dollar",
	aliases: ["FreeMarker2 (Auto/Dollar)", "Apache FreeMarker2 (Auto/Dollar)"],
	loader: () => {
		return import("./freemarker2-CQeVBlCe.js").then((m) => m.TagAutoInterpolationDollar);
	}
});
registerLanguage({
	id: "freemarker2.tag-auto.interpolation-bracket",
	aliases: ["FreeMarker2 (Auto/Bracket)", "Apache FreeMarker2 (Auto/Bracket)"],
	loader: () => {
		return import("./freemarker2-CQeVBlCe.js").then((m) => m.TagAutoInterpolationBracket);
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/go/go.contribution.js
registerLanguage({
	id: "go",
	extensions: [".go"],
	aliases: ["Go"],
	loader: () => {
		return import("./go--k7nPDEL.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/graphql/graphql.contribution.js
registerLanguage({
	id: "graphql",
	extensions: [".graphql", ".gql"],
	aliases: [
		"GraphQL",
		"graphql",
		"gql"
	],
	mimetypes: ["application/graphql"],
	loader: () => {
		return import("./graphql-3dnetBCt.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/handlebars/handlebars.contribution.js
registerLanguage({
	id: "handlebars",
	extensions: [".handlebars", ".hbs"],
	aliases: [
		"Handlebars",
		"handlebars",
		"hbs"
	],
	mimetypes: ["text/x-handlebars-template"],
	loader: () => {
		return import("./handlebars-Dj0NAkyw.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/hcl/hcl.contribution.js
registerLanguage({
	id: "hcl",
	extensions: [
		".tf",
		".tfvars",
		".hcl"
	],
	aliases: [
		"Terraform",
		"tf",
		"HCL",
		"hcl"
	],
	loader: () => {
		return import("./hcl-BNavAvaw.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/html/html.contribution.js
registerLanguage({
	id: "html",
	extensions: [
		".html",
		".htm",
		".shtml",
		".xhtml",
		".mdoc",
		".jsp",
		".asp",
		".aspx",
		".jshtm"
	],
	aliases: [
		"HTML",
		"htm",
		"html",
		"xhtml"
	],
	mimetypes: [
		"text/html",
		"text/x-jshtm",
		"text/template",
		"text/ng-template"
	],
	loader: () => {
		return import("./html-CGwOt2vs.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/ini/ini.contribution.js
registerLanguage({
	id: "ini",
	extensions: [
		".ini",
		".properties",
		".gitconfig"
	],
	filenames: [
		"config",
		".gitattributes",
		".gitconfig",
		".editorconfig"
	],
	aliases: ["Ini", "ini"],
	loader: () => {
		return import("./ini-BC1PpR-E.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/java/java.contribution.js
registerLanguage({
	id: "java",
	extensions: [".java", ".jav"],
	aliases: ["Java", "java"],
	mimetypes: ["text/x-java-source", "text/x-java"],
	loader: () => {
		return import("./java-IxCDXupN.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js
registerLanguage({
	id: "javascript",
	extensions: [
		".js",
		".es6",
		".jsx",
		".mjs",
		".cjs"
	],
	firstLine: "^#!.*\\bnode",
	filenames: ["jakefile"],
	aliases: [
		"JavaScript",
		"javascript",
		"js"
	],
	mimetypes: ["text/javascript"],
	loader: () => {
		return import("./javascript-C3ZZ5Wux.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/julia/julia.contribution.js
registerLanguage({
	id: "julia",
	extensions: [".jl"],
	aliases: ["julia", "Julia"],
	loader: () => {
		return import("./julia-Di_GjOeB.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/kotlin/kotlin.contribution.js
registerLanguage({
	id: "kotlin",
	extensions: [".kt", ".kts"],
	aliases: ["Kotlin", "kotlin"],
	mimetypes: ["text/x-kotlin-source", "text/x-kotlin"],
	loader: () => {
		return import("./kotlin-2hcgdIJS.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/less/less.contribution.js
registerLanguage({
	id: "less",
	extensions: [".less"],
	aliases: ["Less", "less"],
	mimetypes: ["text/x-less", "text/less"],
	loader: () => {
		return import("./less-BkygCUUV.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/lexon/lexon.contribution.js
registerLanguage({
	id: "lexon",
	extensions: [".lex"],
	aliases: ["Lexon"],
	loader: () => {
		return import("./lexon-Nxx1wqO7.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/lua/lua.contribution.js
registerLanguage({
	id: "lua",
	extensions: [".lua"],
	aliases: ["Lua", "lua"],
	loader: () => {
		return import("./lua-CtwnX8am.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/liquid/liquid.contribution.js
registerLanguage({
	id: "liquid",
	extensions: [".liquid", ".html.liquid"],
	aliases: ["Liquid", "liquid"],
	mimetypes: ["application/liquid"],
	loader: () => {
		return import("./liquid-BHm_foDp.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/m3/m3.contribution.js
registerLanguage({
	id: "m3",
	extensions: [
		".m3",
		".i3",
		".mg",
		".ig"
	],
	aliases: [
		"Modula-3",
		"Modula3",
		"modula3",
		"m3"
	],
	loader: () => {
		return import("./m3-D__yuVj2.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution.js
registerLanguage({
	id: "markdown",
	extensions: [
		".md",
		".markdown",
		".mdown",
		".mkdn",
		".mkd",
		".mdwn",
		".mdtxt",
		".mdtext"
	],
	aliases: ["Markdown", "markdown"],
	loader: () => {
		return import("./markdown-ByOuB2va.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/mdx/mdx.contribution.js
registerLanguage({
	id: "mdx",
	extensions: [".mdx"],
	aliases: ["MDX", "mdx"],
	loader: () => {
		return import("./mdx-Bn-igXyh.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/mips/mips.contribution.js
registerLanguage({
	id: "mips",
	extensions: [".s"],
	aliases: ["MIPS", "MIPS-V"],
	mimetypes: [
		"text/x-mips",
		"text/mips",
		"text/plaintext"
	],
	loader: () => {
		return import("./mips-BqxyHFUv.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/msdax/msdax.contribution.js
registerLanguage({
	id: "msdax",
	extensions: [".dax", ".msdax"],
	aliases: ["DAX", "MSDAX"],
	loader: () => {
		return import("./msdax-COwzHQiN.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/mysql/mysql.contribution.js
registerLanguage({
	id: "mysql",
	extensions: [],
	aliases: ["MySQL", "mysql"],
	loader: () => {
		return import("./mysql-DUGo0VW9.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/objective-c/objective-c.contribution.js
registerLanguage({
	id: "objective-c",
	extensions: [".m"],
	aliases: ["Objective-C"],
	loader: () => {
		return import("./objective-c-CfbEzveS.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/pascal/pascal.contribution.js
registerLanguage({
	id: "pascal",
	extensions: [
		".pas",
		".p",
		".pp"
	],
	aliases: ["Pascal", "pas"],
	mimetypes: ["text/x-pascal-source", "text/x-pascal"],
	loader: () => {
		return import("./pascal-CZZ4ZO4-.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/pascaligo/pascaligo.contribution.js
registerLanguage({
	id: "pascaligo",
	extensions: [".ligo"],
	aliases: ["Pascaligo", "ligo"],
	loader: () => {
		return import("./pascaligo-DHw2IbBO.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/perl/perl.contribution.js
registerLanguage({
	id: "perl",
	extensions: [".pl", ".pm"],
	aliases: ["Perl", "pl"],
	loader: () => {
		return import("./perl-uEtoKOt4.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/pgsql/pgsql.contribution.js
registerLanguage({
	id: "pgsql",
	extensions: [],
	aliases: [
		"PostgreSQL",
		"postgres",
		"pg",
		"postgre"
	],
	loader: () => {
		return import("./pgsql-Ng3V_sGM.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/php/php.contribution.js
registerLanguage({
	id: "php",
	extensions: [
		".php",
		".php4",
		".php5",
		".phtml",
		".ctp"
	],
	aliases: ["PHP", "php"],
	mimetypes: ["application/x-php"],
	loader: () => {
		return import("./php-C9cUVk0p.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/pla/pla.contribution.js
registerLanguage({
	id: "pla",
	extensions: [".pla"],
	loader: () => {
		return import("./pla-CTKOGUtn.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/postiats/postiats.contribution.js
registerLanguage({
	id: "postiats",
	extensions: [
		".dats",
		".sats",
		".hats"
	],
	aliases: ["ATS", "ATS/Postiats"],
	loader: () => {
		return import("./postiats-RUCfpUCl.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/powerquery/powerquery.contribution.js
registerLanguage({
	id: "powerquery",
	extensions: [".pq", ".pqm"],
	aliases: [
		"PQ",
		"M",
		"Power Query",
		"Power Query M"
	],
	loader: () => {
		return import("./powerquery-0aT909m1.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/powershell/powershell.contribution.js
registerLanguage({
	id: "powershell",
	extensions: [
		".ps1",
		".psm1",
		".psd1"
	],
	aliases: [
		"PowerShell",
		"powershell",
		"ps",
		"ps1"
	],
	loader: () => {
		return import("./powershell-2voDL0Jz.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/protobuf/protobuf.contribution.js
registerLanguage({
	id: "proto",
	extensions: [".proto"],
	aliases: ["protobuf", "Protocol Buffers"],
	loader: () => {
		return import("./protobuf-BaJxbpu_.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/pug/pug.contribution.js
registerLanguage({
	id: "pug",
	extensions: [".jade", ".pug"],
	aliases: [
		"Pug",
		"Jade",
		"jade"
	],
	loader: () => {
		return import("./pug-BoMzC9j-.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/python/python.contribution.js
registerLanguage({
	id: "python",
	extensions: [
		".py",
		".rpy",
		".pyw",
		".cpy",
		".gyp",
		".gypi"
	],
	aliases: ["Python", "py"],
	firstLine: "^#!/.*\\bpython[0-9.-]*\\b",
	loader: () => {
		return import("./python-CMxD7rGc.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/qsharp/qsharp.contribution.js
registerLanguage({
	id: "qsharp",
	extensions: [".qs"],
	aliases: ["Q#", "qsharp"],
	loader: () => {
		return import("./qsharp-6C9n8Sx7.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/r/r.contribution.js
registerLanguage({
	id: "r",
	extensions: [
		".r",
		".rhistory",
		".rmd",
		".rprofile",
		".rt"
	],
	aliases: ["R", "r"],
	loader: () => {
		return import("./r-hVPIMcKg.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/razor/razor.contribution.js
registerLanguage({
	id: "razor",
	extensions: [".cshtml"],
	aliases: ["Razor", "razor"],
	mimetypes: ["text/x-cshtml"],
	loader: () => {
		return import("./razor-CIDGInUm.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/redis/redis.contribution.js
registerLanguage({
	id: "redis",
	extensions: [".redis"],
	aliases: ["redis"],
	loader: () => {
		return import("./redis-5bLV61x6.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/redshift/redshift.contribution.js
registerLanguage({
	id: "redshift",
	extensions: [],
	aliases: ["Redshift", "redshift"],
	loader: () => {
		return import("./redshift-DVSiyDxy.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/restructuredtext/restructuredtext.contribution.js
registerLanguage({
	id: "restructuredtext",
	extensions: [".rst"],
	aliases: ["reStructuredText", "restructuredtext"],
	loader: () => {
		return import("./restructuredtext-BAoH65HO.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/ruby/ruby.contribution.js
registerLanguage({
	id: "ruby",
	extensions: [
		".rb",
		".rbx",
		".rjs",
		".gemspec",
		".pp"
	],
	filenames: ["rakefile", "Gemfile"],
	aliases: ["Ruby", "rb"],
	loader: () => {
		return import("./ruby-BCHOewKZ.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/rust/rust.contribution.js
registerLanguage({
	id: "rust",
	extensions: [".rs", ".rlib"],
	aliases: ["Rust", "rust"],
	loader: () => {
		return import("./rust-Cxspr4dA.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/sb/sb.contribution.js
registerLanguage({
	id: "sb",
	extensions: [".sb"],
	aliases: ["Small Basic", "sb"],
	loader: () => {
		return import("./sb-i8716NVL.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/scala/scala.contribution.js
registerLanguage({
	id: "scala",
	extensions: [
		".scala",
		".sc",
		".sbt"
	],
	aliases: [
		"Scala",
		"scala",
		"SBT",
		"Sbt",
		"sbt",
		"Dotty",
		"dotty"
	],
	mimetypes: [
		"text/x-scala-source",
		"text/x-scala",
		"text/x-sbt",
		"text/x-dotty"
	],
	loader: () => {
		return import("./scala-Pejaqp-m.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/scheme/scheme.contribution.js
registerLanguage({
	id: "scheme",
	extensions: [
		".scm",
		".ss",
		".sch",
		".rkt"
	],
	aliases: ["scheme", "Scheme"],
	loader: () => {
		return import("./scheme-ClwZfU-t.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/scss/scss.contribution.js
registerLanguage({
	id: "scss",
	extensions: [".scss"],
	aliases: [
		"Sass",
		"sass",
		"scss"
	],
	mimetypes: ["text/x-scss", "text/scss"],
	loader: () => {
		return import("./scss-C447aein.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/shell/shell.contribution.js
registerLanguage({
	id: "shell",
	extensions: [".sh", ".bash"],
	aliases: ["Shell", "sh"],
	loader: () => {
		return import("./shell-BxXf6JVL.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/solidity/solidity.contribution.js
registerLanguage({
	id: "sol",
	extensions: [".sol"],
	aliases: [
		"sol",
		"solidity",
		"Solidity"
	],
	loader: () => {
		return import("./solidity-DuZpyTQ_.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/sophia/sophia.contribution.js
registerLanguage({
	id: "aes",
	extensions: [".aes"],
	aliases: [
		"aes",
		"sophia",
		"Sophia"
	],
	loader: () => {
		return import("./sophia-Dr8-mg-q.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/sparql/sparql.contribution.js
registerLanguage({
	id: "sparql",
	extensions: [".rq"],
	aliases: ["sparql", "SPARQL"],
	loader: () => {
		return import("./sparql-xxUbI9HH.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/sql/sql.contribution.js
registerLanguage({
	id: "sql",
	extensions: [".sql"],
	aliases: ["SQL"],
	loader: () => {
		return import("./sql-KDPmVGBE.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/st/st.contribution.js
registerLanguage({
	id: "st",
	extensions: [
		".st",
		".iecst",
		".iecplc",
		".lc3lib",
		".TcPOU",
		".TcDUT",
		".TcGVL",
		".TcIO"
	],
	aliases: [
		"StructuredText",
		"scl",
		"stl"
	],
	loader: () => {
		return import("./st-Ccv9yx52.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/swift/swift.contribution.js
registerLanguage({
	id: "swift",
	aliases: ["Swift", "swift"],
	extensions: [".swift"],
	mimetypes: ["text/swift"],
	loader: () => {
		return import("./swift-DUu8dB5j.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/systemverilog/systemverilog.contribution.js
registerLanguage({
	id: "systemverilog",
	extensions: [".sv", ".svh"],
	aliases: [
		"SV",
		"sv",
		"SystemVerilog",
		"systemverilog"
	],
	loader: () => {
		return import("./systemverilog-Cj5sgY2Y.js");
	}
});
registerLanguage({
	id: "verilog",
	extensions: [".v", ".vh"],
	aliases: [
		"V",
		"v",
		"Verilog",
		"verilog"
	],
	loader: () => {
		return import("./systemverilog-Cj5sgY2Y.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/tcl/tcl.contribution.js
registerLanguage({
	id: "tcl",
	extensions: [".tcl"],
	aliases: [
		"tcl",
		"Tcl",
		"tcltk",
		"TclTk",
		"tcl/tk",
		"Tcl/Tk"
	],
	loader: () => {
		return import("./tcl-CPNle1jN.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/twig/twig.contribution.js
registerLanguage({
	id: "twig",
	extensions: [".twig"],
	aliases: ["Twig", "twig"],
	mimetypes: ["text/x-twig"],
	loader: () => {
		return import("./twig-A6HsqfB7.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js
registerLanguage({
	id: "typescript",
	extensions: [
		".ts",
		".tsx",
		".cts",
		".mts"
	],
	aliases: [
		"TypeScript",
		"ts",
		"typescript"
	],
	mimetypes: ["text/typescript"],
	loader: () => {
		return import("./typescript-Dno0XhK6.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/typespec/typespec.contribution.js
registerLanguage({
	id: "typespec",
	extensions: [".tsp"],
	aliases: ["TypeSpec"],
	loader: () => {
		return import("./typespec-Bb_3oRjB.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/vb/vb.contribution.js
registerLanguage({
	id: "vb",
	extensions: [".vb"],
	aliases: ["Visual Basic", "vb"],
	loader: () => {
		return import("./vb-79Qjw1fc.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/wgsl/wgsl.contribution.js
registerLanguage({
	id: "wgsl",
	extensions: [".wgsl"],
	aliases: [
		"WebGPU Shading Language",
		"WGSL",
		"wgsl"
	],
	loader: () => {
		return import("./wgsl-CEy3aKvC.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/xml/xml.contribution.js
registerLanguage({
	id: "xml",
	extensions: [
		".xml",
		".xsd",
		".dtd",
		".ascx",
		".csproj",
		".config",
		".props",
		".targets",
		".wxi",
		".wxl",
		".wxs",
		".xaml",
		".svg",
		".svgz",
		".opf",
		".xslt",
		".xsl"
	],
	firstLine: "(\\<\\?xml.*)|(\\<svg)|(\\<\\!doctype\\s+svg)",
	aliases: ["XML", "xml"],
	mimetypes: [
		"text/xml",
		"application/xml",
		"application/xaml+xml",
		"application/xml-dtd"
	],
	loader: () => {
		return import("./xml-Dap3dRey.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution.js
registerLanguage({
	id: "yaml",
	extensions: [".yaml", ".yml"],
	aliases: [
		"YAML",
		"yaml",
		"YML",
		"yml"
	],
	mimetypes: ["application/x-yaml", "text/x-yaml"],
	loader: () => {
		return import("./yaml-BcCc-4RI.js");
	}
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/language/css/monaco.contribution.js
/*!-----------------------------------------------------------------------------
* Copyright (c) Microsoft Corporation. All rights reserved.
* Version: 0.52.2(404545bded1df6ffa41ea0af4e8ddb219018c6c1)
* Released under the MIT license
* https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
*-----------------------------------------------------------------------------*/
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$2 = Object.getOwnPropertyNames;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __copyProps$2 = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames$2(from)) if (!__hasOwnProp$2.call(to, key) && key !== except) __defProp$2(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc$2(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __reExport$2 = (target, mod, secondTarget) => (__copyProps$2(target, mod, "default"), secondTarget && __copyProps$2(secondTarget, mod, "default"));
var monaco_editor_core_exports$2 = {};
__reExport$2(monaco_editor_core_exports$2, editor_api_exports);
var LanguageServiceDefaultsImpl$2 = class {
	constructor(languageId, options, modeConfiguration) {
		this._onDidChange = new monaco_editor_core_exports$2.Emitter();
		this._languageId = languageId;
		this.setOptions(options);
		this.setModeConfiguration(modeConfiguration);
	}
	get onDidChange() {
		return this._onDidChange.event;
	}
	get languageId() {
		return this._languageId;
	}
	get modeConfiguration() {
		return this._modeConfiguration;
	}
	get diagnosticsOptions() {
		return this.options;
	}
	get options() {
		return this._options;
	}
	setOptions(options) {
		this._options = options || /* @__PURE__ */ Object.create(null);
		this._onDidChange.fire(this);
	}
	setDiagnosticsOptions(options) {
		this.setOptions(options);
	}
	setModeConfiguration(modeConfiguration) {
		this._modeConfiguration = modeConfiguration || /* @__PURE__ */ Object.create(null);
		this._onDidChange.fire(this);
	}
};
var optionsDefault$1 = {
	validate: true,
	lint: {
		compatibleVendorPrefixes: "ignore",
		vendorPrefix: "warning",
		duplicateProperties: "warning",
		emptyRules: "warning",
		importStatement: "ignore",
		boxModel: "ignore",
		universalSelector: "ignore",
		zeroUnits: "ignore",
		fontFaceProperties: "warning",
		hexColorLength: "error",
		argumentsInColorFunction: "error",
		unknownProperties: "warning",
		ieHack: "ignore",
		unknownVendorSpecificProperties: "ignore",
		propertyIgnoredDueToDisplay: "warning",
		important: "ignore",
		float: "ignore",
		idSelector: "ignore"
	},
	data: { useDefaultDataProvider: true },
	format: {
		newlineBetweenSelectors: true,
		newlineBetweenRules: true,
		spaceAroundSelectorSeparator: false,
		braceStyle: "collapse",
		maxPreserveNewLines: void 0,
		preserveNewLines: true
	}
};
var modeConfigurationDefault = {
	completionItems: true,
	hovers: true,
	documentSymbols: true,
	definitions: true,
	references: true,
	documentHighlights: true,
	rename: true,
	colors: true,
	foldingRanges: true,
	diagnostics: true,
	selectionRanges: true,
	documentFormattingEdits: true,
	documentRangeFormattingEdits: true
};
var cssDefaults = new LanguageServiceDefaultsImpl$2("css", optionsDefault$1, modeConfigurationDefault);
var scssDefaults = new LanguageServiceDefaultsImpl$2("scss", optionsDefault$1, modeConfigurationDefault);
var lessDefaults = new LanguageServiceDefaultsImpl$2("less", optionsDefault$1, modeConfigurationDefault);
monaco_editor_core_exports$2.languages.css = {
	cssDefaults,
	lessDefaults,
	scssDefaults
};
function getMode$2() {
	return import("./cssMode-urq0qofg.js");
}
monaco_editor_core_exports$2.languages.onLanguage("less", () => {
	getMode$2().then((mode) => mode.setupMode(lessDefaults));
});
monaco_editor_core_exports$2.languages.onLanguage("scss", () => {
	getMode$2().then((mode) => mode.setupMode(scssDefaults));
});
monaco_editor_core_exports$2.languages.onLanguage("css", () => {
	getMode$2().then((mode) => mode.setupMode(cssDefaults));
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/language/html/monaco.contribution.js
/*!-----------------------------------------------------------------------------
* Copyright (c) Microsoft Corporation. All rights reserved.
* Version: 0.52.2(404545bded1df6ffa41ea0af4e8ddb219018c6c1)
* Released under the MIT license
* https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
*-----------------------------------------------------------------------------*/
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$1 = Object.getOwnPropertyNames;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __copyProps$1 = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames$1(from)) if (!__hasOwnProp$1.call(to, key) && key !== except) __defProp$1(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc$1(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __reExport$1 = (target, mod, secondTarget) => (__copyProps$1(target, mod, "default"), secondTarget && __copyProps$1(secondTarget, mod, "default"));
var monaco_editor_core_exports$1 = {};
__reExport$1(monaco_editor_core_exports$1, editor_api_exports);
var LanguageServiceDefaultsImpl$1 = class {
	constructor(languageId, options, modeConfiguration) {
		this._onDidChange = new monaco_editor_core_exports$1.Emitter();
		this._languageId = languageId;
		this.setOptions(options);
		this.setModeConfiguration(modeConfiguration);
	}
	get onDidChange() {
		return this._onDidChange.event;
	}
	get languageId() {
		return this._languageId;
	}
	get options() {
		return this._options;
	}
	get modeConfiguration() {
		return this._modeConfiguration;
	}
	setOptions(options) {
		this._options = options || /* @__PURE__ */ Object.create(null);
		this._onDidChange.fire(this);
	}
	setModeConfiguration(modeConfiguration) {
		this._modeConfiguration = modeConfiguration || /* @__PURE__ */ Object.create(null);
		this._onDidChange.fire(this);
	}
};
var optionsDefault = {
	format: {
		tabSize: 4,
		insertSpaces: false,
		wrapLineLength: 120,
		unformatted: "default\": \"a, abbr, acronym, b, bdo, big, br, button, cite, code, dfn, em, i, img, input, kbd, label, map, object, q, samp, select, small, span, strong, sub, sup, textarea, tt, var",
		contentUnformatted: "pre",
		indentInnerHtml: false,
		preserveNewLines: true,
		maxPreserveNewLines: void 0,
		indentHandlebars: false,
		endWithNewline: false,
		extraLiners: "head, body, /html",
		wrapAttributes: "auto"
	},
	suggest: {},
	data: { useDefaultDataProvider: true }
};
function getConfigurationDefault(languageId) {
	return {
		completionItems: true,
		hovers: true,
		documentSymbols: true,
		links: true,
		documentHighlights: true,
		rename: true,
		colors: true,
		foldingRanges: true,
		selectionRanges: true,
		diagnostics: languageId === htmlLanguageId,
		documentFormattingEdits: languageId === htmlLanguageId,
		documentRangeFormattingEdits: languageId === htmlLanguageId
	};
}
var htmlLanguageId = "html";
var handlebarsLanguageId = "handlebars";
var razorLanguageId = "razor";
var htmlLanguageService = registerHTMLLanguageService(htmlLanguageId, optionsDefault, getConfigurationDefault(htmlLanguageId));
var htmlDefaults = htmlLanguageService.defaults;
var handlebarLanguageService = registerHTMLLanguageService(handlebarsLanguageId, optionsDefault, getConfigurationDefault(handlebarsLanguageId));
var handlebarDefaults = handlebarLanguageService.defaults;
var razorLanguageService = registerHTMLLanguageService(razorLanguageId, optionsDefault, getConfigurationDefault(razorLanguageId));
var razorDefaults = razorLanguageService.defaults;
monaco_editor_core_exports$1.languages.html = {
	htmlDefaults,
	razorDefaults,
	handlebarDefaults,
	htmlLanguageService,
	handlebarLanguageService,
	razorLanguageService,
	registerHTMLLanguageService
};
function getMode$1() {
	return import("./htmlMode-C9XEEjBb.js");
}
function registerHTMLLanguageService(languageId, options = optionsDefault, modeConfiguration = getConfigurationDefault(languageId)) {
	const defaults = new LanguageServiceDefaultsImpl$1(languageId, options, modeConfiguration);
	let mode;
	const onLanguageListener = monaco_editor_core_exports$1.languages.onLanguage(languageId, async () => {
		mode = (await getMode$1()).setupMode(defaults);
	});
	return {
		defaults,
		dispose() {
			onLanguageListener.dispose();
			mode?.dispose();
			mode = void 0;
		}
	};
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/language/json/monaco.contribution.js
/*!-----------------------------------------------------------------------------
* Copyright (c) Microsoft Corporation. All rights reserved.
* Version: 0.52.2(404545bded1df6ffa41ea0af4e8ddb219018c6c1)
* Released under the MIT license
* https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
*-----------------------------------------------------------------------------*/
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var monaco_editor_core_exports = {};
__reExport(monaco_editor_core_exports, editor_api_exports);
var LanguageServiceDefaultsImpl = class {
	constructor(languageId, diagnosticsOptions, modeConfiguration) {
		this._onDidChange = new monaco_editor_core_exports.Emitter();
		this._languageId = languageId;
		this.setDiagnosticsOptions(diagnosticsOptions);
		this.setModeConfiguration(modeConfiguration);
	}
	get onDidChange() {
		return this._onDidChange.event;
	}
	get languageId() {
		return this._languageId;
	}
	get modeConfiguration() {
		return this._modeConfiguration;
	}
	get diagnosticsOptions() {
		return this._diagnosticsOptions;
	}
	setDiagnosticsOptions(options) {
		this._diagnosticsOptions = options || /* @__PURE__ */ Object.create(null);
		this._onDidChange.fire(this);
	}
	setModeConfiguration(modeConfiguration) {
		this._modeConfiguration = modeConfiguration || /* @__PURE__ */ Object.create(null);
		this._onDidChange.fire(this);
	}
};
var jsonDefaults = new LanguageServiceDefaultsImpl("json", {
	validate: true,
	allowComments: true,
	schemas: [],
	enableSchemaRequest: false,
	schemaRequest: "warning",
	schemaValidation: "warning",
	comments: "error",
	trailingCommas: "error"
}, {
	documentFormattingEdits: true,
	documentRangeFormattingEdits: true,
	completionItems: true,
	hovers: true,
	documentSymbols: true,
	tokens: true,
	colors: true,
	foldingRanges: true,
	diagnostics: true,
	selectionRanges: true
});
var getWorker = () => getMode().then((mode) => mode.getWorker());
monaco_editor_core_exports.languages.json = {
	jsonDefaults,
	getWorker
};
function getMode() {
	return import("./jsonMode-BeH-9qfb.js");
}
monaco_editor_core_exports.languages.register({
	id: "json",
	extensions: [
		".json",
		".bowerrc",
		".jshintrc",
		".jscsrc",
		".eslintrc",
		".babelrc",
		".har"
	],
	aliases: ["JSON", "json"],
	mimetypes: ["application/json"]
});
monaco_editor_core_exports.languages.onLanguage("json", () => {
	getMode().then((mode) => mode.setupMode(jsonDefaults));
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js
var IPadShowKeyboard = class extends Disposable {
	static {
		this.ID = "editor.contrib.iPadShowKeyboard";
	}
	constructor(editor$1) {
		super();
		this.editor = editor$1;
		this.widget = null;
		if (isIOS) {
			this._register(editor$1.onDidChangeConfiguration(() => this.update()));
			this.update();
		}
	}
	update() {
		const shouldHaveWidget = !this.editor.getOption(92);
		if (!this.widget && shouldHaveWidget) this.widget = new ShowKeyboardWidget(this.editor);
		else if (this.widget && !shouldHaveWidget) {
			this.widget.dispose();
			this.widget = null;
		}
	}
	dispose() {
		super.dispose();
		if (this.widget) {
			this.widget.dispose();
			this.widget = null;
		}
	}
};
var ShowKeyboardWidget = class ShowKeyboardWidget extends Disposable {
	static {
		this.ID = "editor.contrib.ShowKeyboardWidget";
	}
	constructor(editor$1) {
		super();
		this.editor = editor$1;
		this._domNode = document.createElement("textarea");
		this._domNode.className = "iPadShowKeyboard";
		this._register(addDisposableListener(this._domNode, "touchstart", (e) => {
			this.editor.focus();
		}));
		this._register(addDisposableListener(this._domNode, "focus", (e) => {
			this.editor.focus();
		}));
		this.editor.addOverlayWidget(this);
	}
	dispose() {
		this.editor.removeOverlayWidget(this);
		super.dispose();
	}
	getId() {
		return ShowKeyboardWidget.ID;
	}
	getDomNode() {
		return this._domNode;
	}
	getPosition() {
		return { preference: 1 };
	}
};
registerEditorContribution(IPadShowKeyboard.ID, IPadShowKeyboard, 3);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js
var __decorate$7 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$7 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var InspectTokensController_1;
var InspectTokensController = class InspectTokensController$1 extends Disposable {
	static {
		InspectTokensController_1 = this;
	}
	static {
		this.ID = "editor.contrib.inspectTokens";
	}
	static get(editor$1) {
		return editor$1.getContribution(InspectTokensController_1.ID);
	}
	constructor(editor$1, standaloneColorService, languageService) {
		super();
		this._editor = editor$1;
		this._languageService = languageService;
		this._widget = null;
		this._register(this._editor.onDidChangeModel((e) => this.stop()));
		this._register(this._editor.onDidChangeModelLanguage((e) => this.stop()));
		this._register(TokenizationRegistry.onDidChange((e) => this.stop()));
		this._register(this._editor.onKeyUp((e) => e.keyCode === 9 && this.stop()));
	}
	dispose() {
		this.stop();
		super.dispose();
	}
	launch() {
		if (this._widget) return;
		if (!this._editor.hasModel()) return;
		this._widget = new InspectTokensWidget(this._editor, this._languageService);
	}
	stop() {
		if (this._widget) {
			this._widget.dispose();
			this._widget = null;
		}
	}
};
InspectTokensController = InspectTokensController_1 = __decorate$7([__param$7(1, IStandaloneThemeService), __param$7(2, ILanguageService)], InspectTokensController);
var InspectTokens = class extends EditorAction {
	constructor() {
		super({
			id: "editor.action.inspectTokens",
			label: InspectTokensNLS.inspectTokensAction,
			alias: "Developer: Inspect Tokens",
			precondition: void 0
		});
	}
	run(accessor, editor$1) {
		InspectTokensController.get(editor$1)?.launch();
	}
};
function renderTokenText(tokenText) {
	let result = "";
	for (let charIndex = 0, len = tokenText.length; charIndex < len; charIndex++) {
		const charCode = tokenText.charCodeAt(charIndex);
		switch (charCode) {
			case 9:
				result += "→";
				break;
			case 32:
				result += "·";
				break;
			default: result += String.fromCharCode(charCode);
		}
	}
	return result;
}
function getSafeTokenizationSupport(languageIdCodec, languageId) {
	const tokenizationSupport = TokenizationRegistry.get(languageId);
	if (tokenizationSupport) return tokenizationSupport;
	const encodedLanguageId = languageIdCodec.encodeLanguageId(languageId);
	return {
		getInitialState: () => NullState,
		tokenize: (line, hasEOL, state) => nullTokenize(languageId, state),
		tokenizeEncoded: (line, hasEOL, state) => nullTokenizeEncoded(encodedLanguageId, state)
	};
}
var InspectTokensWidget = class InspectTokensWidget extends Disposable {
	static {
		this._ID = "editor.contrib.inspectTokensWidget";
	}
	constructor(editor$1, languageService) {
		super();
		this.allowEditorOverflow = true;
		this._editor = editor$1;
		this._languageService = languageService;
		this._model = this._editor.getModel();
		this._domNode = document.createElement("div");
		this._domNode.className = "tokens-inspect-widget";
		this._tokenizationSupport = getSafeTokenizationSupport(this._languageService.languageIdCodec, this._model.getLanguageId());
		this._compute(this._editor.getPosition());
		this._register(this._editor.onDidChangeCursorPosition((e) => this._compute(this._editor.getPosition())));
		this._editor.addContentWidget(this);
	}
	dispose() {
		this._editor.removeContentWidget(this);
		super.dispose();
	}
	getId() {
		return InspectTokensWidget._ID;
	}
	_compute(position) {
		const data = this._getTokensAtLine(position.lineNumber);
		let token1Index = 0;
		for (let i = data.tokens1.length - 1; i >= 0; i--) {
			const t = data.tokens1[i];
			if (position.column - 1 >= t.offset) {
				token1Index = i;
				break;
			}
		}
		let token2Index = 0;
		for (let i = data.tokens2.length >>> 1; i >= 0; i--) if (position.column - 1 >= data.tokens2[i << 1]) {
			token2Index = i;
			break;
		}
		const lineContent = this._model.getLineContent(position.lineNumber);
		let tokenText = "";
		if (token1Index < data.tokens1.length) {
			const tokenStartIndex = data.tokens1[token1Index].offset;
			const tokenEndIndex = token1Index + 1 < data.tokens1.length ? data.tokens1[token1Index + 1].offset : lineContent.length;
			tokenText = lineContent.substring(tokenStartIndex, tokenEndIndex);
		}
		reset(this._domNode, $("h2.tm-token", void 0, renderTokenText(tokenText), $("span.tm-token-length", void 0, `${tokenText.length} ${tokenText.length === 1 ? "char" : "chars"}`)));
		append(this._domNode, $("hr.tokens-inspect-separator", { "style": "clear:both" }));
		const metadata = (token2Index << 1) + 1 < data.tokens2.length ? this._decodeMetadata(data.tokens2[(token2Index << 1) + 1]) : null;
		append(this._domNode, $("table.tm-metadata-table", void 0, $("tbody", void 0, $("tr", void 0, $("td.tm-metadata-key", void 0, "language"), $("td.tm-metadata-value", void 0, `${metadata ? metadata.languageId : "-?-"}`)), $("tr", void 0, $("td.tm-metadata-key", void 0, "token type"), $("td.tm-metadata-value", void 0, `${metadata ? this._tokenTypeToString(metadata.tokenType) : "-?-"}`)), $("tr", void 0, $("td.tm-metadata-key", void 0, "font style"), $("td.tm-metadata-value", void 0, `${metadata ? this._fontStyleToString(metadata.fontStyle) : "-?-"}`)), $("tr", void 0, $("td.tm-metadata-key", void 0, "foreground"), $("td.tm-metadata-value", void 0, `${metadata ? Color.Format.CSS.formatHex(metadata.foreground) : "-?-"}`)), $("tr", void 0, $("td.tm-metadata-key", void 0, "background"), $("td.tm-metadata-value", void 0, `${metadata ? Color.Format.CSS.formatHex(metadata.background) : "-?-"}`)))));
		append(this._domNode, $("hr.tokens-inspect-separator"));
		if (token1Index < data.tokens1.length) append(this._domNode, $("span.tm-token-type", void 0, data.tokens1[token1Index].type));
		this._editor.layoutContentWidget(this);
	}
	_decodeMetadata(metadata) {
		const colorMap = TokenizationRegistry.getColorMap();
		const languageId = TokenMetadata.getLanguageId(metadata);
		const tokenType = TokenMetadata.getTokenType(metadata);
		const fontStyle = TokenMetadata.getFontStyle(metadata);
		const foreground = TokenMetadata.getForeground(metadata);
		const background = TokenMetadata.getBackground(metadata);
		return {
			languageId: this._languageService.languageIdCodec.decodeLanguageId(languageId),
			tokenType,
			fontStyle,
			foreground: colorMap[foreground],
			background: colorMap[background]
		};
	}
	_tokenTypeToString(tokenType) {
		switch (tokenType) {
			case 0: return "Other";
			case 1: return "Comment";
			case 2: return "String";
			case 3: return "RegEx";
			default: return "??";
		}
	}
	_fontStyleToString(fontStyle) {
		let r = "";
		if (fontStyle & 1) r += "italic ";
		if (fontStyle & 2) r += "bold ";
		if (fontStyle & 4) r += "underline ";
		if (fontStyle & 8) r += "strikethrough ";
		if (r.length === 0) r = "---";
		return r;
	}
	_getTokensAtLine(lineNumber) {
		const stateBeforeLine = this._getStateBeforeLine(lineNumber);
		const tokenizationResult1 = this._tokenizationSupport.tokenize(this._model.getLineContent(lineNumber), true, stateBeforeLine);
		const tokenizationResult2 = this._tokenizationSupport.tokenizeEncoded(this._model.getLineContent(lineNumber), true, stateBeforeLine);
		return {
			startState: stateBeforeLine,
			tokens1: tokenizationResult1.tokens,
			tokens2: tokenizationResult2.tokens,
			endState: tokenizationResult1.endState
		};
	}
	_getStateBeforeLine(lineNumber) {
		let state = this._tokenizationSupport.getInitialState();
		for (let i = 1; i < lineNumber; i++) state = this._tokenizationSupport.tokenize(this._model.getLineContent(i), true, state).endState;
		return state;
	}
	getDomNode() {
		return this._domNode;
	}
	getPosition() {
		return {
			position: this._editor.getPosition(),
			preference: [2, 1]
		};
	}
};
registerEditorContribution(InspectTokensController.ID, InspectTokensController, 4);
registerEditorAction(InspectTokens);

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/quickinput/browser/helpQuickAccess.js
var __decorate$6 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$6 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var HelpQuickAccessProvider_1;
var HelpQuickAccessProvider = class HelpQuickAccessProvider$1 {
	static {
		HelpQuickAccessProvider_1 = this;
	}
	static {
		this.PREFIX = "?";
	}
	constructor(quickInputService, keybindingService) {
		this.quickInputService = quickInputService;
		this.keybindingService = keybindingService;
		this.registry = Registry.as(Extensions.Quickaccess);
	}
	provide(picker) {
		const disposables = new DisposableStore();
		disposables.add(picker.onDidAccept(() => {
			const [item] = picker.selectedItems;
			if (item) this.quickInputService.quickAccess.show(item.prefix, { preserveValue: true });
		}));
		disposables.add(picker.onDidChangeValue((value) => {
			const providerDescriptor = this.registry.getQuickAccessProvider(value.substr(HelpQuickAccessProvider_1.PREFIX.length));
			if (providerDescriptor && providerDescriptor.prefix && providerDescriptor.prefix !== HelpQuickAccessProvider_1.PREFIX) this.quickInputService.quickAccess.show(providerDescriptor.prefix, { preserveValue: true });
		}));
		picker.items = this.getQuickAccessProviders().filter((p) => p.prefix !== HelpQuickAccessProvider_1.PREFIX);
		return disposables;
	}
	getQuickAccessProviders() {
		return this.registry.getQuickAccessProviders().sort((providerA, providerB) => providerA.prefix.localeCompare(providerB.prefix)).flatMap((provider) => this.createPicks(provider));
	}
	createPicks(provider) {
		return provider.helpEntries.map((helpEntry) => {
			const prefix = helpEntry.prefix || provider.prefix;
			const label = prefix || "…";
			return {
				prefix,
				label,
				keybinding: helpEntry.commandId ? this.keybindingService.lookupKeybinding(helpEntry.commandId) : void 0,
				ariaLabel: localize("helpPickAriaLabel", "{0}, {1}", label, helpEntry.description),
				description: helpEntry.description
			};
		});
	}
};
HelpQuickAccessProvider = HelpQuickAccessProvider_1 = __decorate$6([__param$6(0, IQuickInputService), __param$6(1, IKeybindingService)], HelpQuickAccessProvider);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js
Registry.as(Extensions.Quickaccess).registerQuickAccessProvider({
	ctor: HelpQuickAccessProvider,
	prefix: "",
	helpEntries: [{ description: QuickHelpNLS.helpQuickAccessActionLabel }]
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/contrib/quickAccess/browser/editorNavigationQuickAccess.js
/**
* A reusable quick access provider for the editor with support
* for adding decorations for navigating in the currently active file
* (for example "Go to line", "Go to symbol").
*/
var AbstractEditorNavigationQuickAccessProvider = class {
	constructor(options) {
		this.options = options;
		this.rangeHighlightDecorationId = void 0;
	}
	provide(picker, token, runOptions) {
		const disposables = new DisposableStore();
		picker.canAcceptInBackground = !!this.options?.canAcceptInBackground;
		picker.matchOnLabel = picker.matchOnDescription = picker.matchOnDetail = picker.sortByLabel = false;
		const pickerDisposable = disposables.add(new MutableDisposable());
		pickerDisposable.value = this.doProvide(picker, token, runOptions);
		disposables.add(this.onDidActiveTextEditorControlChange(() => {
			pickerDisposable.value = void 0;
			pickerDisposable.value = this.doProvide(picker, token);
		}));
		return disposables;
	}
	doProvide(picker, token, runOptions) {
		const disposables = new DisposableStore();
		const editor$1 = this.activeTextEditorControl;
		if (editor$1 && this.canProvideWithTextEditor(editor$1)) {
			const context = { editor: editor$1 };
			const codeEditor = getCodeEditor(editor$1);
			if (codeEditor) {
				let lastKnownEditorViewState = editor$1.saveViewState() ?? void 0;
				disposables.add(codeEditor.onDidChangeCursorPosition(() => {
					lastKnownEditorViewState = editor$1.saveViewState() ?? void 0;
				}));
				context.restoreViewState = () => {
					if (lastKnownEditorViewState && editor$1 === this.activeTextEditorControl) editor$1.restoreViewState(lastKnownEditorViewState);
				};
				disposables.add(createSingleCallFunction(token.onCancellationRequested)(() => context.restoreViewState?.()));
			}
			disposables.add(toDisposable(() => this.clearDecorations(editor$1)));
			disposables.add(this.provideWithTextEditor(context, picker, token, runOptions));
		} else disposables.add(this.provideWithoutTextEditor(picker, token));
		return disposables;
	}
	/**
	* Subclasses to implement if they can operate on the text editor.
	*/
	canProvideWithTextEditor(editor$1) {
		return true;
	}
	gotoLocation({ editor: editor$1 }, options) {
		editor$1.setSelection(options.range, "code.jump");
		editor$1.revealRangeInCenter(options.range, 0);
		if (!options.preserveFocus) editor$1.focus();
		const model = editor$1.getModel();
		if (model && "getLineContent" in model) status(`${model.getLineContent(options.range.startLineNumber)}`);
	}
	getModel(editor$1) {
		return isDiffEditor(editor$1) ? editor$1.getModel()?.modified : editor$1.getModel();
	}
	addDecorations(editor$1, range) {
		editor$1.changeDecorations((changeAccessor) => {
			const deleteDecorations = [];
			if (this.rangeHighlightDecorationId) {
				deleteDecorations.push(this.rangeHighlightDecorationId.overviewRulerDecorationId);
				deleteDecorations.push(this.rangeHighlightDecorationId.rangeHighlightId);
				this.rangeHighlightDecorationId = void 0;
			}
			const newDecorations = [{
				range,
				options: {
					description: "quick-access-range-highlight",
					className: "rangeHighlight",
					isWholeLine: true
				}
			}, {
				range,
				options: {
					description: "quick-access-range-highlight-overview",
					overviewRuler: {
						color: themeColorFromId(overviewRulerRangeHighlight),
						position: OverviewRulerLane.Full
					}
				}
			}];
			const [rangeHighlightId, overviewRulerDecorationId] = changeAccessor.deltaDecorations(deleteDecorations, newDecorations);
			this.rangeHighlightDecorationId = {
				rangeHighlightId,
				overviewRulerDecorationId
			};
		});
	}
	clearDecorations(editor$1) {
		const rangeHighlightDecorationId = this.rangeHighlightDecorationId;
		if (rangeHighlightDecorationId) {
			editor$1.changeDecorations((changeAccessor) => {
				changeAccessor.deltaDecorations([rangeHighlightDecorationId.overviewRulerDecorationId, rangeHighlightDecorationId.rangeHighlightId], []);
			});
			this.rangeHighlightDecorationId = void 0;
		}
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/contrib/quickAccess/browser/gotoLineQuickAccess.js
var AbstractGotoLineQuickAccessProvider = class AbstractGotoLineQuickAccessProvider extends AbstractEditorNavigationQuickAccessProvider {
	static {
		this.PREFIX = ":";
	}
	constructor() {
		super({ canAcceptInBackground: true });
	}
	provideWithoutTextEditor(picker) {
		const label = localize("cannotRunGotoLine", "Open a text editor first to go to a line.");
		picker.items = [{ label }];
		picker.ariaLabel = label;
		return Disposable.None;
	}
	provideWithTextEditor(context, picker, token) {
		const editor$1 = context.editor;
		const disposables = new DisposableStore();
		disposables.add(picker.onDidAccept((event) => {
			const [item] = picker.selectedItems;
			if (item) {
				if (!this.isValidLineNumber(editor$1, item.lineNumber)) return;
				this.gotoLocation(context, {
					range: this.toRange(item.lineNumber, item.column),
					keyMods: picker.keyMods,
					preserveFocus: event.inBackground
				});
				if (!event.inBackground) picker.hide();
			}
		}));
		const updatePickerAndEditor = () => {
			const position = this.parsePosition(editor$1, picker.value.trim().substr(AbstractGotoLineQuickAccessProvider.PREFIX.length));
			const label = this.getPickLabel(editor$1, position.lineNumber, position.column);
			picker.items = [{
				lineNumber: position.lineNumber,
				column: position.column,
				label
			}];
			picker.ariaLabel = label;
			if (!this.isValidLineNumber(editor$1, position.lineNumber)) {
				this.clearDecorations(editor$1);
				return;
			}
			const range = this.toRange(position.lineNumber, position.column);
			editor$1.revealRangeInCenter(range, 0);
			this.addDecorations(editor$1, range);
		};
		updatePickerAndEditor();
		disposables.add(picker.onDidChangeValue(() => updatePickerAndEditor()));
		const codeEditor = getCodeEditor(editor$1);
		if (codeEditor) {
			if (codeEditor.getOptions().get(68).renderType === 2) {
				codeEditor.updateOptions({ lineNumbers: "on" });
				disposables.add(toDisposable(() => codeEditor.updateOptions({ lineNumbers: "relative" })));
			}
		}
		return disposables;
	}
	toRange(lineNumber = 1, column = 1) {
		return {
			startLineNumber: lineNumber,
			startColumn: column,
			endLineNumber: lineNumber,
			endColumn: column
		};
	}
	parsePosition(editor$1, value) {
		const numbers = value.split(/,|:|#/).map((part) => parseInt(part, 10)).filter((part) => !isNaN(part));
		const endLine = this.lineCount(editor$1) + 1;
		return {
			lineNumber: numbers[0] > 0 ? numbers[0] : endLine + numbers[0],
			column: numbers[1]
		};
	}
	getPickLabel(editor$1, lineNumber, column) {
		if (this.isValidLineNumber(editor$1, lineNumber)) {
			if (this.isValidColumn(editor$1, lineNumber, column)) return localize("gotoLineColumnLabel", "Go to line {0} and character {1}.", lineNumber, column);
			return localize("gotoLineLabel", "Go to line {0}.", lineNumber);
		}
		const position = editor$1.getPosition() || {
			lineNumber: 1,
			column: 1
		};
		const lineCount = this.lineCount(editor$1);
		if (lineCount > 1) return localize("gotoLineLabelEmptyWithLimit", "Current Line: {0}, Character: {1}. Type a line number between 1 and {2} to navigate to.", position.lineNumber, position.column, lineCount);
		return localize("gotoLineLabelEmpty", "Current Line: {0}, Character: {1}. Type a line number to navigate to.", position.lineNumber, position.column);
	}
	isValidLineNumber(editor$1, lineNumber) {
		if (!lineNumber || typeof lineNumber !== "number") return false;
		return lineNumber > 0 && lineNumber <= this.lineCount(editor$1);
	}
	isValidColumn(editor$1, lineNumber, column) {
		if (!column || typeof column !== "number") return false;
		const model = this.getModel(editor$1);
		if (!model) return false;
		const positionCandidate = {
			lineNumber,
			column
		};
		return model.validatePosition(positionCandidate).equals(positionCandidate);
	}
	lineCount(editor$1) {
		return this.getModel(editor$1)?.getLineCount() ?? 0;
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js
var __decorate$5 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$5 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var StandaloneGotoLineQuickAccessProvider = class StandaloneGotoLineQuickAccessProvider$1 extends AbstractGotoLineQuickAccessProvider {
	constructor(editorService) {
		super();
		this.editorService = editorService;
		this.onDidActiveTextEditorControlChange = Event.None;
	}
	get activeTextEditorControl() {
		return this.editorService.getFocusedCodeEditor() ?? void 0;
	}
};
StandaloneGotoLineQuickAccessProvider = __decorate$5([__param$5(0, ICodeEditorService)], StandaloneGotoLineQuickAccessProvider);
var GotoLineAction$1 = class GotoLineAction$1 extends EditorAction {
	static {
		this.ID = "editor.action.gotoLine";
	}
	constructor() {
		super({
			id: GotoLineAction$1.ID,
			label: GoToLineNLS.gotoLineActionLabel,
			alias: "Go to Line/Column...",
			precondition: void 0,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: 2085,
				mac: { primary: 293 },
				weight: 100
			}
		});
	}
	run(accessor) {
		accessor.get(IQuickInputService).quickAccess.show(StandaloneGotoLineQuickAccessProvider.PREFIX);
	}
};
registerEditorAction(GotoLineAction$1);
Registry.as(Extensions.Quickaccess).registerQuickAccessProvider({
	ctor: StandaloneGotoLineQuickAccessProvider,
	prefix: StandaloneGotoLineQuickAccessProvider.PREFIX,
	helpEntries: [{
		description: GoToLineNLS.gotoLineActionLabel,
		commandId: GotoLineAction$1.ID
	}]
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/base/common/fuzzyScorer.js
var NO_SCORE2 = [void 0, []];
function scoreFuzzy2(target, query, patternStart = 0, wordStart = 0) {
	const preparedQuery = query;
	if (preparedQuery.values && preparedQuery.values.length > 1) return doScoreFuzzy2Multiple(target, preparedQuery.values, patternStart, wordStart);
	return doScoreFuzzy2Single(target, query, patternStart, wordStart);
}
function doScoreFuzzy2Multiple(target, query, patternStart, wordStart) {
	let totalScore = 0;
	const totalMatches = [];
	for (const queryPiece of query) {
		const [score, matches] = doScoreFuzzy2Single(target, queryPiece, patternStart, wordStart);
		if (typeof score !== "number") return NO_SCORE2;
		totalScore += score;
		totalMatches.push(...matches);
	}
	return [totalScore, normalizeMatches(totalMatches)];
}
function doScoreFuzzy2Single(target, query, patternStart, wordStart) {
	const score = fuzzyScore(query.original, query.originalLowercase, patternStart, target, target.toLowerCase(), wordStart, {
		firstMatchCanBeWeak: true,
		boostFullMatch: true
	});
	if (!score) return NO_SCORE2;
	return [score[0], createMatches(score)];
}
Object.freeze({ score: 0 });
function normalizeMatches(matches) {
	const sortedMatches = matches.sort((matchA, matchB) => {
		return matchA.start - matchB.start;
	});
	const normalizedMatches = [];
	let currentMatch = void 0;
	for (const match of sortedMatches) if (!currentMatch || !matchOverlaps(currentMatch, match)) {
		currentMatch = match;
		normalizedMatches.push(match);
	} else {
		currentMatch.start = Math.min(currentMatch.start, match.start);
		currentMatch.end = Math.max(currentMatch.end, match.end);
	}
	return normalizedMatches;
}
function matchOverlaps(matchA, matchB) {
	if (matchA.end < matchB.start) return false;
	if (matchB.end < matchA.start) return false;
	return true;
}
function queryExpectsExactMatch(query) {
	return query.startsWith("\"") && query.endsWith("\"");
}
/**
* Helper function to prepare a search value for scoring by removing unwanted characters
* and allowing to score on multiple pieces separated by whitespace character.
*/
var MULTIPLE_QUERY_VALUES_SEPARATOR = " ";
function prepareQuery(original) {
	if (typeof original !== "string") original = "";
	const originalLowercase = original.toLowerCase();
	const { pathNormalized, normalized, normalizedLowercase } = normalizeQuery(original);
	const containsPathSeparator = pathNormalized.indexOf(sep) >= 0;
	const expectExactMatch = queryExpectsExactMatch(original);
	let values = void 0;
	const originalSplit = original.split(MULTIPLE_QUERY_VALUES_SEPARATOR);
	if (originalSplit.length > 1) for (const originalPiece of originalSplit) {
		const expectExactMatchPiece = queryExpectsExactMatch(originalPiece);
		const { pathNormalized: pathNormalizedPiece, normalized: normalizedPiece, normalizedLowercase: normalizedLowercasePiece } = normalizeQuery(originalPiece);
		if (normalizedPiece) {
			if (!values) values = [];
			values.push({
				original: originalPiece,
				originalLowercase: originalPiece.toLowerCase(),
				pathNormalized: pathNormalizedPiece,
				normalized: normalizedPiece,
				normalizedLowercase: normalizedLowercasePiece,
				expectContiguousMatch: expectExactMatchPiece
			});
		}
	}
	return {
		original,
		originalLowercase,
		pathNormalized,
		normalized,
		normalizedLowercase,
		values,
		containsPathSeparator,
		expectContiguousMatch: expectExactMatch
	};
}
function normalizeQuery(original) {
	let pathNormalized;
	if (isWindows) pathNormalized = original.replace(/\//g, sep);
	else pathNormalized = original.replace(/\\/g, sep);
	const normalized = stripWildcards(pathNormalized).replace(/\s|"/g, "");
	return {
		pathNormalized,
		normalized,
		normalizedLowercase: normalized.toLowerCase()
	};
}
function pieceToQuery(arg1) {
	if (Array.isArray(arg1)) return prepareQuery(arg1.map((piece) => piece.original).join(MULTIPLE_QUERY_VALUES_SEPARATOR));
	return prepareQuery(arg1.original);
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/contrib/quickAccess/browser/gotoSymbolQuickAccess.js
var __decorate$4 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$4 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var AbstractGotoSymbolQuickAccessProvider_1;
var AbstractGotoSymbolQuickAccessProvider = class AbstractGotoSymbolQuickAccessProvider$1 extends AbstractEditorNavigationQuickAccessProvider {
	static {
		AbstractGotoSymbolQuickAccessProvider_1 = this;
	}
	static {
		this.PREFIX = "@";
	}
	static {
		this.SCOPE_PREFIX = ":";
	}
	static {
		this.PREFIX_BY_CATEGORY = `${this.PREFIX}${this.SCOPE_PREFIX}`;
	}
	constructor(_languageFeaturesService, _outlineModelService, options = Object.create(null)) {
		super(options);
		this._languageFeaturesService = _languageFeaturesService;
		this._outlineModelService = _outlineModelService;
		this.options = options;
		this.options.canAcceptInBackground = true;
	}
	provideWithoutTextEditor(picker) {
		this.provideLabelPick(picker, localize("cannotRunGotoSymbolWithoutEditor", "To go to a symbol, first open a text editor with symbol information."));
		return Disposable.None;
	}
	provideWithTextEditor(context, picker, token, runOptions) {
		const editor$1 = context.editor;
		const model = this.getModel(editor$1);
		if (!model) return Disposable.None;
		if (this._languageFeaturesService.documentSymbolProvider.has(model)) return this.doProvideWithEditorSymbols(context, model, picker, token, runOptions);
		return this.doProvideWithoutEditorSymbols(context, model, picker, token);
	}
	doProvideWithoutEditorSymbols(context, model, picker, token) {
		const disposables = new DisposableStore();
		this.provideLabelPick(picker, localize("cannotRunGotoSymbolWithoutSymbolProvider", "The active text editor does not provide symbol information."));
		(async () => {
			if (!await this.waitForLanguageSymbolRegistry(model, disposables) || token.isCancellationRequested) return;
			disposables.add(this.doProvideWithEditorSymbols(context, model, picker, token));
		})();
		return disposables;
	}
	provideLabelPick(picker, label) {
		picker.items = [{
			label,
			index: 0,
			kind: 14
		}];
		picker.ariaLabel = label;
	}
	async waitForLanguageSymbolRegistry(model, disposables) {
		if (this._languageFeaturesService.documentSymbolProvider.has(model)) return true;
		const symbolProviderRegistryPromise = new DeferredPromise();
		const symbolProviderListener = disposables.add(this._languageFeaturesService.documentSymbolProvider.onDidChange(() => {
			if (this._languageFeaturesService.documentSymbolProvider.has(model)) {
				symbolProviderListener.dispose();
				symbolProviderRegistryPromise.complete(true);
			}
		}));
		disposables.add(toDisposable(() => symbolProviderRegistryPromise.complete(false)));
		return symbolProviderRegistryPromise.p;
	}
	doProvideWithEditorSymbols(context, model, picker, token, runOptions) {
		const editor$1 = context.editor;
		const disposables = new DisposableStore();
		disposables.add(picker.onDidAccept((event) => {
			const [item] = picker.selectedItems;
			if (item && item.range) {
				this.gotoLocation(context, {
					range: item.range.selection,
					keyMods: picker.keyMods,
					preserveFocus: event.inBackground
				});
				runOptions?.handleAccept?.(item);
				if (!event.inBackground) picker.hide();
			}
		}));
		disposables.add(picker.onDidTriggerItemButton(({ item }) => {
			if (item && item.range) {
				this.gotoLocation(context, {
					range: item.range.selection,
					keyMods: picker.keyMods,
					forceSideBySide: true
				});
				picker.hide();
			}
		}));
		const symbolsPromise = this.getDocumentSymbols(model, token);
		let picksCts = void 0;
		const updatePickerItems = async (positionToEnclose) => {
			picksCts?.dispose(true);
			picker.busy = false;
			picksCts = new CancellationTokenSource$1(token);
			picker.busy = true;
			try {
				const query = prepareQuery(picker.value.substr(AbstractGotoSymbolQuickAccessProvider_1.PREFIX.length).trim());
				const items = await this.doGetSymbolPicks(symbolsPromise, query, void 0, picksCts.token, model);
				if (token.isCancellationRequested) return;
				if (items.length > 0) {
					picker.items = items;
					if (positionToEnclose && query.original.length === 0) {
						const candidate = findLast(items, (item) => Boolean(item.type !== "separator" && item.range && Range$1.containsPosition(item.range.decoration, positionToEnclose)));
						if (candidate) picker.activeItems = [candidate];
					}
				} else if (query.original.length > 0) this.provideLabelPick(picker, localize("noMatchingSymbolResults", "No matching editor symbols"));
				else this.provideLabelPick(picker, localize("noSymbolResults", "No editor symbols"));
			} finally {
				if (!token.isCancellationRequested) picker.busy = false;
			}
		};
		disposables.add(picker.onDidChangeValue(() => updatePickerItems(void 0)));
		updatePickerItems(editor$1.getSelection()?.getPosition());
		disposables.add(picker.onDidChangeActive(() => {
			const [item] = picker.activeItems;
			if (item && item.range) {
				editor$1.revealRangeInCenter(item.range.selection, 0);
				this.addDecorations(editor$1, item.range.decoration);
			}
		}));
		return disposables;
	}
	async doGetSymbolPicks(symbolsPromise, query, options, token, model) {
		const symbols = await symbolsPromise;
		if (token.isCancellationRequested) return [];
		const filterBySymbolKind = query.original.indexOf(AbstractGotoSymbolQuickAccessProvider_1.SCOPE_PREFIX) === 0;
		const filterPos = filterBySymbolKind ? 1 : 0;
		let symbolQuery;
		let containerQuery;
		if (query.values && query.values.length > 1) {
			symbolQuery = pieceToQuery(query.values[0]);
			containerQuery = pieceToQuery(query.values.slice(1));
		} else symbolQuery = query;
		let buttons;
		const openSideBySideDirection = this.options?.openSideBySideDirection?.();
		if (openSideBySideDirection) buttons = [{
			iconClass: openSideBySideDirection === "right" ? ThemeIcon.asClassName(Codicon.splitHorizontal) : ThemeIcon.asClassName(Codicon.splitVertical),
			tooltip: openSideBySideDirection === "right" ? localize("openToSide", "Open to the Side") : localize("openToBottom", "Open to the Bottom")
		}];
		const filteredSymbolPicks = [];
		for (let index = 0; index < symbols.length; index++) {
			const symbol = symbols[index];
			const symbolLabel = trim(symbol.name);
			const symbolLabelWithIcon = `$(${SymbolKinds.toIcon(symbol.kind).id}) ${symbolLabel}`;
			const symbolLabelIconOffset = symbolLabelWithIcon.length - symbolLabel.length;
			let containerLabel = symbol.containerName;
			if (options?.extraContainerLabel) if (containerLabel) containerLabel = `${options.extraContainerLabel} • ${containerLabel}`;
			else containerLabel = options.extraContainerLabel;
			let symbolScore = void 0;
			let symbolMatches = void 0;
			let containerScore = void 0;
			let containerMatches = void 0;
			if (query.original.length > filterPos) {
				let skipContainerQuery = false;
				if (symbolQuery !== query) {
					[symbolScore, symbolMatches] = scoreFuzzy2(symbolLabelWithIcon, {
						...query,
						values: void 0
					}, filterPos, symbolLabelIconOffset);
					if (typeof symbolScore === "number") skipContainerQuery = true;
				}
				if (typeof symbolScore !== "number") {
					[symbolScore, symbolMatches] = scoreFuzzy2(symbolLabelWithIcon, symbolQuery, filterPos, symbolLabelIconOffset);
					if (typeof symbolScore !== "number") continue;
				}
				if (!skipContainerQuery && containerQuery) {
					if (containerLabel && containerQuery.original.length > 0) [containerScore, containerMatches] = scoreFuzzy2(containerLabel, containerQuery);
					if (typeof containerScore !== "number") continue;
					if (typeof symbolScore === "number") symbolScore += containerScore;
				}
			}
			const deprecated = symbol.tags && symbol.tags.indexOf(1) >= 0;
			filteredSymbolPicks.push({
				index,
				kind: symbol.kind,
				score: symbolScore,
				label: symbolLabelWithIcon,
				ariaLabel: getAriaLabelForSymbol(symbol.name, symbol.kind),
				description: containerLabel,
				highlights: deprecated ? void 0 : {
					label: symbolMatches,
					description: containerMatches
				},
				range: {
					selection: Range$1.collapseToStart(symbol.selectionRange),
					decoration: symbol.range
				},
				uri: model.uri,
				symbolName: symbolLabel,
				strikethrough: deprecated,
				buttons
			});
		}
		const sortedFilteredSymbolPicks = filteredSymbolPicks.sort((symbolA, symbolB) => filterBySymbolKind ? this.compareByKindAndScore(symbolA, symbolB) : this.compareByScore(symbolA, symbolB));
		let symbolPicks = [];
		if (filterBySymbolKind) {
			let lastSymbolKind = void 0;
			let lastSeparator = void 0;
			let lastSymbolKindCounter = 0;
			function updateLastSeparatorLabel() {
				if (lastSeparator && typeof lastSymbolKind === "number" && lastSymbolKindCounter > 0) lastSeparator.label = format(NLS_SYMBOL_KIND_CACHE[lastSymbolKind] || FALLBACK_NLS_SYMBOL_KIND, lastSymbolKindCounter);
			}
			for (const symbolPick of sortedFilteredSymbolPicks) {
				if (lastSymbolKind !== symbolPick.kind) {
					updateLastSeparatorLabel();
					lastSymbolKind = symbolPick.kind;
					lastSymbolKindCounter = 1;
					lastSeparator = { type: "separator" };
					symbolPicks.push(lastSeparator);
				} else lastSymbolKindCounter++;
				symbolPicks.push(symbolPick);
			}
			updateLastSeparatorLabel();
		} else if (sortedFilteredSymbolPicks.length > 0) symbolPicks = [{
			label: localize("symbols", "symbols ({0})", filteredSymbolPicks.length),
			type: "separator"
		}, ...sortedFilteredSymbolPicks];
		return symbolPicks;
	}
	compareByScore(symbolA, symbolB) {
		if (typeof symbolA.score !== "number" && typeof symbolB.score === "number") return 1;
		else if (typeof symbolA.score === "number" && typeof symbolB.score !== "number") return -1;
		if (typeof symbolA.score === "number" && typeof symbolB.score === "number") {
			if (symbolA.score > symbolB.score) return -1;
			else if (symbolA.score < symbolB.score) return 1;
		}
		if (symbolA.index < symbolB.index) return -1;
		else if (symbolA.index > symbolB.index) return 1;
		return 0;
	}
	compareByKindAndScore(symbolA, symbolB) {
		const kindA = NLS_SYMBOL_KIND_CACHE[symbolA.kind] || FALLBACK_NLS_SYMBOL_KIND;
		const kindB = NLS_SYMBOL_KIND_CACHE[symbolB.kind] || FALLBACK_NLS_SYMBOL_KIND;
		const result = kindA.localeCompare(kindB);
		if (result === 0) return this.compareByScore(symbolA, symbolB);
		return result;
	}
	async getDocumentSymbols(document$1, token) {
		const model = await this._outlineModelService.getOrCreate(document$1, token);
		return token.isCancellationRequested ? [] : model.asListOfDocumentSymbols();
	}
};
AbstractGotoSymbolQuickAccessProvider = AbstractGotoSymbolQuickAccessProvider_1 = __decorate$4([__param$4(0, ILanguageFeaturesService), __param$4(1, IOutlineModelService)], AbstractGotoSymbolQuickAccessProvider);
var FALLBACK_NLS_SYMBOL_KIND = localize("property", "properties ({0})");
var NLS_SYMBOL_KIND_CACHE = {
	[5]: localize("method", "methods ({0})"),
	[11]: localize("function", "functions ({0})"),
	[8]: localize("_constructor", "constructors ({0})"),
	[12]: localize("variable", "variables ({0})"),
	[4]: localize("class", "classes ({0})"),
	[22]: localize("struct", "structs ({0})"),
	[23]: localize("event", "events ({0})"),
	[24]: localize("operator", "operators ({0})"),
	[10]: localize("interface", "interfaces ({0})"),
	[2]: localize("namespace", "namespaces ({0})"),
	[3]: localize("package", "packages ({0})"),
	[25]: localize("typeParameter", "type parameters ({0})"),
	[1]: localize("modules", "modules ({0})"),
	[6]: localize("property", "properties ({0})"),
	[9]: localize("enum", "enumerations ({0})"),
	[21]: localize("enumMember", "enumeration members ({0})"),
	[14]: localize("string", "strings ({0})"),
	[0]: localize("file", "files ({0})"),
	[17]: localize("array", "arrays ({0})"),
	[15]: localize("number", "numbers ({0})"),
	[16]: localize("boolean", "booleans ({0})"),
	[18]: localize("object", "objects ({0})"),
	[19]: localize("key", "keys ({0})"),
	[7]: localize("field", "fields ({0})"),
	[13]: localize("constant", "constants ({0})")
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js
var __decorate$3 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$3 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var StandaloneGotoSymbolQuickAccessProvider = class StandaloneGotoSymbolQuickAccessProvider$1 extends AbstractGotoSymbolQuickAccessProvider {
	constructor(editorService, languageFeaturesService, outlineModelService) {
		super(languageFeaturesService, outlineModelService);
		this.editorService = editorService;
		this.onDidActiveTextEditorControlChange = Event.None;
	}
	get activeTextEditorControl() {
		return this.editorService.getFocusedCodeEditor() ?? void 0;
	}
};
StandaloneGotoSymbolQuickAccessProvider = __decorate$3([
	__param$3(0, ICodeEditorService),
	__param$3(1, ILanguageFeaturesService),
	__param$3(2, IOutlineModelService)
], StandaloneGotoSymbolQuickAccessProvider);
var GotoSymbolAction = class GotoSymbolAction extends EditorAction {
	static {
		this.ID = "editor.action.quickOutline";
	}
	constructor() {
		super({
			id: GotoSymbolAction.ID,
			label: QuickOutlineNLS.quickOutlineActionLabel,
			alias: "Go to Symbol...",
			precondition: EditorContextKeys.hasDocumentSymbolProvider,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: 3117,
				weight: 100
			},
			contextMenuOpts: {
				group: "navigation",
				order: 3
			}
		});
	}
	run(accessor) {
		accessor.get(IQuickInputService).quickAccess.show(AbstractGotoSymbolQuickAccessProvider.PREFIX, { itemActivation: ItemActivation.NONE });
	}
};
registerEditorAction(GotoSymbolAction);
Registry.as(Extensions.Quickaccess).registerQuickAccessProvider({
	ctor: StandaloneGotoSymbolQuickAccessProvider,
	prefix: AbstractGotoSymbolQuickAccessProvider.PREFIX,
	helpEntries: [{
		description: QuickOutlineNLS.quickOutlineActionLabel,
		prefix: AbstractGotoSymbolQuickAccessProvider.PREFIX,
		commandId: GotoSymbolAction.ID
	}, {
		description: QuickOutlineNLS.quickOutlineByCategoryActionLabel,
		prefix: AbstractGotoSymbolQuickAccessProvider.PREFIX_BY_CATEGORY
	}]
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/base/common/tfIdf.js
function countMapFrom(values) {
	const map = /* @__PURE__ */ new Map();
	for (const value of values) map.set(value, (map.get(value) ?? 0) + 1);
	return map;
}
/**
* Implementation of tf-idf (term frequency-inverse document frequency) for a set of
* documents where each document contains one or more chunks of text.
* Each document is identified by a key, and the score for each document is computed
* by taking the max score over all the chunks in the document.
*/
var TfIdfCalculator = class TfIdfCalculator {
	constructor() {
		/**
		* Total number of chunks
		*/
		this.chunkCount = 0;
		this.chunkOccurrences = /* @__PURE__ */ new Map();
		this.documents = /* @__PURE__ */ new Map();
	}
	calculateScores(query, token) {
		const embedding = this.computeEmbedding(query);
		const idfCache = /* @__PURE__ */ new Map();
		const scores = [];
		for (const [key, doc] of this.documents) {
			if (token.isCancellationRequested) return [];
			for (const chunk of doc.chunks) {
				const score = this.computeSimilarityScore(chunk, embedding, idfCache);
				if (score > 0) scores.push({
					key,
					score
				});
			}
		}
		return scores;
	}
	/**
	* Count how many times each term (word) appears in a string.
	*/
	static termFrequencies(input) {
		return countMapFrom(TfIdfCalculator.splitTerms(input));
	}
	/**
	* Break a string into terms (words).
	*/
	static *splitTerms(input) {
		const normalize = (word) => word.toLowerCase();
		for (const [word] of input.matchAll(/\b\p{Letter}[\p{Letter}\d]{2,}\b/gu)) {
			yield normalize(word);
			const camelParts = word.replace(/([a-z])([A-Z])/g, "$1 $2").split(/\s+/g);
			if (camelParts.length > 1) {
				for (const part of camelParts) if (part.length > 2 && /\p{Letter}{3,}/gu.test(part)) yield normalize(part);
			}
		}
	}
	updateDocuments(documents) {
		for (const { key } of documents) this.deleteDocument(key);
		for (const doc of documents) {
			const chunks = [];
			for (const text of doc.textChunks) {
				const tf = TfIdfCalculator.termFrequencies(text);
				for (const term of tf.keys()) this.chunkOccurrences.set(term, (this.chunkOccurrences.get(term) ?? 0) + 1);
				chunks.push({
					text,
					tf
				});
			}
			this.chunkCount += chunks.length;
			this.documents.set(doc.key, { chunks });
		}
		return this;
	}
	deleteDocument(key) {
		const doc = this.documents.get(key);
		if (!doc) return;
		this.documents.delete(key);
		this.chunkCount -= doc.chunks.length;
		for (const chunk of doc.chunks) for (const term of chunk.tf.keys()) {
			const currentOccurrences = this.chunkOccurrences.get(term);
			if (typeof currentOccurrences === "number") {
				const newOccurrences = currentOccurrences - 1;
				if (newOccurrences <= 0) this.chunkOccurrences.delete(term);
				else this.chunkOccurrences.set(term, newOccurrences);
			}
		}
	}
	computeSimilarityScore(chunk, queryEmbedding, idfCache) {
		let sum = 0;
		for (const [term, termTfidf] of Object.entries(queryEmbedding)) {
			const chunkTf = chunk.tf.get(term);
			if (!chunkTf) continue;
			let chunkIdf = idfCache.get(term);
			if (typeof chunkIdf !== "number") {
				chunkIdf = this.computeIdf(term);
				idfCache.set(term, chunkIdf);
			}
			const chunkTfidf = chunkTf * chunkIdf;
			sum += chunkTfidf * termTfidf;
		}
		return sum;
	}
	computeEmbedding(input) {
		const tf = TfIdfCalculator.termFrequencies(input);
		return this.computeTfidf(tf);
	}
	computeIdf(term) {
		const chunkOccurrences = this.chunkOccurrences.get(term) ?? 0;
		return chunkOccurrences > 0 ? Math.log((this.chunkCount + 1) / chunkOccurrences) : 0;
	}
	computeTfidf(termFrequencies) {
		const embedding = Object.create(null);
		for (const [word, occurrences] of termFrequencies) {
			const idf = this.computeIdf(word);
			if (idf > 0) embedding[word] = occurrences * idf;
		}
		return embedding;
	}
};
/**
* Normalize the scores to be between 0 and 1 and sort them decending.
* @param scores array of scores from {@link TfIdfCalculator.calculateScores}
* @returns normalized scores
*/
function normalizeTfIdfScores(scores) {
	const result = scores.slice(0);
	result.sort((a, b) => b.score - a.score);
	const max = result[0]?.score ?? 0;
	if (max > 0) for (const score of result) score.score /= max;
	return result;
}

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/quickinput/browser/pickerQuickAccess.js
var TriggerAction;
(function(TriggerAction$1) {
	/**
	* Do nothing after the button was clicked.
	*/
	TriggerAction$1[TriggerAction$1["NO_ACTION"] = 0] = "NO_ACTION";
	/**
	* Close the picker.
	*/
	TriggerAction$1[TriggerAction$1["CLOSE_PICKER"] = 1] = "CLOSE_PICKER";
	/**
	* Update the results of the picker.
	*/
	TriggerAction$1[TriggerAction$1["REFRESH_PICKER"] = 2] = "REFRESH_PICKER";
	/**
	* Remove the item from the picker.
	*/
	TriggerAction$1[TriggerAction$1["REMOVE_ITEM"] = 3] = "REMOVE_ITEM";
})(TriggerAction || (TriggerAction = {}));
function isPicksWithActive(obj) {
	const candidate = obj;
	return Array.isArray(candidate.items);
}
function isFastAndSlowPicks(obj) {
	const candidate = obj;
	return !!candidate.picks && candidate.additionalPicks instanceof Promise;
}
var PickerQuickAccessProvider = class extends Disposable {
	constructor(prefix, options) {
		super();
		this.prefix = prefix;
		this.options = options;
	}
	provide(picker, token, runOptions) {
		const disposables = new DisposableStore();
		picker.canAcceptInBackground = !!this.options?.canAcceptInBackground;
		picker.matchOnLabel = picker.matchOnDescription = picker.matchOnDetail = picker.sortByLabel = false;
		let picksCts = void 0;
		const picksDisposable = disposables.add(new MutableDisposable());
		const updatePickerItems = async () => {
			const picksDisposables = picksDisposable.value = new DisposableStore();
			picksCts?.dispose(true);
			picker.busy = false;
			picksCts = new CancellationTokenSource$1(token);
			const picksToken = picksCts.token;
			let picksFilter = picker.value.substring(this.prefix.length);
			if (!this.options?.shouldSkipTrimPickFilter) picksFilter = picksFilter.trim();
			const providedPicks = this._getPicks(picksFilter, picksDisposables, picksToken, runOptions);
			const applyPicks = (picks, skipEmpty) => {
				let items;
				let activeItem = void 0;
				if (isPicksWithActive(picks)) {
					items = picks.items;
					activeItem = picks.active;
				} else items = picks;
				if (items.length === 0) {
					if (skipEmpty) return false;
					if ((picksFilter.length > 0 || picker.hideInput) && this.options?.noResultsPick) if (isFunction(this.options.noResultsPick)) items = [this.options.noResultsPick(picksFilter)];
					else items = [this.options.noResultsPick];
				}
				picker.items = items;
				if (activeItem) picker.activeItems = [activeItem];
				return true;
			};
			const applyFastAndSlowPicks = async (fastAndSlowPicks) => {
				let fastPicksApplied = false;
				let slowPicksApplied = false;
				await Promise.all([(async () => {
					if (typeof fastAndSlowPicks.mergeDelay === "number") {
						await timeout(fastAndSlowPicks.mergeDelay);
						if (picksToken.isCancellationRequested) return;
					}
					if (!slowPicksApplied) fastPicksApplied = applyPicks(fastAndSlowPicks.picks, true);
				})(), (async () => {
					picker.busy = true;
					try {
						const awaitedAdditionalPicks = await fastAndSlowPicks.additionalPicks;
						if (picksToken.isCancellationRequested) return;
						let picks;
						let activePick = void 0;
						if (isPicksWithActive(fastAndSlowPicks.picks)) {
							picks = fastAndSlowPicks.picks.items;
							activePick = fastAndSlowPicks.picks.active;
						} else picks = fastAndSlowPicks.picks;
						let additionalPicks;
						let additionalActivePick = void 0;
						if (isPicksWithActive(awaitedAdditionalPicks)) {
							additionalPicks = awaitedAdditionalPicks.items;
							additionalActivePick = awaitedAdditionalPicks.active;
						} else additionalPicks = awaitedAdditionalPicks;
						if (additionalPicks.length > 0 || !fastPicksApplied) {
							let fallbackActivePick = void 0;
							if (!activePick && !additionalActivePick) {
								const fallbackActivePickCandidate = picker.activeItems[0];
								if (fallbackActivePickCandidate && picks.indexOf(fallbackActivePickCandidate) !== -1) fallbackActivePick = fallbackActivePickCandidate;
							}
							applyPicks({
								items: [...picks, ...additionalPicks],
								active: activePick || additionalActivePick || fallbackActivePick
							});
						}
					} finally {
						if (!picksToken.isCancellationRequested) picker.busy = false;
						slowPicksApplied = true;
					}
				})()]);
			};
			if (providedPicks === null) {} else if (isFastAndSlowPicks(providedPicks)) await applyFastAndSlowPicks(providedPicks);
			else if (!(providedPicks instanceof Promise)) applyPicks(providedPicks);
			else {
				picker.busy = true;
				try {
					const awaitedPicks = await providedPicks;
					if (picksToken.isCancellationRequested) return;
					if (isFastAndSlowPicks(awaitedPicks)) await applyFastAndSlowPicks(awaitedPicks);
					else applyPicks(awaitedPicks);
				} finally {
					if (!picksToken.isCancellationRequested) picker.busy = false;
				}
			}
		};
		disposables.add(picker.onDidChangeValue(() => updatePickerItems()));
		updatePickerItems();
		disposables.add(picker.onDidAccept((event) => {
			if (runOptions?.handleAccept) {
				if (!event.inBackground) picker.hide();
				runOptions.handleAccept?.(picker.activeItems[0]);
				return;
			}
			const [item] = picker.selectedItems;
			if (typeof item?.accept === "function") {
				if (!event.inBackground) picker.hide();
				item.accept(picker.keyMods, event);
			}
		}));
		const buttonTrigger = async (button, item) => {
			if (typeof item.trigger !== "function") return;
			const buttonIndex = item.buttons?.indexOf(button) ?? -1;
			if (buttonIndex >= 0) {
				const result = item.trigger(buttonIndex, picker.keyMods);
				const action = typeof result === "number" ? result : await result;
				if (token.isCancellationRequested) return;
				switch (action) {
					case TriggerAction.NO_ACTION: break;
					case TriggerAction.CLOSE_PICKER:
						picker.hide();
						break;
					case TriggerAction.REFRESH_PICKER:
						updatePickerItems();
						break;
					case TriggerAction.REMOVE_ITEM: {
						const index = picker.items.indexOf(item);
						if (index !== -1) {
							const items = picker.items.slice();
							const removed = items.splice(index, 1);
							const activeItems = picker.activeItems.filter((activeItem) => activeItem !== removed[0]);
							const keepScrollPositionBefore = picker.keepScrollPosition;
							picker.keepScrollPosition = true;
							picker.items = items;
							if (activeItems) picker.activeItems = activeItems;
							picker.keepScrollPosition = keepScrollPositionBefore;
						}
						break;
					}
				}
			}
		};
		disposables.add(picker.onDidTriggerItemButton(({ button, item }) => buttonTrigger(button, item)));
		disposables.add(picker.onDidTriggerSeparatorButton(({ button, separator }) => buttonTrigger(button, separator)));
		return disposables;
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/platform/quickinput/browser/commandsQuickAccess.js
var __decorate$2 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$2 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var AbstractCommandsQuickAccessProvider_1, CommandsHistory_1;
var AbstractCommandsQuickAccessProvider = class AbstractCommandsQuickAccessProvider$1 extends PickerQuickAccessProvider {
	static {
		AbstractCommandsQuickAccessProvider_1 = this;
	}
	static {
		this.PREFIX = ">";
	}
	static {
		this.TFIDF_THRESHOLD = .5;
	}
	static {
		this.TFIDF_MAX_RESULTS = 5;
	}
	static {
		this.WORD_FILTER = or(matchesPrefix, matchesWords, matchesContiguousSubString);
	}
	constructor(options, instantiationService, keybindingService, commandService, telemetryService, dialogService) {
		super(AbstractCommandsQuickAccessProvider_1.PREFIX, options);
		this.instantiationService = instantiationService;
		this.keybindingService = keybindingService;
		this.commandService = commandService;
		this.telemetryService = telemetryService;
		this.dialogService = dialogService;
		this.commandsHistory = this._register(this.instantiationService.createInstance(CommandsHistory));
		this.options = options;
	}
	async _getPicks(filter, _disposables, token, runOptions) {
		const allCommandPicks = await this.getCommandPicks(token);
		if (token.isCancellationRequested) return [];
		const runTfidf = createSingleCallFunction(() => {
			const tfidf = new TfIdfCalculator();
			tfidf.updateDocuments(allCommandPicks.map((commandPick) => ({
				key: commandPick.commandId,
				textChunks: [this.getTfIdfChunk(commandPick)]
			})));
			const result = tfidf.calculateScores(filter, token);
			return normalizeTfIdfScores(result).filter((score) => score.score > AbstractCommandsQuickAccessProvider_1.TFIDF_THRESHOLD).slice(0, AbstractCommandsQuickAccessProvider_1.TFIDF_MAX_RESULTS);
		});
		const filteredCommandPicks = [];
		for (const commandPick of allCommandPicks) {
			const labelHighlights = AbstractCommandsQuickAccessProvider_1.WORD_FILTER(filter, commandPick.label) ?? void 0;
			const aliasHighlights = commandPick.commandAlias ? AbstractCommandsQuickAccessProvider_1.WORD_FILTER(filter, commandPick.commandAlias) ?? void 0 : void 0;
			if (labelHighlights || aliasHighlights) {
				commandPick.highlights = {
					label: labelHighlights,
					detail: this.options.showAlias ? aliasHighlights : void 0
				};
				filteredCommandPicks.push(commandPick);
			} else if (filter === commandPick.commandId) filteredCommandPicks.push(commandPick);
			else if (filter.length >= 3) {
				const tfidf = runTfidf();
				if (token.isCancellationRequested) return [];
				const tfidfScore = tfidf.find((score) => score.key === commandPick.commandId);
				if (tfidfScore) {
					commandPick.tfIdfScore = tfidfScore.score;
					filteredCommandPicks.push(commandPick);
				}
			}
		}
		const mapLabelToCommand = /* @__PURE__ */ new Map();
		for (const commandPick of filteredCommandPicks) {
			const existingCommandForLabel = mapLabelToCommand.get(commandPick.label);
			if (existingCommandForLabel) {
				commandPick.description = commandPick.commandId;
				existingCommandForLabel.description = existingCommandForLabel.commandId;
			} else mapLabelToCommand.set(commandPick.label, commandPick);
		}
		filteredCommandPicks.sort((commandPickA, commandPickB) => {
			if (commandPickA.tfIdfScore && commandPickB.tfIdfScore) {
				if (commandPickA.tfIdfScore === commandPickB.tfIdfScore) return commandPickA.label.localeCompare(commandPickB.label);
				return commandPickB.tfIdfScore - commandPickA.tfIdfScore;
			} else if (commandPickA.tfIdfScore) return 1;
			else if (commandPickB.tfIdfScore) return -1;
			const commandACounter = this.commandsHistory.peek(commandPickA.commandId);
			const commandBCounter = this.commandsHistory.peek(commandPickB.commandId);
			if (commandACounter && commandBCounter) return commandACounter > commandBCounter ? -1 : 1;
			if (commandACounter) return -1;
			if (commandBCounter) return 1;
			if (this.options.suggestedCommandIds) {
				const commandASuggestion = this.options.suggestedCommandIds.has(commandPickA.commandId);
				const commandBSuggestion = this.options.suggestedCommandIds.has(commandPickB.commandId);
				if (commandASuggestion && commandBSuggestion) return 0;
				if (commandASuggestion) return -1;
				if (commandBSuggestion) return 1;
			}
			return commandPickA.label.localeCompare(commandPickB.label);
		});
		const commandPicks = [];
		let addOtherSeparator = false;
		let addSuggestedSeparator = true;
		let addCommonlyUsedSeparator = !!this.options.suggestedCommandIds;
		for (let i = 0; i < filteredCommandPicks.length; i++) {
			const commandPick = filteredCommandPicks[i];
			if (i === 0 && this.commandsHistory.peek(commandPick.commandId)) {
				commandPicks.push({
					type: "separator",
					label: localize("recentlyUsed", "recently used")
				});
				addOtherSeparator = true;
			}
			if (addSuggestedSeparator && commandPick.tfIdfScore !== void 0) {
				commandPicks.push({
					type: "separator",
					label: localize("suggested", "similar commands")
				});
				addSuggestedSeparator = false;
			}
			if (addCommonlyUsedSeparator && commandPick.tfIdfScore === void 0 && !this.commandsHistory.peek(commandPick.commandId) && this.options.suggestedCommandIds?.has(commandPick.commandId)) {
				commandPicks.push({
					type: "separator",
					label: localize("commonlyUsed", "commonly used")
				});
				addOtherSeparator = true;
				addCommonlyUsedSeparator = false;
			}
			if (addOtherSeparator && commandPick.tfIdfScore === void 0 && !this.commandsHistory.peek(commandPick.commandId) && !this.options.suggestedCommandIds?.has(commandPick.commandId)) {
				commandPicks.push({
					type: "separator",
					label: localize("morecCommands", "other commands")
				});
				addOtherSeparator = false;
			}
			commandPicks.push(this.toCommandPick(commandPick, runOptions));
		}
		if (!this.hasAdditionalCommandPicks(filter, token)) return commandPicks;
		return {
			picks: commandPicks,
			additionalPicks: (async () => {
				const additionalCommandPicks = await this.getAdditionalCommandPicks(allCommandPicks, filteredCommandPicks, filter, token);
				if (token.isCancellationRequested) return [];
				const commandPicks$1 = additionalCommandPicks.map((commandPick) => this.toCommandPick(commandPick, runOptions));
				if (addSuggestedSeparator && commandPicks$1[0]?.type !== "separator") commandPicks$1.unshift({
					type: "separator",
					label: localize("suggested", "similar commands")
				});
				return commandPicks$1;
			})()
		};
	}
	toCommandPick(commandPick, runOptions) {
		if (commandPick.type === "separator") return commandPick;
		const keybinding = this.keybindingService.lookupKeybinding(commandPick.commandId);
		const ariaLabel = keybinding ? localize("commandPickAriaLabelWithKeybinding", "{0}, {1}", commandPick.label, keybinding.getAriaLabel()) : commandPick.label;
		return {
			...commandPick,
			ariaLabel,
			detail: this.options.showAlias && commandPick.commandAlias !== commandPick.label ? commandPick.commandAlias : void 0,
			keybinding,
			accept: async () => {
				this.commandsHistory.push(commandPick.commandId);
				this.telemetryService.publicLog2("workbenchActionExecuted", {
					id: commandPick.commandId,
					from: runOptions?.from ?? "quick open"
				});
				try {
					commandPick.args?.length ? await this.commandService.executeCommand(commandPick.commandId, ...commandPick.args) : await this.commandService.executeCommand(commandPick.commandId);
				} catch (error) {
					if (!isCancellationError(error)) this.dialogService.error(localize("canNotRun", "Command '{0}' resulted in an error", commandPick.label), toErrorMessage(error));
				}
			}
		};
	}
	getTfIdfChunk({ label, commandAlias, commandDescription }) {
		let chunk = label;
		if (commandAlias && commandAlias !== label) chunk += ` - ${commandAlias}`;
		if (commandDescription && commandDescription.value !== label) chunk += ` - ${commandDescription.value === commandDescription.original ? commandDescription.value : `${commandDescription.value} (${commandDescription.original})`}`;
		return chunk;
	}
};
AbstractCommandsQuickAccessProvider = AbstractCommandsQuickAccessProvider_1 = __decorate$2([
	__param$2(1, IInstantiationService),
	__param$2(2, IKeybindingService),
	__param$2(3, ICommandService),
	__param$2(4, ITelemetryService),
	__param$2(5, IDialogService)
], AbstractCommandsQuickAccessProvider);
var CommandsHistory = class CommandsHistory$1 extends Disposable {
	static {
		CommandsHistory_1 = this;
	}
	static {
		this.DEFAULT_COMMANDS_HISTORY_LENGTH = 50;
	}
	static {
		this.PREF_KEY_CACHE = "commandPalette.mru.cache";
	}
	static {
		this.PREF_KEY_COUNTER = "commandPalette.mru.counter";
	}
	static {
		this.counter = 1;
	}
	static {
		this.hasChanges = false;
	}
	constructor(storageService, configurationService, logService) {
		super();
		this.storageService = storageService;
		this.configurationService = configurationService;
		this.logService = logService;
		this.configuredCommandsHistoryLength = 0;
		this.updateConfiguration();
		this.load();
		this.registerListeners();
	}
	registerListeners() {
		this._register(this.configurationService.onDidChangeConfiguration((e) => this.updateConfiguration(e)));
		this._register(this.storageService.onWillSaveState((e) => {
			if (e.reason === WillSaveStateReason.SHUTDOWN) this.saveState();
		}));
	}
	updateConfiguration(e) {
		if (e && !e.affectsConfiguration("workbench.commandPalette.history")) return;
		this.configuredCommandsHistoryLength = CommandsHistory_1.getConfiguredCommandHistoryLength(this.configurationService);
		if (CommandsHistory_1.cache && CommandsHistory_1.cache.limit !== this.configuredCommandsHistoryLength) {
			CommandsHistory_1.cache.limit = this.configuredCommandsHistoryLength;
			CommandsHistory_1.hasChanges = true;
		}
	}
	load() {
		const raw = this.storageService.get(CommandsHistory_1.PREF_KEY_CACHE, 0);
		let serializedCache;
		if (raw) try {
			serializedCache = JSON.parse(raw);
		} catch (error) {
			this.logService.error(`[CommandsHistory] invalid data: ${error}`);
		}
		const cache = CommandsHistory_1.cache = new LRUCache(this.configuredCommandsHistoryLength, 1);
		if (serializedCache) {
			let entries;
			if (serializedCache.usesLRU) entries = serializedCache.entries;
			else entries = serializedCache.entries.sort((a, b) => a.value - b.value);
			entries.forEach((entry) => cache.set(entry.key, entry.value));
		}
		CommandsHistory_1.counter = this.storageService.getNumber(CommandsHistory_1.PREF_KEY_COUNTER, 0, CommandsHistory_1.counter);
	}
	push(commandId) {
		if (!CommandsHistory_1.cache) return;
		CommandsHistory_1.cache.set(commandId, CommandsHistory_1.counter++);
		CommandsHistory_1.hasChanges = true;
	}
	peek(commandId) {
		return CommandsHistory_1.cache?.peek(commandId);
	}
	saveState() {
		if (!CommandsHistory_1.cache) return;
		if (!CommandsHistory_1.hasChanges) return;
		const serializedCache = {
			usesLRU: true,
			entries: []
		};
		CommandsHistory_1.cache.forEach((value, key) => serializedCache.entries.push({
			key,
			value
		}));
		this.storageService.store(CommandsHistory_1.PREF_KEY_CACHE, JSON.stringify(serializedCache), 0, 0);
		this.storageService.store(CommandsHistory_1.PREF_KEY_COUNTER, CommandsHistory_1.counter, 0, 0);
		CommandsHistory_1.hasChanges = false;
	}
	static getConfiguredCommandHistoryLength(configurationService) {
		const configuredCommandHistoryLength = configurationService.getValue().workbench?.commandPalette?.history;
		if (typeof configuredCommandHistoryLength === "number") return configuredCommandHistoryLength;
		return CommandsHistory_1.DEFAULT_COMMANDS_HISTORY_LENGTH;
	}
};
CommandsHistory = CommandsHistory_1 = __decorate$2([
	__param$2(0, IStorageService),
	__param$2(1, IConfigurationService),
	__param$2(2, ILogService)
], CommandsHistory);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/contrib/quickAccess/browser/commandsQuickAccess.js
var AbstractEditorCommandsQuickAccessProvider = class extends AbstractCommandsQuickAccessProvider {
	constructor(options, instantiationService, keybindingService, commandService, telemetryService, dialogService) {
		super(options, instantiationService, keybindingService, commandService, telemetryService, dialogService);
	}
	getCodeEditorCommandPicks() {
		const activeTextEditorControl = this.activeTextEditorControl;
		if (!activeTextEditorControl) return [];
		const editorCommandPicks = [];
		for (const editorAction of activeTextEditorControl.getSupportedActions()) {
			let commandDescription;
			if (editorAction.metadata?.description) if (isLocalizedString(editorAction.metadata.description)) commandDescription = editorAction.metadata.description;
			else commandDescription = {
				original: editorAction.metadata.description,
				value: editorAction.metadata.description
			};
			editorCommandPicks.push({
				commandId: editorAction.id,
				commandAlias: editorAction.alias,
				commandDescription,
				label: stripIcons(editorAction.label) || editorAction.id
			});
		}
		return editorCommandPicks;
	}
};

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js
var __decorate$1 = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param$1 = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var StandaloneCommandsQuickAccessProvider = class StandaloneCommandsQuickAccessProvider$1 extends AbstractEditorCommandsQuickAccessProvider {
	get activeTextEditorControl() {
		return this.codeEditorService.getFocusedCodeEditor() ?? void 0;
	}
	constructor(instantiationService, codeEditorService, keybindingService, commandService, telemetryService, dialogService) {
		super({ showAlias: false }, instantiationService, keybindingService, commandService, telemetryService, dialogService);
		this.codeEditorService = codeEditorService;
	}
	async getCommandPicks() {
		return this.getCodeEditorCommandPicks();
	}
	hasAdditionalCommandPicks() {
		return false;
	}
	async getAdditionalCommandPicks() {
		return [];
	}
};
StandaloneCommandsQuickAccessProvider = __decorate$1([
	__param$1(0, IInstantiationService),
	__param$1(1, ICodeEditorService),
	__param$1(2, IKeybindingService),
	__param$1(3, ICommandService),
	__param$1(4, ITelemetryService),
	__param$1(5, IDialogService)
], StandaloneCommandsQuickAccessProvider);
var GotoLineAction = class GotoLineAction extends EditorAction {
	static {
		this.ID = "editor.action.quickCommand";
	}
	constructor() {
		super({
			id: GotoLineAction.ID,
			label: QuickCommandNLS.quickCommandActionLabel,
			alias: "Command Palette",
			precondition: void 0,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: 59,
				weight: 100
			},
			contextMenuOpts: {
				group: "z_commands",
				order: 1
			}
		});
	}
	run(accessor) {
		accessor.get(IQuickInputService).quickAccess.show(StandaloneCommandsQuickAccessProvider.PREFIX);
	}
};
registerEditorAction(GotoLineAction);
Registry.as(Extensions.Quickaccess).registerQuickAccessProvider({
	ctor: StandaloneCommandsQuickAccessProvider,
	prefix: StandaloneCommandsQuickAccessProvider.PREFIX,
	helpEntries: [{
		description: QuickCommandNLS.quickCommandHelp,
		commandId: GotoLineAction.ID
	}]
});

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js
var __decorate = void 0 && (void 0).__decorate || function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = void 0 && (void 0).__param || function(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
};
var StandaloneReferencesController = class StandaloneReferencesController$1 extends ReferencesController {
	constructor(editor$1, contextKeyService, editorService, notificationService, instantiationService, storageService, configurationService) {
		super(true, editor$1, contextKeyService, editorService, notificationService, instantiationService, storageService, configurationService);
	}
};
StandaloneReferencesController = __decorate([
	__param(1, IContextKeyService),
	__param(2, ICodeEditorService),
	__param(3, INotificationService),
	__param(4, IInstantiationService),
	__param(5, IStorageService),
	__param(6, IConfigurationService)
], StandaloneReferencesController);
registerEditorContribution(ReferencesController.ID, StandaloneReferencesController, 4);

//#endregion
//#region node_modules/monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js
var ToggleHighContrast = class extends EditorAction {
	constructor() {
		super({
			id: "editor.action.toggleHighContrast",
			label: ToggleHighContrastNLS.toggleHighContrast,
			alias: "Toggle High Contrast Theme",
			precondition: void 0
		});
		this._originalThemeName = null;
	}
	run(accessor, editor$1) {
		const standaloneThemeService = accessor.get(IStandaloneThemeService);
		const currentTheme = standaloneThemeService.getColorTheme();
		if (isHighContrast(currentTheme.type)) {
			standaloneThemeService.setTheme(this._originalThemeName || (isDark(currentTheme.type) ? VS_DARK_THEME_NAME : VS_LIGHT_THEME_NAME));
			this._originalThemeName = null;
		} else {
			standaloneThemeService.setTheme(isDark(currentTheme.type) ? HC_BLACK_THEME_NAME : HC_LIGHT_THEME_NAME);
			this._originalThemeName = currentTheme.themeName;
		}
	}
};
registerEditorAction(ToggleHighContrast);

//#endregion
export { CancellationTokenSource, Emitter, KeyCode, KeyMod, MarkerSeverity, MarkerTag, Position, Range, Selection, SelectionDirection, Token, Uri, editor, languages };
//# sourceMappingURL=monaco-editor.js.map