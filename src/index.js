import Telegraf from 'telegraf';
import debugMiddleware from './middlewares/debug';
import photoUploadMiddleware from './middlewares/photoUpload';

const app = new Telegraf(
    process.env.BOT_TOKEN,
    { username: process.env.BOT_USERNAME }
);

app.use(debugMiddleware);
app.use(photoUploadMiddleware);

app.startPolling();
