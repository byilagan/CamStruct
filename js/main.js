// DATA 
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
    $("#topbar h1").delay(2000).fadeIn(300);
    $("#topbar img").delay(2000).fadeIn(300);

    $("#mainSelector").delay(2000).fadeIn(300);
});

// EVENTS 
$("#canonKit").on("click", function () {
    carouselSetUp(this);
});

$("#nikonKit").on("click", function () {
    carouselSetUp(this);
});

$("#sonyKit").on("click", function () {
    carouselSetUp(this);
}); 

$("#cameraSubmit").on("click", function () {
    var chosenItem = $(".active h1").html();
    console.log(chosenItem);
});

// FUNCTIONS 
function carouselSetUp(kitType) {
    $("#mainSelector h1").fadeOut(300); 
    $("#mainSelector .brandButton").fadeOut(300);

    $("#mainSelector").animate({
        height: '600px'
    }, 700)

    getCameraPrices(kitType);

    $(document).ajaxStop(function () {
        getCameras(kitType);

        $("#myCarousel").delay(500).fadeIn(300);
        $("#cameraSubmit").delay(500).fadeIn(300);
    });
}

// Gets the latest prices for the camera bodies of the selected brand
function getCameraPrices (kitType) {
    var brandArray; // array that corresponds the selected brand
    var brand = $(kitType).attr("id"); 

    if (brand == "canonKit") {
        brandArray = canonArray;
    } else if (brand == "nikonKit") {
        brandArray = nikonArray; 
    } else if (brand == "sonyKit") { 
        brandArray = sonyArray;
    }

    // Gets all the camera prices
    for (var i = 0; i < brandArray.length; i++) {
        // get the latest price for the current camera element
    
        (function (index) {
            $.ajax({
                url: "http://localhost:8080/api/prices/" + brandArray[index].name, 
                type: "GET",
                success: function (res) {
                        brandArray[index]["price"] = (res["priceSummary"]["OfferSummary"]["LowestNewPrice"]["Amount"])/100;
                        brandArray[index]["formattedPrice"] = res["priceSummary"]["OfferSummary"]["LowestNewPrice"]["FormattedPrice"]; 
                }   
            });
        })(i);
    }
}

// Fills in the camera carousel based on the brand the user chooses
function getCameras(kitType) {

    // Handlebars template setup
    var activeSource = $("#active-template").html();
    var inactiveSource = $("#inactive-template").html();

    var  activeTemplate = Handlebars.compile(activeSource); 
    var inactiveTemplate = Handlebars.compile(inactiveSource); 
    
    var activeContext;
    var inactiveContext;
    var currentArray;

    var brand = $(kitType).attr("id"); 
    if (brand == "canonKit") {
        console.log("canon");
        currentArray = canonArray.slice(0);
    } else if (brand == "nikonKit") {
        console.log("nikon");
        currentArray = nikonArray.slice(0);
    } else if (brand == "sonyKit") {
        console.log("sony");
        currentArray = sonyArray.slice(0);
    }

    var activeImage = currentArray.splice(0,1);

    activeContext = {activeImg : activeImage[0]};
    inactiveContext = {inactiveURLs : currentArray};

    var activeHTML = activeTemplate(activeContext); 
    var inactiveHTML = inactiveTemplate(inactiveContext);

    $('#myCarousel .carousel-inner').append(activeHTML);
    $('#myCarousel .carousel-inner').append(inactiveHTML);
}