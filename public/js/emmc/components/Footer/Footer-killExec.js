import React from 'react'
import $ from 'jquery'

import AppActions from '../../../actions/app-actions.js'

export default class KillExec extends React.Component {
	constructor () {
		super()
		this.handleKillProcess = this.handleKillProcess.bind(this)
	}
	handleKillProcess () {
		$.ajax({
	      	type: 'POST',
	      	url: '/kill'
	    })
        .done((data) => {
            //this.actions.addCharacterSuccess(data.message);
            //console.log(data);
        })
        .fail((jqXhr) => {
            //this.actions.addCharacterFail(jqXhr.responseJSON.message);
            console.log(jqXhr)
            console.log('Fail!!!')
        })
	}
	render () {
		return <button onClick={this.handleKillProcess}>Kill</button>
	}
}