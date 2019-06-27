const api = require('../helper/api.js');
const fb = require("../helper/fbTemplate");
const Dict = require("../helper/dictionary");
const urlweb = require("../helper/webview.js");

const mainmenu = async (sender) => {
   
   let elementsMenu = [
        fb.carouselTemplate("Welcome!","https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png","We have the right hat for everyone.",[fb.buttons("Student information","Student-information"), fb.buttons("Grade & GPA","Grade&GPA"),fb.buttons("Class&Examination Schedule","Class&Examination-Schedule")]),
        fb.carouselTemplate("Welcome!","https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png","We have the right hat for everyone.",[fb.buttonsURL(urlweb.sisurl,"Exam notification day"), fb.buttonsURL(urlweb.sisurl,"Academic calendar for undergraduate"),fb.buttonsURL(urlweb.sisurl,"Cancle Exam notification day")]),
        
      ];

      let replies = fb.quickreplyTemplate("",[fb.quickreply("TH","test",null),fb.quickreply("ENG","test",null)])
     
      await sendGenericMessage(sender,elementsMenu)
      await sendQuickReply(sender, replies);

}
const btnMessage = async (sender) => {
   
  let btnMessage = fb.buttonsTemplate("What do you want to do next?",[fb.buttons("Personal information","Personal-information"),fb.buttons("Edit Personal information","Edit-Student-information"),fb.buttons("Back","back")])
  
    
  
    
     await sendBtnMessage(sender,btnMessage)
 

}
const Messageinfo = async (sender) => {
   
  let Message = "Name\nTanakorn Pitakchaichan\n======================\nEmail\nTana_korn01@hotmail.com\n======================\nPhone number\n090-9858754\n======================\nAdvisor Name\nKorawit Prutsachainimmit\n======================"
  
     await sendTextMessage(sender,Message)
 

}
const messageGradeGPA = async (sender) => {
   
  // let btnMessage = fb.buttonsTemplate("Plese select Semester/Year criteria",[fb.buttons("Personal information","Personal-information")])
  let replies = fb.quickreplyTemplate("Please select Semester/Year criteria",[fb.quickreply("<< Back","test",null),fb.quickreply("1/2559","test",null),fb.quickreply("2/2559","test",null),fb.quickreply("1/2560","test",null),fb.quickreply("2/2560","test",null),fb.quickreply("1/2561","test",null),fb.quickreply("2/2561","test",null)])
    await sendQuickReply(sender, replies);
 

}

const btnMessageclassEx = async (sender) => {
   
  let btnMessage = fb.buttonsTemplate("What do you want to do next?",[fb.buttons("Class Schedule","Class-schedule"),fb.buttons("Examination Schedule","Examination-Schedule"),fb.buttons("Back","back")])
  
    
     await sendBtnMessage(sender,btnMessage)
 

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
          payload
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
    mainmenu,
    btnMessage,
    Messageinfo,
    messageGradeGPA,
    btnMessageclassEx
}

