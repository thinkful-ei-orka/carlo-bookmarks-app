// import $ from 'jquery';

import api from './api.js';
import store from './store.js';

//-----------------------
// Page Structure Functions
//-----------------------

// Main Page HTML 
// Everything that has to do with the main page, including Filter and Expanded views.
function generateMainPage(bookmark) {
    // Add HTML that loops through bookmarks and creates 
    // the bookmark container with title and rating
    // and adds them in a loop to the lower-container
    
    // Initializations of the bookmark HTML structure and associated variable strings
    let bookmarkStructure = "";
    let description = "";
    let filteredBookmarks = [];

    // Checks value of filter dropdown menu and filters all bookmarks in store according to current filter rating
    // If filter is 0 (no rating), show all bookmarks on page
    if(store.filter !== 0) {
        filteredBookmarks = bookmark.filter(item => item.rating >= store.filter);
    } else {
        filteredBookmarks = bookmark;
    }
    
    // Iterates through each bookmark to create HTML
    filteredBookmarks.forEach(item => {

        // Default rating
        let rating = "No Rating";

        // Check if description is not empty. 
        // If so, make description equal to the bookmark's description from API
        // If not, put default string.
        if(item.desc !== null) {
            description = item.desc;
        } else {
            description = "No description provided.";
        }

        // Check if rating is not equal to anything. 
        // If it is, make rating equal to rating of current bookmark
        if(item.rating !== null) {
            rating = item.rating;
        }

        if(item.expanded) {
            bookmarkStructure += `
            <div class="combo-container">
                <div class="bookmark-container">
                    <div class="title-box">${item.title}</div>
                    <div class="star-box">${rating}</div>
                </div>
                <div class="info-container" data-item-id="${item.id}">
                    <div class="info-inner-top">
                        <div class="info-inner-url-container">
                            <button onclick="window.location.href = '${item.url}';" class="info-url-button">Visit Site</button>
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


    let mainStructure = `
        <div class="main-container">
            <div class="upper-container">
                <button class="new-button">+ New</button>
                <select name="filter-menu" class="js-filter-menu">
                    <option disabled selected>Filter By:</option>
                    <option value="1">1+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="5">5+ Stars</option>
                    <option value="0">No Rating</option>
                </select>
            </div>
            <div class="lower-container">
                ${bookmarkStructure}
            </div>
        </div>`


    return mainStructure;
}

// Create Bookmark HTML
function generateCreateOrEditBookmark(bookmark) {
    let titleString = "";
    let urlString = "";
    let descriptionString = "";
    let editHtmlString = `
        <button type="submit" class="create-button">Create</button>
    `;
    let formString = '<form class="add-form">';
    let rating = -1;

    if(store.edit) {
        titleString = `value="${bookmark.title}"`;
        urlString = `value="${bookmark.url}"`
        descriptionString = bookmark.desc;
        editHtmlString = `
            <button type="submit" class="js-edit-button">Edit</button>
        `;
        formString = '<form class="edit-form">';
        rating = bookmark.rating;
    } 

    let ratingString = "";


    // Create rating HTML. Iterate until i = rating, in which case, add checked
    for(let i = 1; i <= 5; i++) {
        let checked = "";
        if(i === Number(rating) && store.edit) {
            console.log(`checked condition met at ${i}`);
            checked = "checked";
        }

        ratingString += `<input type="radio" name="rating" class="js-add-rating" id="rating${i}" value="${i}" ${checked}>
        <label class="star" for="rating">${i}</label>`
    }

    let createStructure = `
    <div class="main-container">
        ${formString}
            <div class="add-upper-container">
                    <label for="add-input">Add New Bookmark:</label>
                    <input type="text" name="url" class="js-add-input" placeholder="https://www.example.com" ${urlString}>
            </div>
            <div class="add-lower-container">
            <div class="add-inner-top">
                <input type="text" name="title" class="js-add-inner-title" placeholder="Title goes here" ${titleString}>
            </div>
            <div class="add-inner-bottom">
                <div class="add-inner-rating">
                ${ratingString} 
                </div>
                <textarea name="desc" class="js-add-inner-description" placeholder="Add a description (optional)">${descriptionString}</textarea>
            </div>
            </div>
            <div class="js-error-message hidden">ERROR: ${store.errorMessage} </div>
            <div class="add-button-container">
                <button class="cancel-button">Cancel</button>
                ${editHtmlString}
            </div>
        </form>
    </div>
    `;

    return createStructure;
}

//-----------------------
// Render Functions
//-----------------------


function generatePageString(data) {
    // Handle which page to load
    let pageString = "";
    if(store.adding) {
        let bookmark = store.findById(store.tempId); // Get single target bookmark and pass it to create/edit page
        pageString = generateCreateOrEditBookmark(bookmark);
    } else {
        pageString = generateMainPage(data);
    }

    console.log(`Ran generatePageString`);
    

    return pageString;

}

function renderPage() {
    console.log("Rendering page");

    const pageString = generatePageString(store.bookmarks);

    $('main').html(pageString);

    if(store.error === 1) {
        $('.js-error-message').removeClass('hidden');
    } else if(store.error === 0) {
        $('.js-error-message').addClass('hidden');
    }
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
        console.log(item);
        const itemObj = { expanded: !item.expanded };

        store.findAndUpdate(id, itemObj);
        renderPage();
    });
}

function handleNewButtonClicked () {
    $('main').on('click', '.new-button', event => {
        console.log(`ran handleNewButtonClicked`);
        store.adding = true;
        store.edit = false;
        renderPage();
    });
}

function handleCancelButtonClicked() {
    $('main').on('click', '.cancel-button', event => {
        console.log(`ran handleNewButtonClicked`);
        store.adding = false;
        store.edit = false;
        renderPage();
    });
}

function handleCreateButtonClicked() {
    $('main').on('submit', '.add-form', event => {
        event.preventDefault();
        console.log(`ran handleCreateButtonClicked`);
        const itemRating = $('input[name="rating"]:checked').val();
        let itemDescription = $('.js-add-inner-description').val();
        const itemUrl = $('.js-add-input').val();
        const itemTitle = $('.js-add-inner-title').val();

        if(itemDescription === "") {
            itemDescription = null;
        }

        // const bookmarkObject = {
        //     'title': itemTitle,
        //     'url': itemUrl,
        //     'desc': itemDescription,
        //     'rating': itemRating
        // };

        // Add Post below
        api.createItem(itemTitle, itemUrl, itemDescription, itemRating)
            .then(res => {
                if (res.ok) { 
                    return res.json();
                }

                let regexp = /^https:\/\//;

                console.log(regexp.test(itemUrl));
                // If itemTitle or itemUrl are empty, 
                // Else if itemUrl is not valid,
                // show specified errors.
                if(itemTitle === "" || itemUrl === "") {
                    store.errorMessage = "Title and URL are required fields.";
                } else if(regexp.test(itemUrl)) {
                    store.errorMessage = "URL Must begin with 'https://";
                } else {
                    store.errorMessage = res.statusText;
                }
                

                store.error = 1;
                renderPage();
                throw new Error(store.errorMessage);
            })
            .then((response) => {
                store.error = 0;

                store.adding = false;
                store.addBookmark(response);
                renderPage();

            }).catch(err => console.error(err));

        

    });
}

function handleDeleteButtonClicked() {
    $('main').on('click', '.info-trash-button', event => {
        const id = getInnerContainerId(event.currentTarget);

        api.deleteItem(id) 
            .then(res => res.json())
            .then(() => {
          
                store.findAndDelete(id);
                renderPage();
            }).catch(err => console.error(err.message));
    });
}

function handleEditButtonClicked() {
    $('main').on('click', '.info-edit-button', event => {
        console.log(`ran handleEditButtonClicked`);
        store.edit = true;
        store.adding = true;
        const id = getInnerContainerId(event.currentTarget);
        store.tempId = id;
        renderPage();
    });
}

function handleEditButtonSubmit() {
    $('main').on('submit', '.edit-form', event => {
        event.preventDefault();
        console.log(`Submission on Edit Button Ran`);

        

        const itemRating = $('input[name="rating"]:checked').val();
        const itemDescription = $('.js-add-inner-description').val();
        const itemUrl = $('.js-add-input').val();
        const itemTitle = $('.js-add-inner-title').val();
        const id = store.tempId;

        const bookmarkObject = {
            'title': itemTitle,
            'url': itemUrl,
            'desc': itemDescription,
            'rating': itemRating
        };

        

        api.updateItem(id, bookmarkObject)
        .then(res => {
            if (res.ok) { 
                return res.json();
            }

            let regexp = /^https:\/\//;

            console.log(regexp.test(itemUrl));
            // If itemTitle or itemUrl are empty, 
            // Else if itemUrl is not valid,
            // show specified errors.
            if(itemTitle === "" || itemUrl === "") {
                store.errorMessage = "Title and URL are required fields.";
            } else if(regexp.test(itemUrl)) {
                store.errorMessage = "URL Must begin with 'https://";
            } else {
                store.errorMessage = res.statusText;
            }
            

            store.error = 1;
            renderPage();
            throw new Error(store.errorMessage);
        })
        .then((response) => {
            //Find and Update the bookmark with new values in store
            console.log(response);
            store.findAndUpdate(id, bookmarkObject);

            // Reset global variables to default state and render page
            store.error = 0;
            store.edit = false;
            store.tempId = 0;
            store.adding = false;
            renderPage();

        }).catch(err => console.error(err));
    });
}

function handleFilterSelection() {
    $('main').on('change', '.js-filter-menu', event => {
        const rating = $(".js-filter-menu option:selected").val();

        console.log(rating);
        store.filter = Number(rating);
        renderPage();
    });
}

function bindEventListeners () {
    handleEditButtonSubmit();
    handleEditButtonClicked();
    handleFilterSelection();
    handleDeleteButtonClicked();
    handleCreateButtonClicked();
    handleCancelButtonClicked();
    handleNewButtonClicked();
    handleBookmarkClicked();
}

export default {
    bindEventListeners,
    renderPage
}

