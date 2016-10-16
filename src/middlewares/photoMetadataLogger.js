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
    const {
        first_name,
        last_name,
        username,
        id
    } = ctx.update.message.from;
    const displayName = [first_name, last_name] //eslint-disable-line
        .filter(name => name !== undefined)
        .join(' ') || username;
    const data = [
        {
            name: 'timestamp',
            value: ctx.update.message.date,
            excludeFromIndexes: false
        },
        {
            name: 'userId',
            value: id,
            excludeFromIndexes: false
        },
        {
            name: 'displayName',
            value: displayName,
            excludeFromIndexes: true
        },
        {
            name: 'tgUpdate',
            value: JSON.stringify(ctx.update),
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
