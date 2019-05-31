
const apiai = require("apiai");
const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const axios = require('axios');
const request = require('request')
const app = express();
//Import Config file
const config = require("./config");



app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/////// information user
var f_name ;
var l_name ;
 //ตรงนี้ไม่ได้เพราะว่าฟังก์ชั่นร้องขอ parameter //เราไม่มี recipientId

//app.listen(3000);
function setupGetStartedButton(res) {
  var messageData = {
    "get_started": [
      {
        "payload": "USER_DEFINED_PAYLOAD"
      }
    ]
  };


  // Start the request
  request({
    url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=EAAD4BB3LHCIBALN3oGRT2f190z6NVkzSglLZBt4nZBUgXrZBoifnZByEKs9zUkCzT1UYWdWYTGFlOaSrcL8nEfuWEArICIxQZAghZCjjiG1C0pTvkxj4yXhvF3E2lmQ7b4ZBGhbyEhGIRSVySTNr7Um4dhm1HNAreWX7o1ny3h5RKIrPy4XxM60',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    form: messageData
  },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Print out the response body        
        res.send(body);
      } else {
        // TODO: Handle errors
        res.send(body);
      }
    });
}

app.get("/", function (req, res) {
  res.send("Hello world, I am a chat bot");
});
app.get("/ok", function (req, res) {
  res.send("ok");
});

app.get('/webhook', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === 'hook_user') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
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
  }else if(messageSticker){    /////เพิ่ม messageSticker เข้าไป

    sendToApiAi(senderID, messageSticker);
  
  } else if (messageAttachments) {
    handleMessageAttachments(messageAttachments, senderID);
  }
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






app.post("/webhook/", function (req, res) {
  var data = req.body; 
  var data2 = JSON.stringify(req.body);
  var name = data2.timezone;
  console.log("TimeZone1" + data)
  console.log("TimeZone2" + name)
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
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });
    // Assume all went well.
    // You must send back a 200, within 20 seconds
    res.sendStatus(200);
  }
});

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
  callSendAPI(messageData);
}
const sessionIds = new Map();

/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
 *
 */
const callSendAPI = async (messageData) => {

  const url = "https://graph.facebook.com/v3.0/me/messages?access_token=" + config.FB_PAGE_TOKEN;
  await axios.post(url, messageData)
    .then(function (response) {
      if (response.status == 200) {
        var recipientId = response.data.recipient_id;
        var messageId = response.data.message_id;
       // information(recipientId);
        if (messageId) {
          console.log(
            "Successfully sent message with id %s to recipient %s",
            messageId,
            recipientId
          );
        } else {
          console.log(
            "Successfully called Send API for recipient %s",
            recipientId
          );
        }
      }
    })
    .catch(function (error) {
      console.log(error.response.headers);
    });
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

  sendTypingOff(sender);

  if (responseText == "" && !isDefined(action)) {
    //api ai could not evaluate input.
    console.log("Unknown query" + response.result.resolvedQuery);
    sendTextMessage(
      sender,
      "I'm not sure what you want. Can you be more specific?"
    );
  } else if (isDefined(action)) {
    handleApiAiAction(sender, action, responseText, contexts, parameters);
  } else if (isDefined(responseData) && isDefined(responseData.facebook)) {
    try {
      console.log("Response as formatted message" + responseData.facebook);
      sendTextMessage(sender, responseData.facebook);
    } catch (err) {
      sendTextMessage(sender, err.message);
    }
  } else if (isDefined(responseText)) {
    sendTextMessage(sender, responseText);
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

  callSendAPI(messageData);
}

const sendTextMessage = async (recipientId, text) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: text
    }
  };
  await callSendAPI(messageData);
}
const sendImageMessage = async (recipientId, imageUrl) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: imageUrl
        }
      }
    }
  };
  await callSendAPI(messageData);
}
const sendQuickReply = async (recipientId, text, replies, metadata) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: text,
      metadata: isDefined(metadata) ? metadata : "",
      quick_replies: replies
    }
  };
  await callSendAPI(messageData);
}


const exampleWebview = async (recipientId, messageForm) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "OK, let's set your room preferences so I won't need to ask for them in the future.",
          buttons: messageForm
        }
      }
    }

  };
  await callSendAPI(messageData);
}

function information(recipientId){ ///ค่อยปรับปรุงเป็นฟังก์ชั่นรูปแบบที่เหมาะสม
  let data_first_name 
  let data_last_name

  let infoObjBase = {
    fname: data_first_name,
    lname: data_last_name
  }
  
  const url = "https://graph.facebook.com/" + recipientId + "?fields=first_name,last_name,profile_pic&access_token=" + config.FB_PAGE_TOKEN;
   axios.get(url)
    .then(function (response) {
      
        data_first_name = response.data.first_name;
        data_last_name = response.data.last_name;
      
      /*this.f_name = infoObjBase.fname;
      this.l_name = infoObjBase.lname;
      console.log("Name: "+f_name);
      console.log("Lastname : "+l_name);*/
      // console.log("infoObject1:"+JSON.stringify(infoObjBase.fname))
      // console.log("infoObject2:"+infoObjBase.fname)
      //let infoObj = JSON.parse(infoObjBase)
      
     // console.log("fNAME:"+infoObj.fname+"lName:"+infoObj.lname)
      

    })
    .catch(function (error) {
      console.log(error.response.headers);
    });

    console.log("come to create infoObjBase :"+infoObjBase.fname)
    return infoObjBase;

  //console.log("messageForm:"+JSON.stringify(messageForm));
  //await callSendAPI(messageData);
}




function handleApiAiAction(sender, action, responseText, contexts, parameters) {
  
  switch (action) {
    case "send-text":
      var responseText = "This is example of Text message."
      sendTextMessage(sender, responseText);
      break;
    case "fb-send-image":
      var imgUrl = "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/881e6651881085.58fd911b65d88.png";
      sendImageMessage(sender, imgUrl);
      break;
    case "send-music":
      var responseText = "The toys";
      sendTextMessage(sender, responseText);
      break;
    // case "send-name":
    // var responseText = {
    //   recipient:{
    //   id: recipientId
    //   },
    //     message:{
    //     attachment:{
    //     type:"template",
    //       payload:{
    //       template_type:"button",
    //         Text:"YOUR TEXT HERE" + name+ " "+lname+" YOUR TEXT HERE ",
    //         buttons:[{
    //         type:"postback",
    //           title:"TANAKORN",
    //           payload:"start"

    //         },]
    //       }
    //     }
    //     }
    //   };

    //      sendTextMessage(sender, responseText);
    // break;
    case "send-quick-reply":
      var responseText = "Choose the options"
      var replies = [{
        "content_type": "text",
        "title": "Example 1",
        "payload": "Example 1",
      },
      {
        "content_type": "text",
        "title": "Example 2",
        "payload": "Example 2",
      },
      {
        "content_type": "text",
        "title": "Example 3",
        "payload": "Example 3",
      }];
      sendQuickReply(sender, responseText, replies)
      break;
    case "send-carousel":
      const elements = [{

        "title": "<TITLE_TEXT>",
        "image_url": "https://www.stepforwardmichigan.org/wp-content/uploads/2017/03/step-foward-fb-1200x628-house.jpg",
        "subtitle": "We have the right hat for everyone.We have the right hat for everyone.We have the right hat for everyone.",

        "buttons": [{
          "type": "web_url",
          "url": "https://webviews-vue1.herokuapp.com/",
          "title": "Set preferences",
          "webview_height_ratio": "compact",
          "messenger_extensions": true
        }
        ]
      }];

      handleCardMessages(elements, sender)

      break;
    case "test":
      let response = [{
        "type": "web_url",
        "url": "https://webviews-vue1.herokuapp.com/",
        "title": "Set preferences",
        "webview_height_ratio": "full",
        "messenger_extensions": true
      }]
      exampleWebview(sender, response)
      break;
      case "send-start":
        var info = information(sender); // ตรงนี้เราลองเปลี่ยนเป็น let information = information(sender) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        console.log("Information:FNAME"+info)
        var responseText = "The toys ";
        sendTextMessage(sender, responseText);
        break;
     
    default:
      //unhandled action, just send back the text
      sendTextMessage(sender, responseText);
  }

}


async function handleCardMessages(messages, sender) {
  let elements = [];
  for (var m = 0; m < messages.length; m++) {
    let message = messages[m];
    let buttons = [];
    for (var b = 0; b < message.buttons.length; b++) {
      let isLink = message.buttons[b].postback.substring(0, 4) === "http";
      let button;
      if (isLink) {
        button = {
          type: "web_url",
          title: message.buttons[b].text,
          url: message.buttons[b].postback
        };
      } else {
        button = {
          type: "postback",
          title: message.buttons[b].text,
          payload: message.buttons[b].postback
        };
      }
      buttons.push(button);
    }
    let element = {
      title: message.title,
      image_url: message.imageUrl,
      subtitle: message.subtitle,
      buttons: buttons
    };
    elements.push(element);
  }
  await sendGenericMessage(sender, elements);
}

const sendGenericMessage = async (recipientId, elements) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: elements
        }
      }
    }
  };
  await callSendAPI(messageData);
}


var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});