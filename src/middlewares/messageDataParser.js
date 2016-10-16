// This middleware extracts information
// from a received data, such as user display name
// and document/photo file id and writes it
// to the ctx.state to be used by other middlewares
//
// Currently it will set:
// - fileId: the file_id of the biggest photo
//   or the document.file_id
// - displayName: first_name + ' ' + last_name if set
//   or username
// - userId: the telegram id from the message author
// - timestamp: the date of the update

const messageDataParser = (ctx, next) => {
    console.log('-- messageDataParser --');
    const { message } = ctx.update;
    const { document, photo, date } = message;
    const docId = document ? document.file_id : null;
    const photoId = Array.isArray(photo)
        ? photo[photo.length - 1].file_id
        : null;
    const fileId = docId || photoId;
    const {
        first_name,
        last_name,
        username,
        id
    } = ctx.update.message.from;
    const displayName = [first_name, last_name] //eslint-disable-line
        .filter(name => name !== undefined)
        .join(' ') || username;
    ctx.state.fileId = fileId; // eslint-disable-line
    ctx.state.displayName = displayName; // eslint-disable-line
    ctx.state.userId = id; // eslint-disable-line
    ctx.state.timestamp = date; // eslint-disable-line
    return next();
};

export default messageDataParser;
