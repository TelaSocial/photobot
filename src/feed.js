import { getPublicPhotos } from './dataStore';

getPublicPhotos().then(photos => {
    console.log('photos: ', photos);
});
