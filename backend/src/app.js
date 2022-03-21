const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const App = ({ collectionsComponent }) => {
	const app = express();
	app.use(cors({ origin: "*" }));
	app.use(helmet());
	app.use(express.json());
	app.use("/api/v1/collections", collectionsComponent.router);

	return app;
};

module.exports = App;
