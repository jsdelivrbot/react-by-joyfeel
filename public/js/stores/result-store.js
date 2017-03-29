import AppConstants from '../constants/app-constants.js'
import { dispatch, register } from '../dispatchers/app-dispatcher.js'
import { EventEmitter } from 'events'

const CHANGE_EVENT = 'changeResult'

let _resultItem = [],
    _page = 0

const _addResult = (result) => {
    _resultItem.push(result)
}

const _clearResult = () => {
    _resultItem.length = 0
}
/*
const _clearPage = () => {
    _page = 0;
}
*/

const ResultStore = Object.assign(EventEmitter.prototype, {
    emitChange () {
        this.emit( CHANGE_EVENT )
    },
    addChangeListener (callback) {
        this.on(CHANGE_EVENT, callback)
    },
    removeChangeListener (callback) {
        this.removeListener(CHANGE_EVENT, callback)
    },
    getResultItem () {
        return _resultItem
    },
    /*
    getPage () {
        return _page;
    },
    */    
    dispatcherIndex: register(action => {
        switch (action.actionType) {
            case AppConstants.ADD_RESULT:
                _addResult(action.result)
            break;
            case AppConstants.CLEAR_RESULT:
                _clearResult()
            break;
            /*
            case AppConstants.CLEAR_PAGE:
                _clearPage();
            break;            
            */
        }
        
        ResultStore.emitChange()
    })
})

export default ResultStore