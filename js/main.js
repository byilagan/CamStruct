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

var chosenArray; // Chosen camera array
var chosenBrand; // Chosen camera brand
var selectedProducts = [] // All chosen products
var totalPrice = 0; // Total price of all chosen product

// Arrays that hold camera accessories
var lensArray = [];
var bagArray = []; 
var tripodArray = []; 
var memoryArray = [];

var appCounter = 0; // Handles order of ajax requests

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

// Handles order of ajax requests
$(document).ajaxStop(function () {
    if (appCounter == 0) { // Loads in camera carousel
        getCameras();

        $("#myCarousel").delay(500).fadeIn(300);
        $("#cameraSubmit").delay(500).fadeIn(300);

        appCounter++;
    } else if (appCounter == 1) { // Loads in extras selector
        var source = $("#extras-template").html();
        var template = Handlebars.compile(source);

        for (var i = 0; i < lensArray.length; i++) {
            var context = {item : lensArray[i]};
            var HTML = template(context);

            $("#lenses-table tbody").append(HTML);
        }

        for (var i = 0; i < bagArray.length; i++) {
            var context = {item : bagArray[i]};
            var HTML = template(context);

            $("#bags-table tbody").append(HTML);
        }

        for (var i = 0; i < tripodArray.length; i++) {
            var context = {item : tripodArray[i]};
            var HTML = template(context);

            $("#tripods-table tbody").append(HTML);
        }

        for (var i = 0; i < memoryArray.length; i++) {
            var context = {item : memoryArray[i]}; 
            var HTML = template(context);

            $("#memory-table tbody").append(HTML);
        }
    }
}); 

// Canon brand button
$("#canonKit").on("click", function () { 
    chosenArray = canonArray;
    chosenBrand = "Canon";
    carouselSetUp(this);
});

// Nikon brand button
$("#nikonKit").on("click", function () {
    chosenArray = nikonArray;
    chosenBrand = "Nikon"; 
    carouselSetUp(this);
});

// Sony brand button
$("#sonyKit").on("click", function () {
    chosenArray = sonyArray;
    chosenBrand = "Sony"; 
    carouselSetUp(this);
}); 

// Submits camera body choice and switches to extras selector
$("#cameraSubmit").on("click", function () {
    var chosenBody = $(".active h1").html();

    // Opens sidebar and adjust mainSelector width
    $("#wrapper").addClass("toggled");
    $("#page-content-wrapper").css("width", "calc(100% - 250px)");

    var newHeight = $("#sidebar-wrapper").height() - $("#totalDisplay").height()
    $("#productTable").animate({
        height: "" + newHeight
    });

    // Fades out carousel and shrinks mainSelector 
    $("#myCarousel").fadeOut(300);
    $("#cameraSubmit").fadeOut(300);
    $("#mainSelector").animate({
        height: '250px'
    }, 500);

    // Adds body and updates side bar
    addSideBarBody(chosenBody);
    updateSideBar();

    // Fills extras selector
    extrasSetUp();

    // Opens up mainSelector and fades in extrasSelector
    $("#mainSelector").css("padding", "0");
    $("#extrasSelector").css("height", $("#mainSelector").height())
    $("#mainSelector").animate({
        height: '600px'
    }, 700);
    $("#extrasSelector").delay(1000).fadeIn(300);
    
});

// Adds extra item to side bar 
$("#extrasSelector .tab-content").on("click","td button", function () {
    var type = $("#extrasSelector .tab-content .active").attr("id");
    var item = $(this).parent().prev("td").prev("td").html();
    var tempArray; 

    if (type == "lenses") {
        tempArray = lensArray;
    } else if (type == "bags") {
        tempArray = bagArray; 
    } else if (type == "tripods") {
        tempArray = tripodArray; 
    } else if (type == "memory") {
        tempArray = memoryArray; 
    }

    // Adds item to side bar and update price
    addSideBarItem(item, tempArray);
    updateSideBar();
});

// FUNCTIONS 

// Fills in camera carousel with prices
function carouselSetUp () {
    $("#mainSelector h1").fadeOut(300); 
    $("#mainSelector .brandButton").fadeOut(300);

    $("#mainSelector").animate({
        height: '600px'
    }, 700)

    getCameraPrices();
}

// Fills in extras array with items
function extrasSetUp () {
    getLenses();
    getBags(); 
    getTripods(); 
    getMemory();
}

// Fills in the camera carousel based on the brand the user chooses
function getCameras () {
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


// Gets lenses and places them in lensArray
function getLenses () {
    $.ajax({
        url: "http://localhost:8080/api/lenses/" + chosenBrand, 
        type: "GET",
        //async: false,
        success: function (res) {
            for (var i = 0; i < res.length; i++) {
                var newItem = {
                    name : res[i]["ItemAttributes"]["Title"],
                    image : res[i]["LargeImage"]["URL"],
                    price : res[i]["ItemAttributes"]["ListPrice"]["Amount"]/100,
                    formattedPrice : res[i]["ItemAttributes"]["ListPrice"]["FormattedPrice"]
                }

                lensArray.push(newItem);
            }
        }   
    });
}


// Gets bags and places them in bagArray
function getBags () {
    $.ajax({
        url: "http://localhost:8080/api/bags", 
        type: "GET",
        success: function (res) {
              for (var i = 0; i < res.length; i++) {
                var newItem = {
                    name : res[i]["ItemAttributes"]["Title"],
                    image : res[i]["LargeImage"]["URL"],
                    price : res[i]["ItemAttributes"]["ListPrice"]["Amount"]/100,
                    formattedPrice : res[i]["ItemAttributes"]["ListPrice"]["FormattedPrice"]
                }

                bagArray.push(newItem);
            }
        }   
    });
}

// Gets tripods and places them in tripodArray
function getTripods () {
    $.ajax({
        url: "http://localhost:8080/api/tripods", 
        type: "GET",
        success: function (res) {
            for (var i = 0; i < res.length; i++) {
                var newItem = {
                    name : res[i]["ItemAttributes"]["Title"],
                    image : res[i]["LargeImage"]["URL"],
                    price : res[i]["ItemAttributes"]["ListPrice"]["Amount"]/100,
                    formattedPrice : res[i]["ItemAttributes"]["ListPrice"]["FormattedPrice"]
                }

                tripodArray.push(newItem);
            }
        }   
    });
}

// Gets memory cards and places them in memoryArray
function getMemory () {
    $.ajax({
        url: "http://localhost:8080/api/memory", 
        type: "GET",
        success: function (res) {
            for (var i = 0; i < res.length; i++) {
                var newItem = {
                    name : res[i]["ItemAttributes"]["Title"],
                    image : res[i]["LargeImage"]["URL"],
                    price : res[i]["ItemAttributes"]["ListPrice"]["Amount"]/100,
                    formattedPrice : res[i]["ItemAttributes"]["ListPrice"]["FormattedPrice"]
                }

                memoryArray.push(newItem);
            }
        }   
    });
}

// Adds a extra item to side bar
function addSideBarItem(itemName, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].name == itemName) {
            selectedProducts.push(array[i]);
        }
    }
}

// Adds a camera body to side bar
function addSideBarBody(body) {
    for (var i = 0; i < chosenArray.length; i++) { 
        if (chosenArray[i].name == body) {
            selectedProducts.push(chosenArray[i]);
        }
    }
}

// Updates side bar list and pricing
function updateSideBar() {

    $("#productTable tbody").html("");
    totalPrice = 0;

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