const MODE = process.env.npm_lifecycle_event
export default {
	TITLE: 'Crossfox core-boirplate',
	URL: MODE === 'dev' ? '/': 'https://crossfox.dev',
	FOOTER_YEAR: new Date().getFullYear(),
	LANG: 'en-US',
	VERSION: '1.0',

	// COMPANY:
	COMPANY_NAME: 'Crossfox.dev',
	COMPANY_NAME_SHORT: 'Crossfox.dev',
	COMPANY_DESCRIPTION: 'Crossfox core-boirplate',
	OPENING_HOURS: "Mo,Tu,We,Th,Fr,Sa,Su",
	DAY_OF_WEEK: '"Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"',
	OPENS: "09:00",
	CLOSES: "17:00",
	PRICE_RANGE: '$$$$',

	//API:
	GOOGLE_ANALYTIC: null,

	// CONTACTS:
	EMAIL: 'alex@crossfox.dev',
	PHONE: '<a href="tel:123456789">+1 234 567 89</a>',
	AUTHOR: 'Oleksii Fursov',


	//DESIGNED:
	THEME_BACKGROUND: '#111',
	THEME_COLOR: '#ff9800',

	PWA: true,
	PWA_DISPLAY: 'standalone', //https://developer.mozilla.org/en-US/docs/Web/Manifest/display
	PWA_START_URL: '/index.html',
	PWA_ORIENTATION: 'portrait', //https://developer.mozilla.org/en-US/docs/Web/Manifest/orientation
	PWA_APPLE_STATUS_BAR: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`

	// SERVER:
	FOLDER_BUILD: './build',
	FOLDER_SOURCE: './src',
	FOLDER_COPY: ['files'],
	SERVER_OPEN: false,//'external',
	HTTPS: true,
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
		'!/html/pages/**/*.html',
	],
	MODE
}

