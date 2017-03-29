import React from 'react'
import Radium from 'radium'

import Header from './Header/Header'
import Left from './Left/Left'
import Mid from './Mid/Mid'
import Right from './Right/Right'
import Footer from './Footer/Footer'

import AppActions from '../../actions/app-actions'
const CONNECT_URL = 'http://127.0.0.1:3000'

const styles = {
    base: {
        //minHeight: '100%',
        //margin:'0 auto',
        //height: '50px',
        //display: '-webkit-box',
        //display: '-moz-box',
        //display: '-ms-flexbox',
        
        //display: 'flex',  
        //-webkit-flex-flow: row wrap;
        display: '-webkit-flex',
        WebkitFlexFlow: 'row wrap',

        //alignItems: 'stretch',
        //flexFlow: 'row wrap',  
        fontWeight: 'bold',
        textAlign: 'center'
    }
}

@Radium
export default class Main extends React.Component {
    constructor () {
        super()
    }
    componentWillMount () {
        AppActions.socketConnct (CONNECT_URL)
    }
    render () {
        return (
            <div style={[styles.base]}>
                <Header />
                <Left />
                <Mid />
                <Right />
                <Footer />
            </div>
        )
    }
    componentWillUnmount () {
        console.log('Main componentWillUnmount')
        React.unmountComponentAtNode (document.body)
    }
}