import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';

class ListBooks extends Component {
    static propTypes = {
        books: PropTypes.array.isRequired,
        onDeleteBook: PropTypes.func.isRequired
    }

    state = {
        query: ''
    }

    updateQuery = (query) => {
        this.setState({ query: query.trim() })
    }

    clearQuery = () => {
        this.setState({ query: '' })
    }

    render(){

        const { books } = this.props;
        const { query } = this.state;

        let showingBooks;
        if(query){
            const match =  new RegExp(escapeRegExp(query), 'i');
            showingBooks = books.filter((book) => match.test(book.name));
        }else {
            showingBooks = books;
        }

        showingBooks.sort(sortBy('name'));

        return (
            <div className="list-books">
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
                                                    <div className="book-cover" style={{ width: 128, height: 192, backgroundImage:`url(${book.imageLinks.thumbnail})`}}></div>
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
                                                <div className="book-authors">{book.authors[0]}</div>
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
}

export default ListBooks;
