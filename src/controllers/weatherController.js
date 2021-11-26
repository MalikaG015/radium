const axios = require("axios");

// res.status(200). send( { data: userDetails } )

const getWeather = async function (req, res) {
  try {
    let loc=req.query.q
    let id=req.query.appid
    let options = {
      method: "get",
      url: `http://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${id}` 
    };
    const response = await axios(options);
    res.status(200).send({ msg: "Successfully fetched data", data: response.data });

  } 
  catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Some error occured" });
  }

};
//localhost:3000/Location?q=London&appid=cef534f5b600f8a2db30d159d7be6a02

const getLondonTemp = async function (req, res) {
  try {
    
    let options = {
      method: "get",
      url: "http://api.openweathermap.org/data/2.5/weather?q=London&appid=cef534f5b600f8a2db30d159d7be6a02" 
    };
    const response = await axios(options);
    res.status(200).send({ msg: "Successfully fetched data", data: response.data.main.temp });

  } 
  catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Some error occured" });
  }
}
//localhost:3000/LondonTemp

const tempSort = async function (req, res) {
  try {
    //let cities=["Bengaluru","Mumbai","Delhi","Kolkata","Chennai","London","Moscow"]
    //city is array given in body of postman
    let cities=req.body.city
    let cities1=[];
    for(let i=0;i<cities.length;i++){
    let options = {
      method: "get",
      url: `http://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=cef534f5b600f8a2db30d159d7be6a02`
    }
    const response = await axios(options);
    cities1.push({city:cities[i],temp:response.data.main.temp})
  }
    cities1.sort((a,b)=>(a.temp>b.temp)?1:-1)
    res.status(200).send({ msg: "Successfully fetched data", data: cities1 });
  } 
  catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Some error occured" });
  }
}







module.exports.getWeather = getWeather;
module.exports.getLondonTemp = getLondonTemp;
module.exports.tempSort=tempSort;
