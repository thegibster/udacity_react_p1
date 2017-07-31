import React from 'react';
import { Route, Link  } from 'react-router-dom';
import ListBooks from './ListBooks';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import * as BooksAPI from './BooksAPI';
import './App.css';

class BooksApp extends React.Component {
    state = {
        books: [],
        queryBooks:[],
        currentlyReading:[],
        read:[],
        wantToRead:[],
        query: '',
        searchUpdate:false
    }

    componentDidMount() {
        BooksAPI.getAll().then((books) => {
            this.setState({
                books:books, //Break the books array in three state variables for cleaner mapping later on
                currentlyReading: books.filter((book) => book.shelf==='currentlyReading'),
                read: books.filter((book) => book.shelf==='read'),
                wantToRead: books.filter((book) => book.shelf==='wantToRead'),
                searchUpdate: false
            });
        });
    }

    updateQuery = (query) => {
        if (query.length > 0) {
            this.setState({query: query.trim()});
            let rawSearchToState = [];
            BooksAPI.search(query.trim(), 5).then((books) => {
                rawSearchToState = books;
                //books here is referring to the return value from the BooksApi.search action
                if(books.length >0 && !(books.error)){
                    books.map(book => {
                            this.state.books.map(bookie => {
                                if (bookie.id == book.id) {//If there is a book matching in both search array and state.books array, replace the search book value with the currently updated book state
                                    rawSearchToState.splice(rawSearchToState.indexOf(book), 1);
                                    rawSearchToState.push(bookie);
                                }
                            })
                        }
                    );
                }else{
                    rawSearchToState=[];
                }
                this.setState({queryBooks: rawSearchToState});
            });
        }else{
            this.setState({query: query.trim()});
        }
    };

    goBack = () => {
        this.setState({
            query:''
        })
        window.history.back();
    };

    handleInputChange = (event) => {
        const target = event.target;
        const value = event.target.value;
        const name = target.name;

        let updatedBookShelf;
        let stateCopy;

        if(this.state.query.length >0){
            stateCopy = this.state.queryBooks.filter((book) => book.id === name).map(book => book.id === name ?
                { ...book, shelf: value } :
                book

            );
            let checkIfSearchBookExist = this.state.books.filter((book) => book.id === stateCopy[0].id);
            if(checkIfSearchBookExist.length >0){
                let stateWithoutPrevShelf = this.state.books.filter((book) => book.id !== stateCopy[0].id);
                this.setState({
                    books: stateWithoutPrevShelf.concat(stateCopy)
                }, () => {
                    this.setState({
                        currentlyReading: this.state.books.filter((book) => book.shelf==='currentlyReading'),
                        read: this.state.books.filter((book) => book.shelf==='read'),
                        wantToRead: this.state.books.filter((book) => book.shelf==='wantToRead')
                    })
                });

            }else{
                this.setState({
                    books: this.state.books.concat(stateCopy)
                }, () => {
                    this.setState({
                        currentlyReading: this.state.books.filter((book) => book.shelf==='currentlyReading'),
                        read: this.state.books.filter((book) => book.shelf==='read'),
                        wantToRead: this.state.books.filter((book) => book.shelf==='wantToRead')
                    })
                });
            }

            // console.log(stateCopy[0],"this is the statecopy",value, "this is the value");
            BooksAPI.update(stateCopy[0],value)
                .then((res) => console.log(res,'hahha'));

        }else {
            stateCopy = this.state.books.map(book => book.id === name ?
                { ...book, shelf: value } :
                book
            );

            this.setState({
                books: stateCopy
            }, () => {
                this.setState({
                    currentlyReading: stateCopy.filter((book) => book.shelf === 'currentlyReading'),
                    read: stateCopy.filter((book) => book.shelf === 'read'),
                    wantToRead: stateCopy.filter((book) => book.shelf === 'wantToRead')
                })
            });
        }


        updatedBookShelf = this.state.queryBooks.map(book => book.id === name ?
            { ...book, shelf: value } :
            book

        );
        this.setState({ queryBooks:updatedBookShelf });
    };


    render() {
        const { query,books,read,wantToRead,currentlyReading,queryBooks } = this.state;
        let showingBooks;

        if(query){
            const match =  new RegExp(escapeRegExp(query), 'i');
            // match ? console.log(match, 'this the match') : console.log('match fail')
            // Console used to output the match to ensure the regular expression is hitting
            try {
                showingBooks = books.filter((book) => match.test(book.title));
            }
            catch(err) {
                showingBooks=[];
            }
        }else {
            showingBooks = books;
        }

        {
            (query.length > 0 && showingBooks.length>0) && (showingBooks.sort(sortBy('name','author')));
        }

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
                            handleInputChange={this.handleInputChange}
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

export default BooksApp;