const Controller = ({ collectionsService }) => {
	return { setReminders, deleteReminders };

	async function setReminders(req, res, next) {
		try {
			const { collectionId } = req.params;
			const { collectionName, reminders, launchDate, emailTo } = req.body;

			await collectionsService.setReminders({
				collectionId,
				collectionName,
				reminders,
				launchDate,
				emailTo,
			});

			return res.sendStatus(201);
		} catch (error) {
			return next(error);
		}
	}

	async function deleteReminders(req, res, next) {
		try {
			const { collectionId } = req.params;

			await collectionsService.deletePreviousReminders(collectionId);

			return res.sendStatus(200);
		} catch (error) {
			return next(error);
		}
	}
};

module.exports = Controller;
