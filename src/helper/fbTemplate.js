
const carouselTemplate = (title,image_url,subtitle,url) =>{

    const elements = [
        {
          title: title,
          image_url:image_url, // รูปต้องใส่เป็นลิงค์ ออนไลน์เท่านั้นอะนะ
          subtitle: subtitle,
          default_action: {
            type: "web_url",
            url: url,
            messenger_extensions: true,
            webview_height_ratio: "tall",
            fallback_url: url
          },
          buttons: [
            {
              type: "web_url",
              url: url,
              title: "View Website",
              webview_height_ratio: "full",
              messenger_extensions: true
            }
          ]
        }
    ]

    return elements

}

module.exports = {
    carouselTemplate
}