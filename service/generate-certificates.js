import fs from "fs";

import https from "https";

import {execSync} from "child_process";


const DOMAIN = 'localhost';

function generateCertificates() {
	try {
		// Проверяем, установлен ли mkcert
		execSync('mkcert --help', { stdio: 'ignore' });

		// Устанавливаем локальный корневой сертификат (если не установлен)
		try {
			execSync('mkcert -install', { stdio: 'inherit' });
		} catch (error) {
			console.log('Не удалось установить корневой сертификат. Запустите с правами администратора.');
			process.exit(1);
		}

		// Генерируем сертификаты
		execSync(`mkcert ${DOMAIN}`, { stdio: 'inherit' });
		console.log(`Сертификаты для ${DOMAIN} успешно созданы.`);
	} catch (error) {
		console.error('mkcert не установлен. Установите его и повторите.');
		process.exit(1);
	}
}

// Проверяем наличие сертификатов, иначе генерируем
if (!fs.existsSync(`${DOMAIN}.pem`) || !fs.existsSync(`${DOMAIN}-key.pem`)) {
	generateCertificates();
}

// Запускаем сервер
const options = {
	key: fs.readFileSync(`${DOMAIN}-key.pem`),
	cert: fs.readFileSync(`${DOMAIN}.pem`),
};

https
	.createServer(options, (req, res) => {
		res.writeHead(200);
		res.end('Hello, secure world!');
	})
	.listen(3000, () => {
		console.log(`Сервер запущен на https://${DOMAIN}:3000`);
	});
