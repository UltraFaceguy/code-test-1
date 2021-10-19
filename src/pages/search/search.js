let search = `
    <div class="navbar-background">
        <div class="full-width">
            <nav class="navbar-elements">
                <a class="site-logo" href="#" onclick="onNavigate('/'); return false;">My ZIP Finder</a>

                <ul class="navbar-options">
                    <li class="navbar-item"><a href="#" onclick="onNavigate('/'); return false;">Home</a></li>
                    <li class="navbar-item"><a href="#" onclick="onNavigate('/about'); return false;">About</a></li>
                    <li class="navbar-item"><a href="#" onclick="onNavigate('/search'); return false;">Business Locator</a></li>
                </ul>
            </nav>
        </div>
    </div>
    <div class="mapContainer">
        <div id="map"></div>
        <div class="mapSidebar">
            <div class="mapSidebar-top">
                <div class="mapSidebar-title">Enter ZIP Code</div>
                <input
                    class="mapSidebar-input"
                    id="zip-input"
                    type='text'
                    onkeydown=validateInputNumericOnly(event)
                    onkeyup=enableIfValid(event)
                    maxlength="5"
                >
                <button disabled id="zip-button" class="mapSidebar-button" onclick="submitZip()">Go</button>
            </div>
            <div class="mapSidebar-results"/>
        </div>
    </div>
`

let map;
let markers = [];
let submitButton;
let randomImages = [
    "public/business_1.jpg",
    "public/business_2.jpg",
    "public/business_3.jpg",
    "public/business_4.jpg",
    "public/business_5.jpg",
    "public/business_6.jpg",
    "public/business_7.jpg"
];
let randomNames = [
    "Alice's Restaurant",
    "Feed And Seed Emporium",
    "Strickland Propane",
    "Cover To Cover Books",
    "Mega Lo Mart",
    "Thatherton Fuels"
];
let randomDescriptions = [
    "A scenic destination located on the water. Or is it? I guess we'll leave it up to chance",
    "You can get anything you want at this restaurant. Located just 0.5 miles from the railroad track.",
    "Blazing fast service that won't break the bank! Come visit anytime!",
    "Wow! What a business! Recommended by 4/5 dentists.",
    "Low low prices, and an even lower quality!",
    "We proudly have enough reviews that you can't be sure if your rating even actually updates the average stars!",
    "Our prices are so low, we lose money on every sale! But don't worry, we'll make up for it with volume."
];

const myStyles = [{
    featureType: "poi",
    elementType: "labels",
    stylers: [
        {visibility: "off"}
    ]
}];

let setupSearch = function () {
    initMaps();
}

function initMaps() {
    submitButton = document.getElementById("zip-button");
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 36.852924, lng: -75.977982 },
        zoom: 14,
        styles: myStyles
    });
    map.setOptions({draggable: true, zoomControl: false, scrollwheel: true, disableDoubleClickZoom: true});
    populateMarkers();
}

function addMarker(position) {
    const title = randomNames[Math.round(Math.random() * (randomNames.length - 1))]
    const marker = new google.maps.Marker({
        position,
        map,
        title: title
    });
    marker.imgUrl = randomImages[Math.round(Math.random() * (randomImages.length - 1))];
    marker.rating = Math.round((1 + Math.random() * 4) * 10) / 10;
    marker.desc = randomDescriptions[Math.round(Math.random() * (randomDescriptions.length - 1))]
    marker.reviews = 540 + Math.round(Math.random() * 450)
    marker.reviewed = false;
    marker.distance = Math.round(haversine_distance(map.center, position) * 10) / 10;
    const contentString =
        '<div id="content">' +
        '<div class="infoWindow-content">' +
        '<div class="infoWindow-text">' +
        '<img class="infoWindow-image" src="' + marker.imgUrl + '" alt="' + marker.title + '"/>' +
        '<h1 id="firstHeading" class="firstHeading">' + marker.title + '</h1>' +
        '<div id="bodyContent">' +
        "<p>"+ marker.desc +"</p>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";
    const infoWindow = new google.maps.InfoWindow({
        content: contentString,
    });
    marker.infoWindow = infoWindow;
    marker.addListener("click", () => {
        closeOtherInfoWindows();
        infoWindow.open({
            anchor: marker,
            map,
            shouldFocus: true,
        });
    });
    markers.push(marker);
}

function addRandomMarker(position) {
    if (position == null) {
        addMarker(new google.maps.LatLng(0, 0));
    }
    const center = position.toJSON();
    const lat = center.lat - 0.06 + (Math.random() * 0.12);
    const long = center.lng - 0.06 + (Math.random() * 0.12);
    addMarker(new google.maps.LatLng(lat, long));
}

function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function hideMarkers() {
    setMapOnAll(null);
}

function closeOtherInfoWindows() {
    markers.forEach(function (item, index) {
        item.infoWindow.close();
    });
}

function showMarkers() {
    setMapOnAll(map);
}

function deleteMarkers() {
    hideMarkers();
    markers = [];
}

// https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
// This doesn't... seem to be correct though? TODO: Verify distances are correct
function haversine_distance(mk1, mk2) {
    const R = 3958.8; // Radius of the Earth in miles
    const rlat1 = mk1.lat() * (Math.PI / 180); // Convert degrees to radians
    const rlat2 = mk2.lat() * (Math.PI / 180); // Convert degrees to radians
    const difflat = rlat2 - rlat1; // Radian difference (latitudes)
    const difflon = (mk2.lng() - mk1.lng()) * (Math.PI / 180); // Radian difference (longitudes)

    return 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) *
        Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
}

// https://www.freemaptools.com/convert-us-zip-code-to-lat-lng.htm
function getLatLongFromZip(zip, recenterCallback) {
    fetch('https://api.promaptools.com/service/us/zip-lat-lng/get/?zip='+ zip + '&key=17o8dysaCDrgv1c').then((response) => {
        return response.json();
    }).then((json) => {
        if (json.msg && json.msg === "No results found") {
            deleteMarkers();
            const results = document.querySelector('.mapSidebar-results');
            while (results.firstChild) {
                results.removeChild(results.firstChild);
            }
            const noResultsPanel = document.createElement('div');
            let result = `<div>Nothing found for that ZIP!</div>`;
            noResultsPanel.innerHTML += result;
            results.appendChild(noResultsPanel);
        } else {
            recenterCallback(json.output[0].latitude, json.output[0].longitude);
        }
    });
}

function submitZip() {
    const zip = document.getElementById("zip-input").value;
    if (zip.length !== 5 || !parseInt(zip)) {
        console.log("ZIP not valid! Not sending HTTP request...")
        return
    }
    getLatLongFromZip(zip, updateZip)
}

function updateZip(lat, long) {
    map.setCenter(new google.maps.LatLng(lat, long));
    populateMarkers();
}

function populateMarkers() {
    deleteMarkers()
    for (let i = 35 + Math.floor(Math.random() * 60); i > 0; i--) {
        addRandomMarker(map.center);
    }
    updateSidebar();
}

function updateSidebar() {
    // Do this nonsense because the scrollbar lib doesn't
    // support dynamic adding of dom elements... TODO: Get new scroll lib
    const results = document.querySelector('.mapSidebar-results');
    while (results.firstChild) {
        results.removeChild(results.firstChild);
    }
    const container = document.createElement('div');
    container.className = "mapSidebar-container";
    container.setAttribute('ss-container', true);
    results.appendChild(container);
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    markers.sort(compareMarkerDistance);
    markers.forEach(function (item, index) {
        const newEl = document.createElement('div');
        newEl.className = "sidebar-result"
        newEl.id = "sidebar-result-" + index;
        newEl.onclick = function () {
            closeOtherInfoWindows();
            item.infoWindow.open({
                anchor: item,
                map,
                shouldFocus: true,
            });
        }
        generateSidebarPanelInfo(item, newEl);
        container.appendChild(newEl);
    });
    SimpleScrollbar.initAll();
}

function generateSidebarPanelInfo(marker, element) {
    const ratingElement = element.querySelector("#star-rating");
    element.innerHTML = `
        <div class="poi-title">` + marker.title + `<span class="poi-distance"> ` + marker.distance + `mi Away</span></div>
        <div class="poi-rating">` + marker.rating + `★</div><span>  (` + marker.reviews + `) Reviews</span>
        <div class="poi-details">` + marker.desc + `</div>
    `;
    if (ratingElement != null) {
        element.appendChild(ratingElement);
    } else {
        const ratingElement = document.createElement('div');
        ratingElement.id = "star-rating";
        element.appendChild(ratingElement);
        new Starry(ratingElement, {
            onRate: function (rating) {
                if (!marker.reviewed) {
                    marker.reviewed = true;
                    marker.reviews++;
                }
                generateSidebarPanelInfo(marker, element);
            }
        });
    }
}

function compareMarkerDistance(a, b) {
    if (a.distance < b.distance) {
        return -1;
    }
    if (a.distance > b.distance) {
        return 1;
    }
    return 0;
}

function validateInputNumericOnly(event) {
    let key;
    const theEvent = event || window.event;

    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    if (key === "\b") {
        return
    }
    const regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function enableIfValid(event) {
    submitButton.disabled = event.target.value.length !== 5;
}