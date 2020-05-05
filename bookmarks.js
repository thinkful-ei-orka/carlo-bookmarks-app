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
    
    // Initializations of the bookmark HTML structure and associated variable strings/dummy array
    let bookmarkStructure = "";
    let description = "";
    let rating = "";
    let filteredBookmarks = [];
    let filteredHtml = "";

    // Checks value of filter dropdown menu and filters all bookmarks in store according to current filter rating
    // If filter is 0 (no rating), show all bookmarks on page.
    // Sets current selected filter menu to the top selected value.
    // Accompanied HTML generation as well. 
    if(store.filter !== -1) {
        filteredBookmarks = bookmark.filter(item => item.rating >= store.filter);

        filteredHtml = `
            <select name="filter-menu" class="js-filter-menu">
                <option disabled>Filter By:</option>
            `;

        for(let i = 1; i <= 5; i++) {
            if(i === store.filter) {
                // if(i === 0) {
                //     filteredHtml += `<option value="0" selected>No Rating</option>`;
                // } else {
                    filteredHtml += `<option value="${i}" selected>${i}+ Stars</option>`;
                // }
                
            } else {
                // if(i === 0) {
                //     filteredHtml += `<option value="0">No Rating</option>`;
                // } else {
                    filteredHtml += `<option value="${i}">${i}+ Stars</option>`;
                // }
                
            }
        }

        filteredHtml += `</select>`;

    } else {
        filteredBookmarks = bookmark;

        filteredHtml = `
            <select name="filter-menu" class="js-filter-menu">
                <option disabled selected>Filter By:</option>
                <option value="1">1+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="5">5+ Stars</option>
            </select>
        `;
    }
    
    // Iterates through each bookmark to create HTML
    filteredBookmarks.forEach(item => {

        // Check if description is not empty. 
        // If so, make description equal to the bookmark's description from API
        // If not, put default string.
        if(item.desc === null || item.desc === "") {
            description = "No description provided.";
           
        } else {
            description = item.desc;
        }

        // Check if rating is not equal to anything. 
        // If it is, make rating equal to rating of current bookmark and create rating HTML
        // If it is not, default to "No Rating" value
        let ratingHtml = "";

        if(item.rating !== null) {
            rating = item.rating;

            for(let i = 1; i <= rating; i++) {
                ratingHtml += `<div class="star-inner"></div>`;
            }
        } else {
            ratingHtml = `<div class="no-rating-box">No Rating</div>`;
        }

        // Check if item needs to be expanded. 
        // If so, add expanded HTML to the final bookmark structure
        if(item.expanded) {
            bookmarkStructure += `
            <section class="combo-container">
                <div class="bookmark-container" tabindex="0">
                    <div class="title-box">${item.title}</div>
                    <div class="star-box">${ratingHtml}</div>
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
            </section>
            `;
        } else {
            bookmarkStructure += `
            <section class="combo-container">
                <div class="bookmark-container" tabindex="0">
                    <div class="title-box">${item.title}</div>
                    <div class="star-box">${ratingHtml}</div>
                </div>
                <div class="info-container" data-item-id="${item.id}">
                </div>
            </section>
            `;
        }



    });

    // Default structure on main page 
    // Adding resulting bookmark structure from filter/expansion
    let mainStructure = `
        <section class="main-container">
            <section class="upper-container">
                <button class="new-button">+ New</button>
                ${filteredHtml}
            </section>
            <section class="lower-container">
                ${bookmarkStructure}
            </section>
        </section>`


    return mainStructure;
}

// Create/Edit Bookmark HTML
// ** Put together Create and Edit because of the very similar
// structure and did not want to reiterate code **
function generateCreateOrEditBookmark(bookmark) {
    // Create default strings for Create Page values
    let headerString = "Add New Bookmark:";
    let titleString = ""; // Blank title text box input
    let urlString = ""; // Blank URL text box input
    let descriptionString = ""; // Blank description text box input
    let rating = -1; // Rating set to -1 for no pre-selected radio button
    let ratingHtmlString = ""; // Initializes rating HTML string
    let buttonString = `<button type="submit" class="create-button">Create</button>`; // Button HTML for Create button
    let formString = '<form class="add-form">'; // Default to Create bookmark form. 

    // If edit state is true, change strings to Edit Page values
    if(store.edit) {
        headerString = "Edit Current Bookmark:"; 
        titleString = `value="${bookmark.title}"`; // Sets value of title textbox to current title
        urlString = `value="${bookmark.url}"`; // Sets value of URL textbox to current URL
        
        rating = bookmark.rating; // Sets up pre-selection of radio button
        buttonString = `<button type="submit" class="js-edit-button">Edit</button>`; // Change button HTML to Edit button
        formString = '<form class="edit-form">'; // Change to Edit bookmark form

        // Sets value of description textbox to current description. Empty if value is null.
        if(bookmark.desc === null) {
            descriptionString = "";
        } else {
            descriptionString = bookmark.desc;
        }
         
    } 

    // Create rating HTML with loop. Iterate until i = rating, in which case, add checked value for pre-selection.
    // If edit state is not checked, rating will go without pre-selection.
    for(let i = 1; i <= 5; i++) {
        let checked = "";
        if(i === Number(rating) && store.edit) {
            console.log(`checked condition met at ${i}`);
            checked = "checked";
        }

        ratingHtmlString += `<input type="radio" name="rating" class="js-add-rating" id="rating${i}" value="${i}" ${checked}>
        <label class="star" for="rating${i}"> <p>${i}</p> </label>`
    }

    // Bring the structure together with all values from above.
    let createStructure = `
    <div class="main-container">
        ${formString}
            <div class="add-upper-container">
                    <label for="add-input">${headerString}</label>
                    <input type="text" name="url" class="js-add-input" placeholder="https://www.example.com" ${urlString} required>
            </div>
            <div class="add-lower-container">
            <div class="add-inner-top">
                <input type="text" name="title" class="js-add-inner-title" placeholder="Title goes here" ${titleString} required>
            </div>
            <div class="add-inner-bottom">
                <div class="add-inner-rating">
                    ${ratingHtmlString} 
                </div>
                <textarea name="desc" class="js-add-inner-description" placeholder="Add a description (optional)">${descriptionString}</textarea>
            </div>
            </div>
            <div class="js-error-message hidden">ERROR: ${store.errorMessage} </div>
            <div class="add-button-container">
                <button class="cancel-button">Cancel</button>
                ${buttonString}
            </div>
        </form>
    </div>
    `;

    return createStructure;
}

//-----------------------
// Render Functions
//-----------------------

// Generates page string given type of data.
function generatePageString(data) {
    console.log(`Ran generatePageString`);

    let pageString = "";
    let bookmark = store.findById(store.tempId); // Get single target bookmark and pass it to create/edit page

    // Handle which page to load given state. 
    // - Adding means go to Create/Edit page
    // - Otherwise, go to Main page
    if(store.adding) {
        pageString = generateCreateOrEditBookmark(bookmark);
    } else {
        pageString = generateMainPage(data);
    }

    return pageString;
}

function renderPage() {
    console.log("Rendering page");

    // Initialize HTML to the correct returned HTML from generatePageString
    const pageString = generatePageString(store.bookmarks);


    // Add HTML to main
    $('main').html(pageString);

    // After main is loaded, check to see if an error flag has been given.
    // If so, add error HTML to page.
    if(store.error === 1) {
        $('.js-error-message').removeClass('hidden');
    } else if(store.error === 0) {
        $('.js-error-message').addClass('hidden');
    }
}

//-----------------------
// Event Listener Functions
//-----------------------

// Target closest info-container for ID of bookmark
function getInnerContainerId (target) {
    return $(target)
        .closest('.combo-container')
        .find('.info-container')
        .data('item-id');
}

// Expand bookmark on click
function handleBookmarkClicked () {
    $('main').on('click', '.bookmark-container', event => {
        const id = getInnerContainerId(event.currentTarget);
        console.log(`handleBookmarkClicked ran`);

        // Find ID, toggle expanded property, and re-render page
        const item = store.findById(id);
        const itemObj = { expanded: !item.expanded };
        store.findAndUpdate(id, itemObj);
        renderPage();
    });
}

// Expand bookmark on enter keypress
function handleBookmarkKeyPress () {
    $('main').on('keypress', '.bookmark-container', event => {
        // const id = getInnerContainerId(event.currentTarget);
        // console.log(`handleBookmarkKeyDown ran`);

        // // Find ID, toggle expanded property, and re-render page
        // const item = store.findById(id);
        // const itemObj = { expanded: !item.expanded };
        // store.findAndUpdate(id, itemObj);
        // renderPage();
        var keycode = (event.keyCode ? event.keyCode : event.which);
        const id = getInnerContainerId(event.currentTarget);
        console.log(`handleBookmarkKeyPress ran`);
        if(keycode == '13'){

    
            // Find ID, toggle expanded property, and re-render page
            const item = store.findById(id);
            const itemObj = { expanded: !item.expanded };
            store.findAndUpdate(id, itemObj);
            renderPage();
        }
    });
}

// Function handling New Bookmark button clicked
function handleNewButtonClicked () {
    $('main').on('click', '.new-button', event => {
        console.log(`ran handleNewButtonClicked`);

        // Set adding state to true
        // Make sure edit state is false for the page
        // And re-render
        store.adding = true;
        store.edit = false;
        renderPage();
    });
}

// Handle cancel button clicked
function handleCancelButtonClicked() {
    $('main').on('click', '.cancel-button', event => {
        console.log(`ran handleNewButtonClicked`);

        // Set all states to default for main page render.
        store.error = 0;
        store.adding = false;
        store.edit = false;
        renderPage();
    });
}

// Handle create new bookmark submission
function handleCreateButtonClicked() {
    $('main').on('submit', '.add-form', event => {
        event.preventDefault();
        console.log(`ran handleCreateButtonClicked`);

        // Grab values in form of rating, description, URL, title
        const itemRating = $('input[name="rating"]:checked').val();
        let itemDescription = $('.js-add-inner-description').val();
        const itemUrl = $('.js-add-input').val();
        const itemTitle = $('.js-add-inner-title').val();

        // Handle post to bookmarks API
        if(itemRating === undefined) {
            store.errorMessage = "Must select a rating.";
            store.error = 1;
            renderPage();
        } else {
            api.createItem(itemTitle, itemUrl, itemDescription, itemRating)
                .then(res => {
                    if (res.ok) { 
                        return res.json();
                    }

                    // Regular Expression for https://
                    let regexp = /^https:\/\//;

                    // If itemTitle or itemUrl are empty, 
                    // Else if itemUrl is not valid,
                    // show specified errors.
                    if(itemTitle === "" || itemUrl === "") {
                        store.errorMessage = "Title and URL are required fields.";
                    } else if(!regexp.test(itemUrl)) {
                        store.errorMessage = "URL Must begin with 'https://'";
                    } else {
                        store.errorMessage = res.statusText;
                    }
                    
                    // Set error state to on value, re-render, and throw error message.
                    store.error = 1;
                    renderPage();
                    throw new Error(store.errorMessage);
                })
                .then((response) => {
                    // If response is ok, 
                    // Default error state, take back to home page
                    // And locally store the response to add to store.

                    store.error = 0;
                    store.adding = false;
                    store.addBookmark(response);
                    renderPage();

                }).catch(err => console.error(err));
            }
        });

}
    
// Handle delete button
function handleDeleteButtonClicked() {
    $('main').on('click', '.info-trash-button', event => {
        const id = getInnerContainerId(event.currentTarget);

        api.deleteItem(id) 
            .then(res => {
                // Error handling
                if (res.ok) { 
                    return res.json();
                }
                store.errorMessage = res.statusText;
                store.error = 1;
                renderPage();
                throw new Error(store.errorMessage);
            })
            .then(() => {
                // If response is ok, 
                // Default error state, delete item in store based on ID, and re-render
                store.error = 0;
                store.findAndDelete(id);
                renderPage();
            }).catch(err => console.error(err.message));
    });
}

// Homepage bookmark edit button clicked
function handleEditButtonClicked() {
    $('main').on('click', '.info-edit-button', event => {
        console.log(`ran handleEditButtonClicked`);

        // Edit state set to true as well as adding state (same skeleton as create)
        // Grab ID and store the ID from the element on the homepage that was clicked.
        store.edit = true;
        store.adding = true;
        const id = getInnerContainerId(event.currentTarget);
        store.tempId = id;
        renderPage();
    });
}

// Handle edit button submission on edit page
function handleEditButtonSubmit() {
    $('main').on('submit', '.edit-form', event => {
        event.preventDefault();
        console.log(`Submission on Edit Button Ran`);
        
        // Grab values in form of rating, description, URL, title
        const itemRating = $('input[name="rating"]:checked').val();
        const itemDescription = $('.js-add-inner-description').val();
        const itemUrl = $('.js-add-input').val();
        const itemTitle = $('.js-add-inner-title').val();
        const id = store.tempId;

        // Add them to an object.
        const bookmarkObject = {
            'title': itemTitle,
            'url': itemUrl,
            'desc': itemDescription,
            'rating': itemRating
        };

        // Handle PATCH to update item.
        if(itemRating === undefined) {
            store.errorMessage = "Must select a rating.";
            store.error = 1;
            renderPage();
        } else {
            api.updateItem(id, bookmarkObject)
            .then(res => {
                if (res.ok) { 
                    return res.json();
                }

                // Regular Expression for https://
                let regexp = /^https:\/\//;

                // If itemTitle or itemUrl are empty, 
                // Else if itemUrl is not valid,
                // show specified errors.
                if(itemTitle === "" || itemUrl === "") {
                    store.errorMessage = "Title and URL are required fields.";
                } else if(!regexp.test(itemUrl)) {
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
        }
    });
}

// Handle filter selection from dropdown menu
function handleFilterSelection() {
    $('main').on('change', '.js-filter-menu', event => {
        // Get filter value and set store filter variable to the rating selected
        const rating = $(".js-filter-menu option:selected").val();
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
    handleBookmarkKeyPress();
    handleBookmarkClicked();
}

export default {
    bindEventListeners,
    renderPage
}

