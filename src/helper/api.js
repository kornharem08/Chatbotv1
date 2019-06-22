const axios = require('axios');
const config = require("../../config");


const callSendAPI = async (messageData) => {

    const url = "https://graph.facebook.com/v3.0/me/messages?access_token=" + config.FB_PAGE_TOKEN;
    await axios.post(url, messageData)
      .then(function (response) {
        if (response.status == 200) {
          var recipientId = response.data.recipient_id;
          var messageId = response.data.message_id;
         // information(recipientId);
          if (messageId) {
            console.log(
              "Successfully sent message with id %s to recipient %s",
              messageId,
              recipientId
            );
          } else {
            console.log(
              "Successfully called Send API for recipient %s",
              recipientId
            );
          }
        }
      })
      .catch(function (error) {
        console.log(error.response.headers);
      });
  }


  const requestUserinfo = async (recipientId) => { ///ค่อยปรับปรุงเป็นฟังก์ชั่นรูปแบบที่เหมาะสม

    var infoBase = {}
    const url = "https://graph.facebook.com/" + recipientId + "?fields=id,name,first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + config.FB_PAGE_TOKEN;
    await axios.get(url)
      .then(function (response) {
   
          infoBase = response.data
  
      })
      .catch(function (error) {
        console.log(error.response.headers);
      });
      return infoBase;
  
  }

  module.exports = {
    callSendAPI,
    requestUserinfo
}