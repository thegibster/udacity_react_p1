/**
 * Created by dragibbs on 8/1/17.
 */
import React, { Component } from 'react';
import Select from './Select';

class BookShelf extends Component {
    render () {

        const { books,handleInputChange } = this.props;


        return (
            <div className="bookshelf-books">
                <ol className="books-grid">
                    {books.map((book) => (
                        <div key={book.id}>
                            <li>
                                <div className="book">
                                    <div className="book-top">
                                        <div className="book-cover" style={{ width: 128, height: 188, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                        <div className="book-shelf-changer">
                                            <Select
                                                name={book.id}
                                                onChange={handleInputChange}
                                                value={`${book.shelf}`}
                                            />
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
        )
    }
}

export default BookShelf;