function log(name){
    console.log("The name is" + name);
}
function welcome(){
    console.log("Welcome to application! My name is Malika");
}
let url="https://www.google.com";
module.exports.logMessage=log;
module.exports.printWelcomeMessage=welcome;
module.exports.loggerEndpoint=url;