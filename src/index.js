import Telegraf from 'telegraf';
import debugMiddleware from './middlewares/debug';
import photoUploadMiddleware from './middlewares/photoUpload';
import tos from './middlewares/termsOfService';

const app = new Telegraf(
        process.env.BOT_TOKEN,
        { username: process.env.BOT_NAME });

app.use(debugMiddleware);
app.use(photoUploadMiddleware);
app.use(tos);

app.startPolling(0);
