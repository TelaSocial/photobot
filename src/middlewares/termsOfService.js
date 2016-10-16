import setup from '../../setup';
import gcloud from 'google-cloud';
import path from 'path';

const ds = gcloud.datastore({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: path.join(__dirname, '../../keyfile.json')
});

const tos = (ctx, next) => {
    const fileId = ctx.state.fileId;
    const { text, from } = ctx.update.message;

    const isStart = text && text === '/start';
    const isTosReply = text && (text === setup.agreeText || text === setup.declineText);
    const hasAccepted = id => global.activeUsers.has(id);

    if (isStart && !hasAccepted(from.id)) {
        ctx.reply(setup.askForConfirmation, { reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
            keyboard: [
                [{ text: setup.agreeText }, { text: setup.declineText }]]
        } });
    } else if (isTosReply && !hasAccepted(from.id)) {
        if (text === setup.agreeText) {
            global.activeUsers.add(from.id);
        } else if (text === setup.declineText) {
            global.activeUsers.delete(from.id);
        } else {
            return next();
        }

        const kind = 'TosAcceptance';
        const userId = `${from.id}`;
        const key = ds.key([kind, userId]);
        const data = [
            {
                name: 'timestamp',
                value: ctx.update.message.date,
                excludeFromIndexes: false
            },
            {
                name: 'userId',
                value: from.id,
                excludeFromIndexes: false
            },
            {
                name: 'answer',
                value: hasAccepted(from.id),
                excludeFromIndexes: false
            }
        ];
        const entity = { key, data };
        console.log('entity ', entity);

        return ds.save(entity, err => {
            if (err) { console.log('ERROR:::::', err); }
            if (hasAccepted(from.id)) {
                ctx.reply(setup.notifyAgreed);
            } else {
                ctx.reply(setup.notifyDeclined);
            }
            return next();
        });
    } else if (fileId && !hasAccepted(from.id)) {
        ctx.reply(setup.greeting(
                    from.first_name,
                    process.env.BOT_USERNAME));
    }
    return next();
};
export default tos;

