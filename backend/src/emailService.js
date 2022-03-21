const nodemailer = require("nodemailer");

const port = parseInt(process.env.EMAIL_PORT);

let username = process.env.EMAIL_USERNAME;
let password = process.env.EMAIL_PASSWORD;

module.exports = async () => {
	if (process.env.NODE_ENV !== "production") {
		const testAccount = await nodemailer.createTestAccount();

		username = testAccount.user; // generated ethereal user
		password = testAccount.pass; // generated ethereal password
	}

	// create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: port,
		secure: false,
		auth: {
			user: username,
			pass: password,
		},
	});

	return transporter;
};
