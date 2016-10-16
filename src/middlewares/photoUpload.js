import cloud from 'google-cloud';
import path from 'path';
import download from 'download';

const gcloud = cloud({
    projectId: process.env.GCLOUD_PROJECT, //eslint-disable-line
    keyFilename: path.join(__dirname, '../../keyfile.json')
});

const gcs = gcloud.storage();

const photoUpload = (ctx, next) => {
    console.log('-- photoUpload --');
    const { telegram } = ctx;
    const fileId = ctx.state.fileId;
    if (fileId) {
        return telegram.getFileLink(fileId).then(fileLink => {
            telegram.sendMessage(
                ctx.update.message.chat.id,
                `fileURL: ${fileLink}`);
            download(fileLink, '.').then(() => {
                const bucket = gcs.bucket(process.env.STORAGE_BUCKET);
                console.log('File name', fileLink.slice(fileLink.lastIndexOf('/') + 1));
                bucket.upload(fileLink.slice(fileLink.lastIndexOf('/') + 1), (erro, file) => {
                    if (erro) {
                        console.log('ERROR::::::', erro);
                    } else {
                        console.log('file ', file);
                    }
                });
            });
            return next();
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
