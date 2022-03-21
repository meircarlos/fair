const Agenda = require("agenda");

module.exports = async ({ emailTransporter }) => {
	const mongoConnectionString = `mongodb://${process.env.MONGO_URI}`;

	const agenda = new Agenda({
		db: { address: mongoConnectionString, collection: "reminders" },
	});

	agenda
		.on("ready", () => console.log("Agenda started!"))
		.on("error", () => console.log("Agenda connection error!"));

	await agenda.start();

	agenda.define("launch reminder email", async (job) => {
		const jobData = job.attrs.data;
		console.log(
			"send Email to:",
			jobData.emailTo,
			jobData.collectionName,
			jobData.timeUntilLaunch
		);
		const info = await emailTransporter.sendMail({
			from: '"FAIR 👻" <fair@gmail.com>',
			to: jobData.emailTo,
			subject: `REMINDER - THE COLLECTION ${jobData.collectionName} LAUNCHES IN ${jobData.timeUntilLaunch}`,
			text: `REMINDER - THE COLLECTION ${jobData.collectionName} LAUNCHES IN ${jobData.timeUntilLaunch}`,
		});
		console.log(info);
	});

	agenda.define("launch date email", async (job) => {
		const jobData = job.attrs.data;
		console.log(
			"send launch date Email to:",
			jobData.emailTo,
			jobData.collectionName
		);
		const info = await emailTransporter.sendMail({
			from: '"FAIR 👻" <fair@gmail.com>',
			to: jobData.emailTo,
			subject: `${jobData.collectionName} IS LAUNCHING NOW!`,
			text: `${jobData.collectionName} IS LAUNCHING NOW!`,
		});
		console.log(info);
	});

	return agenda;
};
