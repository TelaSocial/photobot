import datastore from '@google-cloud/datastore';

const ds = datastore({
    projectId: process.env.GCLOUD_PROJECT
});

const photoMetadataLogger = (ctx, next) => {
    console.log('-- photoMetadataLogger --');
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
            console.error('ERROR::::', err);
            return next();
        }
    );
};

export default photoMetadataLogger;
