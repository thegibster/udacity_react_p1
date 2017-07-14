import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import * as BooksAPI from './BooksAPI'

class ListBooks extends Component {
    static propTypes = {
        queryBooks: PropTypes.array.isRequired
        // onDeleteBook: PropTypes.func.isRequired
        // updateAppState: PropTypes.func.isRequired
    }
    state = {
        showNoResults : false
    }

    componentDidMount(){

          if(this.props.queryBooks.length <= 0){
              this.setState({ showNoResults: true})
        }
    }



    render(){

        const { queryBooks, query ,handleInputChange } = this.props;

        const  { showNoResults } = this.state;


        return (

            <div className="list-books">

                {
                    (query.length > 0 && queryBooks.length > 0 )  && (
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
                {queryBooks.map((book) => (
                    <div key={book.id}>
                        <li  className='contact-list-item'>
                        <div className="book">
                        <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 192, backgroundImage:`url(${book ? book.imageLinks.thumbnail : 'null'})`}}></div>
                        <div className="book-shelf-changer">
                        <select
                            name={book.id}
                            onChange={handleInputChange}
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
                        <div className="book-authors"></div>
                        </div>
                        </li>
                    </div>
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
                    (showNoResults && query) && (
                    <div>
                     <h1>No Results Found</h1>

                    </div>
                    )
                }
            </div>

        )
    }
}

export default ListBooks;
