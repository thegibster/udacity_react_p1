This is the starter template for the final assessment project for Udacity's React Fundamentals course, developed by [React Training](https://reacttraining.com). The goal of this template is to save you time by providing a static example of the CSS and HTML markup that may be used, but without any of the React code that is needed to complete the project. If you choose to start with this template, your job will be to add interactivity to the app by refactoring the static code in this template.

Of course, you are free to start this project from scratch if you wish! Just be sure to use [Create React App](https://github.com/facebookincubator/create-react-app) to bootstrap the project.

## Backend Server

To simplify your development process, we've provided a backend server for you to develop against. The provided file [`BooksAPI.js`](src/BooksAPI.js) contains the methods you will need to perform necessary operations on the backend:

### `getAll()`
* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* This collection represents the books currently in the bookshelves in your app.

### `update(book, shelf)`
* book: `<Object>` containing at minimum an `id` attribute
* shelf: `<String>` contains one of ["wantToRead", "currentlyReading", "read"]  
* Returns a Promise which resolves to a JSON object containing the response data of the POST request

### `search(query, maxResults)`
* query: `<String>`
* maxResults: `<Integer>` Due to the nature of the backend server, search results are capped at 20, even if this is set higher.
* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* These books do not know which shelf they are on. They are raw results only. You'll need to make sure that books have the correct state while on the search page.

## Important
The backend API uses a fixed set of cached search results and is limited to a particular set of search terms, which can be found in [SEARCH_TERMS.md](SEARCH_TERMS.md). That list of terms are the _only_ terms that will work with the backend, so don't be surprised if your searches for Basket Weaving or Bubble Wrap don't come back with any results. 

## create-react-app

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Starting the Project

### Clone or download the project folder:

 ```sh
 $ git clone https://github.com/thegibster/udacity_react_p1.git
 ```

 ```
 This project uses the npm package manager and has the following dependencies :

      "escape-string-regexp": "^1.0.5",
      "form-serialize": "^0.7.2",
      "prop-types": "^15.5.10",
      "react": "^15.6.1",
      "react-dom": "^15.6.1",
      "react-router-dom": "^4.1.1",
      "sort-by": "^1.2.0"
```

1. After forking the project ,cloning the project or downloading the zip(unzip) version of the project.
2. To load all package dependencies run:
     >$ npm install

2. To run on local server use the terminal to enter the project directory and run:

     >$ yarn start

    to start the local server on default port localhost 3000.

You can now move books to different shelves using each books dropdown menu or hit the Search button in the lower right hand corner
to navigate to the search path and search for a book which you can add to your list and modify which shelf you would like that book to be added to.


## Contributing

This repository is the starter code for _all_ Udacity students. Therefore, we most likely will not accept pull requests.

For details, check out [CONTRIBUTING.md](CONTRIBUTING.md).
