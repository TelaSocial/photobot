import Telegraf from 'telegraf';
import { getPublishers } from './dataStore';
import debug from './middlewares/debug';
import messageDataParser from './middlewares/messageDataParser';
import photoUpload from './middlewares/photoUpload';
import photoMetadataLogger from './middlewares/photoMetadataLogger';
import tos from './middlewares/termsOfService';

const app = new Telegraf(
    process.env.BOT_TOKEN,
    { username: process.env.BOT_NAME }
);

// Middlewares
app.use(debug);
app.use(messageDataParser);
app.use(tos);
app.use(photoUpload);
app.use(photoMetadataLogger);

getPublishers().then(users => {
    users.forEach(u => global.activeUsers.add(u.data.userId));
    console.log('users: ', users);
    app.startPolling(0);
});

