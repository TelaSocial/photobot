// This middleware sets a fileId variable in the State
// based on the type of message it received
// currently it will set the fileId to be the biggest
// photo in a message with photo or the document.file_id of a
// message with document

const fileIdParser = (ctx, next) => {
    console.log('-- fileIdParser --');
    const { message } = ctx.update;
    const { document, photo } = message;
    const docId = document ? document.file_id : null;
    const photoId = Array.isArray(photo)
        ? photo[photo.length - 1].file_id
        : null;
    const fileId = docId || photoId;
    ctx.state.fileId = fileId; // eslint-disable-line
    return next();
};

export default fileIdParser;
