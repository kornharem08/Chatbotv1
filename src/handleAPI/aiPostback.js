const func = require("../views/function.js");

const handleAiPostback = async(

    sender,
    payload

) => {

    switch(payload) {

        case "MainMenu_Payload":
            func.mainmenu();
            break;

        default:


    }


}


// const sendGenericMessage = async (recipientId, elements) => {
//     var messageData = {
//       recipient: {
//         id: recipientId
//       },
//       message: {
//         attachment: {
//           type: "template",
//           payload: {
//             template_type: "generic",
//             elements: elements
//           }
//         }
//       }
//     };
//     await api.callSendAPI(messageData);
//   };


  module.exports = {
    handleAiPostback,
    sendGenericMessage
  }