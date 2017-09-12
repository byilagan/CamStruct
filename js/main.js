// VARIABLES
var canonArray = [
    {
        name : "Canon t7i",
        image : "images/canon/canon_t7i.png"
    },
    {
        name : "Canon 80d", 
        image : "images/canon/canon_80d.jpg"
    }, 
    {
        name : "Canon 7d Mark II",
        image : "images/canon/canon_7dmarkii.jpg"
    },
    {
        name : "Canon 5d Mark IV",
        image : "images/canon/canon_5dmarkiv.jpg"
    },
    {
        name : "Canon 1dx Mark II",
        image : "images/canon/canon_1dxmarkii.jpg"
    }
]; 

var nikonArray = [
    {
        name : "Nikon d3400",
        image : "images/nikon/nikon_d3400.jpg"
    },
    {
        name : "Nikon d5600",
        image : "images/nikon/nikon_d5600.jpg"
    },
    {
        name : "Nikon d7500", 
        image : "images/nikon/nikon_d7500.JPG"
    },
    {
        name : "Nikon d850",
        image : "images/nikon/nikon_d850.jpg"
    },
    {
        name : "Nikon d5",
        image : "images/nikon/nikon_d5.jpg"
    }
]; 

var sonyArray = [
    {
        name : "Sony a5100",
        image : "images/sony/sony_a5100.jpg"
    },
    {
        name : "Sony a6000",
        image : "images/sony/sony_a6000.jpg"
    },
    {
        name : "Sony a6500",
        image : "images/sony/sony_a6500.jpg"
    },
    {
        name : "Sony a7rii",
        image : "images/sony/sony_a7rii.jpg"
    },
    {
        name : "Sony a9",
        image : "images/sony/sony_a9.jpg"
    }
];

var chosenArray; // Chosen brand 
var selectedProducts = [] // All chosen products
var totalPrice = 0; // Total price of all chosen products

// ON READY 
$(function () {

    // Rotates splash page image using jQuery Rotate
    $("#splashImage").rotate({
        angle:0, 
        animateTo: 360, 
        duration: 2000
    });

    // Fade out splash image
    $("#splashImage").delay(2000).fadeOut(300);

    // Change background color with jQuery UI
    $("body").delay(2000).animate({
        backgroundColor: '#ECE9E7'
    }, 300)

    // Fade in topbar branding
    $("#topbar a").delay(2000).fadeIn(300);
    $("#topbar img").delay(2000).fadeIn(300);
    $("#mainSelector").delay(2000).fadeIn(300);
});

// EVENTS 
$("#canonKit").on("click", function () {
    chosenArray = canonArray;
    carouselSetUp(this);
});

$("#nikonKit").on("click", function () {
    chosenArray = nikonArray;
    carouselSetUp(this);
});

$("#sonyKit").on("click", function () {
    chosenArray = sonyArray;
    carouselSetUp(this);
}); 

$("#cameraSubmit").on("click", function () {
    var chosenBody = $(".active h1").html();

    // Opens sidebar and adjust mainSelector width
    $("#wrapper").addClass("toggled");
    $("#page-content-wrapper").css("width", "calc(100% - 250px)");

    // Fades out carousel and shrinks mainSelector 
    $("#myCarousel").fadeOut(300);
    $("#cameraSubmit").fadeOut(300);
    $("#mainSelector").delay(300).animate({
        height: '250px'
    }, 500);

    addTableItem(chosenBody);
    updateTable();
     
    console.log(chosenBody);
});

// FUNCTIONS 
function carouselSetUp() {
    $("#mainSelector h1").fadeOut(300); 
    $("#mainSelector .brandButton").fadeOut(300);

    $("#mainSelector").animate({
        height: '600px'
    }, 700)

    getCameraPrices();

    $(document).ajaxStop(function () {
        getCameras();

        $("#myCarousel").delay(500).fadeIn(300);
        $("#cameraSubmit").delay(500).fadeIn(300);
    });
}

// Gets the latest prices for the camera bodies of the selected brand
function getCameraPrices () {
    // Gets all the camera prices
    for (var i = 0; i < chosenArray.length; i++) {
        // get the latest price for the current camera element
    
        (function (index) {
            $.ajax({
                url: "http://localhost:8080/api/prices/" + chosenArray[index].name, 
                type: "GET",
                success: function (res) {
                        chosenArray[index]["price"] = (res["priceSummary"]["OfferSummary"]["LowestNewPrice"]["Amount"])/100;
                        chosenArray[index]["formattedPrice"] = res["priceSummary"]["OfferSummary"]["LowestNewPrice"]["FormattedPrice"]; 
                }   
            });
        })(i);
    }
}

// Fills in the camera carousel based on the brand the user chooses
function getCameras() {

    // Handlebars template setup
    var activeSource = $("#active-template").html();
    var inactiveSource = $("#inactive-template").html();

    var  activeTemplate = Handlebars.compile(activeSource); 
    var inactiveTemplate = Handlebars.compile(inactiveSource); 

    currentArray = chosenArray.slice(0);

    var activeImage = currentArray.splice(0,1);

    var activeContext = {activeImg : activeImage[0]};
    var inactiveContext = {inactiveURLs : currentArray};

    var activeHTML = activeTemplate(activeContext); 
    var inactiveHTML = inactiveTemplate(inactiveContext);

    $('#myCarousel .carousel-inner').append(activeHTML);
    $('#myCarousel .carousel-inner').append(inactiveHTML);
}

// Adds a table cell to the product sidebar
function addTableItem(body) {
    var bodyObj;

    for (var i = 0; i < chosenArray.length; i++) { 
        if (chosenArray[i].name == body) {
            selectedProducts.push(chosenArray[i]);
        }
    }
}

function updateTable() {

    //update item list
    for (var i = 0; i < selectedProducts.length; i++) {
        var tableSource = $("#table-cell-template").html();

        var tableTemplate = Handlebars.compile(tableSource);

        var tableContext = {item : selectedProducts[i]};

        var tableHTML = tableTemplate(tableContext); 

        $("#productTable tbody").append(tableHTML);

        totalPrice += selectedProducts[i].price; 
    }   

    $("#totalDisplay span").text(totalPrice.toFixed(2)); //updates total price
}