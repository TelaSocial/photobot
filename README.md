# photobot
A Telegram bot that receives photo attachments from users and store them
on a different server.

## Requirements

- node > v6
- yarn
  - https://yarnpkg.com/en/docs/install
- a Google Cloud app credentials json file
  - https://console.cloud.google.com/home/dashboard
  - **Create project** ![screen shot 2016-10-16 at 17 54 31](https://cloud.githubusercontent.com/assets/7760/19420426/cc86caec-93c9-11e6-88ab-f55f7be794c9.png)

## Install

```shell
git clone git@github.com:TelaSocial/photobot.git
cd photobot
yarn install
```

## Config
```shell
cp .env-sample .env
$EDITOR .env
source .env
```

## Help 
```shell
yarn run info
```

## Development

```shell
yarn start:dev:bot
```

## Production

### Run
```shell
yarn build
yarn start
```

### Monitor
```shell
yarn monitor
```

### Logs
```shell
ls *.log
tail -f THE_FILENAME_YOU_WANT 
```

### Stop
```shell
yarn stop
```

## Usage

### API

#### GET /photos

Gets the feed with all public photos in the configured gcloud app + bucket,
regardless of their captions.

```
curl --request GET \
  --url http://localhost:7314/photos
```

#### POST /blacklist

Blacklists an individual photo and remove it from the public feeds.

** body parameter: photoID**

**example **

```
curl --request POST \
  --url http://localhost:7314/blacklist \
  --header 'content-type: application/json' \
  --data '{
	"photoId": "AgADAQADn6gxG3tmKgHscgQ3VBrHqcWs5y8ABKjihbunkqIUGcQBAAEC" 
}'
```

