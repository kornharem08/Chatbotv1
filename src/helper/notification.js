const func = require("../views/function.js");

function checkNotification(){

    setInterval(function() {
     func.sendTextMessage("2797221146971020","this is notification")
    }, 30000);


}

