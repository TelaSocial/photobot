const photoUpload = (ctx, next) => next().then(() => {
    const { telegram } = ctx;
    const { message } = ctx.update;
    const { document, photo } = message;
    const docId = document ? document.file_id : null;
    const photoId = Array.isArray(photo)
        ? photo[photo.length - 1].file_id
        : null;
    const fileId = docId || photoId;
    if (fileId) {
        telegram.getFileLink(fileId).then(fileLink => {
            ctx.telegram.sendMessage(
                ctx.update.message.chat.id,
                `fileURL: ${fileLink}`
            );
        });
    }
    // if (ctx.update.message.text === 'foo') {
    //     ctx.telegram.sendMessage(ctx.update.message.chat.id, 'oi', {
    //         reply_markup: {
    //             keyboard: [
    //                 [{ text: 'yes' }, { text: 'no' }]
    //             ],
    //             one_time_keyboard: true
    //         }
    //     });
    // }
});

export default photoUpload;
