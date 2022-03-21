const { Router } = require("express");

module.exports = ({ collectionsController }) => {
	const router = new Router();

	router.post("/:collectionId", collectionsController.setReminders);

	router.delete("/:collectionId", collectionsController.deleteReminders);

	return router;
};
