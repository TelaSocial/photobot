const fooMiddleware = (ctx, next) => next().then(() => {
    console.log(JSON.stringify(ctx, ' ', 2));
    ctx.telegram.sendMessage(ctx.update.message.chat.id, 'oi');
});

export default fooMiddleware;
