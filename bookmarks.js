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

    // Checks value of filter dropdown menu and filters all bookmarks in store according to current filter rating
    // If filter is 0 (no rating), show all bookmarks on page
    if(store.filter !== 0) {
        filteredBookmarks = bookmark.filter(item => item.rating >= store.filter);
    } else {
        filteredBookmarks = bookmark;
    }
    
    // Iterates through each bookmark to create HTML
    filteredBookmarks.forEach(item => {

        // Check if description is not empty. 
        // If so, make description equal to the bookmark's description from API
        // If not, put default string.
        if(item.desc !== null) {
            description = item.desc;
        } else {
            description = "No description provided.";
        }

        // Check if rating is not equal to anything. 
        // If it is, make rating equal to rating of current bookmark and create rating HTML
        // If it is not, default to "No Rating" value
        let ratingHtml = "";

        if(item.rating !== null) {
            rating = item.rating;

            for(let i = 1; i <= rating; i++) {
                ratingHtml += `<div class="star-inner"></div>`
            }
        } else {
            ratingHtml = `<div class="no-rating-box">No Rating</div>`;
        }

        // Check if item needs to be expanded. 
        // If so, add expanded HTML to the final bookmark structure
        if(item.expanded) {
            bookmarkStructure += `
            <div class="combo-container">
                <div class="bookmark-container">
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
            </div>
            `;
        } else {
            bookmarkStructure += `
            <div class="combo-container">
                <div class="bookmark-container">
                    <div class="title-box">${item.title}</div>
                    <div class="star-box">${ratingHtml}</div>
                </div>
                <div class="info-container" data-item-id="${item.id}">
                </div>
            </div>
            `;
        }



    });

    // Default structure on main page 
    // Adding resulting bookmark structure from filter/expansion
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
        store.error = 0;
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
                } else if(!regexp.test(itemUrl)) {
                    store.errorMessage = "URL Must begin with 'https://'";
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
            .then(res => {
                if (res.ok) { 
                    return res.json();
                }
                store.errorMessage = res.statusText;
                store.error = 1;
                renderPage();
                throw new Error(store.errorMessage);
            })
            .then(() => {
                store.error = 0;
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

            // Regular Expression for htts://
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

