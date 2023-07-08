window.TURTLE_EVENTS = {}

export class TurtleEvent {
	constructor(name, data) {
		this.name = name
		this.data = data
	}

	emit() {
		let listeners = window.TURTLE_EVENTS[this.name]
		if (!listeners) {
			return
		}

		for (var idx in listeners) {
			listeners[idx].callback.bind(listeners[idx].context)(this.data)
		}
	}
}

export function createEvent(name, data) {
	return new TurtleEvent(name, data)
}

export function createEventListener(name, callback, context = this) {
	if (!window.TURTLE_EVENTS[name]) window.TURTLE_EVENTS[name] = []
	window.TURTLE_EVENTS[name].push({
		callback:callback,
		context:context
	})
		
}

export function deleteEventListener(name, callback) {
	if (!window.TURTLE_EVENTS[name]) window.TURTLE_EVENTS[name] = []
	let listeners = window.TURTLE_EVENTS[name]
	for (var idx in listeners) {
		if(listeners[idx].callback === callback){
			window.TURTLE_EVENTS[name].splice(idx,1)
		}
	}
}

export function deleteAllEventListener(name){
	window.TURTLE_EVENTS[name] = []
}