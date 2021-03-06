const axios = require('axios');
const config = require("../../config");


const callSendAPI = async (messageData) => {

  const url = "https://graph.facebook.com/v5.0/me/messages?access_token=" + config.FB_PAGE_TOKEN;
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
    return studentID

}

const requestLang = async (senderId) => {
  let lang = null
  const url = "https://sisconnect-db.herokuapp.com/requestLang"
  await axios({
    method: 'get',
    url: url,
    data: {
      senderId: senderId
    }
  })
    .then(function (response) {
      if (response.data) {
        lang = response.data.lang

      }
    })
    .catch(function (error) {
      console.log(error);
    });
    return lang

}

const updateLang = async (senderId,lang) => {
  let status = null
  const url = "https://sisconnect-db.herokuapp.com/updateLang"
  await axios({
    method: 'post',
    url: url,
    data: {
      senderId: senderId,
      lang: lang
    }
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


const requestinfoAllgrade = async (studentID) =>{
  let oldgrade = []
  await axios.get(`https://sispsu.herokuapp.com/api/grade/${studentID}`)
    .then(function (response) {
      // handle success
      oldgrade = response.data.data
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
   
    return oldgrade
}

const requestPersonalinfo = async (studentID) =>{
  let personalInfo
  await axios.get(`https://sispsu.herokuapp.com/api/student/${studentID}`)
    .then(function (response) {
      // handle success
      personalInfo = response.data.data
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
   
    return personalInfo
}

const requestNotification = async (notiForm) =>{

  let status
  const url = `https://sisconnect-db.herokuapp.com/updateExamNoti`
    await axios({
      method: 'post',
      url: url,
      data: notiForm
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

const findWhohaveExamNoti = async () => {
  let ListWho
  const url = `https://sisconnect-db.herokuapp.com/findWhoExamNoti`
    await axios({
      method: 'get',
      url: url
    })
      .then(function (response) {
        if (response.status == 200) {
          ListWho = response.data
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  return ListWho
}

const requestTimeExam = async (studentID,year,eduterm,miniterm) => {
  let examtime
  const url = `https://sispsu.herokuapp.com/api/examschedule/${studentID}/${year}/${eduterm}/${miniterm}`
    await axios({
      method: 'get',
      url: url
    })
      .then(function (response) {
          if (response.status == 200) {
          examtime = response.data.data
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  return examtime
}

const requestAllSenderID = async () => {
  let listSender
  const url = `https://sisconnect-db.herokuapp.com/senderId_all`
    await axios({
      method: 'get',
      url: url
    })
      .then(function (response) {
        if (response.status = 200) {
          listSender = response.data
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  return listSender
}

const checkhasNoti = async (senderId) => {
  let noti = null
  const url = `https://sisconnect-db.herokuapp.com/checkhasNoti`
    await axios({
      method: 'get',
      url: url,
      data: {
        senderId: senderId,
      }
    })
      .then(function (response) {
        if (response.status = 200) {
          noti = response.data.notification
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  return noti
}

const requestAllGPA = async (studentID) => {
  let gpa
  const url = `https://sispsu.herokuapp.com/api/gpa/${studentID}/`
    await axios({
      method: 'get',
      url: url
    })
      .then(function (response) {
          if (response.status == 200) {
          gpa = response.data.data
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  return gpa
}





module.exports = {
  callSendAPI,
  requestUserinfo,
  insertProfile,
  validateAuthenticate,
  requestStudentID,
  requestinfoAllgrade,
  requestNotification,
  findWhohaveExamNoti,
  requestTimeExam,
  requestAllSenderID,
  requestLang,
  updateLang,
  checkhasNoti,
  requestPersonalinfo,
  requestAllGPA
}