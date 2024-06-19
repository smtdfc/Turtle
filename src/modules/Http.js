import {TurtleModule} from "../Module.js"

export class TurtleRequest {
	constructor(configs) {
		this.xhr = new XMLHttpRequest()
		this.URL = new URL(configs.url)
		this.method = configs.method
		this.data = configs.data
		this.body = configs.body
		this.timeout = configs.timeout
		this.headers = configs.headers ?? {}
		this.withCredentials = configs.withCredentials ?? false
		this.responseType = configs.responseType
		this.sended = false
		this.events = {
			abort: new Function(),
			done: new Function(),
			timeout:new Function(),
			error:new Function()
		}
		if (configs.auth) {
			this.auth = {
				username: configs.auth.username,
				password: configs.auth.password
			}
		} else {
			this.auth = null
		}
	}

	setHeader(name, value) {
		this.headers[name] = value
	}

	getHeader(name){
		return this.headers[name]
	}
	
	deleteHeader(name){
		delete this.headers[name]
	}
	
	setParam(name, value) {
		this.URL.searchParams.set(name, value)
	}

	deleteParam(name) {
		this.URL.searchParams.delete(name)
	}

	getParam(name) {
		this.URL.searchParams.get(name)
	}

	cancel() {
		if (!this.sended) {
			throw "Cannot cancel request!"
		} else {
			this.xhr.abort()
			this.events.abort()
		}
	}

	send() {
		return new Promise((resolve, reject) => {
			if (this.auth != null) {
				this.xhr.open(this.method, this.URL.href, true, this.auth.username, this.auth.password)
			} else {
				this.xhr.open(this.method, this.URL.href, true)
			}
			this.xhr.timeout = this.timeout
			if (this.headers) {
				Object.keys(this.headers).forEach(header => {
					this.xhr.setRequestHeader(header, this.headers[header])
				})
			}
			
			this.xhr.responseType = this.responseType
			this.xhr.withCredentials = this.withCredentials
			if (this.data) {
				this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
				this.xhr.send(JSON.stringify(this.data))
			} else {
				this.xhr.send(this.body)
			}
			let ctx = this
			this.xhr.onerror = function(err) {
				ctx.events.error()
				reject(err)
			}
			this.xhr.onabort = function() {
				ctx.events.abort()
				resolve({
					abort: true
				})
			}
			
			this.xhr.ontimeout = function() {
				ctx.events.timeout()
				resolve({
					timeouted: true
				})
			}
			
			this.xhr.onload = function() {
				if (ctx.xhr.readyState == 4) {
					console.log(ctx.xhr)
					let res = new TurtleResponse(ctx)
					ctx.events.done(res)
					resolve({
						response: res,
						timeouted: false
					})
				}
			};
		})
	}
}


export class TurtleResponse {
	constructor(req) {
		this.req = req
		this.xhr = this.req.xhr
		this.status = this.xhr.status
		this.statusText = this.xhr.statusText
		this.URL = this.xhr.responseURL
		this.type = this.xhr.responseType
	}

	getHeader(name) {
		return this.xhr.getResponseHeader(name)
	}
	
	getAllHeaders(){
		return this.xhr.getAllResponseHeaders()
	}

	text() {
		return this.xhr.responseText
	}

	json() {
		try {
			return JSON.parse(this.xhr.response)
		} catch (err) {
			throw "Cannot parse JSON from response"
		}
	}

	raw() {
		return this.xhr.response
	}
}

export class HttpModule extends TurtleModule{
  constructor(app){
    super(app)
  }
  
  init(){
    this.app.http = this
    return this
  }
  
  send(configs){
    let req = new TurtleRequest(configs)
    return req.send()
  }
  
}