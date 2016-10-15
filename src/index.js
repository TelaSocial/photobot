import Telegraf from 'telegraf';

const app = new Telegraf(
    process.env.BOT_TOKEN,
    { username: process.env.BOT_USERNAME }
);

const tag = '#zuzu';
const zuardiId = '19555963';

// Here goes all msg to user for license approval
app.on('text', ctx => {
    console.log('got update', ctx.update);
    ctx.reply('ok!');
    ctx.telegram.sendMessage(zuardiId, 'License');
});

// console.log('telegram', JSON.stringify(app.telegram, ' ', 2));

app.on('new_chat_member', ctx => {
    // const userName = ctx.update.
    console.log('ctx', JSON.stringify(ctx.update.message.new_chat_member, ' ', 2));
    const newUser = ctx.update.message.new_chat_member;
    if (newUser) {
        console.log('newUser ', newUser);
        ctx.telegram.sendMessage(newUser.id, `Hello ${newUser.first_name}!! Have a nice day`);
    }
});

app.on('photo', ctx => {
    ctx.reply('got image mate');

    const userImgTag = ctx.update.message.caption;
    if (userImgTag === tag) {
        ctx.reply('This image is allowed');
    } else {
        console.log('This image is not allowed');
    }
});

app.startPolling();
