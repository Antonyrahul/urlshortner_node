const crypto = require('crypto')
const express = require('express');
const app = express();
const cors = require('cors')
const bodyparser = require('body-parser');
const { getName } = require('country-list');

const mongodbclient = require('mongodb');
const bcrypt = require('bcrypt');
const geoip = require('geoip-lite');
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


app.post('/gethistory', function (req, res) {
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
app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/:id', function (req, res) {
   var id = req.params.id;
   console.log("in")
    console.log(id);
    customerip = req.headers['x-forwarded-for'];
    devicename = req.headers['user-agent']
    i1 = devicename.indexOf("(")
    i2 = devicename.indexOf(')')
     device = devicename.slice(i1+1,i2)
     var geo = geoip.lookup(customerip);
     countryname =(getName(geo.country));
     // console.log(countryname)
    //console.log(req.connection)
    let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();
dateandtime = date+'-'+month+'-'+year+"  "+hours+":"+minutes+":"+seconds

    mongodbclient.connect(dburl, function (err, client) {
        if (err) throw err;
        var db = client.db("urldb");
        userData= {
            
            shorturl :id
        }
        historydata ={
            dateandtime:dateandtime,
            location:countryname,
            devicedetails : device,
            customerip:customerip

        }
        updatedata={$inc:{
            externalvisitcount : +1
        },
        $push:{history:historydata}
        }
      
            db.collection("urlcollection").findOneAndUpdate(userData,updatedata, function (err, data) {
                if (err) throw err;
                client.close();
                if(data.value.longurl)
                res.redirect(data.value.longurl)
//else
              //  res.json({
             //       mesaage:"url not found"
            //    })
             
            console.log(data.value.longurl)
           
            // Store hash in your password DB.
        

       // client.close();
    });

})
})
app.post('/getlongurl', function (req, res) {
   
    console.log(req.body);
    console.log("in")
    
    customerip = req.headers['x-forwarded-for'];
    devicename = req.headers['user-agent']
    i1 = devicename.indexOf("(")
    i2 = devicename.indexOf(')')
     device = devicename.slice(i1+1,i2)
     var geo = geoip.lookup(customerip);
     countryname =(getName(geo.country));
     // console.log(countryname)
    //console.log(req.connection)
    let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();
dateandtime = date+'-'+month+'-'+year+"  "+hours+":"+minutes+":"+seconds
   
    
    mongodbclient.connect(dburl, function (err, client) {
        if (err) throw err;
        var db = client.db("urldb");
       
        historydata ={
            dateandtime:dateandtime,
            location:countryname,
            devicedetails : device,
            customerip:customerip

        }
        updatedata={$inc:{
            homevisitcount : +1
        },
        $push:{history:historydata}
        }
      
            db.collection("urlcollection").findOneAndUpdate(req.body,updatedata, function (err, data) {
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
app.listen(process.env.PORT, function () {

    console.log("listening on port 4123");
});
