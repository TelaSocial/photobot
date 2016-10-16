// import Datastore from '@google-cloud/datastore';
// const ds = Datastore({
//     projectId: process.env.GCLOUD_PROJECT
// });
const photoMetadataLogger = (ctx, next) => {
    console.log('-- photoMetadataLogger --');
    return next();
};

export default photoMetadataLogger;
