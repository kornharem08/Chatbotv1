const apiai = require("apiai");
const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid");
// const request = require('request')
const app = express();
//Import Config file
const config = require("./config");
const api = require("./src/helper/api")
const handle = require("./src/handleAPI/aiAction");
const handlePb = require("./src/handleAPI/aiPostback");
const func = require("./src/views/function.js");
const notification = require("./src/helper/googlesheet");
const cors = require('cors');
//const assets = require("./src/assets");
const { google } = require('googleapis');
const keys = require('./src/helper/keyapi/SISCONNECT-0779c8454af1.json')

////////////////////////////////// Redis
var Redis = require('ioredis');
var redis = new Redis(process.env.REDIS_URL);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var allowedOrigins = ['http://localhost:8080',
  'https://webviews-vue1.herokuapp.com','https://nuxtsiscon.herokuapp.com'];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


async function gsrun(cl) {
  const gsapi = google.sheets({ version: 'v4', auth: cl });
  const opt = {
    spreadsheetId: '1IfhrtQJX7wY3jpyMqm8Ze7AxIBdJkQPGjptRvxT4h00',
    range: 'A2:C'
  };
  let data = await gsapi.spreadsheets.values.get(opt);
  let dataArray = data.data.values
  console.log("dataArray:"+dataArray)
  // let newDataArray = dataArray.map(function(r){
  //   //console.log("datafromGoogleSheet:"+r[0])
  //   return r
  // })
  // console.log("datafromGoogleSheetNew:"+dataArray[0][0])
  await checknotiDate(dataArray)

}

async function checknotiDate(dataArray) {
  let d = new Date()
  let date = d.getDate()
  let month = d.getMonth() + 1
  if (month < 10) {
    month = `0${month}`
  }
  let year = d.getFullYear()
  let today = `${date}/${month}/${year}`
  
  for (let i = 0; i < dataArray.length; i++) {

    if (dataArray[i][1] == today) {
      sendnotiMessage(dataArray[i][0])
    
    }
    

  }

}

async function sendnotiMessage(message) {

  let senderidAll = await api.requestAllSenderID()
  senderidAll.forEach(element => {
    func.sendTextMessage(element, message)
  });

}


app.get("/", function (req, res) {
  res.send("Hello world, I am a chat bot");
});


app.get('/webhook', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === 'sis_bot') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.get("/notihook", async (req, res) => {

  const client = new google.auth.JWT(

    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']

  );
  ////////////////////////////////////// ส่วนของ Google Sheet
  await client.authorize(function (err, tokens) {

    if (err) {
      console.log(err);
      return;
    } else {
      console.log('Connected!');
      gsrun(client)
    }

  });
  //////////////////////////////////////// ส่วนของ Exam Notification
  await examNotification()

  res.sendStatus(200)

});


function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  if (!sessionIds.has(senderID)) {
    sessionIds.set(senderID, uuid.v1());
  }

  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageSticker = message.sticker_id;   ////// เพิ่ม messageSticker เข้าไป
  var messageAttachments = message.attachments;

  if (messageText) {
    //send message to api.ai
    sendToApiAi(senderID, messageText);
  } else if (messageSticker) {    /////เพิ่ม messageSticker เข้าไป

    sendToApiAi(senderID, messageSticker);

  } else if (messageAttachments) {
    handleMessageAttachments(messageAttachments, senderID);
  }
}

function receivedQuickRp(event) {
  let senderID = event.sender.id;
  let postback = JSON.parse(event.message.quick_reply.payload)
  console.log("receivedQuickRp:"+postback)
  let value
  let campagin

  if(postback.data){
  value = postback.data
  }

  if(postback.campagin){
  campagin = postback.campagin
  }
  // var title = postback.title
  // var payload = postback.payload


  if (!sessionIds.has(senderID)) {
    sessionIds.set(senderID, uuid.v1());
  }

  if (postback) {

    sendToPostbackAi(senderID, campagin, value)

  }

}



function receivedPostback(event) {
  let senderID = event.sender.id;
  let postback = event.postback;


  let title = postback.title
  let payload = postback.payload


  if (!sessionIds.has(senderID)) {
    sessionIds.set(senderID, uuid.v1());
  }

  if (payload) {

    sendToPostbackAi(senderID, payload, null)

  }


}

function sendToPostbackAi(senderID, postback, value) {

  sendTypingOn(senderID)
  handlePostback(senderID, postback, value)
}


function handlePostback(senderID, postback, value) {

  sendTypingOff(senderID)
  handlePb.handleAiPostback(senderID, postback, value)
}




function sendToApiAi(sender, text) {
  sendTypingOn(sender);
  let apiaiRequest = apiAiService.textRequest(text, {
    sessionId: sessionIds.get(sender)
  });
  apiaiRequest.on("response", response => {
    if (isDefined(response.result)) {
      handleApiAiResponse(sender, response);
    }
  });

  apiaiRequest.on("error", error => console.error(error));
  apiaiRequest.end();
}






app.post("/webhook/", async function (req, res) {
  var data = req.body;
  var data2 = JSON.stringify(req.body);
  var name = data2.timezone;
  console.log("Data" + data2)
  // Make sure this is a page subscription
  if (data.object == "page") {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function (pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;
      console.log("=========Data===========" + pageID)
      // Iterate over each messaging event
      pageEntry.messaging.forEach(function (messagingEvent) {

        if (messagingEvent.postback) {
          receivedPostback(messagingEvent)
        } else if (messagingEvent.message.quick_reply) {
          console.log("Quick-Reply:"+messagingEvent.message.quick_reply)
         let qr = messagingEvent.message.quick_reply.payload
         let jsonparse = JSON.parse(qr)
           console.log("qr:" +jsonparse.campagin)
          
          /// ต้องทำ session อีกทีนึง
          // receivedQuickRp(messagingEvent)




        } else if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });
    // Assume all went well.
    // You must send back a 200, within 20 seconds
    res.sendStatus(200);
  } else if (data.type == "authenticate") {
    let status = null
    await redis.get(`${data.senderid}`, function (err, result) {
      let auth = JSON.parse(result)
      console.log("auth:" + auth.status)
      if (auth.status == "authenticate") {
        authenticate(data)
        status = 200
      }else{
        status = 404
      }

    });
    if(status == 200){
      res.sendStatus(200);
    }else if (status == 404){
      res.status(404).send('Sorry, we cannot find that senderid! maybe senderid is wrong!');
    }
  }
});

async function authenticate(data) {

  let item = {
    senderId: data.senderid,
    studentID: data.username,
    lang: "ENG",
    notification: false
  }

  let responsestatus = await api.insertProfile(item)
  if (responsestatus == 200) {
    redis.mset(new Map([[`${data.senderid}`, `{"status":"member"}`]]));
    func.mainmenu(data.senderid)
  }

}

const examNotification = async () => {
  let listwho = await api.findWhohaveExamNoti()
  let studentid = []
  let examtime = []
  let d = new Date()
  let date = d.getDate()
  let month = d.getMonth() + 1
  let year = d.getFullYear() + 543
  let today = `${date}/${month}/${year}`
  let message = ""

  await listwho.forEach(element => {
    let studentinfo = {
      senderId: element.senderId,
      studentID: element.studentID
    }
    studentid.push(studentinfo)
  });

  for (let index = 0; index < studentid.length; index++) {

    examtime = await api.requestTimeExam(studentid[index].studentID)
    for (let indexE = 0; indexE < examtime.length; indexE++) {
      if (examtime[indexE].ExamDate == today) {
        let From = examtime[indexE].From
        let To = examtime[indexE].To
        let SubjectNameEN = examtime[indexE].SubjectNameEN
        let ExamRoom = ""
        if (examtime[indexE].ExamRooms[0]) {
          ExamRoom = examtime[indexE].ExamRooms[0]
        } else {
          ExamRoom = "ยังไม่ระบุ"
        }
        console.log("ExamRoom:" + examtime[0].ExamRooms[0])
        message = `ทดสอบการแจ้งเตือน: วันนี้มีสอบนะจ๊ะ เริ่มสอบ ${From} ถึง ${To} วิชา ${SubjectNameEN} ห้อง ${ExamRoom}`
        func.sendTextMessage(studentid[index].senderId, message)
      }
    }

  }
}


const apiAiService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN, {
  language: "th",
  requestSource: "fb"
});

const sendTypingOn = (recipientId) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };
  api.callSendAPI(messageData);
}
const sessionIds = new Map();

const isDefined = (obj) => {
  if (typeof obj == "undefined") {
    return false;
  }
  if (!obj) {
    return false;
  }
  return obj != null;
}
function handleApiAiResponse(sender, response) {
  let responseText = response.result.fulfillment.speech;
  let responseData = response.result.fulfillment.data;
  let messages = response.result.fulfillment.messages;
  let action = response.result.action;
  let contexts = response.result.contexts;
  let parameters = response.result.parameters;
  console.log("Contexts:" + contexts)
  sendTypingOff(sender);

  if (responseText == "" && !isDefined(action)) {
    //api ai could not evaluate input.
    console.log("Unknown query" + response.result.resolvedQuery);
    func.sendTextMessage(
      sender,
      "I'm not sure what you want. Can you be more specific?"
    );
  } else if (isDefined(action)) {
    handle.handleApiAiAction(sender, action, responseText, contexts, parameters);
  } else if (isDefined(responseData) && isDefined(responseData.facebook)) {
    try {
      console.log("Response as formatted message" + responseData.facebook);
      func.sendTextMessage(sender, responseData.facebook);
    } catch (err) {
      func.sendTextMessage(sender, err.message);
    }
  } else if (isDefined(responseText)) {
    func.sendTextMessage(sender, responseText);
  }
}

/*
* Turn typing indicator off
*
*/
const sendTypingOff = (recipientId) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_off"
  };

  api.callSendAPI(messageData);
}



var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});