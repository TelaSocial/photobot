import gcloud from 'google-cloud';
import path from 'path';
import fileExists from 'file-exists';
import config from '../config';

const photoKind = 'PhotoMetadata';

const keyDevPath = path.join(__dirname, '../keyfile.json');
const keyDistPath = path.join(__dirname, '../../../keyfile.json');
const keyFilename = fileExists(keyDevPath) ? keyDevPath : keyDistPath;
console.log('config.gcloud.projectId', config.gcloud.projectId);
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
    const query = gds.createQuery(photoKind)
        .filter('acceptedTerms', '=', true)
        .filter('blacklisted', '=', false)
        .order('timestamp', { descending: true });
    return new Promise(resolve => {
        gds.runQuery(query, (err, photos) => {
            if (err) {
                console.error('get public photos query error:', err);
                return resolve([]);
            }
            return resolve(photos);
        });
    });
};

const getPhotosWithTag = tagName => {
    const query = gds.createQuery(photoKind)
        .filter('acceptedTerms', '=', true)
        .filter('blacklisted', '=', false)
        .filter('tag', '=', tagName)
        .order('timestamp', { descending: true });
    return new Promise(resolve => {
        gds.runQuery(query, (err, photos) => {
            if (err) {
                console.error('get photos with tag query error:', err);
                return resolve([]);
            }
            return resolve(photos);
        });
    });
};

const getPhotosInAlbum = albumName => {
    const query = gds.createQuery(photoKind)
        .filter('album', '=', albumName)
        .order('timestamp', { descending: true });
    return new Promise(resolve => {
        gds.runQuery(query, (err, photos) => {
            if (err) {
                console.error('get album photos query error:', err);
                return resolve([]);
            }
            return resolve(photos);
        });
    });
};

const addPhotoToAlbum = (photoId, albumName) =>
    new Promise(resolve => {
        const key = gds.key([photoKind, photoId]);
        gds.get(key, (err, entity) => {
            if (err) {
                return resolve(err);
            }
            const entityAlbums = entity.data.album || [];
            const newEntityAlbums = entity.data.album.includes(albumName)
                ? entityAlbums
                : entityAlbums.concat([albumName]);
            const newEntity = {
                ...entity,
                data: {
                    ...entity.data,
                    album: newEntityAlbums
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

const getPhotosWithWord = word => {
    const query = gds.createQuery(photoKind)
        .filter('acceptedTerms', '=', true)
        .filter('blacklisted', '=', false)
        .filter('word', '=', word)
        .order('timestamp', { descending: true });
    return new Promise(resolve => {
        gds.runQuery(query, (err, photos) => {
            if (err) {
                console.error('get photos with word query error:', err);
                return resolve([]);
            }
            return resolve(photos);
        });
    });
};

const blacklistPhoto = photoId =>
    new Promise(resolve => {
        const key = gds.key([photoKind, photoId]);
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
    getPhotosWithTag,
    getPhotosWithWord,
    getPhotosInAlbum,
    addPhotoToAlbum,
    blacklistPhoto
};
