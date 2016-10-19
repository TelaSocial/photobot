import {
    getPublicPhotos,
    getPhotosWithTag,
    getPhotosWithWord,
    blacklistPhoto
} from './dataStore';
import express from 'express';
import bodyParser from 'body-parser';
import config from '../config';

const PORT = config.api.port;
const allowedAdmins = config.api.adminTokens;

const app = express();
app.use(bodyParser.json());

const buildFeed = photos =>
    photos.map(photo => ({
        author: photo.data.displayName,
        caption: photo.data.caption,
        date: photo.data.timestamp,
        url: photo.data.url
    }));

app.get('/photos', (req, res) => {
    getPublicPhotos().then(photos =>
        res.send(buildFeed(photos))
    );
});

app.get('/photos/tag/:tagName', (req, res) => {
    getPhotosWithTag(`#${req.params.tagName}`).then(photos =>
        res.send(buildFeed(photos))
    );
});

app.get('/photos/word/:word', (req, res) => {
    getPhotosWithWord(`${req.params.word}`).then(photos =>
        res.send(buildFeed(photos))
    );
});

app.post('/blacklist', (req, res) => {
    if (!req.body.photoId) {
        return res.status(500).send({ error: 'photoId is required' });
    }
    if (!req.headers.authentication) {
        return res.status(403).send({ error: 'missing authentication header' });
    }
    const isAdmin = allowedAdmins.includes(req.headers.authentication);
    if (!isAdmin) {
        return res.status(403).send({ error: 'invalid authentication token' });
    }
    const photoId = req.body.photoId.replace('name=', '');
    console.log('POST', photoId);
    return blacklistPhoto(photoId).then(response => res.send(response));
});

app.listen(PORT);

