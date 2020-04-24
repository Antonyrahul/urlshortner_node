const crypto = require('crypto')
const express = require('express');
const app = express();
const cors = require('cors')
const bodyparser = require('body-parser');
const mongodbclient = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt =  require("jsonwebtoken");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors())

dburl ="mongodb+srv://antonyrahul96:antonyrahul96@cluster0-aoyxh.mongodb.net/test?retryWrites=true&w=majority"
//dburl = "mongodb://localhost:27017/"
app.post('/loginuser', function (req, res) {
    console.log(req.body);
    mongodbclient.connect(dburl, function (err, client) {
        if (err) throw err;
        var db = client.db("urldb");

            db.collection("usersCollection").findOne({email:req.body.email}, function (err, data) {
                if(data)
                {
                if (err) throw err;
                bcrypt.compare(req.body.password, data.password, function(err, result) {
                    if(err) throw err;
                   
                    if(result == true)
                    {
                    console.log("logged in")
                    var jwtToken = jwt.sign({id:data.id},'qazwsxedcrfv')
                    client.close();
                    res.status(200).json({
                        message: "LOGGED IN",
                        jwttoken: jwtToken,
                        name : data.firstname,
                        email:data.email,
                        status :200
                    });
                    

                }
                    else{
                        client.close();
                        res.status(401).json({
                            message: "Incorrect password"
                        })
                    
                    console.log("wrong creds")
                    }
                });

                
                
            }
            else
            {
                client.close();
                res.status(401).json({
                    message : "Incorrect username"
                })
            }
            })
            // Store hash in your password DB.
        


    });

})

app.post('/registeruser', function (req, res) {
    console.log(req.body);
    mongodbclient.connect(dburl, function (err, client) {
        if (err) throw err;
        var db = client.db("urldb");
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (err) throw err;
            var userData = {
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: hash
                
            }
            db.collection("usersCollection").insertOne(userData, function (err, data) {
                if (err) throw err;
                client.close();
                res.json({
                    message: "saved"
                })
            })
            // Store hash in your password DB.
        });

       // client.close();
    });

})

app.post('/getUrls', function (req, res) {
    console.log(req.body);
    mongodbclient.connect(dburl, function (err, client) {
        useUnifiedTopology: true
        if (err) throw err;
        var db = client.db("urldb");
     
           
                db.collection("urlcollection").find(req.body).toArray(function (err, data) {
                    if (err) throw err;
                    client.close();
                    res.json({
                        message: "saved",
                        data:data
                    })
                })
            
          
            // Store hash in your password DB.
        

       // client.close();
    });

})


app.post('/generateurl', function (req, res) {
   
    console.log(req.body);
    crypto.randomBytes(3,(err, buf) => {
        if (err) throw err;
        url = buf.toString('hex');
        
        
        })
    
    mongodbclient.connect(dburl, function (err, client) {
        if (err) throw err;
        var db = client.db("urldb");
        userData= {
            longurl:req.body.longurl,
            shorturl :url,
            email: req.body.email
        }
      
            db.collection("urlcollection").insertOne(userData, function (err, data) {
                if (err) throw err;
                client.close();
                res.json({
                    message: "saved",
                    url:url
            })
            // Store hash in your password DB.
        

       // client.close();
    });

})
})

app.post('/getlongurl', function (req, res) {
   
    console.log(req.body);
   
    
    mongodbclient.connect(dburl, function (err, client) {
        if (err) throw err;
        var db = client.db("urldb");
        userData= {
            
            shorturl :req.body.data
        }
        updatedata={$inc:{
            visitcount : +1
        }
        }
      
            db.collection("urlcollection").findOneAndUpdate(userData,updatedata, function (err, data) {
                if (err) throw err;
                client.close();
                res.json({
                    message: "saved",
                    data:data
            })
            // Store hash in your password DB.
        

       // client.close();
    });

})
})
//process.env.PORT
app.listen(4123, function () {

    console.log("listening on port 4123");
});
