import Telegraf from 'telegraf';
const botName = process.env.BOT_NAME;
import setUp from '../setUp';
const app = new Telegraf(process.env.BOT_TOKEN, { username: botName });

const app = new Telegraf(
    process.env.BOT_TOKEN,
    { username: process.env.BOT_USERNAME }
);
console.log('token', process.env.BOT_TOKEN);
const tag = setUp.tag;
console.log('token', process.env.BOT_TOKEN);
const tag = setUp.tag;

const activeUsers = new Set();

app.command('start', ctx => { // eslint-disable-line
    return ctx.reply(setUp.askForConfirmation, { reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [
            [{ text: setUp.agreeText }, { text: setUp.declineText }]]
    }
    });
});

app.on('text', ctx => {
    if (ctx.message.text === setUp.agreeText) {
        console.log('user id', ctx.message.from.id);
        activeUsers.add(ctx.message.from.id);
        ctx.reply(setUp.notifyAgreed);
    } else {
        ctx.reply(setUp.notifyDeclined);
    }
});

app.on('photo', ctx => {
    const userImgTag = ctx.update.message.caption;
    const user = ctx.update.message.from.id;
    console.log('user ', user);

    if (activeUsers.has(user.id)) {
        ctx.reply(`Hello ${user.first_name}!! please talk to @${botName}`);
    }
    console.log('activeUsers ', activeUsers);
    if (userImgTag === tag && activeUsers.has(user)) {
        console.log('This image is allowed');
    } else {
        console.log('This image is not allowed');
    }
});

app.startPolling(0);
