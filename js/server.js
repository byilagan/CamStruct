var express = require("express");
var app = express();
var AmazonAPI = require("amz-products");

var amazon = new AmazonAPI({
  accessKeyId     : "Your access key", 
  secretAccessKey : "Your secret access key", 
  associateId     : "your associate tag",
  locale : "US"
});

var port = process.env.port || 8080;
var router = express.Router();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// GET PRICE SUMMARY FOR CAMERA BODY
router.get('/prices/:cameraBody', function (req, res) { 
    amazon.getItemsInBrowseNode({
        Keywords: req.params.cameraBody + " Body",
        SearchIndex: "All", 
        ResponseGroup: "OfferSummary"
    }, function(err, response){
        res.json({name: req.params.cameraBody, priceSummary: response["ItemSearchResponse"]["Items"]["Item"][0]});
    });
    console.log("GET: Search Results ");
});

app.use("/api", router);

app.listen(port); 
console.log("Server is listening on port " + port);
