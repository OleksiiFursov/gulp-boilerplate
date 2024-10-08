export default {
	TITLE: 'Crossfox gulp-boirplate',
	URL: process.env.npm_lifecycle_event === 'dev' ? '/': 'https://crossfox.dev',
	FOOTER_YEAR: 2024,
	MODE:  process.env.npm_lifecycle_event,
	LANG: 'en',
	// COMPANY:
	COMPANY_NAME: 'Crossfox.dev',
	COMPANY_NAME_SHORT: 'Crossfox.dev',
	COMPANY_DESCRIPTION: 'Crossfox gulp-boirplate',
	OPENING_HOURS: "Mo,Tu,We,Th,Fr,Sa,Su",
	DAY_OF_WEEK: 'Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday', // first and last " not require
	OPENS: "09:00",
	CLOSES: "17:00",
	PRICE_RANGE: '$$',
	GOOGLE_ANALYTIC: null,
	// CONTACTS:
	EMAIL: 'alex@crossfox.dev',
	PHONE: '<a href="tel:123456789">+1 234 567 89</a>',
	AUTHOR: 'Oleksii Fursov',

	//DESIGNED:
	THEME_COLOR: '#ff9800',
	THEME_BACKGROUND: '#111',

	// SERVER:
	FOLDER_BUILD: './build',
	FOLDER_SOURCE: './src',
	FOLDER_COPY: ['files'],
	SERVER_OPEN: false,//'external',
	HTTPS: true,
	PORT: 777,
	TUNNEL: false,
	RENDER_HTML: [
		'html/**/*.html',
		'!/html/part/*.html',
		'!html/blocks/*.html',
		'!/html/blocks/**/*.html',
		'!/html/pages/**/*.html',
	]
}
