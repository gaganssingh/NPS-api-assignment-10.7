"use strict";

const searchUrl = "https://api.nps.gov/api/v1/parks";
const apiKey = "dW6BVA02vgqunkQWLPQhlrlpAzrssUl5ks2Fh0kq";

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${[encodeURIComponent(key)]}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
}

function displayResults(responseJson, maxResults=10) {
    $("#js-error-message").empty();
    $(".js-num-parks").empty();
    $("#results-list").empty();
    $(".js-num-parks").append(`<h2>Showing ${responseJson.data.length} parks</h2>`);
    for (let i = 0; i < responseJson.data.length & i < maxResults; i++) {
        $("#results-list").append(
            `
            <li><h3>${responseJson.data[i].fullName}</h3>
            <p><a href="${responseJson.data[i].url}" target="_blank">Click here to visit park website</a>
            <p>${responseJson.data[i].description}</p>
            </li>
            `);
    }
    $(".js-num-parks").removeClass("hidden");
    $(".results").removeClass("hidden");
}

function parksList(searchUrl, state, maxResults, apiKey) {
    const params = {
        stateCode: state,
        limit: maxResults
    }

    const queryString = formatQueryParams(params);
    const url = searchUrl + "?" + queryString + "&api_key=" + apiKey;
    console.log(url);
    
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
        $("#js-error-message").text(`Something's not right here: ${err.message}`);
    });
}

function watchForm() {
    $("#js-form").submit(event => {
        event.preventDefault();
        const state = $("#js-name").val().split(",");
        const maxResults = $("#js-max-results").val();
        parksList(searchUrl, state, maxResults, apiKey);
    })
}

$(watchForm);