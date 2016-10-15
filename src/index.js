import Telegraf from 'telegraf';

const app = new Telegraf(process.env.BOT_TOKEN);
app.command('start', ctx => ctx.reply('Hey'));
app.on('sticker', ctx => ctx.reply('👍'));
app.startPolling();
