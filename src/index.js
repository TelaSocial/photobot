import Telegraf from 'telegraf';
import gcloud from 'google-cloud';
import path from 'path';
import debug from './middlewares/debug';
import messageDataParser from './middlewares/messageDataParser';
import photoUpload from './middlewares/photoUpload';
import photoMetadataLogger from './middlewares/photoMetadataLogger';
import tos from './middlewares/termsOfService';

const ds = gcloud.datastore({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: path.join(__dirname, '../keyfile.json')
});
const query = ds.createQuery('TosAcceptance')
.filter('answer', '=', true);
global.activeUsers = new Set();


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

ds.runQuery(query, (err, users) => {
    users.forEach(u => global.activeUsers.add(u.data.userId));
    app.startPolling(0);
    console.log('Bot is alive');
});

