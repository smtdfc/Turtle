const isProduction = process.env.NODE_ENV === 'production';

const exports = {};

if (isProduction) {
  exports = require("./bundles/development.turtle.min.cjs")
} else {
  exports = require("./bundles/development.turtle.min.cjs")
}

module.exports = exports;