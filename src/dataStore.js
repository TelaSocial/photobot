import gcloud from 'google-cloud';
import path from 'path';
import fileExists from 'file-exists';
import config from '../config';

const keyDevPath = path.join(__dirname, '../keyfile.json');
const keyDistPath = path.join(__dirname, '../../../keyfile.json');
const keyFilename = fileExists(keyDevPath) ? keyDevPath : keyDistPath;
const cloud = gcloud({
    projectId: config.gcloud.projectId,
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
        .filter('acceptedTerms', '=', true)
        .filter('blacklisted', '=', false);
    return new Promise(resolve => {
        gds.runQuery(query, (err, photos) => resolve(photos));
    });
};

const blacklistPhoto = photoId =>
    new Promise(resolve => {
        const key = gds.key(['PhotoMetadata', photoId]);
        gds.get(key, (err, entity) => {
            if (err) {
                return resolve(err);
            }
            const newEntity = {
                ...entity,
                data: {
                    ...entity.data,
                    blacklisted: true
                }
            };
            console.log('newEntity', newEntity);
            return gds.update(newEntity, (error, response) => {
                if (error) {
                    return resolve(error);
                }
                return resolve(response);
            });
        });
    }
);

export {
    gds,
    gcs,
    getPublishers,
    getPublicPhotos,
    blacklistPhoto
};
