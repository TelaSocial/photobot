# photobot
A Telegram bot that receives photo attachments from users and store them
on Google Cloud.

## Requirements

- node > v6
- yarn
  - https://yarnpkg.com/en/docs/install
- gcloud sdk
  - https://cloud.google.com/sdk/docs/quickstarts
- a Google Cloud app credentials json file
  - https://console.cloud.google.com/home/dashboard
  - **Create project**
    - ![screen shot 2016-10-16 at 17 54 31](https://cloud.githubusercontent.com/assets/7760/19420426/cc86caec-93c9-11e6-88ab-f55f7be794c9.png)
  - **Create credential**
    - ![screen shot 2016-10-19 at 09 04 45](https://cloud.githubusercontent.com/assets/7760/19516545/3ad90a92-95db-11e6-90a8-124cb4063fc0.png)
    - ![screen shot 2016-10-19 at 09 05 02](https://cloud.githubusercontent.com/assets/7760/19516549/404549d2-95db-11e6-83c1-8a35c650d2d3.png)
 - download the .json file and copy to the root of photobot project as ```keyfile.json```

## Install

```shell
git clone git@github.com:TelaSocial/photobot.git
cd photobot
yarn install
```

## Config
```shell
cp config-sample.js config.js
$EDITOR config.js
```

With gcloud sdk configured to your gcloud app, you will have to create the indexes with:

```shell
yarn build:index
```

## Help 
```shell
yarn run info
```

## Development

```shell
yarn start:dev:bot
yarn start:dev:api
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
ls logs
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

#### GET /photos/tag/:tagName

Gets the feed of public photos that has a hashtag in it's caption

```
curl --request GET \
  --url http://localhost:7314/photos/tag/latino
```

#### GET /photos/word/:word

Gets the feed of public photos that contains a word in it's caption

```
curl --request GET \
  --url http://localhost:7314/photos/word/telasocial
```

#### GET /photos/album/:album

Gets the feed of public photos that contains a word in it's caption

```
curl --request GET \
  --url http://localhost:7314/photos/album/destaques
```

#### POST /blacklist

Blacklists an individual photo and remove it from the public feeds.

***headers:*** Authentication

***body parameter:*** photoId

***example:***

```
curl --request POST \
  --url http://localhost:7314/blacklist \
  --header 'authentication: 98765498765498765' \
  --header 'content-type: application/json' \
  --data '{
	"photoId": "AgADAQADn6gxG3tmKgHscgQ3VBrHqcWs5y8ABKjihbunkqIUGcQBAAEC" 
}
```

#### POST /photos/album/:album

Add a photo to an album

***headers:*** Authentication

***body parameter:*** photoId

***example:***

```
curl --request POST \
  --url http://localhost:7314/photos/album/showcase \
  --header 'authentication: 98765498765498765' \
  --header 'content-type: application/json' \
  --data '{
	"photoId": "AgADAQADoKgxG3tmKgHaenVjPegTTQn25y8ABPtXeuwz8Dgd6zIBAAEC" 
}'
```

## TBD

- remove photo from album
- ban user

