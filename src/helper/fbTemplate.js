
const carouselTemplate = (title,image_url,subtitle,button1) =>{
  
console.log("Button:"+JSON.stringify(button1))
    const elements = 
        {
          title: title,
          image_url:image_url, // รูปต้องใส่เป็นลิงค์ ออนไลน์เท่านั้นอะนะ
          subtitle: subtitle,
        //   default_action: {
        //     type: "web_url",
        //     url: url,
        //     messenger_extensions: true,
        //     webview_height_ratio: "tall",
        //     fallback_url: url
        //   },
          buttons: [
            button1,
            {}
            //button2
            
          ]
        }
    

    return elements

}


const buttonsTemplate = (url,title) => {

 const button =  {
        type: "web_url",
        url: url,
        title: title,
        webview_height_ratio: "full",
        messenger_extensions: true
    }

    return button
}

module.exports = {
    carouselTemplate,
    buttonsTemplate
}