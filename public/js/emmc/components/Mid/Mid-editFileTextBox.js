import React from 'react';
import AppActions from '../../../actions/app-actions.js';

export default class FileTextBox extends React.Component {
	constructor (props) {
		super(props);
		this.handler = this.handler.bind(this)
	}
	handler () {
		let { testcase, refIndex } = this.props

		AppActions.editItem(testcase, refIndex, this.refs[refIndex].value, 'fileBoxContent');
	}
	render () {
		let { content, refIndex } = this.props

		return (
			<input 
				type="text" 
				defaultValue={content}
                onChange={this.handler}
                className="form-control" 
                ref={refIndex} disabled 
            />
		)
	}
}