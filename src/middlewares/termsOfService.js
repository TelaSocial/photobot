import setup from '../../setup';
const tos = (ctx, next) => {
    const { text, userId, displayName, fileId, chatType } = ctx.state;
    const ds = ctx.state.gds;
    const isStart = text && text.indexOf('/start') !== -1;
    const isTosReply = text && (text === setup.agreeText || text === setup.declineText);

    if (isStart) {
        console.log('--- -- start -- -- ---');
        ctx.reply(setup.askForConfirmation, { reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
            keyboard: [
                [{ text: setup.agreeText }, { text: setup.declineText }]]
        } });
        return next();
    }
    if (isTosReply) {
        const hasAccepted = (text === setup.agreeText);
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
            ctx.reply(hasAccepted ? setup.notifyAgreed : setup.notifyDeclined);
            return next();
        });
    }
    if (fileId && !global.activeUsers.has(userId)) {
        if (chatType === 'private') {
            ctx.reply(setup.askForConfirmation, {
                reply_markup: {
                    resize_keyboard: true,
                    one_time_keyboard: true,
                    keyboard: [
                        [{ text: setup.agreeText }, { text: setup.declineText }]
                    ]
                }
            });
        } else {
            ctx.reply(setup.greeting(displayName, process.env.BOT_USERNAME));
        }
        return next();
    }
    return next();
};
export default tos;

