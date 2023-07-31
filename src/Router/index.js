import {  createComponent } from "../Component/Component.js"
const Router = {
	init: false,
	element: document.createElement("div"),
	currentRoute: null,
	defaultRoute: null,
	routes: [],
	type: null,
	handleErr: {
		notFound: new Function(),
		notAllow:new Function(),
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
	if($component.componentId)
		$component.data.routerData = data
	Router.currentRouteComponent = $component
	element.appendChild($component)
}

async function renderContentOfRoute(matched) {
	let route = matched.route
	let params = matched.params
	let query = matched.query
	let componentDefined = window.customElements.get(route.component) != undefined
		if(route.callback) route.callback(route,params)
		if(route.protect){
		let res = await route.protect()
		if(!res){
			return {
				routeBlocked:true,
				value:res
			}
		}
	}
	if (route.resolver) {
		let result = await route.resolver(params, query)
		if (result) {
			if (result.content) {
				Router.element.innerHTML = result.content
			return
			}
	
			if (result.replaceComponent) {
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
	if (route.loadComponent && !componentDefined) route.loadComponent(route, params)
	if (route.component) {
		renderComponent(Router.element, route.component, {
			params: params,
			query: query
		})
	}
	if(route.onload){
	  route.onload()
	}
}

async function resolveRoute(url) {
	url = encodeURI(url)
	url = new URL(url, window.location.origin)
	let query = url.searchParams
	let urlParsed = parseURL(url.pathname)
	let matchedRoutes = checkMatchedRoute(urlParsed)
	if(Router.currentRouteComponent && Router.currentRouteComponent.componentId){
		Router.currentRouteComponent.onRouteChange()
	}
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
		//if (matched.route.path == Router.currentRoute) return
		Router.currentRoute =  matched.route.path
		matched.query = query
		let res = await renderContentOfRoute(matched)
		if(!res) break
		if(res.routeBlocked){
			Router.handleErr.notAllow({ url,params:matched.params, query, }, Router.element,res.value)
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
	if (Router.type == "history") {
		let url = window.location.pathname
		resolveRoute(url)
	}
})

export function redirect(path,replace=false) {
	if (Router.type == "hash") {
	
		if(replace){
			let url = new URL(window.location.href)
			url.hash = `#${path}`
			window.history.replaceState(null,null,url.toString())
			let hash = window.location.hash
			resolveRoute(hash.slice(1))
			return
		}
		window.location.hash = `#${path}`
	}
	if (Router.type == "history") {
		if(!replace){
			window.history.pushState(null, null, path)
		}else{
			window.history.replaceState(null,null,path)
		}
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
}

class LinkComponent extends HTMLElement{
	constructor(){
		super()
	}
	
	connectedCallback(){
		let a = document.createElement("a")
		a.data = {
			replace:this.getAttribute("replace") || false
		}
		a.href = this.getAttribute("to") || ""
		a.innerHTML = this.innerHTML
		a.style = this.getAttribute("style") || ""
		a.className = this.getAttribute("class") || ""
		this.after(a)
		this.remove()
		a.addEventListener("click",function(e){
			e.preventDefault()
			redirect(e.target.href)
		})
	}
}

window.customElements.define("link-to",LinkComponent)
export function setRouterEventListener(name,callback){
	Router.events[name] = callback
}

export function startRouter(){
	if (Router.type == "hash") {
		let hash = window.location.hash
		resolveRoute(hash.slice(1))
	
	} else {
		let path = window.location.pathname
		resolveRoute(path)
	}
	
}