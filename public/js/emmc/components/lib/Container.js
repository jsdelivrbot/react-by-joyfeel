import React from 'react'
import Radium from 'radium'

const styles = {
    base: {
        maxWidth: '75em',
        margin: '0 auto'
    } 
}

@Radium
export default class Container extends React.Component {
    constructor () {
        super()
    }
    render () {
        return (
            <div style={[styles.base]}>
                {this.props.children}
            </div>
        )
    }
}