const func = require("../views/function.js");
// let user

// const initUser = async (sender) => {

//   this.user = await api.requestUserinfo(sender)
//   console.log("testsee:"+this.user.locale);
// }
//// haloatesttest
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
        func.mainmenu(sender)
        break;
    case "send-text":
        var responseText = "This is example of Text message.";
        func.sendTextMessage(sender, responseText);
      break;
   
     case "send-music":
         var responseText = "The toys";
        func.sendTextMessage(sender, responseText);
       break;
    case "send-carousel":
      func.mainmenu(sender);
      // handleCardMessages(elements, sender)
      break;
    case "lookgrade":
      func.messageGradeGPA(sender);
      break;
    case "lookgrade_parameter":
      console.log("parameter:"+parameters)
      break;
    case "look-grade-all":
      func.btnGradeGPAViewall(sender);
      break;
    case "look-exam-schedule":
      func.btnExScheduleView(sender);
      break;
    case "change-language":
      func.messageLanguage(sender);
    default:
      // unhandled action, just send back the text
       func.sendTextMessage(sender, responseText);
  }
};

module.exports = {

    handleApiAiAction
}


