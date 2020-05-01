// import $ from 'jquery';

import api from './api.js';
import store from './store.js';

//-----------------------
// Page Structure Functions
//-----------------------

// Main Page HTML
function generateMainPage(bookmark) {
    // Add HTML that loops through bookmarks and creates 
    // the bookmark container with title and rating
    // and adds them in loops to the lower-container
    
    let bookmarkStructure = "";

    bookmark.forEach(item => {
        bookmarkStructure += `
        <div class="bookmark-container">
            <div class="title-box">${item.title}</div>
            <div class="star-box">Stars</div>
        </div>
        <div class="info-container" data-item-id="${item.id}">
        </div>
        `;
    });


    let mainStructure = `
    <div class="main-container">
        <div class="upper-container">
            <button class="new-button">+ New</button>
            <select name="filter-menu" class="js-filter-menu">
                <option disabled selected>Filter By:</option>
                <option value="one">One Star</option>
                <option value="two">Two Stars</option>
                <option value="three">Three Stars</option>
                <option value="four">Four Stars</option>
                <option value="five">Five Stars</option>
                <option value="no-filter">No Filter</option>
            </select>
        </div>
        <div class="lower-container">
            ${bookmarkStructure}
        </div>
    </div>`;

    return mainStructure;
}

// Expand HTML
function generateExpand(bookmark) {
    let expandStructure = `
    <div class="info-inner-top">
        <div class="info-inner-url-container">
            <button class="info-url-button">Visit Site</button>
        </div>
        <div class="info-inner-rating">Stars</div>
    </div>
    <div class="info-inner-bottom">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut 
        fringilla, sapien sed fringilla maximus, ipsum mi tristique 
        velit, mollis tempor nisl orci nec metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut 
        fringilla, sapien sed fringilla maximus, ipsum mi tristique 
        velit, mollis tempor nisl orci nec metus. 
    </div>`;

    return expandStructure;
}

// Create Bookmark HTML
function generateCreateBookmark(bookmark) {

}

//-----------------------
// Render Functions
//-----------------------


function generatePageString(data) {
    // Handle which page to load
    // if(store.adding) {

    // } else {

    // }

    console.log(`Ran generatePageString`);
    let pageString = generateMainPage(data);

    return pageString;

}

function renderPage() {
    console.log("Rendering page");

    const pageString = generatePageString(store.bookmarks);

    $('main').html(pageString);
}

//-----------------------
// Event Listener Functions
//-----------------------

function getInnerContainerId (target) {
    return $(target)
        .closest('.lower-container')
        .find('.info-container')
        .data('item-id');
}

function handleBookmarkClicked () {
    $('.')
}


function bindEventListeners () {

}

export default {
    renderPage
}

