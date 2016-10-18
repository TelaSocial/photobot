import messages from '../../locales/ptBr.js';
const tos = (ctx, next) => {
    const { text, userId, displayName, fileId, chatType } = ctx.state;
    const ds = ctx.state.gds;

    if (fileId && !global.activeUsers.has(userId)) {
        if (chatType === 'private') {
            ctx.reply(messages.askForConfirmation, {
                reply_markup: {
                    resize_keyboard: true,
                    one_time_keyboard: true,
                    keyboard: [[
                        { text: messages.agreeText },
                        { text: messages.declineText }
                    ]]
                }
            });
        } else {
            ctx.reply(messages.greeting(displayName,
                            process.env.BOT_USERNAME));
        }
        return next();
    }

    if (!text) {
        return next();
    }

    const isStart = text.indexOf('/start') !== -1;
    const isTosReply = (text === messages.agreeText ||
                            text === messages.declineText);
    if (isStart) {
        console.log('--- -- start -- -- ---');
        ctx.reply(messages.askForConfirmation, {
            reply_markup: {
                resize_keyboard: true,
                one_time_keyboard: true,
                keyboard: [[
                    { text: messages.agreeText },
                    { text: messages.declineText }
                ]]
            }
        });
        return next();
    }

    if (isTosReply) {
        const hasAccepted = (text === messages.agreeText);
        if (hasAccepted) {
            global.activeUsers.add(userId);
        } else {
            global.activeUsers.delete(userId);
        }
        const kind = 'TosAcceptance';
        const key = ds.key([kind, userId]);
        const data = [
            {
                name: 'timestamp',
                value: ctx.update.message.date,
                excludeFromIndexes: false
            },
            {
                name: 'userId',
                value: userId,
                excludeFromIndexes: false
            },
            {
                name: 'answer',
                value: hasAccepted,
                excludeFromIndexes: false
            }
        ];
        const entity = { key, data };
        return ds.save(entity, err => {
            if (err) {
                console.log('ERROR:::::', err);
            }
            ctx.reply(hasAccepted
                    ? messages.notifyAgreed
                    : messages.notifyDeclined
            );
            return next();
        });
    }
    return next();
};
export default tos;

