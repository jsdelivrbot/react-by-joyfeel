import React from 'react';
import AppActions from '../../../actions/app-actions.js';

export default class TextBox extends React.Component {
	constructor (props) {
		super(props);
		this.handler = this.handler.bind(this)
	}
	handler () {
		let { testcase, refIndex } = this.props

		AppActions.editItem(testcase, refIndex, this.refs[refIndex].value, 'textBoxContent');
	}
	render () {
		let { content, placeholder, refIndex } = this.props

		return (
			<input 
				type="text" 
				defaultValue={content}
                onChange={this.handler}
                className="form-control" 
                placeholder={placeholder} 
                ref={refIndex} 
            />
		)
	}
}