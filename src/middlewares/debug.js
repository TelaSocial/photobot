const debug = (ctx, next) => next().then(() => {
    console.log('\n\n\n===\n');
    console.log(JSON.stringify(ctx, ' ', 2));
    console.log('\n===\n');
});

export default debug;

