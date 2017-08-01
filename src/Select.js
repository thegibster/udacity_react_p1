/**
 * Created by dragibbs on 8/1/17.
 */
import React, { Component } from 'react';

class Select extends Component {

    render() {

        const { name, onChange, value } = this.props;
        return (
            <select
                name={name}
                onChange={onChange}
                value={value}
            >
                <option value="none" disabled>Move to...</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
            </select>
        )
    }
}


export default Select;