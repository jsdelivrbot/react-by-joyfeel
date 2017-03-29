import React from 'react'
import ReactDOM from 'react-dom'
import Radium from 'radium'
import $ from 'jquery'

import AppActions from '../../../actions/app-actions.js'
import AppStore from '../../../stores/app-store'
import SaveListItem from './Footer-saveListItem'
import LoadListItem from './Footer-loadListItem'
import KillExec from './Footer-killExec'
import Immutable from 'immutable'

const styles = {
    base: {
        background: '#5A5539',
        flex: '1 100%',
        order: '4',
        height: '10vh'
    }
}

@Radium
export default class Footer extends React.Component {
    constructor () {
        super()
        this.state = {
            items: this.testcaseItem(),
            displaySendButton: true,
            displayClearButton: true,
            displaySaveButton: false,
            displayKillButton: false,
            displayReplayButton: false,
            displayLoadButton: true
        }

        this.sendButton = this.sendButton.bind(this)
        this.clearButton = this.clearButton.bind(this)
        this.killButton = this.killButton.bind(this)
        this.replayButton = this.replayButton.bind(this)
    }
    testcaseItem() {
        return AppStore.getTestcaseItem()
    }
    componentWillMount () {
        AppStore.addChangeListener(this._onChange.bind(this))
    }
    _onChange () {
        this.setState({
            items: this.testcaseItem()
        })
    }
    readyStateButton() {
        this.setState({
            displaySendButton: true,
            displayClearButton: true,
            displaySaveButton: false,
            displayKillButton: false,
            displayReplayButton: false,
            displayLoadButton: true
        })
    }
    runningStateButton() {
        this.setState({
            displaySendButton: false,
            displayClearButton: false,
            displaySaveButton: true,
            displayKillButton: true,
            displayReplayButton: false,
            displayLoadButton: false
        })
    }
    finishedStateButton() {
        this.setState({
            displaySendButton: false,
            displayClearButton: true,
            displaySaveButton: true,
            displayKillButton: false,
            displayReplayButton: true,
            displayLoadButton: true
        })
    }
    sendScriptFile(sendData) {
        this.runningStateButton()
        AppActions.runningStatus()

        $.ajax({
            url: '/',
            type: 'POST',
            processData: false,
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(sendData)
        })
        .done(data => {
            AppActions.finishedStatus('Finished successfully')
        })
        .fail(jqXhr => {
            AppActions.finishedStatus('Finished fail')
        })
        .always(() => {
            this.finishedStateButton()
        })
    }
    postData(formData, sendData) {
        //console.log(JSON.stringify(sendData));
        $.ajax({
            url: '/upload',
            type: 'POST',
            processData: false,
            contentType: false,
            data: formData
        })
        .done(data => {
            this.sendScriptFile(sendData)
        })
        .fail(jqXhr => {
            //this.actions.addCharacterFail(jqXhr.responseJSON.message);
            console.log('Upload File Error: '+ jqXhr);
        })
    }
    parseJsonToFormdata(originalSendData) {
        let formData = new FormData(),
            sendData = Immutable.fromJS(originalSendData)

        /*
         *  Retrieve the real file object from fileBoxContent.
         *  But we need to replace the file object to filename.
         */
        let tempArr = originalSendData.reduce((acc, item, index) => {
            //Get current obj {XD}
            let tempItem = item

            //Immutable.List.isList(getPreviousBox)

            if (typeof item.get('fileBoxContent') !== 'undefined' &&
                Immutable.List.isList( item.get('fileBoxContent') )) {
                //middle: [@@@@@@]
                let middle = tempItem.get('fileBoxContent')

                //middle: [@@@@@@]
                middle = Immutable.fromJS(middle)

                //middle: []
                let immFileArr = middle.clear()
                //item: [@@@@@@]
                item.get('fileBoxContent').map((file, i) => {
                    acc.push(file)
                    //Collect all of the file
                    
                    formData.append('file', file)

                    immFileArr = immFileArr.update(i, () => file.name);
                })

                //XD: {'fileBoxContent':['123.jpg', '3123.png']}
                tempItem = tempItem.set('fileBoxContent', immFileArr)
            }
            sendData = sendData.set(index, tempItem)
            //this.state.mytest = this.state.mytest.set(index, tempItem)
            
            return acc;
        }, [])

        return {
            formData,
            sendData
        }
    }
    startSend(originalSendData) {
        let { formData, sendData } = this.parseJsonToFormdata(originalSendData)
        this.postData(formData, sendData)
    }
    sendButton() {
        //console.log(JSON.stringify(this.state.items));
        let originalSendData = this.state.items
        if (originalSendData.size === 0) {
            return;
        }
        this.startSend(originalSendData)
    }
    killButton() {
        AppActions.readyStatus()
        this.readyStateButton()

        $.ajax({
            type: 'POST',
            url: '/kill'
        })
        .done(data => {
            //this.actions.addCharacterSuccess(data.message);
            //console.log('Kill process done:', data);
        })
        .fail(jqXhr => {
            //this.actions.addCharacterFail(jqXhr.responseJSON.message);
            console.log('Kill Process Fail: ' + jqXhr);
        })
    }
    replayButton() {
        AppActions.readyStatus()
        AppActions.clearResult()
        this.readyStateButton()
        this.sendButton()
    }    
    clearButton() {
        AppActions.readyStatus()
        AppActions.clearItem()

        //Clear right menu
        AppActions.clearResult()

        //AppActions.clearPage();
        this.readyStateButton()
    }
    render () {
        return (
            <div style={[styles.base]}>
                {this.state.displaySendButton ? 
                    <button onClick={this.sendButton}>Send</button> : 
                    null}
                {' '}
                {this.state.displayClearButton ?
                    <button onClick={this.clearButton}>Clear</button> :
                    null}
                {' '}
                {this.state.displaySaveButton ? 
                    <SaveListItem script={this.state.items} /> : 
                    null}
                {' '}
                {this.state.displayKillButton ? 
                    <button onClick={this.killButton}>Kill</button> : 
                    null}
                {' '}
                {this.state.displayReplayButton ? 
                    <button onClick={this.replayButton}>Replay</button> : 
                    null}                    
                {/* Load */}
                {this.state.displayLoadButton ?
                    <LoadListItem /> :
                    null}
            </div>
        )
    }
}