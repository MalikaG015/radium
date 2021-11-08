function printDate(){
    console.log("Today is 8yh november 2021");
}
function printMonth(){
    console.log("current month is november");

}
function printBatchInfo(){
    console.log("My batch is radium. Today is week 4-day 1. The topic for today is module system in nodejs");
}
module.exports.getDate=printDate;
module.exports.getMonth=printMonth;
module.exports.getBatchInfo=printBatchInfo;

