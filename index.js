const apiai = require('@google-cloud/dialogflow');
const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const projectId = 'botj-jldh'

const credentials = {
  client_email: "sisbot@botj-jldh.iam.gserviceaccount.com",
  private_key:"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDT0TzoWY8k0+3x\nY5+GLgYjkPTxezPpU6bMFP2A1osqR73I4H6sysGKjhl4D8ylaR9bRQ0PRa/IBHzn\nQi3Y5taAmc8PSG1UQy35hPVidw77D72KwFQKHeb/BPtZZHPx2s4btEpcpaE8KvCH\n/hGArA23n5x4SW9DZjGD6C+Ys4kywYrbilNFCbhhc088Qi8c3D7S7LOEAu5i5Ef4\nySGV6NROT/6KCsmeZCp1EMU/JeCDVprG68KQHBu7NT3Y8+ckJqV4HXbWzggcpLpe\n6yGmzwOG7Hu+K86KfgGbl+Z1yRYIuZw+XHG/KjYj0ctTyVl5hHn9O8ZgNppU93b4\n9Q8eu7HxAgMBAAECggEAWWScYmjtpvrEGFRVjlDdKWRzY3h9+5Jgug9/v0CMQf8+\nAslv3KfDT6DR8eAlG4gGgkPdk5zy5ySxu/2rkLc3PtXq04XbEi05+WzaDMC3c1B8\ny1KJBS4Cf40QMPVak28m/f00Ru5l4hkzIwmgRGAYd+7mH8PKL7Uw33z9nWHj3KWZ\n1ya8UYIfciWayKv31YuBT0GPRwx676jBpXM0a88g+3LwT+TCi82sc8E9csyBN7Ph\nbEgQXpm+V7XepZphMOHOz7X+fsYC55aTSZP9nJ7DiqL9UgaTs/95U+68lu+YC1sm\nAcfYdB03UZ5hny/1dMi072LqANMmRWJXIMZuasTH2wKBgQD5sMPZrF2VPQ9hkayX\n6s5duLLXRx2DBAd88V9cMdl/48V5sRv4hpds5oUSgS33E+P4ZsYjj0VFOOaNhxK2\ngXnXwovndG+4OYrgj7moqNDQ/tShg4xeRUFHt+VxMfNds1TOpQ9T4fOTOGuIzfg/\ntpwq0AamyqHfeiNfBa62bY9wLwKBgQDZK3kwluVWlBVk34ZdZwyp3Jtrj+PZx/Ie\nv/guXo++8ccKMkqy+DU3iMg/ViIeLpGZJDdUoJG1EYUAtfrzXCj+zmFi/JGs13Ua\ntr3bfHNiA7ZtSLvwg0Ig42LtiYKowII6eF20lcRKo8gB7k3csu9m20bthbvVo/8W\nHKlLD6dX3wKBgQDHXn4zS2753+RtKq0eLE2VBgo+3LjSyR/VgsF60w7xEAS481L7\nMTStrq7opJ74HzizOhTRhe9wo0tsDEND2MRaJCwjppQiDEg4oGpFIm6Bwkgzot8s\n0q2aP1sD9Dd3RN7dlWxUtSERF0a92IB1FzFA+hOlkDyKPXMKx3XGklqq3wKBgCGC\nE7Drl3dEYgiudIz02X9cCp8OFJoFv9X+yMxeys8rfwqTt/LlWVC4Si17nMgLZ2u5\nqs/j9pd5nIv/iDkEf07RiTU8wz1oASmeCK1VBniZGgzCrDzwA8QPUbRVA1QGYBGl\ngM/cS+04WCP0IQ9sjIPSUZ9UgybzpuhCg9yRDcEBAoGBAPlrRXEbYX9b4iZohM+e\nRdSpfY/MCu86/VAd2zwc2/McID+OiXylsuVjqERC13U7DkU5zmZ66dleF63lwMzH\ntrmc8AwVn6U+JJZ8ich2Jk5oK/vqopApWuQP5Rb28GmvoOIRwbKAIJ2nyXePPKyP\niUSOPmoko8iBR0Wjt4FLnGAl\n-----END PRIVATE KEY-----\n",
};
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
const sessionIds = new Map();

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
  if(date < 10){
    date = `0${date}`
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
    req.query['hub.verify_token'] === config.FB_VERIFY_TOKEN) {
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

  res.send(200)

});


const receivedMessage = async (event) => {
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
    await sendToApiAi(senderID, messageText);
  }
  // } else if (messageAttachments) {
  //   handleMessageAttachments(messageAttachments, senderID);
  // }
}

function receivedQuickRp(event) {
  let senderID = event.sender.id;
  let qr = event.message.quick_reply.payload
  let postback = JSON.parse(qr)  
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


 const sessionClient = new apiai.SessionsClient({
    credentials:credentials,
  });

const sendToApiAi = async (sender, text) => {
  sendTypingOn(sender);
   // Create a new session
  
   const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionIds.get(sender));
    console.log("sessionPath: ",sessionPath)
   console.log()
  let apiaiRequest = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: text,
        // The language used by the client (en-US)
        languageCode: 'th-TH',
      },
    },
  }

    // Send request and log result
    const responses = await sessionClient.detectIntent(apiaiRequest);
    console.log('Detected intent');
    console.log("result : ",responses)
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
    ///
  // apiaiRequest.on("response", response => {
  //   if (isDefined(response.result)) {
  //     handleApiAiResponse(sender, response);
  //   }
  // });

  // apiaiRequest.on("error", error => console.error(error));
  // apiaiRequest.end();
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
        //  let qr = messagingEvent.message.quick_reply.payload
        //  let jsonparse = JSON.parse(qr)
        //    console.log("qr:" +jsonparse.campagin)
          
          /// ต้องทำ session อีกทีนึง
          try{
          receivedQuickRp(messagingEvent)
          }catch{
            console.log("receivedQuickRp error")
          } 



        } else if (messagingEvent.message) {
           receivedMessage(messagingEvent).then(() => {}).catch((e) => console.log("messagingEvent:",e))
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
  let message = "วันนี้มีสอบนะจ๊ะ: "
  
  await listwho.forEach(element => {
    let studentinfo = {
      senderId: element.senderId,
      studentID: element.studentID
    }
    studentid.push(studentinfo)
  });
  let setExam = await setExamcurrently(listwho[0].senderId)
  console.log("setExam:"+setExam.eduyear+"/"+setExam.eduterm+"/"+setExam.miniterm)
  for (let index = 0; index < studentid.length; index++) {

    examtime = await api.requestTimeExam(studentid[index].studentID,setExam.eduyear,setExam.eduterm,setExam.miniterm)
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
        message += `เริ่มสอบ ${From} ถึง ${To} วิชา ${SubjectNameEN} ห้อง ${ExamRoom}`
        func.sendTextMessage(studentid[index].senderId, message)
      }
    }

  }
}

async function setExamcurrently(senderid) {
  let studentID = await api.requestStudentID(senderid)
  let oldgrade = await api.requestinfoAllgrade(studentID)
  let eduyear = groupBy(oldgrade, 'EduYearTH')
  let d = new Date()
  let month = d.getMonth() + 1
  let lastelement
  let lastterm
  let miniterm
   let text = []
   for (let i = 0; i < Object.keys(eduyear).length; i++) {
     let eduterm = groupBy(eduyear[`${Object.keys(eduyear)[i]}`], 'EduTerm')
     let term
      if(Object.keys(eduterm) == "1"){
        term = 1
      }else if(Object.keys(eduterm) == "1,2"){
        term = 2
      }else if(Object.keys(eduterm) == "1,2,3"){
        term = 3
      }
       text.push({eduyear:Object.keys(eduyear)[i],eduterm:term})
      
   }
  
   lastterm = text[text.length-1].eduterm
    
   if(lastterm == 1 && month < 11 && month > 7 ){
      miniterm = "M"
    }else if(lastterm == 2 && month <= 4 && month > 1){
      miniterm = "M"
    }else if(lastterm == 1 && month >=11 && month < 13){
      miniterm = "F"
    }else if(lastterm == 2 && month > 4 && month <= 7){
      miniterm = "F"
    }

  lastelement = { eduyear:text[text.length-1].eduyear, eduterm:lastterm, miniterm:miniterm }
   return lastelement
 }
 
 function groupBy(objectArray, property) {
   return objectArray.reduce(function (acc, obj) {
     var key = obj[property]
     if (!acc[key]) {
       acc[key] = []
     }
     acc[key].push(obj)
     return acc;
   }, {})
 }



// const apiAiService = apiai(config.API_AI_CLIENT_ACCESS_TOKEN, {
//   language: "th",
//   requestSource: "fb"
// });

const sendTypingOn = (recipientId) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "typing_on"
  };
  api.callSendAPI(messageData);
}

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
  console.log("Parameters:" + JSON.stringify(parameters))
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