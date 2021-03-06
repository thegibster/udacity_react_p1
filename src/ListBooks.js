import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from './Select';
class ListBooks extends Component {
    static propTypes = {
        queryBooks: PropTypes.array.isRequired,
        handleInputChange: PropTypes.func.isRequired
    }
    state = {
        showNoResults : false,
        searchUpdate: true
    }

    componentDidMount(){
        if(this.props.queryBooks.length <= 0){
            this.setState({ showNoResults: true});
        }
    }

    render(){
        const { queryBooks, query ,handleInputChange } = this.props;
        const  { showNoResults } = this.state;

        return (

            <div className="list-books">

                {
                    (query.length > 0 && queryBooks.length >= 1 )  && (
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
                                                                    <div className="book-cover" style={{ width: 128, height: 192, backgroundImage:`url(${book.imageLinks.thumbnail ? book.imageLinks.thumbnail : 'http://nzbodyworkepinc.weebly.com/uploads/1/8/6/1/18617822/8474511.jpg?123'})`}}></div>
                                                                    <div className="book-shelf-changer">
                                                                        <Select
                                                                            name={book.id}
                                                                            onChange={handleInputChange}
                                                                            value={`${book.shelf}`}
                                                                        />
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
                    (showNoResults && queryBooks.length <= 0) && (
                        <div>
                            <h1>Please Enter a Valid Search Query</h1>

                        </div>
                    )
                }
            </div>

        )
    }
}

export default ListBooks;
