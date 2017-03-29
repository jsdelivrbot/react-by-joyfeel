import React from 'react';
import AppActions from '../../../actions/app-actions.js';
import { Input } from 'react-bootstrap';

export default class SelectBox extends React.Component {
	constructor (props) {
		super(props);
		this.handler = this.handler.bind(this)
	}

	handler () {
		let { testcase, refIndex } = this.props

		AppActions.editItem(testcase, refIndex, this.refs[refIndex].getValue(), 'selectBoxContent');
	}
	render () {
		let { content, refIndex } = this.props

		return (
			<Input 
				type="select" 
				defaultValue={content}
				onChange={this.handler}
                className="form-control" 
                ref={refIndex}>
           		<option value='1000'>4k</option>
           		<option value='2000'>8k</option>
           		<option value='4000'>16k</option>
           		<option value='8000'>32k</option>
           		<option value='10000'>64k</option>
           		<option value='20000'>128k</option>
           		<option value='40000'>256k</option>
           		<option value='80000'>512k</option>
             </Input>
		)
	}
	componentDidMount () {
		let { testcase, content, refIndex } = this.props
		//console.log('@@@@@@@@@@@@@@' + this.props.content + '@@@@@@@@@@@@@@');
		if (typeof content === 'undefined') {
			AppActions.editItem(testcase, refIndex, '1000', 'selectBoxContent');	
		}	
	}
}
/*
SelectBox.propsTypes = {
	content: React.PropTypes.string
};


SelectBox.defaultProps = {
	content: '1000'
};
*/