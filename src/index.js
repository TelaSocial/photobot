import Telegraf from 'telegraf';
const botName = process.env.BOT_NAME;
const app = new Telegraf(process.env.BOT_TOKEN, { username: botName });
import debugMiddleware from './middlewares/debug';
import photoUploadMiddleware from './middlewares/photoUpload';
import tos from './middlewares/termsOfService';

console.log('token', process.env.BOT_TOKEN);

app.use(debugMiddleware);
app.use(photoUploadMiddleware);
app.use(tos);

app.startPolling(0);
