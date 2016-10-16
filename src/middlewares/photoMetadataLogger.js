import gcloud from 'google-cloud';
import path from 'path';

const ds = gcloud.datastore({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: path.join(__dirname, '../../keyfile.json')
});

const photoMetadataLogger = (ctx, next) => {
    console.log('-- photoMetadataLogger --', path.join(__dirname, '../../keyfile.json'));
    const kind = 'PhotoMetadata';
    const key = ds.key(kind);
    const fileId = ctx.state.fileId;
    const data = [
        {
            name: 'fileId',
            value: fileId,
            excludeFromIndexes: true
        }
    ];
    const entity = { key, data };
    return ds.save(
        entity,
        err => {
            if (err) {
                console.error('ERROR::::', err);
            }
            return next();
        }
    );
};

export default photoMetadataLogger;
