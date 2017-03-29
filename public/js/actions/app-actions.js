import AppConstants from '../constants/app-constants.js';
import { dispatch, register } from '../dispatchers/app-dispatcher.js';

export default {
	addItem (testcase) {
		dispatch ({
			actionType: AppConstants.ADD_ITEM, testcase
		});
	},
	removeItem (testcase) {
		dispatch ({
			actionType: AppConstants.REMOVE_ITEM, testcase
		});
	},
	clearItem () {
		dispatch ({
			actionType: AppConstants.CLEAR_ITEM
		});
	},
	editItem (testcase, editIndex, editValue, editType) {
		dispatch ({
			actionType: AppConstants.EDIT_ITEM, testcase, editIndex, editValue, editType
		});
	},
	readyStatus() {
		dispatch ({
			actionType: AppConstants.READY_STATUS
		});		
	},
	runningStatus () {
		dispatch ({
			actionType: AppConstants.RUNNING_STATUS
		});		
	},
	finishedStatus (finishedStatus) {
		dispatch ({
			actionType: AppConstants.FINISHED_STATUS, finishedStatus
		});				
	},
	socketConnct (url) {
		dispatch ({
			actionType: AppConstants.SOCKET_CONNECT, url
		});
	},
	addResult (result) {
		dispatch ({
			actionType: AppConstants.ADD_RESULT, result
		});		
	},
	clearResult () {
		dispatch ({
			actionType: AppConstants.CLEAR_RESULT
		});		
	}
}