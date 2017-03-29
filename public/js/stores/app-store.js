import AppConstants from '../constants/app-constants.js';
import { dispatch, register } from '../dispatchers/app-dispatcher.js';
import { EventEmitter } from 'events';
import Immutable from 'immutable';

const CHANGE_EVENT = 'changeApp';

/*
A: normalTestcase
B: Read
C: Write
*/
const _listTestcase = [
    {category: 'Title', name: 'For Loop'},
        {category: 'Z', name: '{',
            command: 'loop',
            textBox: ['loopTime'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: ''
        },
        {category: 'Z', name: '}',
            command: 'end', dbgfsFile: ''
        },
    {category: 'Title', name: 'Initialization'},
        {category: 'E', name: 'High-Speed 26MHz, 1 bit data bus (SDR)',
            command: '0'
        },
        {category: 'E', name: 'High-Speed 26MHz, 4 bit data bus (SDR)',
            command: '1'
        },
        {category: 'E', name: 'High-Speed 26MHz, 8 bit data bus (SDR)',
            command: '2'
        },

        {category: 'E', name: 'High-Speed 52MHz, 1 bit data bus (SDR)',
            command: '3'
        },
        {category: 'E', name: 'High-Speed 52MHz, 4 bit data bus (SDR)',
            command: '4'
        },
        {category: 'E', name: 'High-Speed 52MHz, 8 bit data bus (SDR)',
            command: '5'
        },

        {category: 'E', name: 'High-Speed 52MHz, 4 bit data bus (DDR), 1.8V or 3V I/O',
            command: '6'
        },
        {category: 'E', name: 'High-Speed 52MHz, 8 bit data bus (DDR), 1.8V or 3V I/O',
            command: '7'
        },
        {category: 'E', name: 'HS200, 4 bit data bus (SDR), 1.8V I/O',
            command: '8'
        },
        {category: 'E', name: 'HS200, 8 bit data bus (SDR), 1.8V I/O',
            command: '9'
        },
        /*
        {category: 'E', name: 'HS400, 8 bit data bus (SDR), 1.8V I/O',
            command: '10'
        },
        */        
    {category: 'Title', name: 'Normal Testcase'},
        {category: 'A', name: 'Basic Read (no data verification)',
            command: '1', dbgfsFile: 'test'
        },

        {category: 'A', name: 'Basic Write (no data verification)',
            command: '2', dbgfsFile: 'test'
        },

        {category: 'A', name: 'Basic Read (with data verification)',
            command: '3', dbgfsFile: 'test'
        },

        {category: 'A', name: 'Basic Write (with data verification)',
            command: '4', dbgfsFile: 'test'
        },

        {category: 'A', name: 'Test only',
            command: '49', dbgfsFile: 'test'
        },

        {category: 'A', name: 'Switch to default partition',
            command: '51', dbgfsFile: 'test'
        },

        {category: 'A', name: 'Switch to boot1 partition',
            command: '52', dbgfsFile: 'test'
        },

        {category: 'A', name: 'Switch to boot2 partition',
            command: '53', dbgfsFile: 'test'
        },

        {category: 'A', name: 'Switch to RPMB partition',
            command: '54', dbgfsFile: 'test'
        },

        {category: 'A', name: 'Sleep',
            command: '89', dbgfsFile: 'test'
        },

        {category: 'A', name: 'Wakeup',
            command: '90', dbgfsFile: 'test'
        },
        {category: 'I', name: 'Get EXT_CSD',
            command: '111', dbgfsFile: 'test'
        },
        {category: 'saveCSD', name: 'Get CSD',
            command: '128', dbgfsFile: 'test'
        },
        {category: 'F', name: 'ms delay',
            command: '100',
            textBox: ['ms(dec)'], fileBox: [],
            textBoxContent: Immutable.List(), fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },
        {category: 'A', name: 'Packet Command Write',
            command: '62', dbgfsFile: 'test'
        },
    {category: 'Title', name: 'CMD INDEX'},
        {category: 'A', name: 'CMD 0',
            command: '112', dbgfsFile: 'test'
        },
        {category: 'cmdIndex6', name: 'CMD 6',
            command: '118',
            textBox: ['index (dec)', 'value (hex)'],
            textBoxContent: Immutable.List(),
            dbgfsFile: 'two_arg_no_file'
        },
        {category: 'ext_csd_access_mode', name: 'CMD 6 (access mode)',
            command: '130',
            textBox: ['access Bits (binary)', 'index (dec)', 'value (binary)'],
            textBoxContent: Immutable.List(),
            dbgfsFile: 'three_arg_no_file'
        },   
        {category: 'cmdIndex6', name: 'CMD 27',
            command: '129',
            textBox: ['index (dec)', 'value (hex)'], 
            textBoxContent: Immutable.List(),
            dbgfsFile: 'two_arg_no_file'
        },     
        {category: 'A', name: 'CMD 13',
            command: '125', dbgfsFile: 'test'
        },
    {category: 'Title', name: 'Buffer length setting'},
        {category: 'F', name: 'Set buffer length (custom)',
            command: '66',
            textBox: ['blockCount'], fileBox: [],
            textBoxContent: Immutable.List(), fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },
        {category: 'F', name: 'Set buffer length',
            command: '66',
            selectBox: [],
            selectBoxContent: Immutable.List(),
            dbgfsFile: 'myTest'
        },
    {category: 'Title', name: 'Read'},
        {category: 'B', name: 'Open-ended Read',
            command: '46',
            textBox: ['startAddr (hex)', 'blockCount (hex)'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },

        {category: 'B', name: 'Pre-defined Read (non-Reliable)',
            command: '58',
            textBox: ['startAddr (hex)', 'blockCount (hex)'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },

        {category: 'B', name: 'Pre-defined Read (Reliable)',
            command: '71',
            textBox: ['startAddr (hex)', 'blockCount (hex)'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },
        {category: 'B', name: 'Open-ended Read (no file)',
            command: '102',
            textBox: ['startAddr (hex)', 'blockCount (hex)'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },

        {category: 'B', name: 'Pre-defined Read (non-Reliable, no file)',
            command: '103',
            textBox: ['startAddr (hex)', 'blockCount (hex)'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },

        {category: 'B', name: 'Pre-defined Read (Reliable, no file)',
            command: '104',
            textBox: ['startAddr (hex)', 'blockCount (hex)'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },
/*
        {category: 'B', name: 'Open-ended Read (Single 18)',
            command: '71',
            textBox: ['startAddr', 'blockCount'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },
*/

    {category: 'Title', name: 'Write'},
        {category: 'C', name: 'Open-ended Write',
            command: '47',
            textBox: ['startAddr (hex)', 'blockCount (hex)'], fileBox: ['pattern'],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },

        {category: 'C', name: 'Pre-defined Write (non-Reliable)',
            command: '59',
            textBox: ['startAddr (hex)', 'blockCount (hex)'], fileBox: ['pattern'],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },

        {category: 'C', name: 'Pre-defined Write (Reliable)',
            command: '72',
            textBox: ['startAddr (hex)', 'blockCount (hex)'], fileBox: ['pattern'],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },
/*
        {category: 'C', name: 'Open-ended Write (Sleep)',
            command: '95',
            textBox: ['startAddr', 'blockCount', 'sleepAddr'], fileBox: ['pattern'],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTestSleep'
        },

        {category: 'C', name: 'Pre-defined Write (non-Reliable, Sleep)',
            command: '96',
            textBox: ['startAddr', 'blockCount', 'sleepAddr'], fileBox: ['pattern'],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTestSleep'
        },

        {category: 'C', name: 'Pre-defined Write Write (Reliable, Sleep)',
            command: '97',
            textBox: ['startAddr', 'blockCount', 'sleepAddr'], fileBox: ['pattern'],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTestSleep'
        },
*/
    {category: 'Title', name: 'Test case D'},
        {category: 'D', name: 'Erase',
            command: '48',
            textBox: ['startAddr (hex)', 'blockCount (hex)'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },
        {category: 'A', name: 'Erase all',
            command: '63', dbgfsFile: 'test'
        },
        {category: 'D', name: 'Trim',
            command: '64',
            textBox: ['startAddr (hex)', 'blockCount (hex)'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },
        {category: 'A', name: 'Trim all',
            command: '65', dbgfsFile: 'test'
        },
        {category: 'D', name: 'Discard',
            command: '85',
            textBox: ['startAddr (hex)', 'blockCount (hex)'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List(),
            dbgfsFile: 'myTest'
        },
        {category: 'A', name: 'Discard all',
            command: '86', dbgfsFile: 'test'
        },
        {category: 'A', name: 'Sanitize',
            command: '101', dbgfsFile: 'test'
        },
/*
    {category: 'Title', name: 'Test case J'},

        {category: 'B', name: 'GPP1',
            textBox: ['startAddr', 'blockCount'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List()},

        {category: 'B', name: 'GPP2',
            textBox: ['startAddr', 'blockCount'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List()},

        {category: 'B', name: 'EUDA',
            textBox: ['startAddr', 'blockCount', 'enable'], fileBox: [],
            textBoxContent: Immutable.List(),  fileBoxContent:Immutable.List()},
*/
    {category: 'Title', name: 'Burn In Test (Write)'},
        {category: 'J', name: 'Open-ended BurnIn Write',
            command: '105', dbgfsFile: 'burnin',
            fileBox: ['pattern'], fileBoxContent:Immutable.List()
        },
        {category: 'J', name: 'Pre-defined BurnIn Write(non-Reliable)',
            command: '106', dbgfsFile: 'burnin',
            fileBox: ['pattern'], fileBoxContent:Immutable.List()
        },
        {category: 'J', name: 'Pre-defined BurnIn Write(Reliable)',
            command: '107', dbgfsFile: 'burnin',
            fileBox: ['pattern'], fileBoxContent:Immutable.List()
        },
    {category: 'Title', name: 'Burn In Test (Read, no file)'},
        {category: 'J', name: 'Open-ended BurnIn Read',
            command: '108', dbgfsFile: 'burnin',
            fileBox: ['pattern'], fileBoxContent:Immutable.List()
        },
        {category: 'J', name: 'Pre-defined BurnIn Read(non-Reliable)',
            command: '109', dbgfsFile: 'burnin',
            fileBox: ['pattern'], fileBoxContent:Immutable.List()
        },
        {category: 'J', name: 'Pre-defined BurnIn Read(Reliable)',
            command: '110', dbgfsFile: 'burnin',
            fileBox: ['pattern'], fileBoxContent:Immutable.List()
        },
    {category: 'Title', name: 'RPMB'},
    /*
        {category: 'A', name: 'RPMB Status',
            command: '74', dbgfsFile: 'test'
        },
    */
        {category: 'rpmb_programming_key', name: 'RPMB Programming Key',
            command: '75', dbgfsFile: 'rpmb_programming_key',
            fileBox: ['key'], fileBoxContent:Immutable.List()
        },
        {category: 'rpmb_counter', name: 'RPMB Read Counter Value',
            command: '76', dbgfsFile: 'rpmb_write_counter',
            fileBox: ['key', 'nonce'], fileBoxContent:Immutable.List()
        },       
        //Test
        {category: 'rpmb_write', name: 'RPMB Write Data (256)',
            command: '79', dbgfsFile: 'rpmb_write_data',
            textBox: ['startAddr (hex)', 'count (dec)'],  textBoxContent:Immutable.List(),
            fileBox: ['key', 'data', 'nonce'], fileBoxContent:Immutable.List()
        },
        {category: 'rpmb_write', name: 'RPMB Write Data (512)',
            command: '79', dbgfsFile: 'rpmb_write_data',
            textBox: ['startAddr (hex)', 'count (dec)'],  textBoxContent:Immutable.List(),
            fileBox: ['key', 'data', 'nonce'], fileBoxContent:Immutable.List()
        },
        {category: 'rpmb_write', name: 'RPMB Write Data (8192)',
            command: '79', dbgfsFile: 'rpmb_write_data',
            textBox: ['startAddr (hex)', 'count (dec)'],  textBoxContent:Immutable.List(),
            fileBox: ['key', 'data', 'nonce'], fileBoxContent:Immutable.List()
        },                
        {category: 'rpmb_read', name: 'RPMB Read Data',
            command: '80', dbgfsFile: 'rpmb_read_data',
            textBox: ['startAddr (hex)', 'blockCount (hex)', 'count (dec)'],  textBoxContent:Immutable.List(),
            fileBox: ['key', 'nonce'], fileBoxContent:Immutable.List()
        },
        {category: 'rpmb_configuration_write', name: 'RPMB Device Configuration Write',
            command: '77', dbgfsFile: 'rpmb_configuration_write',
            textBox: ['address (hex)'],  textBoxContent:Immutable.List(),
            fileBox: ['key', 'data', 'nonce'], fileBoxContent:Immutable.List()
        },
        {category: 'rpmb_counter', name: 'RPMB Device Configuration Read',
            command: '78', dbgfsFile: 'rpmb_write_counter',
            fileBox: ['key', 'nonce'], fileBoxContent:Immutable.List()
        }        
]

let _testcaseItem = Immutable.List();
let _processStatus = 'Ready';

const _addTestcase = (testcaseObj) => {
    let date,
        immObj,
        immTimestampObj;

    //console.log(JSON.stringify(testcaseObj));
    date = new Date().valueOf();
    //Deep copy the `testcaseObj`
    immObj = Immutable.Map(testcaseObj);
    //Set the value of deep copy obj
    immTimestampObj = immObj.set('timestamp', date);

    _testcaseItem = _testcaseItem.push(immTimestampObj);
}

const _removeTestcase = (testcaseObj) => {
    let deletedIndex;

    deletedIndex = _testcaseItem.indexOf(testcaseObj);
    _testcaseItem = _testcaseItem.delete(deletedIndex);
};

const _editTestcase = (testcaseObj, boxIndex, editValue, editType) => {
    //console.log('!!!!!!!!!editType!!!!!!!!!!!:', editType);
    let editIndex,
        getTestcaseObj,
        getPreviousBox,
        changedBox,
        immObj;

    //1. Get the testcaseObj which is already stored in the _testcaseItem.
    editIndex = _testcaseItem.indexOf(testcaseObj);
    getTestcaseObj = _testcaseItem.get(editIndex);

    getPreviousBox = getTestcaseObj.get(editType);
    //console.log('getPreviousBox', getPreviousBox);

    if (Immutable.List.isList(getPreviousBox)) {
        //console.log('YYYYYYYYYYY');
        //Y
        changedBox = getPreviousBox.set(boxIndex, editValue);
    } else {
        //N
        //console.log('NNNNNNNNNNN');

        let middle = Immutable.List(getPreviousBox);
        changedBox = middle.set(boxIndex, editValue);
    }

    //2. Get the testcaseObj which is already stored in the _testcaseItem.
    immObj = testcaseObj.set(editType, changedBox);

    //3. Refresh the _testcaseItem
    _testcaseItem = _testcaseItem.set(editIndex, immObj);
    //console.log('_testcaseItem:', _testcaseItem);
}

const _clearTestcase = () => {
   _testcaseItem = _testcaseItem.clear();
}

const _readyStatus = () => {
    _processStatus = 'Ready';
}

const _runningStatus = () => {
    _processStatus = 'Running';
}

const _finishedStatus = (finishedStatus) => {
    _processStatus = finishedStatus;
}

const AppStore = Object.assign(EventEmitter.prototype, {
    emitChange (){
        this.emit( CHANGE_EVENT );
    },
    addChangeListener (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getListTestcase () {
        return _listTestcase;
    },
    getTestcaseItem () {
        return _testcaseItem;
    },
    getProcessStatus () {
        return _processStatus;
    },
    dispatcherIndex: register(function (action) {
        switch (action.actionType) {
            case AppConstants.ADD_ITEM:
                _addTestcase(action.testcase);
            break;
            case AppConstants.REMOVE_ITEM:
                _removeTestcase(action.testcase);
            break;
            case AppConstants.CLEAR_ITEM:
                _clearTestcase();
            break;
            case AppConstants.EDIT_ITEM:
                _editTestcase(action.testcase,
                                action.editIndex,
                                action.editValue,
                                action.editType);
            break;
            case AppConstants.READY_STATUS:
                _readyStatus();
            break;
            case AppConstants.RUNNING_STATUS:
                _runningStatus();
            break;
            case AppConstants.FINISHED_STATUS:
                _finishedStatus(action.finishedStatus);
            break;
        }

        AppStore.emitChange();
    })
});

export default AppStore;
