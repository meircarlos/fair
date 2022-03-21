import { Agenda } from 'agenda/es';
import * as dayjs from 'dayjs';

let agenda, emailTransporter;

export default {
  async bootstrap(transporter) {
    emailTransporter = transporter;

    const mongoConnectionString = `mongodb://${process.env.MONGO_URI}`;

    agenda = new Agenda({
      db: { address: mongoConnectionString, collection: 'reminders' },
    });

    agenda
      .on('ready', () => console.log('Agenda started!'))
      .on('error', () => console.log('Agenda connection error!'));

    await agenda.start();

    agenda.define('launch reminder email', async (job) => {
      const jobData = job.attrs.data;
      console.log(
        'send Email to:',
        jobData.emailTo,
        jobData.collectionName,
        jobData.timeUntilLaunch,
      );
      const info = await emailTransporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'some@email.com',
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>', // html body
      });
      console.log(info);
    });

    agenda.define('launch date email', async (job) => {
      const jobData = job.attrs.data;
      console.log(
        'send launch date Email to:',
        jobData.emailTo,
        jobData.collectionName,
      );
      const info = await emailTransporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'some@email.com',
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>', // html body
      });
      console.log(info);
    });
  },
  getAgenda() {
    return agenda;
  },
};
