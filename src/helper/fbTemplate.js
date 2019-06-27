


const carouselTemplate = (title,image_url,subtitle,buttons) =>{
  

    const elements = 
        {
          title: title,
          image_url:image_url, // รูปต้องใส่เป็นลิงค์ ออนไลน์เท่านั้นอะนะ
          subtitle: subtitle,
          buttons:buttons
        }
    

    return elements

}

// template ข้อความปุ่ม
const buttonsTemplate = (text,buttons) => {


   const payload = {
        template_type:"button",
        text:text,
        buttons:buttons
      }

      return payload

}

const quickreplyTemplate = (text,quickreply) => {

    const message = {
        text:text,
        quick_replies: quickreply
    }

    return message
}


const quickreply = (title,payload,image) => {

    var image_url = ""

    if(image_url != null){

        this.image_url = image

    }

 const quickreply = {
        content_type:"text",
        title:title,
        payload:payload,
        image_url //เราใส่รูปให้ quickreply ได้ด้วยย
    }

    return quickreply
}

//ปุ่มเปิด Webview
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

//ปุมธรรมดา
const buttons = (title,postback) => { // postback คือข้อความที่กดแล้วจะให้มันส่งไปอะไรไป ยัง dialogflow 

    const button =  {
           type: "postback",
           title: title,
           payload: postback
       }
   
       return button
   }

module.exports = {
    carouselTemplate,
    buttonsTemplate,
    quickreplyTemplate,
    quickreply,
    buttonsURL,
    buttons
}


