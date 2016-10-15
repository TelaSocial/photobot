import Telegraf from 'telegraf';
import fooMiddleware from './fooMiddleware';

const app = new Telegraf(process.env.BOT_TOKEN);

app.use(fooMiddleware);

app.command('start', ctx => ctx.reply('Hey'));


app.startPolling();
