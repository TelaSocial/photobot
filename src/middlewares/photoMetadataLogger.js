const photoMetadataLogger = (ctx, next) => {
    const fileId = ctx.state.fileId;
    if (!fileId) {
        return next();
    }
    const ds = ctx.state.gds;
    const kind = 'PhotoMetadata';
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
            name: 'caption',
            value: ctx.update.message.caption || '',
            excludeFromIndexes: false
        },
        {
            name: 'acceptedTerms',
            value: global.activeUsers.has(ctx.state.userId),
            excludeFromIndexes: false
        },
        {
            name: 'url',
            value: ctx.state.fileUrl,
            excludeFromIndexes: false
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
