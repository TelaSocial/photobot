import gcloud from 'google-cloud';
import path from 'path';

const ds = gcloud.datastore({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: path.join(__dirname, '../../keyfile.json')
});

const photoMetadataLogger = (ctx, next) => {
    const kind = 'PhotoMetadata';
    const fileId = ctx.state.fileId;
    const key = ds.key([kind, fileId]);
    const data = [
        {
            name: 'timestamp',
            value: ctx.state.timestamp,
            excludeFromIndexes: false
        },
        {
            name: 'userId',
            value: ctx.state.userId,
            excludeFromIndexes: false
        },
        {
            name: 'displayName',
            value: ctx.state.displayName,
            excludeFromIndexes: true
        },
        {
            name: 'tgUpdate',
            value: JSON.stringify(ctx.update),
            excludeFromIndexes: true
        }

    ];
    const entity = { key, data };
    console.log('entity', entity);
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
