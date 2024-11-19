import notify from 'gulp-notify'
import plumber from 'gulp-plumber'
import config from '../config.js'

export const getBuildDir = (path = '') => `${config.FOLDER_BUILD}/${path}`
export const getSrcDir = (path = '') => `${config.FOLDER_SOURCE}/${path}`

export const getHtmlSrc = () => config.RENDER_HTML.map(v => v[0] === '!' ? '!' + getSrcDir(v.slice(1)) : getSrcDir(v))

export const getConfig = async () => {
	const config = (await import('../config.js?v=' + Date.now())).default;

	config.DAY_OF_WEEK = config.DAY_OF_WEEK.slice(1,-1);
	config.PRICE_RANGE = config.PRICE_RANGE.replace(/\$/g, '$$$');
	return config;
}
export const plumberNotify = (title) => plumber({
	errorHandler: notify.onError({
		title: title,
		message: 'Error <%= error.message %>',
		sound: false,
	}),
})

export function clearHTML (file) {
	const content = file.contents.toString().replace(
	  /(<script[^>]*>)(.*?)(<\/script>)/sg,
		v => v.replace(/(\n|\s{2,})+/g, ' '))

	file.contents = Buffer.from(content)
}


