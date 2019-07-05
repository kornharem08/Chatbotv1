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
    // case "fb-send-image":
    //   // var imgUrl =
    //   // //   "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/881e6651881085.58fd911b65d88.png";
    //   // // sendImageMessage(sender, imgUrl);
    //   break;
     case "send-music":
         var responseText = "The toys";
        func.sendTextMessage(sender, responseText);
       break;
    // case "send-quick-reply":
    //   // var replies = fb.quickreplyTemplate("test",[fb.quickreply("test","test",null),fb.quickreply("test","test",null),fb.quickreply("test","test",null)])
    //   // sendQuickReply(sender, replies);
    //   break;
    case "send-carousel":
      func.mainmenu(sender);
      // handleCardMessages(elements, sender)
      break;
    default:
      // unhandled action, just send back the text
       func.sendTextMessage(sender, responseText);
  }
};

module.exports = {

    handleApiAiAction
}


