import Telegraf from 'telegraf';
import fooMiddleware from './fooMiddleware';

const app = new Telegraf(
    process.env.BOT_TOKEN,
    { username: process.env.BOT_USERNAME }
);

app.use(fooMiddleware);

app.command('start', ctx => ctx.reply('Hey'));


app.startPolling();
