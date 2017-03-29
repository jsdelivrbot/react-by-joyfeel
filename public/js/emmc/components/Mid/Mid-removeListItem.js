import React from 'react';
import AppActions from '../../../actions/app-actions.js';

export default class RemoveListItem extends React.Component {
	constructor (props) {
		super(props);
		this.handler = this.handler.bind(this)
	}
	handler () {
		AppActions.removeItem(this.props.testcase);
	}
	render () {
		return <button onClick={this.handler}>
				x
			</button>;
	}
}