const photoUpload = (ctx, next) => {
    console.log('-- photoUpload --');
    const { telegram } = ctx;
    const fileId = ctx.state.fileId;
    if (fileId) {
        telegram.getFileLink(fileId).then(fileLink => {
            telegram.sendMessage(
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
    return next();
};

export default photoUpload;
