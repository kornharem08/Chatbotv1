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

const validateAuthenticate = async (senderId) => {
  let count
  const url = "https://sisconnect-db.herokuapp.com/findsenderId_count"
  await axios({
    method: 'get',
    url: url,
    data: {
      senderId: senderId
    }
  })
    .then(function (response) {
      if (response.data) {
        count = response.data.count

      }
    })
    .catch(function (error) {
      console.log(error);
    });

  return count
}

const insertProfile = async (studentInfo) => {

  let status
    console.log("studentInfo:" + studentInfo.senderId + "," + studentInfo.studentID)
    
    const url = "https://sisconnect-db.herokuapp.com/insertProfile"
    await axios({
      method: 'post',
      url: url,
      data: studentInfo
    })
      .then(function (response) {
        if (response.status == 200) {
          status = response.status
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  return status
}

const requestStudentID = async (senderId) => {
  let studentID = null
  const url = "https://sisconnect-db.herokuapp.com/requestStudentId"
  await axios({
    method: 'get',
    url: url,
    data: {
      senderId: senderId
    }
  })
    .then(function (response) {
      if (response.data) {
        studentID = response.data.studentID

      }
    })
    .catch(function (error) {
      console.log(error);
    });
    console.log("studentID:"+JSON.stringify(studentID))
    return studentID

}

module.exports = {
  callSendAPI,
  requestUserinfo,
  insertProfile,
  validateAuthenticate,
  requestStudentID
}