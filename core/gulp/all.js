import fs from 'fs'
import {task} from "gulp";
import favicons from 'favicons';

import config from '../../config.js'
import { getBuildDir, getSrcDir } from '../tools.js'

task('generate-favicon', async (done) => {
	console.log(done);
	const logoPath = getSrcDir('img/cf-favicon.png');
	const configuration = {
		path: getSrcDir('pwa'),                // Путь для ссылок в HTML (относительный к корню)
		appName: "My App",                     // Название приложения
		appShortName: "App",                   // Краткое название приложения
		appDescription: "This is my web app",  // Описание приложения
		background: "#ffffff",                 // Фоновый цвет
		theme_color: "#ffffff",                // Цвет темы
		display: "standalone",                 // Режим отображения PWA
		orientation: "portrait",               // Ориентация приложения
		start_url: "/index.html",              // URL для старта приложения
		version: "1.0",                        // Версия приложения
		logging: true,                         // Логирование
		icons: {                               // Какие иконки генерировать
			android: true,                       // Иконка для Android
			appleIcon: true,                     // Иконка для iOS
			favicons: true,                      // Стандартные фавиконки
			windows: true,                       // Иконки для Windows плиток
			yandex: false
		}
	};

	if (fs.existsSync(logoPath)) {
		try {
			fs.mkdirSync(getSrcDir('pwa'));

			const {
				images,
				files,
				html
			} = await favicons(logoPath, configuration);

			images.forEach(image => {
				fs.writeFileSync(`${getSrcDir('pwa')}/${image.name}`, image.contents);
			});
			files.forEach(file => {
				fs.writeFileSync(`${getSrcDir('pwa')}/${file.name}`, file.contents);
			});
			console.log(html)
		}catch (error) {
			console.log(error.message);
		}

		/*.then(function (error, response) {
			if (error) {
				console.error(error.message);
				return done(error);  // В случае ошибки остановить задачу
			}

			// Сохраняем сгенерированные изображения
			response.images.forEach(image => {
				fs.writeFileSync(`${outputDir}/${image.name}`, image.contents);
			});

			// Сохраняем сгенерированные файлы, такие как manifest.json
			response.files.forEach(file => {
				fs.writeFileSync(`${outputDir}/${file.name}`, file.contents);
			});

			// Логируем HTML-код для вставки в <head> HTML-файлов
			console.info('HTML для вставки в <head> вашего HTML файла:');
			console.info(response.html.join("\n"));

		}).then(done);*/
	}else {done()}
})
