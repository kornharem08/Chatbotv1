const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');
const config = require("../../config");

async function captureInit() {

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process'
        ],
        defaultViewport: {
            width: 1540,
            height: 755,
            isLandscape: true
        }
    });
    const page = await browser.newPage();
    await page.goto('http://nuxtsiscon.herokuapp.com/Schedule/5930213055');
    await page.waitForSelector('#Showtable', {visible: true})
    await page.screenshot({ path: 'schedule.png' });
    let fileReaderStream = await fs.createReadStream('./schedule.png')
    let formData = await {
        "recipient": JSON.stringify({
            "id": "2797221146971020"
        }),
        "message": JSON.stringify({
            "attachment": {
                "type": "image",
                "payload": {
                    "is_reusable": false
                }
            }
        }),
        "filedata": fileReaderStream

    }


    let capture = await httpGet(formData)
    await browser.close();

    return capture
}

function httpGet(formData){
    return new Promise((resolve, reject) => {
   request({
      "method": 'POST',
      "json": true,
      "formData": formData,
      "uri": 'https://graph.facebook.com/v5.0/me/message_attachments?access_token=' + config.FB_PAGE_TOKEN
    },
      function (err, res, body) {
        //***
        if(!err){
          
        console.log("res:" + res.body.attachment_id)
        return resolve(res)
        }else{
          console.log("Error!!");
     
        }
      });
    })
  }

module.exports = {
    captureInit
}