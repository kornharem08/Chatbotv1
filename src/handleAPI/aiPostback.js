const func = require("../views/function.js");

const handleAiPostback = async(

    sender,
    payload

) => {

    switch(payload) {

        case "MainMenu_Payload":
            func.mainmenu(sender);
            break;

        default:


    }


}

  module.exports = {
    handleAiPostback
    
  }