import fs from 'fs'
import { dest, src, task } from 'gulp'
import favicons from 'favicons'
import changed from 'gulp-changed'
import clean from 'gulp-clean'

import config from '../../config.js'
import { getBuildDir, getSrcDir } from '../tools.js'

task('clean', done => {
	if (fs.existsSync(getBuildDir())) {
		return src(getBuildDir(), { read: false })
		.pipe(clean({ force: true }))
	}
	done()
})
task('fonts', () =>
  src(getSrcDir('fonts/**/*'), { encoding: false, dot: true })
  .pipe(changed(getBuildDir('fonts/')))
  .pipe(dest(getBuildDir('fonts/'))))

task('files', async () => {
	const tasks = [];

	if(config.PWA && !fs.existsSync(getSrcDir('pwa'))) {
		tasks.push(done => {
			task('generate-favicon')(done);
		});
	}
	const folders = config.PWA ? [...config.FOLDER_COPY, 'pwa']: config.FOLDER_COPY

	for (const folder of folders) {
		tasks.push(async () => {
			return new Promise((resolve, reject) => {
				src(getSrcDir(folder + '/**/*'), {encoding: false})
				    .pipe(changed(getBuildDir(folder + '/')))
				    .pipe(dest(getBuildDir(folder + '/')))
				    .on('end', resolve)
				    .on('error', reject);
			});
		});
	}

	await Promise.all(tasks.map(task => task()));
})
task('generate-favicon', async (done) => {
	const logoPath = getSrcDir('img/cf-favicon.png')
	const configuration = {
		path: getSrcDir('pwa'),
		appName: config.COMPANY_NAME,
		lang: config.LANG,
		appShortName: config.COMPANY_NAME_SHORT,
		appDescription: config.COMPANY_DESCRIPTION,
		background: config.THEME_BACKGROUND,
		theme_color: config.THEME_COLOR,
		display: config.PWA_DISPLAY,
		orientation: config.PWA_ORIENTATION,
		start_url: config.PWA_START_URL,
		appleStatusBarStyle: config.PWA_APPLE_STATUS_BAR,
		version: config.VERSION,
		icons: {
			android: true,
			appleIcon: true,
			favicons: true,
			windows: true,
		},

	}

	if (fs.existsSync(logoPath)) {
		try {
			fs.mkdirSync(getSrcDir('pwa'))

			const {
				images,
				files,
				html,
			} = await favicons(logoPath, configuration)

			images.forEach(image => {
				fs.writeFileSync(`${getSrcDir('pwa')}/${image.name}`, image.contents)
			})
			files.forEach(file => {
				fs.writeFileSync(`${getSrcDir('pwa')}/${file.name}`, file.contents)
			})

			fs.writeFileSync(getSrcDir('html/part/pwa.html'), html.join('\n'))
		} catch (error) {
			console.log(error.message)
		}

	} else {done()}
})
