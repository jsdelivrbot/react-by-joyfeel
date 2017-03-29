import React from 'react'
import $ from 'jquery'

import AppActions from '../../../actions/app-actions.js'
import saveAs from './FileSaver.js'

export default class SaveListItem extends React.Component {
	constructor () {
		super()
		this.handleSaveScript = this.handleSaveScript.bind(this)
	}
	handleSaveScript () {
		$.ajax({
	      	type: 'GET',
	      	url: '/storedScript'
	    })
        .done(data => {
            let blob = new Blob(
            	[data], 
            	{
            		type: "application/json;charset=utf-8"
            	}
            )
            saveAs(blob, "CMD.jsons")
        })
        .fail(jqXhr => {
            console.log(jqXhr)
            console.log('Fail!!!')
        })
	}
	render () {
		return <button onClick={this.handleSaveScript}> Save </button>
	}
}