require("./config");
const App = require("./app");
const CollectionsComponent = require("./components/collections");
const EmailService = require("./emailService");
const Agenda = require("./agenda");

async function startServer() {
	const emailTransporter = await EmailService();
	const agenda = await Agenda({ emailTransporter });
	const collectionsComponent = CollectionsComponent({ agenda });
	const app = App({ collectionsComponent });

	process.on("uncaughtException", (error) => console.error(error));
	process.on("unhandledRejection", (error) => console.error(error));

	const server = await app.listen(process.env.PORT);
	console.log(`Listening on port ${process.env.PORT}`);

	return {
		app,
		server,
	};
}

module.exports = startServer();
