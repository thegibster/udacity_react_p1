import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import * as BooksAPI from './BooksAPI'

class ListBooks extends Component {
    static propTypes = {
        books: PropTypes.array.isRequired
        // onDeleteBook: PropTypes.func.isRequired
    }



    // updateQuery = (query) => {
    //     this.setState({ query: query.trim() })
    // }
    //
    // clearQuery = () => {
    //     this.setState({ query: '' })
    // }

    render(){

        const { books } = this.props;
        const { query } = this.props;



        return (

            <div className="list-books">

                {
                    (query.length > 0 && books.length > 0 )  && (
                    <div>
                    <div className="list-books-title">
                        <h1>Add Book</h1>
                    </div>
                    <div className="list-books-content">
                    <div>

                    <div className="bookshelf">
                    <h2 className="bookshelf-title">Available</h2>
                    <div className="bookshelf-books">
                    <ol className="books-grid">
                {books.map((book) => (
                    <li key={book.id} className='contact-list-item'>
                    <div className="book">
                    <div className="book-top">
                    <div className="book-cover" style={{ width: 128, height: 192, backgroundImage:`url(${book ? book.imageLinks.thumbnail : 'null'})`}}></div>
                    <div className="book-shelf-changer">
                    <select>
                    <option value="none" disabled>Move to...</option>
                    <option value="currentlyReading">Currently Reading</option>
                    <option value="wantToRead">Want to Read</option>
                    <option value="read">Read</option>
                    <option value="none">None</option>
                    </select>
                    </div>
                    </div>
                    <div className="book-title">{book.title}</div>
                    <div className="book-authors"></div>
                    </div>
                    </li>
                    ))}
                    </ol>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    )
                }

                {
                    (books.length == 0 && query) && (
                    <div>
                     <h1>No Results Found</h1>
                        <h2>Try Another Search Name</h2>
                    </div>
                    )
                }
            </div>

        )
    }
}

export default ListBooks;
