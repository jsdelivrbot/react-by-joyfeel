import React from 'react';
import Radium from 'radium';

import AppActions from '../../../actions/app-actions';
import SocketStore from '../../../stores/socket-store';
import ResultStore from '../../../stores/result-store';

import ListResultItem from './Right-listResultItem';

import { Badge, Table, Pager, PageItem } from 'react-bootstrap';

const styles = {
    base: {
        background: '#807951',
        flex: '1 20%',
        order: '3',
        height: '85vh',
        overflowY: 'scroll',
        textAlign: 'left'
    }
};

function getSocket () {
    return SocketStore.getSocket();
}

function getResult () {
    return ResultStore.getResultItem();
}

@Radium
export default class Right extends React.Component {
    constructor () {
        super();
        this.state = {
            socket: getSocket(),
            result: getResult(),
            currentPage: 0
        };
    }
    prev () {
        if (this.state.page - 1 < 0) {
            return;
        } else {
            this.setState({
                currentPage: this.state.currentPage - 1
            });
        }
    }
    next () {
        let currentPage = Math.floor(this.state.result.length / this.props.perPage);

        if ((this.state.currentPage + 1) > currentPage) {
            return;
        } else {
            this.setState({
                currentPage: this.state.currentPage + 1
            });            
        }
    }
    current () {
        let currentPage = Math.floor(this.state.result.length / this.props.perPage);

        if (this.state.currentPage === currentPage) {
            return;
        } else {
            this.setState({
                currentPage: currentPage
            });            
        }
    }
    componentWillMount () {
        ResultStore.addChangeListener(this._onChange.bind(this));
    }
    _onChange () {
        if ( getResult().length === 0 ) {
            this.setState({
                currentPage: 0
            });        
        }
        this.setState({
            result: getResult()
        });
    }
    render () {
        let { perPage } = this.props,
            { currentPage, result } = this.state,  //0
            itemCount = result.length;  //0, 1, 2, ....

        let start = currentPage * perPage, //0*100, 1*100
            end = Math.min (itemCount, start + perPage); //Show [] or 100

        return (
            <div style={[styles.base]}>
                <p>Current page <Badge>{currentPage}</Badge></p>
                <div>
                    <Pager>
                        <PageItem onClick={this.prev.bind(this)}>&larr; Previous</PageItem>
                        {' '}
                        <PageItem onClick={this.current.bind(this)}>Current</PageItem>
                        {' '}
                        <PageItem onClick={this.next.bind(this)}>Next &rarr;</PageItem>
                    </Pager>
                </div>
                <Table bordered condensed responsive>
                    <thead>
                        <tr><th>#</th><th>Testcase</th><th>Result</th></tr>
                    </thead>
                    <tbody>
                        {this.state.result.slice(start, end).map((item, index) => {
                            let add = start + index;
                            return <ListResultItem key={index} result={item} count={add} ref='dos'/>;
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }
    componentDidMount () {
        //console.log('componentDidMount');
        this.state.socket.on('result', (data) => {
            AppActions.addResult(data);
        });
    }
    componentWillUnmount () {
        console.log('FFFFFFFFFFFF componentWillUnmount');
    }
}

Right.defaultProps = { perPage: 50 };
