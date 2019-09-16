const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');

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
            width: 1800,
            height: 800,
            isLandscape: true
        }
    });
    const page = await browser.newPage();
    await page.goto('https://webviews-vue1.herokuapp.com/Schedule');
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
                    "is_reusable": true
                }
            }
        }),
        "filedata": fileReaderStream

    }

    var attachment
    await request({
        "method": 'POST',
        "json": true,
        "formData": formData,
        "uri": 'https://graph.facebook.com/v4.0/me/message_attachments?access_token=EAAD4BB3LHCIBALN3oGRT2f190z6NVkzSglLZBt4nZBUgXrZBoifnZByEKs9zUkCzT1UYWdWYTGFlOaSrcL8nEfuWEArICIxQZAghZCjjiG1C0pTvkxj4yXhvF3E2lmQ7b4ZBGhbyEhGIRSVySTNr7Um4dhm1HNAreWX7o1ny3h5RKIrPy4XxM60'
    },
        function (err, res, body) {
            //***
            console.log("res_attachment_id_test:" + res.body.attachment_id)
            
                attachment = res.body.attachment_id
            
        });

    await browser.close();

    return attachment
}



module.exports = {
    captureInit
}