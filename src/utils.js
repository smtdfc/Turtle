export function generateKey(){
	return Math.floor(Math.random()*Date.now()).toString(16)
}

export function generateError(name,message){
	throw `
		ERROR : ${name}
			${message}
	`
}
