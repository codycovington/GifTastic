
var topics = [];
var favorites = [];


$(document).ready(function() {

// This on click function handles events where the search button is clicked
$("#search-request").on("click", function(event) {

        event.preventDefault();
        var searchRequest =  $("#search-text").val().trim();
        if (searchRequest != "") {
        topics.push(searchRequest);
        renderButtons();
        
        } else {
            alert("You must enter a word");
        }    
});

// Function for rendering & displaying buttons
function renderButtons() {
    $("#buttons-view").empty();
    // Loops through the array of queries
    for (var i = 0; i < topics.length; i++) {
        var a = $("<button class='btn btn-primary'></button>");
        // Adds a class to our button
        a.addClass("searchRequestClass");
        // Added a data-attribute
        a.attr("data-name", topics[i]);
        // Provided the initial button text
        a.text(topics[i]);
        // Added the button to the buttons-view div
        $("#buttons-view").append(a);
    } 
}

// Adding click event listeners to all rendered buttons  with .searchRequestClass
$(document).on('click', '.searchRequestClass', displayGiphyImages);

function displayGiphyImages() {
    var apiKey = "7gM2QWosn2bK7b9u3WWh2PbsW8PDpdjK";
    var searchTerm = $("#search-text").val().trim();
    // var searchTerm = $(this).attr("data-name");
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&limit=10&api_key=" + apiKey;
    // Creates AJAX call for the specific movie button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        //console.log(response);
   
    for (var i = 0; i < response.data.length; i++) {
    //console.log(response.data[i].images.downsized_still.url);
    //Place the image urls and ratings in a div inside "image-views'"     
        var imageRating = $("<div><strong>Rating:</strong> " + response.data[i].rating + "</div><br>");
        $("#images-view").prepend(imageRating);

        var newImageDiv = $("<img>");
        newImageDiv.addClass("image");
        newImageDiv.attr("data-state", "still");
        newImageDiv.attr("src", response.data[i].images.fixed_height_still.url);
        newImageDiv.attr("data-still", response.data[i].images.fixed_height_still.url);
        newImageDiv.attr("data-play", response.data[i].images.fixed_height.url);
        $("#images-view").prepend(newImageDiv);

        addToFavBtn = $("<div><button class='btn btn-outline-success'>Add to Favorites</button></div>");
        addToFavBtn.addClass("favButton");
        addToFavBtn.attr("data-state", "still");
        addToFavBtn.attr("src", response.data[i].images.fixed_height.url);
        addToFavBtn.attr("data-still", response.data[i].images.fixed_height_still.url);
        addToFavBtn.attr("data-play", response.data[i].images.fixed_height.url);
        $("#images-view").prepend(addToFavBtn);
    }
    });
   
}


//PLAY PAUSE FUNCTIONALITY
$(document).on('click', '.image', pausePlay);

function pausePlay() {
      
    var state = $(this).attr("data-state");
    console.log($(this).attr("data-state"));

	var playState = $(this).attr("data-play");
    var stillState = $(this).attr("data-still");
    
	if (state == "still") {
		$(this).attr("src", playState);
		$(this).attr("data-state", "play");
	}
	if (state == "play") {
		$(this).attr("src", stillState);
		$(this).attr("data-state", "still");
	}  
    
}

// CLEAR THE RESULTS FROM A SEARCH, BUT NOT FAVORITES
$("#clear-results").on("click", function(event) {

    event.preventDefault();
    $("#images-view").empty();
    $("#search-text").val("");
       
});

//============================== FAVORITES CODE FEATURE ================================================

//PUSH THE GIF TO FAVORITES IN LOCAL STORAGE VIA THE BUTTON
$("body").on("click", ".favButton",  function(event) {
    event.preventDefault();

    console.log($(this).attr("src"));
    localStorage.setItem("favorite_url", $(this).attr("src"));
    localStorage.setItem("data-state", $(this).attr("data-state")); 
    localStorage.setItem("data-still", $(this).attr("data-still"));
    localStorage.setItem("data-play", $(this).attr("data-play"));
    alert("Added to Favorites");
});

//DISPLAY THE FAVORITES
function displayFavorites() {
    var getFavorite = localStorage.getItem("favorite_url");
    console.log(getFavorite);
    var favImg = $("#favorites").append("<img src=" + getFavorite + ">");
    favImg.addClass("favImg");
    console.log(getFavorite);

    

    var deleteFav = $("<div><button class='btn btn-outline-danger'>Delete Fav</button></div>");
    deleteFav.addClass("deleteFav");
    $("#favorites").append(deleteFav);

    if (localStorage.getItem("favorite_url") === null) {
        $("#favorites").hide();
      } else {
          $("#favorites").show();
      } 
      
}

//Call the function to display Favorites
displayFavorites();

//Add play/pause functionality -- WORK IN PROGRESS
$("body").on("click", ".favImg",  function() {
    pausePlay();
});

//FUNCTION TO DELETE FAVORITES
$("body").on("click", ".deleteFav", function(event) {

    event.preventDefault();
    localStorage.removeItem("favorite_url");
    localStorage.removeItem("data-state");
    localStorage.removeItem("data-still");
    localStorage.removeItem("data-play");
    $("#favorites").empty();
    
     
});



})

