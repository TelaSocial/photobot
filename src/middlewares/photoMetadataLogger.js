const extractTags = new RegExp('#\\w+', 'ig');
const extractWords = new RegExp('\\w+', 'ig');

const photoMetadataLogger = (ctx, next) => {
    const fileId = ctx.state.fileId;
    if (!fileId) {
        return next();
    }
    const ds = ctx.state.gds;
    const kind = 'PhotoMetadata';
    const key = ds.key([kind, fileId]);
    const caption = ctx.update.message.caption || '';
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
            name: 'tag',
            value: caption.match(extractTags),
            excludeFromIndexes: false
        },
        {
            name: 'word',
            value: caption.match(extractWords),
            excludeFromIndexes: false
        },
        {
            name: 'blacklisted',
            value: false,
            excludeFromIndexes: false
        },
        {
            name: 'acceptedTerms',
            value: global.activeUsers.has(ctx.state.userId),
            excludeFromIndexes: false
        },
        {
            name: 'displayName',
            value: ctx.state.displayName,
            excludeFromIndexes: true
        },
        {
            name: 'caption',
            value: caption,
            excludeFromIndexes: true
        },
        {
            name: 'url',
            value: ctx.state.fileUrl,
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
