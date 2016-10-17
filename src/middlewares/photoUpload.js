import download from 'download';
import fs from 'fs';
import path from 'path';

const photoUpload = (ctx, next) => {
    const fileId = ctx.state.fileId;
    if (!fileId) {
        return next();
    }
    const { telegram } = ctx;
    const gcs = ctx.state.gcs;
    console.log(' -- photo upload --', gcs !== undefined);
    return telegram.getFileLink(fileId).then(fileLink =>
        download(fileLink, '.').then(() => {
            const fileName = fileLink.slice(fileLink.lastIndexOf('/') + 1);
            const userHasAcceptedTos = global.activeUsers.has(ctx.state.userId);
            console.log('userHasAcceptedTos', userHasAcceptedTos);
            const options = {
                destination: fileId,
                public: userHasAcceptedTos
            };
            console.log('fileName', fileName);
            console.log('options', options);
            console.log('process.env.STORAGE_BUCKET', process.env.STORAGE_BUCKET);
            const bucket = gcs.bucket(process.env.STORAGE_BUCKET);
            console.log('bucket', bucket !== undefined);
            return bucket.upload(fileName, options, (err, file) => {
                const photoPath = path.join(__dirname, `../../${fileName}`);
                fs.unlink((photoPath, fileName), e => {
                    if (e) {
                        console.log('Error when deleting file', e);
                    }
                });
                if (err) {
                    console.log('ERROR::::::', err);
                    return false;
                }
                console.log('file', file.metadata.selfLink);
                ctx.state.fileUrl = file.metadata.selfLink; //eslint-disable-line
                return next();
            });
        })
    );
};

export default photoUpload;
