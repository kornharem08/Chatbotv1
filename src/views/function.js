const api = require('../helper/api.js');
const fb = require("../helper/fbTemplate");
const Dict = require("../helper/dictionary");
const urlweb = require("../helper/webview.js");
const Redis = require('ioredis');
const captureSchedule = require("../helper/captureSchedule");
const googlesheet = require("../helper/googlesheet")
const redis = new Redis(process.env.REDIS_URL);
//fb.buttons(Dict.Cancle_Exam_notification_TXT[txt_lang], "Cancle-Exam-notification-day")
const mainmenu = async (sender) => {
  let txt_lang = await api.requestLang(sender)
  let noti = await api.checkhasNoti(sender)
  let elementsMenu
  if(noti == true){
  elementsMenu = [
    fb.carouselTemplate(Dict.MainMenu_TXT[txt_lang], "https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png", Dict.Hello_TXT[txt_lang], [fb.buttons(Dict.StudentInfo_TXT[txt_lang], "Student-information"), fb.buttons(Dict.Grade_TXT[txt_lang], "Grade&GPA"), fb.buttons(Dict.Class_Examiantion_Schedule_TXT[txt_lang], "Class&Examination-Schedule")]),
    fb.carouselTemplate(Dict.MainMenu_TXT[txt_lang], "https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png", Dict.Hello_TXT[txt_lang], [fb.buttons(Dict.Cancle_Exam_notification_TXT[txt_lang], "Cancle-Exam-notification-day"), fb.buttons(Dict.Academic_Calendar_TXT[txt_lang], "Academic_Calendar_Payload")]),

  ];
}else{
  elementsMenu = [
    fb.carouselTemplate(Dict.MainMenu_TXT[txt_lang], "https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png", Dict.Hello_TXT[txt_lang], [fb.buttons(Dict.StudentInfo_TXT[txt_lang], "Student-information"), fb.buttons(Dict.Grade_TXT[txt_lang], "Grade&GPA"), fb.buttons(Dict.Class_Examiantion_Schedule_TXT[txt_lang], "Class&Examination-Schedule")]),
    fb.carouselTemplate(Dict.MainMenu_TXT[txt_lang], "https://www.phuket.psu.ac.th/wp-content/uploads/2019/03/cropped-PSU_PHUKET-EN.png", Dict.Hello_TXT[txt_lang], [fb.buttons(Dict.Exam_notification_TXT[txt_lang], "Exam-notification-day"), fb.buttons(Dict.Academic_Calendar_TXT[txt_lang], "Academic_Calendar_Payload")]),

  ];
}

 //let replies = fb.quickreplyTemplate("", [fb.quickreply("TH", "test", null), fb.quickreply("ENG", "test", null)])

  await sendGenericMessage(sender, elementsMenu)
  //await sendQuickReply(sender, replies);

}
const btnMessage = async (sender) => {
  let txt_lang = await api.requestLang(sender)
  let btnMessage = fb.buttonsTemplate(Dict.whatdoyouwant_TXT[txt_lang], [fb.buttons(Dict.Personal_info_TXT[txt_lang], "Personal-information"), fb.buttons(Dict.Edit_Personal_info_TXT[txt_lang], "Edit-Student-information"), fb.buttons(Dict.back_TXT[txt_lang], "MainMenu_Payload")])
  await sendBtnMessage(sender, btnMessage)


}
const Messageinfo = async (sender) => {

  let Message = "Name\nTanakorn Pitakchaichan\n======================\nEmail\nTana_korn01@hotmail.com\n======================\nPhone number\n090-9858754\n======================\nAdvisor Name\nKorawit Prutsachainimmit\n======================"

  await sendTextMessage(sender, Message)


}
const messageGradeGPA = async (sender) => {
  let txt_lang = await api.requestLang(sender)
  let btnMessage = fb.buttonsTemplate(Dict.select_view_TXT[txt_lang], [fb.buttons(Dict.back_TXT[txt_lang], "MainMenu_Payload", null), fb.buttons(Dict.select_semester_TXT[txt_lang], "GradeGPA_Semester"), fb.buttons(Dict.grade_all_TXT[txt_lang], "GradeGPA_ViewAll")])
  await sendBtnMessage(sender, btnMessage);

}

const btnMessageclassEx = async (sender) => {
  let txt_lang = await api.requestLang(sender)
  let btnMessage = fb.buttonsTemplate(Dict.whatdoyouwant_TXT[txt_lang], [fb.buttons(Dict.class_schedule_TXT[txt_lang], "Class-schedule"), fb.buttons(Dict.examination_schedule_TXT[txt_lang], "Examination-Schedule"), fb.buttons(Dict.back_TXT[txt_lang], "MainMenu_Payload")])

  await sendBtnMessage(sender, btnMessage)

}

const quickreplyGradeGPAsemester = async (sender) => {
  // let quickreply = await setQuickreplyforgrade(sender)
  // console.log("setQuickreplyforgrade:" + quickreply[0])
  let txt_lang = await api.requestLang(sender)
  let replies = fb.quickreplyTemplate(Dict.semester_TXT[txt_lang], [fb.quickreply(Dict.back_TXT[txt_lang], '{"campagin":"MainMenu_Payload","data":"null"}', null),fb.quickreply("1/2561", '{"campagin":"Grade_Semester_quickreply","data":"1/2561"}',null),fb.quickreply("2/2561", '{"campagin":"Grade_Semester_quickreply","data":"2/2561"}', null),fb.quickreply("1/2560", '{"campagin":"Grade_Semester_quickreply","data":"1/2560"}', null),fb.quickreply("2/2560", '{"campagin":"Grade_Semester_quickreply","data":"2/2560"}',null),fb.quickreply("1/2559", '{"campagin":"Grade_Semester_quickreply","data":"1/2559"}', null),fb.quickreply("2/2559", '{"campagin":"Grade_Semester_quickreply","data":"2/2559"}', null)])
  // console.log("quickreplyGradeGPAsemester:"+JSON.stringify(replies))
  await sendQuickReply(sender, replies);
}

// const quickreplyGradeGPATerm = async (sender) => {
//   let replies = fb.quickreplyTemplate("Please select Term", [ fb.quickreply("Midterm", '{ "campagin":"GradeGPA_Term", "data":"M"}', null), fb.quickreply("Final", '{ "campagin":"GradeGPA_Term", "data":"F"}', null)])
//   await sendQuickReply(sender, replies);
// }

const btnGradeGPAWebview = async (sender) => {
  let txt_lang = await api.requestLang(sender)
  let studentID = await api.requestStudentID(sender)

  let subsemesterm, subsemesteryear = null
  await redis.get(`${sender}`, function (err, result) {

    let data = JSON.parse(result)
    let datasemester = data.semester
    let datasubsemesterterm = datasemester.substring(0, 1)
    let datasubsemesteryear = datasemester.substring(2)

    subsemesterm = datasubsemesterterm
    subsemesteryear = datasubsemesteryear

  });
  let btnMessage = await fb.buttonsTemplate(Dict.view_Grade_TXT[txt_lang], [fb.buttonsURL(`${urlweb.sisurl_grade}/${studentID}/${subsemesteryear}/${subsemesterm}`, Dict.click_toview_TXT[txt_lang]), fb.buttons(Dict.back_TXT[txt_lang], "MainMenu_Payload")])
  await sendBtnMessage(sender, btnMessage)
}

const btnGradeGPAViewall = async (sender) => {
  let txt_lang = await api.requestLang(sender)
  let studentID = await api.requestStudentID(sender)
  let btnMessage = await fb.buttonsTemplate(Dict.view_Grade_TXT[txt_lang], [fb.buttonsURL(`${urlweb.sisurl_grade}/${studentID}/0/0`, Dict.click_toview_TXT[txt_lang]), fb.buttons(Dict.back_TXT[txt_lang], "MainMenu_Payload")])
  await sendBtnMessage(sender, btnMessage)

}

const btnExScheduleView = async (sender) => {
  let txt_lang = await api.requestLang(sender)
  let studentID = await api.requestStudentID(sender)
  let btnMessage = await fb.buttonsTemplate(Dict.view_Exam_Schedule_TXT[txt_lang], [fb.buttonsURL(`${urlweb.sisurl_exam}/${studentID}/2562/1/M`, Dict.click_toview_TXT[txt_lang]), fb.buttons(Dict.back_TXT[txt_lang], "MainMenu_Payload")])
  await sendBtnMessage(sender, btnMessage)

}
const messageClassSc = async (sender) => {

  //let replies = fb.quickreplyTemplate("Please select Semester/Year criteria", [fb.quickreply("<< Back", "MainMenu_Payload", null), fb.quickreply("1/2559", "test", null), fb.quickreply("2/2559", "test", null), fb.quickreply("1/2560", "test", null), fb.quickreply("2/2560", "test", null), fb.quickreply("1/2561", "test", null), fb.quickreply("2/2561", "test", null)])
  let capture = await captureSchedule.captureInit();
  await sendImageMessage(sender, capture.body.attachment_id)

}

const messageEditinfo = async (sender) => {
  
  let Message = "Name\nTanakorn Pitakchaichan\n======================\nPhone number\n090-252812\n======================"

  let replies = fb.quickreplyTemplate("Please select Menu Edit", [fb.quickreply(Dict.back_TXT[txt_lang], "MainMenu_Payload", null), fb.quickreply("Email", "test", null), fb.quickreply("Phone number", "test", null)])

  await sendTextMessage(sender, Message)
  await sendQuickReply(sender, replies);


}

const MessageExamnotif = async (sender) => {
  let txt_lang = await api.requestLang(sender)
  let notiform = {
    senderId: sender,
    notification: true
  }
  let responeNoti = await api.requestNotification(notiform)
  let Message = ""
  if(responeNoti == 200){
    Message = Dict.examnoti_TXT[txt_lang]
  }
  else{
    Message = "เปิดไม่สำเร็จ"
  }  

  await sendTextMessage(sender, Message)

}

const MessageCancleExamnotif = async (sender) => {
  let txt_lang = await api.requestLang(sender)
  let Message = ""
  let notiform = {
    senderId: sender,
    notification: false
  }
  let responeNoti = await api.requestNotification(notiform)
  let Message = ""
  if(responeNoti == 200){
    Message = Dict.disexamnoti_TXT[txt_lang]
  }
  else{
    Message = "ปิดไม่สำเร็จ 404"
  }  
  await sendTextMessage(sender, Message)


}

const messageExamSchedule = async (sender) => {

  let replies = fb.quickreplyTemplate("Please select Examination Schedule", [fb.quickreply("Midterm", '{ "campagin":"Ex_Second", "data":"M"}', null), fb.quickreply("Final", '{ "campagin":"Ex_Second", "data":"F"}', null)])
  await sendQuickReply(sender, replies);


}

const messageExamScheduleWeb = async (sender) => {
  let studentID = await api.requestStudentID(sender)
  let btnMessage = fb.buttonsTemplate("Click to view Examination Schedule", [fb.buttonsURL(`${urlweb.sisurl_exam}/${studentID}/2559/1/M`, "View Exam Schedule"), fb.buttons("Back", "MainMenu_Payload")])

  await sendBtnMessage(sender, btnMessage)
}

const authenticated = async (sender) => {
  let btnMessage = fb.buttonsTemplate("Sign In before use sisconnect", [fb.buttonsURL(`${urlweb.sisurl_signin}/${sender}`, "SignIn")])
  await sendBtnMessage(sender, btnMessage)
}

const messageLanguage = async (sender) => {
  let txt_lang = await api.requestLang(sender)
  let replies = fb.quickreplyTemplate(Dict.selectLang_TXT[txt_lang], [fb.quickreply("TH",'{"campagin":"Language_TH_Payload","data":"null"}', "https://upload.wikimedia.org/wikipedia/commons/e/e4/%E0%B8%98%E0%B8%87%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4%E0%B9%84%E0%B8%97%E0%B8%A2.png"), fb.quickreply("ENG", '{"campagin":"Language_ENG_Payload","data":"null"}', "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/285px-Flag_of_the_United_States.svg.png")])
  await sendQuickReply(sender, replies);
}

const messageCalendar = async (sender) => {
  let txt_lang = await api.requestLang(sender)
  let calendarlink = await googlesheet.getCalendar()
  await sendTextMessage(sender,`${Dict.download_calendar_TXT[txt_lang]} : ${calendarlink}`)
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
const sendImageMessage = async (recipientId, attachment_id) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          attachment_id: attachment_id
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

async function setQuickreplyforgrade(senderid) {
  let studentID = await api.requestStudentID(senderid)
  let oldgrade = await api.requestinfoAllgrade(studentID)
  let eduyear = groupBy(oldgrade, 'EduYearTH')
  let text = []

  for (let i = 0; i < Object.keys(eduyear).length; i++) {
    let eduterm = groupBy(eduyear[`${Object.keys(eduyear)[i]}`], 'EduTerm')
    // console.log(`${Object.keys(eduyear)[i]}/`+Object.keys(eduterm))
    if (Object.keys(eduterm)[0] == 1) {

      text.push(`${Object.keys(eduterm)[0]}/${Object.keys(eduyear)[i]}`)
    }
    if (Object.keys(eduterm)[1] == 2) {

      text.push(`${Object.keys(eduterm)[1]}/${Object.keys(eduyear)[i]}`)
    }
    if (Object.keys(eduterm)[2] == 3) {

      text.push(`${Object.keys(eduterm)[2]}/${Object.keys(eduyear)[i]}`)
    }
  }
  return text
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
  btnExScheduleView,
  messageClassSc,
  messageEditinfo,
  MessageExamnotif,
  MessageCancleExamnotif,
  messageExamSchedule,
  messageExamScheduleWeb,
  quickreplyGradeGPAsemester,
  btnGradeGPAWebview,
  authenticated,
  messageLanguage,
  btnGradeGPAViewall,
  messageCalendar
}

