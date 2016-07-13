/*eslint-disable */
var webpack = require('webpack');
var path = require('path');

module.exports = function()
{
	return {
		/**
		 * Inline source maps, generated by TypeScript compiler, will be used.
		 */
		devtool: 'inline-source-map',

		resolve: {
			extensions: ['', '.ts', '.js']
		},

		verbose: true,

		module: {
			loaders: [
				/**
				 * Unlike ts-loader, awesome-typescript-loader doesn't allow to override TS compiler options
				 * in query params. We use separate `tsconfig.test.json` file, which only differs in one thing:
				 * inline source maps. They are used for code coverage report.
				 *
				 * See project repository for details / configuration reference:
				 * https://github.com/s-panferov/awesome-typescript-loader
				 */
				{
					test: /\.ts$/,
					exclude: /node_modules/,
					loader: 'awesome-typescript-loader',
					query: {
						tsconfig: 'config/tsconfig.test.json'
					}
				}
			],
			postLoaders: [
				/**
				 * Instruments TS source files for subsequent code coverage.
				 * See https://github.com/deepsweet/istanbul-instrumenter-loader
				 */
				{
					test: /\.ts$/,
					loader: 'istanbul-instrumenter-loader',
					exclude: [
						/node_modules/,
						/test/,
						/Spec\.ts$/
					]
				}
			]
		},
	};
};
