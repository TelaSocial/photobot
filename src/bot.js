import Telegraf from 'telegraf';
import { gds, gcs, getPublishers } from './dataStore';
import debug from './middlewares/debug';
import addDatastore from './middlewares/addDataStore';
import messageDataParser from './middlewares/messageDataParser';
import photoUpload from './middlewares/photoUpload';
import photoMetadataLogger from './middlewares/photoMetadataLogger';
import tos from './middlewares/termsOfService';
import config from '../config';

const app = new Telegraf(config.tg.botToken,
            { username: config.tg.botUsername });

// Middlewares
app.use(debug);
app.use(addDatastore(gds, gcs));
app.use(messageDataParser);
app.use(tos);
app.use(photoUpload);
app.use(photoMetadataLogger);

getPublishers().then(users => {
    if (Array.isArray(users)) {
        users.forEach(u => global.activeUsers.add(u.data.userId));
        console.log('users: ', users);
    }
    app.startPolling(0);
}).catch(e => console.error(e));

