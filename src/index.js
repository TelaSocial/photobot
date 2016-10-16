import Telegraf from 'telegraf';
import debug from './middlewares/debug';
import fileIdParser from './middlewares/fileIdParser';
import photoUpload from './middlewares/photoUpload';
import photoMetadataLogger from './middlewares/photoMetadataLogger';
import tos from './middlewares/termsOfService';

const app = new Telegraf(
    process.env.BOT_TOKEN,
    { username: process.env.BOT_NAME }
);

// Middlewares
app.use(debug);
app.use(fileIdParser);
app.use(photoMetadataLogger);
app.use(photoUpload);
app.use(tos);

app.startPolling(0);
