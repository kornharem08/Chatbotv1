
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

// template ข้อความปุ่ม
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

const quickreplyTemplate = (text,quickreply) => {

    const message = {
        text:text,
        quick_replies: quickreply
    }

    return message
}


const quickreply = (title,payload,image) => {

    var image_url = ""

    if(image_url == null){

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