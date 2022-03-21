const dayjs = require("dayjs");

const Service = ({ agenda }) => {
	return { setReminders, deletePreviousReminders };

	async function setReminders({
		collectionId,
		collectionName,
		reminders,
		launchDate,
		emailTo,
	}) {
		await deletePreviousReminders(collectionId);

		await setNewReminders({
			collectionId,
			collectionName,
			reminders,
			launchDate,
			emailTo,
		});

		return true;
	}

	async function deletePreviousReminders(collectionId) {
		const canceledJobs = await agenda.cancel({
			"data.collectionId": collectionId,
		});

		console.log(
			"collectionsSerivce:deletePreviousReminders",
			"canceledJobs",
			{
				canceledJobs,
				collectionId,
			}
		);

		return canceledJobs;
	}

	//
	// PRIVATE METHODS
	//

	async function setNewReminders({
		collectionId,
		collectionName,
		reminders,
		launchDate,
		emailTo,
	}) {
		const launchDateJS = dayjs(launchDate);

		// Sets launch reminder emails jobs
		for (const timeUntilLaunch of reminders) {
			const reminderDate = getReminderDate(launchDateJS, timeUntilLaunch);

			await agenda.schedule(reminderDate, "launch reminder email", {
				collectionId,
				collectionName,
				timeUntilLaunch,
				launchDate,
				emailTo,
			});
			console.log(
				"collectionsSerivce:setNewReminders",
				"launch reminder email set",
				{
					collectionId,
					timeUntilLaunch,
				}
			);
		}

		// Sets launch date email job
		await agenda.schedule(launchDateJS.toDate(), "launch date email", {
			collectionId,
			collectionName,
			launchDate,
			emailTo,
		});
		console.log(
			"collectionsSerivce:setNewReminders",
			"launch date email set",
			{
				collectionId,
			}
		);
	}

	function getReminderDate(launchDateJS, timeUntilLaunch) {
		switch (timeUntilLaunch) {
			case "30m":
				return launchDateJS.subtract(30, "minute").toDate();

			case "1h":
				return launchDateJS.subtract(1, "hour").toDate();

			default:
				// '1d'
				return launchDateJS.subtract(1, "day").toDate();
		}
	}
};

module.exports = Service;
