const api = require('../helper/api.js')
const urlweb = require("../helper/webview.js");

const handleApiAiAction = async (
  sender,
  action,
  responseText,
  contexts,
  parameters
) => {
  switch (action) {
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
      var responseText = "Choose the options";
      var replies = [
        {
          content_type: "text",
          title: "Example 1",
          payload: "Example 1"
        },
        {
          content_type: "text",
          title: "Example 2",
          payload: "Example 2"
        },
        {
          content_type: "text",
          title: "Example 3",
          payload: "Example 3"
        }
      ];
      sendQuickReply(sender, responseText, replies);
      break;
    case "send-carousel":
      const elements = [
        {
          title: "Welcome!",
          image_url:
            "https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png", // รูปต้องใส่เป็นลิงค์ ออนไลน์เท่านั้นอะนะ
          subtitle: "We have the right hat for everyone.",
          default_action: {
            type: "web_url",
            url: urlweb.sisurl,
            messenger_extensions: true,
            webview_height_ratio: "tall",
            fallback_url: urlweb.sisurl
          },
          buttons: [
            {
              type: "web_url",
              url: urlweb.sisurl,
              title: "View Website",
              webview_height_ratio: "full",
              messenger_extensions: true
            }
          ]
        },
        {
          title: "Welcome!",
          image_url:
            "https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png", // รูปต้องใส่เป็นลิงค์ ออนไลน์เท่านั้นอะนะ
          subtitle: "We have the right hat for everyone.",
          default_action: {
            type: "web_url",
            url: urlweb.sisurl,
            messenger_extensions: true,
            webview_height_ratio: "tall",
            fallback_url: urlweb.sisurl
          },
          buttons: [
            {
              type: "web_url",
              url: urlweb.sisurl,
              title: "View Website",
              webview_height_ratio: "full",
              messenger_extensions: true
            }
          ]
        }
      ];
      sendGenericMessage(sender, elements);
      // handleCardMessages(elements, sender)
      break;
    case "test":
      let response = [
        {
          type: "web_url",
          url: "https://webviews-vue1.herokuapp.com/",
          title: "Set preferences",
          webview_height_ratio: "full",
          messenger_extensions: true
        }
      ];
      exampleWebview(sender, response);
      break;
    case "send-start":
      var info = await information(sender);
      var responseText = "The toys " + info.first_name + " " + info.last_name;
      sendTextMessage(sender, responseText);
      break;

    default:
      //unhandled action, just send back the text
      sendTextMessage(sender, responseText);
  }
};

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
};


module.exports = {

    handleApiAiAction,
    sendGenericMessage,
    sendTextMessage,
    sendImageMessage,
    sendQuickReply

}
