const path = require("path")

module.exports = [
	{
		entry:path.join(__dirname,"../src/turtle.js"),
		mode: "production",
		output: {
			path: path.resolve(__dirname, '../dist'),
			filename: 'turtle.min.js',
			globalObject: 'this',
			library: {
				name: 'Turtle',
				type: 'umd',
			}
		}
	}
]