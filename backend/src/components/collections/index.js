const CollectionsService = require("./services/collectionsService");
const CollectionsController = require("./controllers/collectionsController");
const CollectionsRouter = require("./router");

module.exports = ({ agenda }) => {
	const collectionsService = CollectionsService({
		agenda,
	});

	const collectionsController = CollectionsController({
		collectionsService,
	});

	const router = CollectionsRouter({
		collectionsController,
	});

	return { router };
};
