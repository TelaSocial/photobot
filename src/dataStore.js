import gcloud from 'google-cloud';
import path from 'path';
import fileExists from 'file-exists';

const keyDevPath = path.join(__dirname, '../keyfile.json');
const keyDistPath = path.join(__dirname, '../../../keyfile.json');
const keyFilename = fileExists(keyDevPath) ? keyDevPath : keyDistPath;
const cloud = gcloud({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename
});
const gds = cloud.datastore();
const gcs = cloud.storage();

const getPublishers = () => {
    const query = gds.createQuery('TosAcceptance')
        .filter('answer', '=', true);
    global.activeUsers = new Set();

    return new Promise(resolve => {
        gds.runQuery(query, (err, users) => resolve(users));
    });
};

const getPublicPhotos = () => {
    console.log('fetching photos info from datastore');
    const query = gds.createQuery('PhotoMetadata')
        .filter('acceptedTerms', '=', true);
    return new Promise(resolve => {
        gds.runQuery(query, (err, photos) => resolve(photos));
    });
};

export {
    gds,
    gcs,
    getPublishers,
    getPublicPhotos
};
