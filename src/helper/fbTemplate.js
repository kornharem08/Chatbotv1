
const carouselTemplate = (title,image_url,subtitle,button1,button2,button3) =>{
  
    
    var buttons = [button1]

    if(button2 != null){
        buttons.push(button2)
    }

    if(button3 != null){
        buttons.push(button3)
    }

console.log("Button:"+JSON.stringify(button1))
    const elements = 
        {
          title: title,
          image_url:image_url, // รูปต้องใส่เป็นลิงค์ ออนไลน์เท่านั้นอะนะ
          subtitle: subtitle,
          buttons
        }
    

    return elements

}

const buttonsTemplate = (text,button1,button2,button3) => {

    var buttons = [button1]

    if(button2 != null){
        buttons.push(button2)
    }

    if(button3 != null){
        buttons.push(button3)
    }

   const payload = {
        template_type:"button",
        text:text,
        buttons
      }

      return payload

}


const buttonsURL = (url,title) => {

 const button =  {
        type: "web_url",
        url: url,
        title: title,
        webview_height_ratio: "full",
        messenger_extensions: true
    }

    return button
}

const buttons = (title,postback) => { // postback คือข้อความที่กดแล้วจะให้มันส่งไปอะไรไป ยัง dialogflow

    const button =  {
           type: "web_url",
           title: title,
           payload: postback
       }
   
       return button
   }

module.exports = {
    carouselTemplate,
    buttonsTemplate,
    buttonsURL,
    buttons
}