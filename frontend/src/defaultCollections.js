const dayjs = require("dayjs");

module.exports = [
	{
		name: "collection 1",
		launchDate: dayjs().add(2, "day").format(),
	},
	{
		name: "collection 2",
		launchDate: dayjs().add(1, "day").add(3, "hour").format(),
	},
	{
		name: "collection 3",
		launchDate: null,
	},
	{
		name: "collection 4",
		launchDate: null,
	},
	{
		name: "collection 5",
		launchDate: dayjs().add(5, "hour").format(),
	},
	{
		name: "collection 6",
		launchDate: null,
	},
];
