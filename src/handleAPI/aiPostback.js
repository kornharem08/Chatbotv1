const func = require("../views/function.js");
const api = require("../helper/api")
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);
const googlesheet = require("../helper/googlesheet")
const handleAiPostback = async (

    sender,
    payload,
    value

) => {
    switch (payload) {
        case "<GET_STARTED_PAYLOAD>":
            await validateAuthen(sender)
            break;
        case "MainMenu_Payload":
            func.mainmenu(sender);
            break;
        case "Student-information":
            func.btnMessage(sender);
            break;
        case "Personal-information":
            func.Messageinfo(sender);
            break;
        case "Grade&GPA":
            func.messageGradeGPA(sender);
            break;
        case "Class&Examination-Schedule":
            func.btnMessageclassEx(sender);
            break;
        case "Examination-Schedule":
            func.btnExScheduleView(sender);
            break;
        case "Academic_Calendar_Payload":
            func.messageCalendar(sender)
            //googlesheet.getCalendar()
            break;
        case "Class-schedule":
            func.messageClassSc(sender);
            break;
        case "Edit-Student-information":
            func.messageEditinfo(sender);
            break;
        case "Exam-notification-day":
            func.MessageExamnotif(sender);
            break;
        case "Cancle-Exam-notification-day":
            func.MessageCancleExamnotif(sender);
            break;
        case "Ex_First":
            if (value) {
                testval1 = value
                console.log("value:" + value)
            }
            func.messageExamSchedule(sender);
            break;
        case "Ex_Second":
            if (value) {
                console.log("value:" + value)
            }
            func.messageExamScheduleWeb(sender);
            break;
        case "GradeGPA_Semester":
            func.quickreplyGradeGPAsemester(sender);
            break;
        case "GradeGPA_ViewAll":
            func.btnGradeGPAViewall(sender)
            break;    
        case "Grade_Semester_quickreply":
            if (value) {
                await redis.mset(new Map([[`${sender}`, `{"semester":"${value}"}`]]));
                await func.btnGradeGPAWebview(sender);
            }
            break;
        case "Language_Payload":
            func.messageLanguage(sender)
            break;
        case "Language_TH_Payload":
            let response_lang_TH = await api.updateLang(sender,"TH")
            if(response_lang_TH == 200){
                func.mainmenu(sender)
            }
            break;
        case "Language_ENG_Payload":
            lang = "ENG"
            let response_lang_ENG = await api.updateLang(sender,"ENG")
            if(response_lang_ENG == 200){
                func.mainmenu(sender)
            }
            break; 
        // case "GradeGPA_Term":
        //     if (value) {
        //         let data
        //         await redis.get(`${sender}`, function (err, result) {
        //             data = JSON.parse(result)
        //             data.term = `${value}`
        //             let dataset = JSON.stringify(data)
        //             console.log("result:" + dataset)
        //             redis.mset(new Map([[`${sender}`, dataset]]));
        //         });
        //         //   redis.mset(new Map([[`${sender}`, data]]));

        //         await redis.get(`${sender}`, function (err, result) {

        //             console.log("result2:" + result)

        //         });
        //     }
        //     func.btnGradeGPAWebview(sender);
        //     break;
        default:


    }


}

const validateAuthen = async (senderid) => {

    const valid = await api.validateAuthenticate(senderid)

    if (valid == 0) {
        func.authenticated(senderid);
        redis.mset(new Map([[`${senderid}`, `{"status":"authenticate"}`]]));
    } else {
        func.mainmenu(senderid)
    }
}


// // const sendGenericMessage = async (recipientId, elements) => {
// //     var messageData = {
// //       recipient: {
// //         id: recipientId
// //       },
// //       message: {
// //         attachment: {
// //           type: "template",
// //           payload: {
// //             template_type: "generic",
// //             elements: elements
// //           }
// //         }
// //       }
// //     };
// //     await api.callSendAPI(messageData);
// //   };


module.exports = {
    handleAiPostback

}