import React from 'react';
import { Route, Link  } from 'react-router-dom';
import ListBooks from './ListBooks';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  state = {
    books: [],
      queryBooks:[],
      currentlyReading:[],
      read:[],
      wantToRead:[],
      query: ''
  }

  componentDidMount() {
      BooksAPI.getAll().then((books) => {
          this.setState({
              books:books,
              currentlyReading: books.filter((book) => book.shelf==='currentlyReading'),
              read: books.filter((book) => book.shelf==='read'),
              wantToRead: books.filter((book) => book.shelf==='wantToRead')
          });
          // console.log(books);
      });
  }

    updateQuery = (query) => {
        this.setState({ query: query.trim() })
        BooksAPI.search(query.trim(),10).then((books) => {

            this.setState({ queryBooks:books });
            console.log(books);

        });
    }

    handleSelectOption = (event) => {
        const target = event.target;
        const value = event.target.value;
        const name = target.name;


        this.setState({
            [name]: value,

        });
    };

    goBack = () => {
        this.setState({
            query:''
        })
        window.history.back();
    }

    updateAppState = () => {
      console.log()
    }





    // const add = x => y => y + x;
    // shelfPicker = shelf =>   {
    //
    // BooksAPI.update(`${shelf}`.filter((book) => book.id ===  name),value)
    //   .then((res) => console.log(res,'hahha'))
    //
    // }

    handleInputChange = (event) => {
        const target = event.target;
        const value = event.target.value;
        const name = target.name;
        console.log(target,value,name,);
        //make a function that returns a funtion that will use the shelf type
        // BooksAPI.update((this.state.books.filter((book) => book.id ===  name)),value)
        //     .then((res) => console.log(res,'hahha'))
        // console.log(this.state.books.filter((book) => book.id ===  name))

        // let stateCopy = Object.assign({}, this.state.books);
        // console.log(this.state.read)
        let stateCopy;
      if(this.state.query.length >0){
          stateCopy = this.state.queryBooks.filter((book) => book.id === name).map(book => book.id === name ?
              // transform the book with a matching id
              { ...book, shelf: value } :
              // otherwise return original book
              book

          );

          this.setState({
              //add code to combine the seach array to the state of the app
              books: this.state.books.concat(stateCopy)
          }, () => {
            this.setState({
                  currentlyReading: this.state.books.filter((book) => book.shelf==='currentlyReading'),
                  read: this.state.books.filter((book) => book.shelf==='read'),
                  wantToRead: this.state.books.filter((book) => book.shelf==='wantToRead')
            })
          });


      }else {
           stateCopy = this.state.books.map(book => book.id === name ?
              // transform the book with a matching id
              { ...book, shelf: value } :
              // otherwise return original book
              book
          );

          this.setState({
              books: stateCopy,
              currentlyReading: stateCopy.filter((book) => book.shelf==='currentlyReading'),
              read: stateCopy.filter((book) => book.shelf==='read'),
              wantToRead: stateCopy.filter((book) => book.shelf==='wantToRead')
          });
      }
        console.log(stateCopy,"cheese")
        // stateCopy.books[name] = Object.assign({}, stateCopy.books[name]);
        // stateCopy.books[name].shelf = value;

        // BooksAPI.getAll().then((books) => {
        //     this.setState({ books });
        //     // console.log(books);
        // });
        // this.setState({
        //     [name]: value
        //
        // });
    }

  render() {
      const { query,books,read,wantToRead,currentlyReading,queryBooks } = this.state;

      let showingBooks;
      if(query){
          const match =  new RegExp(escapeRegExp(query), 'i');
          match ? console.log(match, 'this the match') : console.log('match fail')
          try {
              showingBooks = books.filter((book) => match.test(book.title)  );
          }
          catch(err) {
            showingBooks=[];
          }
          console.log('true query',showingBooks)
      }else {
          showingBooks = books;
      }

      {(query.length > 0 && showingBooks.length>0) && (showingBooks.sort(sortBy('name','author')))}


    return (
      <div className="app">
        <Route exact path="/search" render={() => (
            <div className='list-contacts-top'>
              <div>
                <div className="back-search-button"
                     onClick={this.goBack}

                ></div>
                  <input
                      className='search-books-bars'
                      type='text'
                      placeholder='Search Author or Title'
                      value={query}
                      onChange={(event) => this.updateQuery(event.target.value)}
                  />

              </div>
              <ListBooks
                // books={ showingBooks ? showingBooks : [] }
                  queryBooks={ queryBooks }
                query={ query }
                updateAppState={() => this.updateAppState()}
                handleInputChange ={this.handleInputChange}

              />
            </div>

        )}/>
        <Route exact path="/" render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                        {currentlyReading.map((book) => (
                            <div key={book.id}>
                              <li>
                                <div className="book">
                                  <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 188, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                    <div className="book-shelf-changer">
                                      <select
                                          name={book.id}
                                          onChange={this.handleInputChange}
                                          value={`${book.shelf}`}
                                      >
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="book-title">{book.title}</div>
                                  <div className="book-authors">{book.authors}</div>
                                </div>
                              </li>
                            </div>
                        ))}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                        {wantToRead.map((book) => (
                            <div key={book.id}>
                              <li>
                                <div className="book">
                                  <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 188, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                    <div className="book-shelf-changer">
                                      <select
                                          name={book.id}
                                          onChange={this.handleInputChange}
                                          value={`${book.shelf}`}
                                      >
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="book-title">{book.title}</div>
                                  <div className="book-authors">{book.authors}</div>
                                </div>
                              </li>
                            </div>
                        ))}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                        {read.map((book) => (
                            <div key={book.id}>
                              <li>
                                <div className="book">
                                  <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 188, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                    <div className="book-shelf-changer">
                                      <select
                                          name={book.id}
                                          onChange={this.handleInputChange}
                                          value={`${book.shelf}`}

                                      >
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="book-title">{book.title}</div>
                                  <div className="book-authors">{book.authors}</div>
                                </div>
                              </li>
                            </div>
                        ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link to={`/search`}></Link>
            </div>
          </div>
        )}></Route>
      </div>
    )
  }
}

export default BooksApp
