
const { google } = require('googleapis');
const keys = require('./keyapi/SISCONNECT-0779c8454af1.json')

const client = new google.auth.JWT(
   
   keys.client_email,
   null,
   keys.private_key,
   ['https://www.googleapis.com/auth/spreadsheets']

 );

const getDataSheet = async () => {
// let status = null
 ////////////////////////////////////// ส่วนของ Google Sheet
 let status = "connect"
  await client.authorize(function (err, tokens) {
   let response
   if (err) {
     console.log(err);
     return;
   } else {
     console.log('Connected!');
     //data = gsrun(client)
     response = "Connect"
   }
   console.log("response:"+response)
   return response
 });
//  console.log("dataCalendar:"+status)
//  return status
 return status

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
   // let newDataArray = dataArray.map(function(r){
   //   //console.log("datafromGoogleSheet:"+r[0])
   //   return r
   // })
   // console.log("datafromGoogleSheetNew:"+dataArray[0][0])
   return dataArray 
 }


  const checkCalendar = async (dataArray) => {

   for (let i = 0; i < dataArray.length; i++) {
     if (dataArray[i][2]) {
       sendnotiMessage(dataArray[i][2])
     }
   }
 
 }

 async function getCalendar() {
   let dataArray = await getDataSheet()
   console.log("response:"+dataArray)

 }

 module.exports = {

   getCalendar

 }