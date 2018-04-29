import lineBot from 'linebot'
import express from 'express'

const bot = linebot({
  channelId: '1577421285',
  channelSecret: '673c52073ec0ca7b627b1c66908ca9dd',
  channelAccessToken: '8VdwJLiw+DJPiZ+aCIoCz2azViyfqQ22FI5AGVJ+qSU5pERy7+6Ga+Dx4qMKfeg8+aQ2DqXznWR2BEbAHbWHM6MARmP57GCVDmM+Tg5s0WX6GbCItO2ITwOs1Vkjw2N13sonx8SUbwV4sS2rIU4VwQdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function(event) {
  console.log(event); //把收到訊息的 event 印出來看看
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});