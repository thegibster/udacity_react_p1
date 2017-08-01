import React from 'react';
import { Route, Link  } from 'react-router-dom';
import ListBooks from './ListBooks';
import BookShelf from './BookShelf';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import * as BooksAPI from './BooksAPI';
import './App.css';

class BooksApp extends React.Component {
    state = {
        books: [],
        queryBooks:[],
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
        const { query,books,queryBooks } = this.state;
        const wantToRead = books.filter(book => book.shelf === 'wantToRead');
        const currentlyReading = books.filter(book => book.shelf === 'currentlyReading');
        const read = books.filter(book => book.shelf === 'read');
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
                                    <BookShelf
                                        books={currentlyReading}
                                        handleInputChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Want to Read</h2>
                                    <BookShelf
                                        books={wantToRead}
                                        handleInputChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Read</h2>
                                    <BookShelf
                                        books={read}
                                        handleInputChange={this.handleInputChange}
                                    />
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