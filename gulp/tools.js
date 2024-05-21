import notify from 'gulp-notify'
import config from '../config.js'

export const getBuildDir = (path = '') => `./${config.FOLDER_BUILD}/${path}`

export const plumberNotify = (title) => ({
	errorHandler: notify.onError({
		title: title,
		message: 'Error <%= error.message %>',
		sound: false,
	}),
})
