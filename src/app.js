import linebot from 'linebot'
import express from 'express'
import fetch from 'isomorphic-fetch'

const googleApiKey = process.env.GoogleApiKey

const bot = linebot({
  channelId: process.env.ChannelId, //heroku's config var
  channelSecret: process.env.ChannelSecret,
  channelAccessToken: process.env.ChannelAccessToken,
})

let imgArr = []

bot.on('message', e => {
  //console.log(e) //把收到訊息的 event 印出來看看

  if (e.message.type === 'text') {
    const msg = e.message.text

    if (msg.indexOf('!') === 0 || msg.indexOf('！') === 0) {
      //call youtube api
      const qryStr = msg
        .substr(1, msg.length - 1)
        .replace(/[ `~!@#$%^&*()\-_=+[{\]};:'"\\\/?.>,<]/g, '+')
      let videoUrl = ''

      queryYoutubeVideo(qryStr)
        .then(tmp => (videoUrl = tmp))
        .then(() =>
          e.reply(videoUrl).catch(error => {
            console.log('error')
          })
        )
      console.log(videoUrl)

      e.reply(videoUrl).catch(error => {
        console.log('error')
      })
    } else if (msg.includes('福利') && imgArr[0]) {
      let rtnObj = [
        randomImage(),
        randomImage(),
        randomImage(),
        randomImage(),
        randomImage(),
      ]
      e.reply(rtnObj).catch(error => {
        console.log('error')
      })
    }
  }
})

const randomImage = () => imgArr[Math.floor(Math.random() * imgArr.length) + 1]

const queryYoutubeVideo = qryStr => {
  return fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&order=viewCount&q=${encodeURI(
      qryStr
    )}&key=${googleApiKey}`,
    { method: 'get' }
  )
    .then(response => response.json())
    .then(json => {
      return `${json.items[0].snippet.title}  https://www.youtube.com/watch?v=${
        json.items[0].id.videoId
      }`
    })
    .catch(err => {
      console.log('error')
    })
}

const getImageJson = () => {
  for (let i = 0; i < 8; i++) {
    fetch('http://gank.io/api/random/data/%E7%A6%8F%E5%88%A9/20', {
      method: 'get',
    })
      .then(response => response.json())
      .then(json => {
        json.results.forEach(e => {
          if (e.url.includes('.jpg') || e.url.includes('.jpeg')) {
            //Line 只支援jpg
            let imgUrl = e.url.includes('https')
              ? e.url
              : e.url.replace('http', 'https')
            imgArr.push({
              type: 'image',
              originalContentUrl: imgUrl,
              previewImageUrl: imgUrl,
            })
          }
        })
      })
      .catch(err => {
        console.log('error')
      })
  }
}

const app = express()
const linebotParser = bot.parser()
app.post('/', linebotParser)

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
const server = app.listen(process.env.PORT || 8080, function() {
  const port = server.address().port
  console.log('App now running on port', port)
  getImageJson()
})
