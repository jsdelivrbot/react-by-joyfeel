import React from 'react'
import ReactDOM from 'react-dom'

import "bootstrap/css/bootstrap.css!"
import Main from './emmc/components/Main'

import "../dest/main.css!"

//import $ from 'jquery';
//import 'highcharts-release/highcharts.js';
//import Button from 'react-bootstrap/lib/Button';
//import { Button, ButtonToolbar } from 'react-bootstrap';

//import "normalize.css/normalize.css!";
/*
	"normalize.css": "github:necolas/normalize.css@3.0.3",

	So, find the jspm_packages/github/necolas/normalize.css/normalize.css
	In short, that is normalize.css/normalize.css!
*/

//import "bootstrap/css/bootstrap.css!";
/*
	"bootstrap": "github:twbs/bootstrap@3.3.5",

	So, find the jspm_packages/github/twbs/bootstrap/css/bootstrap.css
	In short, that is bootstrap/css/bootstrap.css!
*/
 
//http://codepen.io/anon/pen/VvxRoK?editors=110
ReactDOM.render(
	<Main />, 
	document.getElementById('foo')
)
