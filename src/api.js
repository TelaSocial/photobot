import { getPublicPhotos } from './dataStore';
import express from 'express';

const app = express();
const PORT = process.env.PORT;

const updateIntervalTime = 15 * 1000; // 15 seconds

let publicPhotos = [];

const buildPublicPhotosFeed = () => new Promise(resolve =>
    getPublicPhotos().then(photos => {
        const feed = photos.map(photo => ({
            author: photo.data.displayName,
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

console.log('starting…');
buildPublicPhotosFeed().then(feed => {
    console.log('feed:', feed);
    console.log(`\nPhoto feed built. Serving Photo feed API on port ${PORT}`);
    app.listen(PORT);
});

const regenerateFeedLoop = () => {
    setTimeout(() => {
        buildPublicPhotosFeed().then(feed => {
            console.log('feed updated', feed);
            regenerateFeedLoop();
        });
    }, updateIntervalTime);
};

// regenerate feed every x miliseconds
regenerateFeedLoop();

