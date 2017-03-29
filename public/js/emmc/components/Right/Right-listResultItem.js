import React from 'react';
//import ReactDOM from 'react-dom';
import Radium from 'radium';

const styles = {
    base: {
    },
    titleLi: {

        color: '#333',
        padding: '3px 0'
    }
};

@Radium
export default class ListResultItem extends React.Component {
    constructor () {
        super();
    }
    render () {
        return <tr><td>{this.props.count + 1}</td><td>{this.props.result.name}</td><td>{this.props.result.txt}</td></tr>
    }
    componentWillUnmount () {
        //let mountNode = ReactDOM.findDOMNode (this.refs.dd);
        //let umount = React.unmountComponentAtNode (mountNode);
        //console.log('QQQQQQQQQQQQQQQQQQQ');
    }
}