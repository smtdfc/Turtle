const path = require("path")

module.exports = [
	{
		entry:path.join(__dirname,"../src/turtle.js"),
		mode: "production",
		output: {
			path: path.resolve(__dirname, '../dist'),
			filename: 'core.turtle.js',
			globalObject: 'this',
			library: {
				name: 'Turtle',
				type: 'umd',
			}
		}
	}
]