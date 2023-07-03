export class TurtleStateManager{
	constructor(name){
		this.component = null
		this.name = name
		this.events ={
			stateChange:new Function()
		}
	}
	
	onStateChange(callback,context=this){
		this.events.stateChange = callback.bind(context)
	}
	
	bind(component){
		this.component = component
	}
	
	changeState(newValue){
		if(!this.component){
			console.warn("You are trying to change the state of the component but there is no component associated with this manager yet ")
			throw "Cannot change state !"
		}
		this.component.setState(this.name,newValue)
	}
}