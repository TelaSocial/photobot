const debug = (ctx, next) => {
    console.log('\n\n\n===\n');
    console.log(JSON.stringify(ctx, ' ', 2));
    console.log('\n===\n');
    return next();
};

export default debug;

