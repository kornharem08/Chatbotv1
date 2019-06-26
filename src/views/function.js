const api = require('../helper/api.js');
const fb = require("../helper/fbTemplate");
const Dict = require("../helper/dictionary");

const mainmenu =(sender) => {
   
   let elementsMenu = [
        fb.carouselTemplate("Welcome!","https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png","We have the right hat for everyone.",[fb.buttonsURL(urlweb.sisurl,"View Website"), fb.buttonsURL(urlweb.sisurl,"Schedule"),fb.buttonsURL(urlweb.sisurl,"Test")]),
        fb.carouselTemplate("Welcome!","https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png","We have the right hat for everyone.",[fb.buttonsURL(urlweb.sisurl,"View Website"), fb.buttonsURL(urlweb.sisurl,"Test")])
        // fbTemplate.carouselTemplate("Welcome!","https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png","We have the right hat for everyone.",fbTemplate.buttonsTemplate(urlweb.sisurl,"Schedule"))
      ];

      sendGenericMessage(sender,elementsMenu)

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
    sendGenericMessage,
    sendTextMessage,
    sendImageMessage,
    sendQuickReply,
    sendBtnMessage,
    mainmenu
}

