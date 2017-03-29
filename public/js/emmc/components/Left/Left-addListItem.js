import React from 'react';
import Radium from 'radium';
import AppActions from '../../../actions/app-actions.js';


const styles = {
    base: {
    },
    testcaseLi: {
        color: '#333',
        padding: '3px 0',
        cursor: "pointer",

        ':hover': {
            border: '1px solid #fbcb09',
            background: '#fdf5ce',
            fontWeight: 'bold',
            color: '#c77405'
        },
        ':focus': {
            margin: '-1px'
        }
    }
};

@Radium
export default class AddListItem extends React.Component {
	constructor () {
		super();
	}
	handler () {
        //console.log(JSON.stringify(this.props.testcase));
		AppActions.addItem(this.props.testcase);
	}
	render () {
		return <li style={[styles.testcaseLi]} onClick={this.handler.bind(this)}>
				{this.props.testcase.name}
			</li>;
	}
}