var express = require("express");
var app = express();
var AmazonAPI = require("amz-products");

var amazon = new AmazonAPI({
  accessKeyId     : "Your access key here", 
  secretAccessKey : "Your secret key here", 
  associateId     : "Your associate tag here",
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
        ResponseGroup: "OfferSummary",
    }, function(err, response){
        res.json({name: req.params.cameraBody, priceSummary: response["ItemSearchResponse"]["Items"]["Item"][0]});
    });
    console.log("GET: Price Results for " + req.params.cameraBody);
});

// GET INFO FOR LENSES FOR GIVEN BRAND
router.get('/lenses/:cameraBrand', function (req, res) { 
    amazon.getItemsInBrowseNode({
        Keywords: req.params.cameraBrand + " lenses",
        SearchIndex: "All",
        ResponseGroup: "ItemAttributes, Images"
    }, function(err, response){
        //res.json({name: req.params.cameraBody, priceSummary: response["ItemSearchResponse"]["Items"]["Item"][0]});
        console.log(JSON.stringify(response));
    });
    console.log("GET: Search Results for " + req.params.cameraBrand + " lenses");
});

router.get('/bags', function (req, res) { 
    amazon.getItemsInBrowseNode({
        Keywords: "camera bags",
        SearchIndex: "All",
        ResponseGroup: "ItemAttributes, Images"
    }, function(err, response){
        //res.json({name: req.params.cameraBody, priceSummary: response["ItemSearchResponse"]["Items"]["Item"][0]});
        console.log(JSON.stringify(response));
    });
    console.log("GET: Search Results for camera bags");
});

router.get('/tripods', function (req, res) { 
    amazon.getItemsInBrowseNode({
        Keywords: "tripods",
        SearchIndex: "All",
        ResponseGroup: "ItemAttributes, Images"
    }, function(err, response){
        //res.json({name: req.params.cameraBody, priceSummary: response["ItemSearchResponse"]["Items"]["Item"][0]});
        console.log(JSON.stringify(response));
    });
    console.log("GET: Search Results for tripods");
});

router.get('/memory', function (req, res) { 
    amazon.getItemsInBrowseNode({
        Keywords: "memory cards",
        SearchIndex: "All",
        ResponseGroup: "ItemAttributes, Images"
    }, function(err, response){
        //res.json({name: req.params.cameraBody, priceSummary: response["ItemSearchResponse"]["Items"]["Item"][0]});
        console.log(JSON.stringify(response));
    });
    console.log("GET: Search Results for memory cards ");
});

app.use("/api", router);

app.listen(port); 
console.log("Server is listening on port " + port);
