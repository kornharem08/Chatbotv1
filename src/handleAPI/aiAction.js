const api = require('../helper/api.js')
const urlweb = require("../helper/webview.js");
const Dict = require("../helper/dictionary");
const fb = require("../helper/fbTemplate")
// let user

// const initUser = async (sender) => {

//   this.user = await api.requestUserinfo(sender)
//   console.log("testsee:"+this.user.locale);
// }

const handleApiAiAction = async (
  sender,
  action,
  responseText,
  contexts,
  parameters
) => {
  // await initUser(sender)
  switch (action) {
    case "MainMenu":
        var elements = [
          fb.carouselTemplate("Welcome!","https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png","We have the right hat for everyone.",[fb.buttonsURL(urlweb.sisurl,"View Website"), fb.buttonsURL(urlweb.sisurl,"Schedule"),fb.buttonsURL(urlweb.sisurl,"Test")]),
          fb.carouselTemplate("Welcome!","https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png","We have the right hat for everyone.",[fb.buttonsURL(urlweb.sisurl,"View Website"), fb.buttonsURL(urlweb.sisurl,"Test")])
          // fbTemplate.carouselTemplate("Welcome!","https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png","We have the right hat for everyone.",fbTemplate.buttonsTemplate(urlweb.sisurl,"Schedule"))
        ];
        sendGenericMessage(sender, elements);
        break;
    case "send-text":
      var responseText = "This is example of Text message.";
      sendTextMessage(sender, responseText);
      break;
    case "fb-send-image":
      var imgUrl =
        "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/881e6651881085.58fd911b65d88.png";
      sendImageMessage(sender, imgUrl);
      break;
    case "send-music":
      var responseText = "The toys";
      sendTextMessage(sender, responseText);
      break;
    case "send-quick-reply":
      var replies = fb.quickreplyTemplate("test",[fb.quickreply("test","test",null),fb.quickreply("test","test",null),fb.quickreply("test","test",null)])
      sendQuickReply(sender, replies);
      break;
    case "send-carousel":
      var elements = [
        fb.carouselTemplate("Welcome!","https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png","We have the right hat for everyone.",[fb.buttonsURL(urlweb.sisurl,"View Website"), fb.buttonsURL(urlweb.sisurl,"Schedule"),fb.buttonsURL(urlweb.sisurl,"Test")]),
        fb.carouselTemplate("Welcome!","https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png","We have the right hat for everyone.",[fb.buttonsURL(urlweb.sisurl,"View Website"), fb.buttonsURL(urlweb.sisurl,"Test")])
        // fbTemplate.carouselTemplate("Welcome!","https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png","We have the right hat for everyone.",fbTemplate.buttonsTemplate(urlweb.sisurl,"Schedule"))
      ];
      sendGenericMessage(sender, elements);
      // handleCardMessages(elements, sender)
      break;
    default:
      //unhandled action, just send back the text
      sendTextMessage(sender, responseText);
  }
};


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
};

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
};
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
};
const sendQuickReply = async (recipientId, message) => { // อันนี้ quickReply
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: message
  };
  await api.callSendAPI(messageData);
};

const sendBtnMessage = async (recipientId, payload) =>{  /// https://developers.facebook.com/docs/messenger-platform/send-messages/template/button

  var messageData = {
    recipient:{
      id: recipientId
    },
    message:{
      attachment:{
        type:"template",
        payload:payload
      }
    }
  };
  await api.callSendAPI(messageData);
}


module.exports = {

    handleApiAiAction,
    sendGenericMessage,
    sendTextMessage,
    sendImageMessage,
    sendQuickReply,
    sendBtnMessage

}
