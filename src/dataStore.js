import gcloud from 'google-cloud';
import path from 'path';

const ds = gcloud.datastore({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: path.join(__dirname, '../keyfile.json')
});

const getPublishers = () => {
    const query = ds.createQuery('TosAcceptance')
        .filter('answer', '=', true);
    global.activeUsers = new Set();

    return new Promise(resolve => {
        ds.runQuery(query, (err, users) => {
            users.forEach(u => global.activeUsers.add(u.data.userId));
            return resolve();
        });
    });
};

// recebe a lista dos file names cujo userId esta na lista dos publishers
const getPublicPhotos = () => {};

export {
    getPublishers,
    getPublicPhotos
};
