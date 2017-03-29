import React from 'react';
import Radium from 'radium';
import AppStore from '../../../stores/app-store.js';

import ListTitle from './Left-listTitle.js';
import AddListItem from './Left-addListItem.js';


const styles = {
    base: {
        background: '#edc951',
        flex: '1 15%',
        order: '1',
        height: '85vh',
        //overflowX: 'auto',
        overflowY: 'scroll',
        textAlign: 'left'
    },
    ulLayout: {
        listStyle: 'none',
        padding: '0',
        margin: '0'
    },
    ulFont: {
        fontFamily: 'Sans-serif',
        fontSize: '0.85 em'
    },
    titleLi: {
        border: '1px solid #e78f08',
        background: '#4f4730',
        color: '#ffffff',
        fontWeight: 'bold',
        padding: '0.2em'
    },
    testcaseLi: {
        color: '#333',
        padding: '3px 0',
        cursor: "pointer",

        ':hover': {
            border: '1px solid #fbcb09',
            background: '#fdf5ce',
            fontWeight: 'bold',
            color: '#c77405'
        },
        ':focus': {
            margin: '-1px'
        }
    }
};


function getListTestcase () {
    return {listTestcase: AppStore.getListTestcase()}
}

@Radium
export default class Left extends React.Component {
    constructor () {
        super();
        this.state = getListTestcase ();
    }
    render () {
        let listTestcase = this.state.listTestcase.map(function(item) {
            //console.log(JSON.stringify(testcase));
            if (item.category === 'Title') {
                return (
                    <ListTitle key={item.name} testcase={item} />
                );    
            } else {
                return (
                    <AddListItem key={item.name} testcase={item} />
                );    
            }            
        });

        return (
            <div style={[styles.base]}>
                <ul style={[styles.ulLayout, styles.ulFont]}>
                    {listTestcase}
                </ul>
            </div>
        );
    }
}