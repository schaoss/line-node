import linebot from 'linebot'
import express from 'express'
import getJSON from 'get-json'

const bot = linebot({
  channelId: '1577421285',
  channelSecret: process.env.ChannelSecret, //heroku's config var
  channelAccessToken: process.env.ChannelAccessToken,
})
let imgArr = []

bot.on('message', e => {
  //console.log(e) //把收到訊息的 event 印出來看看

  if (e.message.type === 'text') {
    const msg = e.message.text
    if (msg.includes('福利') && imgArr[0]) {
      let rtnObj = imgArr[Math.floor(Math.random() * imgArr.length) + 1]
      e
        .reply(rtnObj)
        .then(data => {
          //console.log(msg)
        })
        .catch(error => {
          console.log('error')
        })
    }
  }
})

const randomImage = () => {
  setInterval(
    () => {
      imgArr = []
      getJSON(
        'http://gank.io/api/random/data/%E7%A6%8F%E5%88%A9/20',
        (error, response) => {
          response.results.forEach(e => {
            let imgUrl = e.url.includes('https')
              ? e.url
              : e.url.replace('http', 'https')
            imgArr.push({
              type: 'image',
              originalContentUrl: imgUrl,
              previewImageUrl: imgUrl,
            })
          })
        }
      )
    },
    60 * 1000 //1分鐘重取一次
  )
}

const app = express()
const linebotParser = bot.parser()
app.post('/', linebotParser)

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
const server = app.listen(process.env.PORT || 8080, function() {
  const port = server.address().port
  console.log('App now running on port', port)
  randomImage()
})
