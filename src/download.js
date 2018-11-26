import request from 'request'
import fs from 'fs'
import mkdirp from 'mkdirp'
import fetch from 'node-fetch'
import 'babel-polyfill'

const FOLDER = 'F:/auto-downloads/'
let imgArr = []

mkdirp(FOLDER)

const downloadPic = async (src, dest) => {
  const out = fs.createWriteStream(dest)
  await fetch(src).then(res => {
    res.body
      .on('data', chunk => {
        out.write(chunk)
      })
      .on('end', () => {
        out.end()
        console.log(dest + ' saved!')
      })
      .on('error', () => {
        console.log(e)
        out.end()
        fs.unlink(dest)
      })
  })
}

const getImageJson = async () => {
  imgArr = []
  await fetch('https://gank.io/api/data/%E7%A6%8F%E5%88%A9/100/1', {
    method: 'get'
  })
    .then(response => response.json())
    .then(json => {
      json.results.forEach(tmp => {
        let imgUrl = tmp.url
        if (imgArr.every(e => e !== imgUrl)) {
          imgArr.push(imgUrl)
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
}

const randomString = () => {
  return Math.random()
    .toString(36)
    .substring(7)
}

const main = async () => {
  await getImageJson()
  imgArr.forEach(async url => {
    try {
      const tmpArr = url.split('?')[0].split('.')
      const ext = tmpArr[tmpArr.length - 1]
      await downloadPic(url, FOLDER + randomString() + '.' + ext)
    } catch (e) {
      console.log(e)
    }
  })
}

main()
