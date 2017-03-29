import React from 'react';
import AppActions from '../../../actions/app-actions.js';

import { Col } from 'react-bootstrap';
import Radium from 'radium';

const styles = {
    btn: {
		fontFamily: 'Arial',
		color: '#ffffff',
		fontSize: '10px',
		background: '#3f88b8',
		padding: '10px 20px 10px 20px'
    },
    file: {
    	visibility: 'hidden',
    	position: 'absolute'
    },
    testBtn: {
    	//display: 'inline'
      width: '65%'
    },
    testLabel: {
      clear: 'both'
    },
    testSpan2: {
      float: 'left',
      marginRight: '10px'
    }
};

@Radium
export default class FileBox extends React.Component {
	constructor (props) {
		super(props);
		this.handler = this.handler.bind(this)
	}
	handler () {
		let { refIndex, testcase} = this.props

		AppActions.editItem(testcase, refIndex, this.refs[refIndex].files[0], 'fileBoxContent');
	}
	render () {
		let { refIndex, testcase} = this.props
			//fileLabel = testcase.get('fileBox')[refIndex]
		//console.log(refIndex)
		//console.log(testcase.get('fileBox')[refIndex])
		//console.log(this.props.testcase.get('fileBox')[refIndex])
				/*
				<label htmlFor={fileLabel}>
					<span style={[styles.btn]}>{fileLabel}</span>
				</label>

					style={[styles.file]}
					id={fileLabel}

				<Col md={3} key={refIndex}>
				</Col>
				*/
		return (
			<span>
				<label style={[styles.testLabel]}>
        <span style={[styles.testSpan2]}>{testcase.get('fileBox')[refIndex]}</span>
				<input
					type="file"
					style={[styles.testBtn]}
					onChange={this.handler}
	                ref={this.props.refIndex}
	            />
	            </label>
	        </span>
		)
	}
}
