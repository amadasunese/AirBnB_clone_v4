$(document).ready(function () {
    let myAmenities = [];
    let myStates = [];
    let myCities = [];

    $('.amenities .popover input[type=checkbox]').click(function () {
        const myListName = [];
        myAmenities = [];

        $('.amenities .popover  input[type=checkbox]:checked').each(function () {
            myListName.unshift($(this).attr('data-name'));
            myAmenities.unshift($(this).attr('data-id'));
        });
        if (myListName.length === 0) {
            $('.amenities h4').html('&nbsp;');
        } else {
            $('.amenities h4').text(myListName.join(', '));
        }
        console.log(myAmenities);
    });

    $('.locations .popover h2 input[type=checkbox]').click(function () {
        const myListName = [];
        myStates = [];

        $('.locations .popover h2 input[type=checkbox]:checked').each(function () {
            myListName.unshift($(this).attr('data-name'));
            myStates.unshift($(this).attr('data-id'));
        });
        if (myListName.length === 0) {
            $('.locations h6.myStates').html('&nbsp;');
        } else {
            $('.locations h6.myStates').text(myListName.join(', '));
        }
        console.log(myStates);
    });

    $('.locations .popover ul ul input[type=checkbox]').click(function () {
        const myListName = [];
        myCities = [];

        $('.locations .popover ul ul input[type=checkbox]:checked').each(function () {
            myListName.unshift($(this).attr('data-name'));
            myCities.unshift($(this).attr('data-id'));
        });
        if (myListName.length === 0) {
            $('.locations h6.myCities').html('&nbsp;');
        } else {
            $('.locations h6.myCities').text(myListName.join(', '));
        }
        console.log(myCities);
    });

    $('.filters button').click(function (event) {
        event.preventDefault();

        $('.places').text('');

        const obj = {};
        obj.amenities = myAmenities;
        obj.states = myStates;
        obj.cities = myCities;

        listPlaces(JSON.stringify(obj));
    });

    // Variable to keep track of the review state
    let reviewsVisible = false;

    // Function to fetch and display reviews
    function fetchAndDisplayReviews() {
        // Implement the fetch operation to get the reviews data
        // For example:
        $.ajax({
            url: '/api/reviews',
            type: 'GET',
            dataType: 'json',
            success: function (reviews) {
                // Parse the reviews data and display them
                // For example, you can create a <div> to hold the reviews and append each review as a child element
                const reviewsDiv = $('<div id="reviewsDiv"></div>');
                reviews.forEach(review => {
                    const reviewElement = $('<p></p>').text(review.text);
                    reviewsDiv.append(reviewElement);
                });

                // Add the reviews to the DOM
                $('.places').append(reviewsDiv);
            },
            error: function (xhr, status) {
                console.error('Error fetching reviews:', status);
            }
        });
    }

    // Function to hide reviews
    function hideReviews() {
        $('#reviewsDiv').remove();
    }

    // Event listener to toggle fetch/display and hide reviews
    $('span#showHideReviews').click(function () {
        // Toggle reviews visibility and change the button text
        reviewsVisible = !reviewsVisible;
        if (reviewsVisible) {
            fetchAndDisplayReviews();
            $(this).text('Hide');
        } else {
            hideReviews();
            $(this).text('Reviews');
        }
    });

    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/status/',
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            $('#api_status').addClass('available');
        },

        error: function (xhr, status) {
            console.log('error ' + xhr);
        }
    });
    listPlaces();
});

function listPlaces(consult = '{}') {
    console.log(consult);
    $.ajax({
        type: 'POST',
        url: 'http://0.0.0.0:5001/api/v1/places_search',
        dataType: 'json',
        data: consult,
        contentType: 'application/json; charset=utf-8',
        success: function (places) {
            console.log(places);
            for (let i = 0; i < places.length; i++) {
                $('.places').append(`
<article>
<div class="title_box">
<h2> ${places[i].name}</h2>
<div class="price_by_night"> ${places[i].price_by_night} </div>
</div>
<div class="information">
<div class="max_guest">${places[i].max_guest}
${places[i].max_guest > 1 ? 'Guests' : 'Guest'} </div>
<div class="number_rooms">${places[i].number_rooms}
${places[i].number_rooms > 1 ? 'Bedrooms' : 'Bedroom'}  </div>
<div class="number_bathrooms">${places[i].number_bathrooms}
${places[i].number_bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}  </div>
</div>
<div class="user">
</div>
<div class="description">
${places[i].description}
</div>
</article>
`);
            }
        },
        error: function (xhr, status) {
            console.log('error ' + status);
        }
    });
}
