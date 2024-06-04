import { getSrcDir } from './gulp/tools.js'

export default {
	mode: 'production',
	entry: {
		index: getSrcDir('js/index.js')
	},
	output: {
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};
