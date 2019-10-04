
const { google } = require('googleapis');
const keys = require('./keyapi/SISCONNECT-0779c8454af1.json')


const getDataSheet = () => {
let dataArray
const client = new google.auth.JWT(
   
   keys.client_email,
   null,
   keys.private_key,
   ['https://www.googleapis.com/auth/spreadsheets']

 );
 ////////////////////////////////////// ส่วนของ Google Sheet
  dataArray = client.authorize(async function (err, tokens) {
   let data
   if (err) {
     console.log(err);
     return;
   } else {
     console.log('Connected!');
     data = await gsrun(client)

   }
   return data
 });
 return dataArray

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

 }

 module.exports = {

   getCalendar

 }