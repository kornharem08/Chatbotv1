const apiai = require("apiai");
const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const axios = require('axios');
const request = require('request')
const app = express();
//Import Config file
const config = require("./config");
const api = require("./src/helper/api.js");
const urlweb = require("./src/helper/webview.js");
const assets = require("./src/assets");


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/////// information user
var f_name ;
var l_name ;
var test_name;
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

  api.callSendAPI(messageData);
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
  await api.callSendAPI(messageData);
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
  await api.callSendAPI(messageData);
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
  await api.callSendAPI(messageData);
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
  await api.callSendAPI(messageData);
}

const information = async (recipientId) => { ///ค่อยปรับปรุงเป็นฟังก์ชั่นรูปแบบที่เหมาะสม

  var infoBase = {}
  const url = "https://graph.facebook.com/" + recipientId + "?fields=first_name,last_name,profile_pic&access_token=" + config.FB_PAGE_TOKEN;
  await axios.get(url)
    .then(function (response) {
 
        infoBase = response.data

    })
    .catch(function (error) {
      console.log(error.response.headers);
    });
    return infoBase;

}




const handleApiAiAction = async(sender, action, responseText, contexts, parameters) => {
  
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
      const elements = [{////hello
        "title":"Welcome!",
        "image_url": ``,
        "subtitle":"We have the right hat for everyone.",
        "default_action": {
          "type": "web_url",
          "url": urlweb.sisurl,
          "messenger_extensions": true,
          "webview_height_ratio": "tall",
          "fallback_url": urlweb.sisurl
        },
        "buttons":[
          {
            "type":"web_url",
            "url":urlweb.sisurl,
            "title":"View Website",
            "webview_height_ratio": "full",
            "messenger_extensions": true
          }        
        ]      
        }];
        sendGenericMessage(sender,elements)
      // handleCardMessages(elements, sender)
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
        var info = await information(sender) 
        var responseText = "The toys "+info.first_name+" "+info.last_name;
        sendTextMessage(sender, responseText);
        break;
     
    default:
      //unhandled action, just send back the text
      sendTextMessage(sender, responseText);
  }

}



async function handleCardMessages(messages, sender) { /// < เป็นตัวอย่างสำหรับทำฟังก์ชั่นใช้ซํ้าที่น่าเลียนแบบอยู่เหมือนกัน เพราะก่อนหน้านี้สมองเบลอๆยังไม่รู้ว่ามันใช้ทำอะไร
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
          url: message.buttons[b].postback,
          webview_height_ratio: full,
          messenger_extensions: true
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
  await api.callSendAPI(messageData);
}


var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});