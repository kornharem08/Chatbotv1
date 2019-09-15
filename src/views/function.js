const api = require('../helper/api.js');
const fb = require("../helper/fbTemplate");
const Dict = require("../helper/dictionary");
const urlweb = require("../helper/webview.js");
const Redis = require('ioredis');
const captureSchedule = require("../helper/captureSchedule");
const redis = new Redis(process.env.REDIS_URL);

const mainmenu = async (sender) => {

  let elementsMenu = [
    fb.carouselTemplate("Welcome!", "https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png", "We have the right hat for everyone.", [fb.buttons("Student information", "Student-information"), fb.buttons("Grade & GPA", "Grade&GPA"), fb.buttons("Class&Examination Schedule", "Class&Examination-Schedule")]),
    fb.carouselTemplate("Welcome!", "https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png", "We have the right hat for everyone.", [fb.buttons("Exam notification day", "Exam-notification-day"), fb.buttonsURL(urlweb.sisurl, "Academic calendar for undergraduate"),fb.buttons("Cancle Exam notification day","Cancle-Exam-notification-day")]),

  ];

  let replies = fb.quickreplyTemplate("", [fb.quickreply("TH", "test", null), fb.quickreply("ENG", "test", null)])

  await sendGenericMessage(sender, elementsMenu)
  await sendQuickReply(sender, replies);

}
const btnMessage = async (sender) => {

  let btnMessage = fb.buttonsTemplate("What do you want to do next?", [fb.buttons("Personal information", "Personal-information"), fb.buttons("Edit Personal information", "Edit-Student-information"), fb.buttons("Back", "MainMenu_Payload")])




  await sendBtnMessage(sender, btnMessage)


}
const Messageinfo = async (sender) => {

  let Message = "Name\nTanakorn Pitakchaichan\n======================\nEmail\nTana_korn01@hotmail.com\n======================\nPhone number\n090-9858754\n======================\nAdvisor Name\nKorawit Prutsachainimmit\n======================"

  await sendTextMessage(sender, Message)


}
const messageGradeGPA = async (sender) => {

  let btnMessage = fb.buttonsTemplate("Select view Semester/Year or view all", [fb.buttons("<< Back", "MainMenu_Payload", null), fb.buttons("Select Semester/Year", "GradeGPA_Semester") , fb.buttons("View All", "GradeGPA_ViewAll")])
  await sendBtnMessage(sender, btnMessage);

}

const btnMessageclassEx = async (sender) => {

  let btnMessage = fb.buttonsTemplate("What do you want to do next?", [fb.buttons("Class Schedule", "Class-schedule"), fb.buttons("Examination Schedule", "Examination-Schedule"), fb.buttons("Back", "MainMenu_Payload")])

  await sendBtnMessage(sender, btnMessage)

}

const quickreplyGradeGPAsemester = async (sender) =>{
  let replies = fb.quickreplyTemplate("Please select Semester/Year criteria", [fb.quickreply("<< Back", "test", null), fb.quickreply("1/2561", '{ "campagin":"Grade_Semester_quickreply", "data":"1/2561"}', null), fb.quickreply("2/2561", '{ "campagin":"Grade_Semester_quickreply", "data":"2/2561"}', null), fb.quickreply("3/2559", '{ "campagin":"Grade_Semester_quickreply", "data":"2/2559"}', null)])
  await sendQuickReply(sender, replies);
}

const quickreplyGradeGPATerm = async (sender) => {
  let replies = fb.quickreplyTemplate("Please select Term", [ fb.quickreply("Midterm", '{ "campagin":"GradeGPA_Term", "data":"M"}', null), fb.quickreply("Final", '{ "campagin":"GradeGPA_Term", "data":"F"}', null)])
  await sendQuickReply(sender, replies);
}

const btnGradeGPAWebview = async (sender) => {
  let term
  let subsemesterm 
  let subsemesteryear 
 await redis.get(`${sender}`, function(err,result) {  
    
    let data = JSON.parse(result)
    let datasemester = data.semester
    let datasubsemesterterm = datasemester.substring(0,1)
    let datasubsemesteryear = datasemester.substring(2)
    console.log("data:"+data.term)
    term = data.term
    subsemesterm = datasubsemesterterm
    subsemesteryear = datasubsemesteryear
    
});
  let btnMessage = await fb.buttonsTemplate("Click to view Grade/GPA", [ fb.buttonsURL(`${urlweb.sisurl_grade}/5930213034/${subsemesteryear}/${subsemesterm}/${term}`, "View Grade/GPA"), fb.buttons("Back", "MainMenu_Payload")])
  await sendBtnMessage(sender, btnMessage)
}

const messageExSc = async (sender) => {

  let replies = fb.quickreplyTemplate("Please select Semester/Year criteria", [fb.quickreply("<< Back", "MainMenu_Payload", null), fb.quickreply("1/2559", '{ "campagin":"Ex_First", "data":"1/2559"}', null), fb.quickreply("2/2559", '{ "campagin":"Ex_First", "data":"2/2559"}', null), fb.quickreply("3/2559", "Ex_3/2559", null)])
  await sendQuickReply(sender, replies);

}
const messageClassSc = async (sender) => {

  //let replies = fb.quickreplyTemplate("Please select Semester/Year criteria", [fb.quickreply("<< Back", "MainMenu_Payload", null), fb.quickreply("1/2559", "test", null), fb.quickreply("2/2559", "test", null), fb.quickreply("1/2560", "test", null), fb.quickreply("2/2560", "test", null), fb.quickreply("1/2561", "test", null), fb.quickreply("2/2561", "test", null)])
  let capture = captureSchedule.captureSchedule();
  await sendTextMessage(sender,"Test_Schedule")

}

const messageEditinfo = async (sender) => {
  let Message = "Name\nTanakorn Pitakchaichan\n======================\nPhone number\n090-252812\n======================"

  let replies = fb.quickreplyTemplate("Please select Menu Edit", [fb.quickreply("<< Back", "MainMenu_Payload", null), fb.quickreply("Email", "test", null), fb.quickreply("Phone number", "test", null)])

  await sendTextMessage(sender, Message)
  await sendQuickReply(sender, replies);


}

const MessageExamnotif = async (sender) => {

  let Message = "Exam notification day Successfully"

  await sendTextMessage(sender, Message)

}

const MessageCancleExamnotif = async (sender) => {

  let Message = "Cancle Exam notification day Successfully"

  await sendTextMessage(sender, Message)


}

const messageExamSchedule = async (sender) => {

  let replies = fb.quickreplyTemplate("Please select Examination Schedule", [ fb.quickreply("Midterm", '{ "campagin":"Ex_Second", "data":"M"}', null), fb.quickreply("Final", '{ "campagin":"Ex_Second", "data":"F"}', null)])
  await sendQuickReply(sender, replies);


}

const messageExamScheduleWeb = async (sender) => {
  let btnMessage = fb.buttonsTemplate("Click to view Examination Schedule", [ fb.buttonsURL(urlweb.sisurl_exam, "View Exam Schedule"), fb.buttons("Back", "MainMenu_Payload")])

  await sendBtnMessage(sender, btnMessage)
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

const sendBtnMessage = async (recipientId, payload) => {  /// https://developers.facebook.com/docs/messenger-platform/send-messages/template/button

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
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
  btnMessageclassEx,
  messageExSc,
  messageClassSc,
  messageEditinfo,
  MessageExamnotif,
  MessageCancleExamnotif,
  messageExamSchedule,
  messageExamScheduleWeb,
  quickreplyGradeGPAsemester,
  quickreplyGradeGPATerm,
  btnGradeGPAWebview
}

