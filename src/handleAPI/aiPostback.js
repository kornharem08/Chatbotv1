const func = require("../views/function.js");
const handleAiPostback = async (

    sender,
    payload,
    value

) => {

    switch (payload) {

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
            func.messageExSc(sender);
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
                if(value){
                    testval1 = value
                    console.log("value:"+value)
                }
            func.messageExamSchedule(sender);
            break;
        case "Ex_Second":
            if(value){
                console.log("value:"+value)
            }
            func.messageExamScheduleWeb(sender);
            break;
        case "GradeGPA_Semester":
            func.quickreplyGradeGPAsemester(sender);
            break;
        case "Grade_Semester_quickreply":
            func.quickreplyGradeGPATerm(sender);
            break;
        case "GradeGPA_Term":
            func.btnGradeGPAWebview(sender);
            break;
        default:


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