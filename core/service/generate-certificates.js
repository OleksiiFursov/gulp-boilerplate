import fs from "fs";
import config from '../../config.js'
import { execSync } from "child_process";

const DOMAIN = config.DOMAIN;
const SSL_DIR = "ssl";
const CERT_PATH = `${SSL_DIR}/${DOMAIN}.pem`;
const KEY_PATH = `${SSL_DIR}/${DOMAIN}-key.pem`;

function generateCertificates() {
	try {
		// Check if mkcert is installed
		execSync("mkcert --help", { stdio: "ignore" });

		// Install local root certificate (if not installed)
		try {
			execSync("mkcert -install", { stdio: "inherit" });
		} catch (error) {
			console.log("Failed to install root certificate. Run with administrator rights.");
			process.exit(1);
		}

		// Create SSL directory if it doesn't exist
		if (!fs.existsSync(SSL_DIR)) {
			fs.mkdirSync(SSL_DIR, { recursive: true });
		}

		// Generate certificates
		execSync(`mkcert -cert-file ${CERT_PATH} -key-file ${KEY_PATH} ${DOMAIN}`, {
			stdio: "inherit",
		});
		console.log(`Certificates for ${DOMAIN} have been successfully created.`);
	} catch (error) {
		console.error("mkcert is not installed. Please install it and try again.");
		process.exit(1);
	}
}

// Check if certificates exist, otherwise generate them
if (!fs.existsSync(CERT_PATH) || !fs.existsSync(KEY_PATH)) {
	generateCertificates();
}
