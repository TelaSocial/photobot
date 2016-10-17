// This middleware creator will take 2 arguments:
// a google cloud datastore and a google cloud storage
// instances and add them to the state as
// ctx.state.gcs and ctx.state.gds
const createMiddleware = (gds, gcs) => (ctx, next) => {
    ctx.state.gds = gds; // eslint-disable-line
    ctx.state.gcs = gcs; // eslint-disable-line
    return next();
};

export default createMiddleware;

