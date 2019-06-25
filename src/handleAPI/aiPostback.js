const api = require('../helper/api.js')
const fb = require("../helper/fbTemplate")

const handlePostback = async(

    sender,
    payload

) => {

    switch(payload) {

        case "MainMenu_Payload":
                var elementsMenu = [
                    fb.carouselTemplate("Welcome!","https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png","We have the right hat for everyone.",[fb.buttonsURL(urlweb.sisurl,"View Website"), fb.buttonsURL(urlweb.sisurl,"Schedule"),fb.buttonsURL(urlweb.sisurl,"Test")]),
                    fb.carouselTemplate("Welcome!","https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png","We have the right hat for everyone.",[fb.buttonsURL(urlweb.sisurl,"View Website"), fb.buttonsURL(urlweb.sisurl,"Test")])
                    // fbTemplate.carouselTemplate("Welcome!","https://www.computing.psu.ac.th/th/wp-content/uploads/2018/03/PSU_CoC_ENG.png","We have the right hat for everyone.",fbTemplate.buttonsTemplate(urlweb.sisurl,"Schedule"))
                  ];
                  sendGenericMessage(sender, elementsMenu);
            break;

        default:


    }


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


  module.exports = {
    handlePostback,
    sendGenericMessage
  }