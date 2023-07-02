import { create as createComponent } from "../Component/Component.js"
const Router = {
	init: false,
	element: document.createElement("div"),
	currentRoute: null,
	defaultRoute: null,
	routes: [],
	type: null,
	handleErr: {
		notFound: new Function()
	},
	events: {
		loadcontent: new Function(),
		contentloaded: new Function()
	}
}

function parseURL(url) {
	let raw = url.split("/")
	raw = raw.filter((val) => {
		if (val.length > 0) return val
	})
	return raw
}

function checkMatchedRoute(urlParsed) {
	let matched = []
	Router.routes.forEach(route => {
		let path = parseURL(route.path)
		if (path.length != urlParsed.length) {
			return
		}
		let p = {}
		let c = 0
		path.forEach(function(r, idx) {
			if (r[0] == ":") {
				c++
				p[r.slice(1)] = urlParsed[idx]
			} else if (r[0] == "*") {
				c++
				return
			} else if (r == urlParsed[idx]) {
				c++
			}
		})
		if (c == path.length && c == urlParsed.length) {
			matched.push({
				route: route,
				params: p
			})
		}
	})
	return matched
}

function renderComponent(element, component, data) {
	element.textContent = ``
	let $component = document.createElement(component)
	$component.data.routerData = data
	element.appendChild($component)
}

async function renderContentOfRoute(matched) {
	let route = matched.route
	let params = matched.params
	let query = matched.query
	if (route.callback) route.callback(route, params)
	if(route.protect){
		let res = await route.protect()
		if(!res){
			return {
				routeBlocked:true
			}
		}
	}
	if (route.component && window.TURTLE_COMPONENTS[route.component]) {
		renderComponent(Router.element, route.component, {
			params: params,
			query: query
		})
		return
	} else {

		if (route.resolver) {
			let result = await route.resolver(params, query)
			if (result) {
				if (result.content) {
					Router.element.innerHTML = result.content
					return
				}
				
				if(result.replaceComponent){
					route.component = result.replaceComponent
				}
				
				if (result.redirect) {
					redirect(result.redirect)
					return
				}
				if (result.nextRoute) {
					return {
						nextRoute: true
					}
				} 
			}
		}
		if (route.component && window.TURTLE_COMPONENTS[route.component]) {
			renderComponent(Router.element, route.component, {
				params: params,
				query: query
			})
		}
	}
}

function resolveRoute(url) {
	
	url = encodeURI(url)
	url = new URL(url, window.location.origin)
	let query = url.searchParams
	let urlParsed = parseURL(url.pathname)
	let matchedRoutes = checkMatchedRoute(urlParsed)
	Router.events.loadcontent({
		url,query
	},Router.element)
	if (matchedRoutes.length == 0) {
		Router.handleErr.notFound({ url, query }, Router.element)
		Router.events.contentloaded({
			url,query
		},Router.element)
	}
	for (let idx in matchedRoutes) {
		let matched = matchedRoutes[idx]
		if (matched.route.path == Router.currentRoute) return
		Router.currentRoute = matched.route.path
		matched.query = query
		let res = renderContentOfRoute(matched)
		if(res.routeBlocked){
			Router.handleErr.routeBlocked({ url,params:matched.params, query }, Router.element)
		}
		if (res.nextRoute) {
			continue
		} else {
			break
		}
	}
	Router.events.contentloaded({
		url,query
	},Router.element)
}

window.addEventListener("hashchange", function(e) {
	if (Router.type == "hash") {
		let hash = window.location.hash
		
		resolveRoute(hash.slice(1))
	}
})

window.addEventListener("popstate", function(e) {
	if (Router.type == "history" && Router.init) {
		let url = window.location.pathname
		resolveRoute(url)
	}
})

export function redirect(path) {
	if (Router.type == "hash" && Router.init) {
		window.location.hash = `#${path}`
	}
	if (Router.type == "history") {
		window.history.pushState(null, null, path)
		let url = window.location.pathname
		resolveRoute(url)
	}
}

export function initRouter(configs) {
	Router.element = configs.element ? document.querySelector(configs.element) : document.createElement("div")
	if (!Router.element) {
		throw `Invalid element ${configs.element}`
	}
	Router.type = (window.history && window.history.pushState) ? configs.type : "hash"
	Router.routes = configs.routes ?? []
	Router.defaultRoute = configs.routes ?? "/"
	Router.handleErr = configs.handleErr ?? {
		notFound: new Function()
	}
	

	window.addEventListener("load", function(e) {
		if (Router.type == "hash") {
			let hash = window.location.hash
			resolveRoute(hash.slice(1))

		} else {
			let path = window.location.pathname
			resolveRoute(path)
		}
	})
	Router.init = true
}

createComponent("link-to", {
	render: function() {
		if (!Router.init) {
			throw "Router has not been initialized !"
		}
		this.data.link = this.getAttribute("link")
		return `
			<a ref="a" href="#">${this.textContent}</a>
		`
	},
	onRender:function(){
		let ctx = this
		this.getRef("a").addEventListener("click",function(e){
			e.preventDefault()
			let link = ctx.data.link
			redirect(link)
		})
	}
})

export function setRouterEventListener(name,callback){
	Router.events[name] = callback
}