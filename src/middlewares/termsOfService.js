import setUp from '../../setUp';

// TODO: change this to remote database
const activeUsers = new Set();

const tos = (ctx, next) => next().then(() => {
    const { text, from } = ctx.update.message;

    const isStart = text && text === '/start';
    const isTosReply = text && (text === setUp.agreeText || text === setUp.declineText);
    const hasAccepted = activeUsers.has(from.id);

    if (isStart && !hasAccepted) {
        ctx.reply(setUp.askForConfirmation, { reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
            keyboard: [
                [{ text: setUp.agreeText }, { text: setUp.declineText }]]
        }
    });
    } else if (isTosReply && !hasAccepted) {
        if (text === setUp.agreeText) {
            activeUsers.add(from.id);
            ctx.reply(setUp.notifyAgreed);
        } else {
            ctx.reply(setUp.notifyDeclined);
        }
    }
});
export default tos;
