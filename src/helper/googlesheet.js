
const { google } = require('googleapis');
const keys = require('./keyapi/SISCONNECT-0779c8454af1.json')

const client = new google.auth.JWT(
   
   keys.client_email,
   null,
   keys.private_key,
   ['https://www.googleapis.com/auth/spreadsheets']

 );

const getDataSheet = () => {
// let status = null
 ////////////////////////////////////// ส่วนของ Google Sheet
 client.authorize(function (err, tokens) {
   if (err) {
     console.log(err);
     return;
   } else {
     console.log('Connected!');
     //gsrun(client)
     
   }
 });
//  console.log("dataCalendar:"+status)
//  return status

}



const gsrun = async (cl) => {
   const gsapi = google.sheets({ version: 'v4', auth: cl });
   const opt = {
     spreadsheetId: '1IfhrtQJX7wY3jpyMqm8Ze7AxIBdJkQPGjptRvxT4h00',
     range: 'A2:C'
   };
   let data = await gsapi.spreadsheets.values.get(opt);
   let dataArray = data.data.values
   console.log("dataArray:"+dataArray)
   return dataArray
  //  checkCalendar(dataArray)
 }


  const checkCalendar = async (dataArray) => {

   for (let i = 0; i < dataArray.length; i++) {
     if (dataArray[i][2]) {
       sendnotiMessage(dataArray[i][2])
     }
   }
 
 }

 async function getCalendar() {
   let dataArray = await gsrun(client)
   let resultCalendar = null
   console.log("response:"+dataArray)
   for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i][2]) {
      resultCalendar = dataArray[i[2]]
    }
  }

   return resultCalendar

 }

 module.exports = {

   getCalendar

 }