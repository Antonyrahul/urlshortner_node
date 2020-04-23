const crypto = require('crypto')
const express = require('express');
const app = express();
const cors = require('cors')
const bodyparser = require('body-parser');
const mongodbclient = require('mongodb');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors())

dburl ="mongodb://localhost:27017/"
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
            longurl:req.body.data,
            shorturl :url
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
      
            db.collection("urlcollection").findOne(userData, function (err, data) {
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

app.listen(4123, function () {

    console.log("listening on port 4123");
});
