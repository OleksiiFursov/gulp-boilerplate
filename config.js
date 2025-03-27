import {config} from "dotenv";
import { pathSSL } from './core/tools.js'
config();

const MODE = process.env.npm_lifecycle_event || 'dev';



const configCompany = {
	TITLE: 'Front-end Boilerplate by CrossFox.online',
	URL: MODE === 'dev' ? '/': '',
	DOMAIN: 'localhost', // only name without protocol
	FOOTER_YEAR: new Date().getFullYear(),
	LANG: 'en-US',
	VERSION: '1.0',

	// COMPANY:
	COMPANY_NAME: 'dev.crossfox.online',
	COMPANY_NAME_SHORT: 'dev.Crossfox.online',
	COMPANY_DESCRIPTION: 'Front-end Boilerplate by CrossFox.online',
	OPENING_HOURS: "Mo,Tu,We,Th,Fr,Sa,Su",
	DAY_OF_WEEK: '"Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"',
	OPENS: "09:00",
	CLOSES: "17:00",
	PRICE_RANGE: '$$',
	SEO_OG: true,
	SEO_TWITTER: true,
	//API:
	GOOGLE_ANALYTIC: null,
	SCHEMA_ORG: false,
	// CONTACTS:

	EMAIL: 'alex@crossfox.dev',
	PHONE: '<a href="tel:123456789">+1 234 567 89</a>',
	AUTHOR: 'Oleksii Fursov',
	//DESIGNED:
	THEME_BACKGROUND: '#111',
	THEME_COLOR: '#ff9800',
};


export default {
	...configCompany,
	BASEURL: false,
	// DEPLOY:     https://github.com/mscdex/ssh2#user-content-client-methods
	SFTP:{
		HOST: process.env.SFTP_HOST,
		PORT: process.env.SFTP_PORT,
		USER: process.env.SFTP_USER,
		PASSWORD: process.env.SFTP_PASSWORD,
		REMOTE_DIR: process.env.SFTP_REMOTE_DIR,
		LIMIT: 3,
		INCLUDED_DIR: 'all', //'all', // all | callback (dir => dir !== 'folder')
		INCLUDED_FILE: 'all' //'all', // all | callback
	},



	PWA: true,
	PWA_DISPLAY: 'standalone', //https://developer.mozilla.org/en-US/docs/Web/Manifest/display
	PWA_START_URL: '/index.html',
	PWA_ORIENTATION: 'portrait', //https://developer.mozilla.org/en-US/docs/Web/Manifest/orientation
	PWA_APPLE_STATUS_BAR: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`

	// SERVER:
	FOLDER_BUILD: './build',
	FOLDER_SOURCE: './src',
	FOLDER_COPY: [],
	SERVER_OPEN: false,//'external',
	HTTPS: true,
	GENERATE_SSL: true,
	SSL: {
		key: pathSSL('localhost-key.pem'),
		cert: pathSSL('localhost.pem')
	},
	PORT: 777,
	GHOSTMODE:{
		clicks: true,
		forms: true,
		scroll: false,
		location : true
	},
	TUNNEL: false,
	RENDER_HTML: [
		'html/**/*.html',
		'!/html/part/*.html',
		'!html/blocks/*.html',
		'!/html/blocks/**/*.html',
	],
	MODE
}

