import AppConstants from '../constants/app-constants.js'
import { dispatch, register } from '../dispatchers/app-dispatcher'
import { EventEmitter } from 'events'
import Immutable from 'immutable'

import io from 'socket.io-client'
const CHANGE_EVENT = 'changeSocket'

let _socket = false

const _socketConnect = (url) => {
    _socket = io()
}

const SocketStore = Object.assign(EventEmitter.prototype, {
    emitChange (){
        this.emit( CHANGE_EVENT )
    },
    addChangeListener (callback) {
        this.on(CHANGE_EVENT, callback)
    },
    removeChangeListener (callback) {
        this.removeListener(CHANGE_EVENT, callback)
    },
    getSocket () {
        return _socket
    },
    dispatcherIndex: register(action => {
        switch (action.actionType) {
            case AppConstants.SOCKET_CONNECT:
                _socketConnect(action.url)
            break;
        }

        SocketStore.emitChange()
    })
});

export default SocketStore