import React from 'react';
import Radium from 'radium';
import AppActions from '../../../actions/app-actions.js';

const styles = {
    base: {
    },
    titleLi: {
        border: '1px solid #e78f08',
        background: '#4f4730',
        color: '#ffffff',
        fontWeight: 'bold',
        padding: '0.2em'
    }
};

@Radium
export default class ListTitle extends React.Component {
    constructor () {
        super();
    }
    handler () {
        AppActions.addItem(this.props.testcase);
    }
    render () {
        return <li style={[styles.titleLi]}>
                {this.props.testcase.name}
            </li>;
    }
}