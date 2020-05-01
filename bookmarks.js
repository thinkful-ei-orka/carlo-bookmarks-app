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
    let description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut fringilla, sapien sed fringilla maximus, ipsum mi tristique velit, mollis tempor nisl orci nec metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut fringilla, sapien sed fringilla maximus, ipsum mi tristique velit, mollis tempor nisl orci nec metus.";
    let rating = "5";

    bookmark.forEach(item => {
        if(item.desc !== null) {
            description = item.desc;
        }

        if(item.rating !== null) {
            rating = item.rating;
        }

        if(item.expanded) {
            bookmarkStructure += `
            <div class="combo-container">
                <div class="bookmark-container">
                    <div class="title-box">${item.title}</div>
                    <div class="star-box">Stars</div>
                </div>
                <div class="info-container" data-item-id="${item.id}">
                    <div class="info-inner-top">
                        <div class="info-inner-url-container">
                            <button class="info-url-button">Visit Site</button>
                        </div>
                        <div class="info-inner-controls">
                            <button class="info-edit-button">Edit</button>
                            <button class="info-trash-button">Delete</button>
                        </div>
                    </div>
                    <div class="info-inner-bottom">
                        ${description}
                    </div>
                </div>
            </div>
            `;
        } else {
            bookmarkStructure += `
            <div class="combo-container">
                <div class="bookmark-container">
                    <div class="title-box">${item.title}</div>
                    <div class="star-box">${rating}</div>
                </div>
                <div class="info-container" data-item-id="${item.id}">
                </div>
            </div>
            `;
        }



    });

    let mainStructure = ""

    if(store.adding) {
        mainStructure = `
        <div class="main-container">
            <form class="add-form">
                <div class="add-upper-container">
                        <label for="add-input">Add New Bookmark:</label>
                        <input type="text" name="add-input" class="js-add-input">
                </div>
                <div class="add-lower-container">
                <div class="add-inner-top">
                    <div class="add-inner-link">Link Walkthrough</div>
                    <div class="add-inner-edit">E</div>
                </div>
                <div class="add-inner-bottom">
                    <div class="add-inner-rating">
                        <div class="star star-one">S</div>
                        <div class="star star-two">S</div>
                        <div class="star star-three">S</div>
                        <div class="star star-four">S</div>
                        <div class="star star-five">S</div>
                    </div>
                    <textarea class="add-inner-description">Add a description (optional)
                    </textarea>
                </div>
                </div>
                <div class="add-button-container">
                    <button class="cancel-button">Cancel</button>
                    <button class="create-button">Create</button>
                </div>
            </form>
        </div>
        `;
    } else {
        mainStructure = `
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
    }


    return mainStructure;
}

// Expand HTML
// function generateExpand(bookmark) {

//     let expandStructure = `
//     <div class="info-inner-top">
//         <div class="info-inner-url-container">
//             <button class="info-url-button">Visit Site</button>
//         </div>
//         <div class="info-inner-rating">Stars</div>
//     </div>
//     <div class="info-inner-bottom">
//         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut 
//         fringilla, sapien sed fringilla maximus, ipsum mi tristique 
//         velit, mollis tempor nisl orci nec metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut 
//         fringilla, sapien sed fringilla maximus, ipsum mi tristique 
//         velit, mollis tempor nisl orci nec metus. 
//     </div>`;

//     return expandStructure;
// }

// // Create Bookmark HTML
// function generateCreateBookmark(bookmark) {

// }

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
        .closest('.combo-container')
        .find('.info-container')
        .data('item-id');
}

function handleBookmarkClicked () {
    $('main').on('click', '.bookmark-container', event => {
        const id = getInnerContainerId(event.currentTarget);
        console.log(`handleBookmarkClicked ran`);
        const item = store.findById(id);
        console.log(item.expanded);
        const itemObj = { expanded: !item.expanded };

        store.findAndUpdate(id, itemObj);
        renderPage();
    });
}



function bindEventListeners () {
    handleBookmarkClicked();
}

export default {
    bindEventListeners,
    renderPage
}

