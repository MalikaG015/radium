const express = require('express');

const router = express.Router();

router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});
router.get('/movies',function(req,res){
    const array=["Titanic","Godzilla","Interstellar","Badshah"];
    res.send(array);
})
router.get('/movies/:movieIndex', function(req,res){
    let movies=["Interstellar","Black","Grey","Godzilla","Gulabo Sitabo"];
    let index=req.params.movieIndex;
    let movieAtIndex=movies[index];
    if(index>=movies.length){
        res.send("invalid index");
    }
    else{
        res.send(movieAtIndex);
    }
   })
router .get('/films',function(req,res){
    const myObj=[{
        "id":1,
        "name":"Hero"
    },
    {
        "id":2,
        "name":"Bharti"
    },
    {
        "id":3,
        "name":"I am alive"
    },
    {
        "id":4,
        "name":"Today"
    }]
    res.send(myObj);
})
router.get('/films/:filmId', function(req,res){
    let movies=[{
        "id":1,
        "name":"Hero"
    },
    {
        "id":2,
        "name":"Bharti"
    },
    {
        "id":3,
        "name":"I am alive"
    },
    {
        "id":4,
        "name":"Today"
    }]
    let value=req.params.filmId;
    if(value<=movies.length-1){
        res.send(movies[value-1]);
    }
    else{
        res.send("invalid id");
    }
    
})
module.exports = router;
