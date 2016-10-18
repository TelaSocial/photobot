import { getPublicPhotos, blacklistPhoto } from './dataStore';
import express from 'express';
import bodyParser from 'body-parser';
import config from '../config';

const PORT = config.api.port;
const updateIntervalTime = 15 * 1000; // 15 seconds

const app = express();
app.use(bodyParser.json());

let publicPhotos = [];

const buildPublicPhotosFeed = () => new Promise(resolve =>
    getPublicPhotos().then(photos => {
        const feed = photos.map(photo => ({
            author: photo.data.displayName,
            caption: photo.data.caption,
            date: photo.data.timestamp,
            url: photo.data.url
        }));
        if (Array.isArray(feed)) {
            publicPhotos = feed;
        }
        resolve(feed);
    }).catch(e =>
        console.error('getPublicPhotos error', e)
    )
);

app.get('/photos', (req, res) => {
    res.send(publicPhotos);
});

app.get('/photos/tag/:tagName', (req, res) => {
    const photosWithTag = publicPhotos.filter(photo =>
        photo.caption.indexOf(req.params.tagName) !== -1);
    res.send(photosWithTag);
});

app.post('/blacklist', (req, res) => {
    if (!req.body.photoId) {
        return res.status(500).send({ error: 'photoId is required' });
    }
    const photoId = req.body.photoId.replace('name=', '');
    console.log('POST', photoId);
    return blacklistPhoto(photoId).then(response => res.send(response));
});

console.log('starting…');
buildPublicPhotosFeed().then(feed => {
    console.log('feed:', feed);
    console.log(`\nPhoto feed built. Serving Photo feed API on port ${PORT}`);
    app.listen(PORT);
});

const regenerateFeedLoop = () => {
    setTimeout(() => {
        buildPublicPhotosFeed().then(() => {
            // console.log('feed updated', feed);
            regenerateFeedLoop();
        });
    }, updateIntervalTime);
};

// regenerate feed every x miliseconds
regenerateFeedLoop();
