import React from 'react';
import Radium from 'radium';
import AppStore from '../../../stores/app-store';

const styles = {
    base: {
        background: '#343121',
        flex: '1 100%',
        height: '5vh'
    },
    siteTitle: {
        lineHeight: '5vh',
        margin: '0',
        color: 'white'
    }
};

function testcaseItem () {
    return AppStore.getTestcaseItem();
}

function processStatus () {
    return AppStore.getProcessStatus();
}

@Radium
export default class Header extends React.Component {
    constructor () {
        super();
        this.state = {
            //items: testcaseItem(),
            processStatus: processStatus()
        };
    }
    componentWillMount () {
        AppStore.addChangeListener(this._onChange.bind(this));
    }
    _onChange () {
        this.setState({
            //items: testcaseItem(),
            processStatus: processStatus()
        });
    }
    render () {
        return (
            <div style={[styles.base]}>
                <h1 style={[styles.siteTitle]}>emmc Tester[{this.state.processStatus}]</h1>
            </div>
        );
    }
}
