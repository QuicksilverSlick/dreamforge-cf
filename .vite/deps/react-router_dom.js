"use client";


import { __toESM } from "./chunk-DbKvDyjX.js";
import { require_react } from "./react-Dzmm40ca.js";
import { CRITICAL_CSS_DATA_ATTRIBUTE, FrameworkContext, RemixErrorBoundary, RouterProvider, createBrowserHistory, createClientRoutes, createClientRoutesWithHMRRevalidationOptOut, createRouter, decodeViaTurboStream, deserializeErrors, getHydrationData, getPatchRoutesOnNavigationFunction, getTurboStreamSingleFetchDataStrategy, hydrationRouteProperties, invariant, mapRouteProperties, useFogOFWarDiscovery } from "./chunk-65XJMMLO-D3aNWsCq.js";
import { require_react_dom } from "./react-dom-DMiczgDw.js";

//#region node_modules/react-router/dist/development/dom-export.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
function RouterProvider2(props) {
	return /* @__PURE__ */ import_react.createElement(RouterProvider, {
		flushSync: import_react_dom.flushSync,
		...props
	});
}
var ssrInfo = null;
var router = null;
function initSsrInfo() {
	if (!ssrInfo && window.__reactRouterContext && window.__reactRouterManifest && window.__reactRouterRouteModules) {
		if (window.__reactRouterManifest.sri === true) {
			const importMap = document.querySelector("script[rr-importmap]");
			if (importMap?.textContent) try {
				window.__reactRouterManifest.sri = JSON.parse(importMap.textContent).integrity;
			} catch (err) {
				console.error("Failed to parse import map", err);
			}
		}
		ssrInfo = {
			context: window.__reactRouterContext,
			manifest: window.__reactRouterManifest,
			routeModules: window.__reactRouterRouteModules,
			stateDecodingPromise: void 0,
			router: void 0,
			routerInitialized: false
		};
	}
}
function createHydratedRouter({ getContext }) {
	initSsrInfo();
	if (!ssrInfo) throw new Error("You must be using the SSR features of React Router in order to skip passing a `router` prop to `<RouterProvider>`");
	let localSsrInfo = ssrInfo;
	if (!ssrInfo.stateDecodingPromise) {
		let stream = ssrInfo.context.stream;
		invariant(stream, "No stream found for single fetch decoding");
		ssrInfo.context.stream = void 0;
		ssrInfo.stateDecodingPromise = decodeViaTurboStream(stream, window).then((value) => {
			ssrInfo.context.state = value.value;
			localSsrInfo.stateDecodingPromise.value = true;
		}).catch((e) => {
			localSsrInfo.stateDecodingPromise.error = e;
		});
	}
	if (ssrInfo.stateDecodingPromise.error) throw ssrInfo.stateDecodingPromise.error;
	if (!ssrInfo.stateDecodingPromise.value) throw ssrInfo.stateDecodingPromise;
	let routes = createClientRoutes(ssrInfo.manifest.routes, ssrInfo.routeModules, ssrInfo.context.state, ssrInfo.context.ssr, ssrInfo.context.isSpaMode);
	let hydrationData = void 0;
	if (ssrInfo.context.isSpaMode) {
		let { loaderData } = ssrInfo.context.state;
		if (ssrInfo.manifest.routes.root?.hasLoader && loaderData && "root" in loaderData) hydrationData = { loaderData: { root: loaderData.root } };
	} else {
		hydrationData = getHydrationData({
			state: ssrInfo.context.state,
			routes,
			getRouteInfo: (routeId) => ({
				clientLoader: ssrInfo.routeModules[routeId]?.clientLoader,
				hasLoader: ssrInfo.manifest.routes[routeId]?.hasLoader === true,
				hasHydrateFallback: ssrInfo.routeModules[routeId]?.HydrateFallback != null
			}),
			location: window.location,
			basename: window.__reactRouterContext?.basename,
			isSpaMode: ssrInfo.context.isSpaMode
		});
		if (hydrationData && hydrationData.errors) hydrationData.errors = deserializeErrors(hydrationData.errors);
	}
	let router2 = createRouter({
		routes,
		history: createBrowserHistory(),
		basename: ssrInfo.context.basename,
		getContext,
		hydrationData,
		hydrationRouteProperties,
		mapRouteProperties,
		future: { middleware: ssrInfo.context.future.v8_middleware },
		dataStrategy: getTurboStreamSingleFetchDataStrategy(() => router2, ssrInfo.manifest, ssrInfo.routeModules, ssrInfo.context.ssr, ssrInfo.context.basename),
		patchRoutesOnNavigation: getPatchRoutesOnNavigationFunction(ssrInfo.manifest, ssrInfo.routeModules, ssrInfo.context.ssr, ssrInfo.context.routeDiscovery, ssrInfo.context.isSpaMode, ssrInfo.context.basename)
	});
	ssrInfo.router = router2;
	if (router2.state.initialized) {
		ssrInfo.routerInitialized = true;
		router2.initialize();
	}
	router2.createRoutesForHMR = createClientRoutesWithHMRRevalidationOptOut;
	window.__reactRouterDataRouter = router2;
	return router2;
}
function HydratedRouter(props) {
	if (!router) router = createHydratedRouter({ getContext: props.getContext });
	let [criticalCss, setCriticalCss] = import_react.useState(ssrInfo?.context.criticalCss);
	import_react.useEffect(() => {
		setCriticalCss(void 0);
	}, []);
	import_react.useEffect(() => {
		if (criticalCss === void 0) document.querySelectorAll(`[${CRITICAL_CSS_DATA_ATTRIBUTE}]`).forEach((element) => element.remove());
	}, [criticalCss]);
	let [location, setLocation] = import_react.useState(router.state.location);
	import_react.useLayoutEffect(() => {
		if (ssrInfo && ssrInfo.router && !ssrInfo.routerInitialized) {
			ssrInfo.routerInitialized = true;
			ssrInfo.router.initialize();
		}
	}, []);
	import_react.useLayoutEffect(() => {
		if (ssrInfo && ssrInfo.router) return ssrInfo.router.subscribe((newState) => {
			if (newState.location !== location) setLocation(newState.location);
		});
	}, [location]);
	invariant(ssrInfo, "ssrInfo unavailable for HydratedRouter");
	useFogOFWarDiscovery(router, ssrInfo.manifest, ssrInfo.routeModules, ssrInfo.context.ssr, ssrInfo.context.routeDiscovery, ssrInfo.context.isSpaMode);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, /* @__PURE__ */ import_react.createElement(FrameworkContext.Provider, { value: {
		manifest: ssrInfo.manifest,
		routeModules: ssrInfo.routeModules,
		future: ssrInfo.context.future,
		criticalCss,
		ssr: ssrInfo.context.ssr,
		isSpaMode: ssrInfo.context.isSpaMode,
		routeDiscovery: ssrInfo.context.routeDiscovery
	} }, /* @__PURE__ */ import_react.createElement(RemixErrorBoundary, { location }, /* @__PURE__ */ import_react.createElement(RouterProvider2, {
		router,
		unstable_onError: props.unstable_onError
	}))), /* @__PURE__ */ import_react.createElement(import_react.Fragment, null));
}

//#endregion
export { HydratedRouter, RouterProvider2 as RouterProvider };
//# sourceMappingURL=react-router_dom.js.map