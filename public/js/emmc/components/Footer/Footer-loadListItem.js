import React from 'react'
import AppActions from '../../../actions/app-actions.js'
import Immutable from 'immutable'

export default class LoadListItem extends React.Component {
  constructor () {
    super()
    this.handleLoadFile = this.handleLoadFile.bind(this)
  }
  setupReader(file) {
    let reader = new FileReader()

    // (1) get the file
    reader.readAsText(file, 'UTF-8')
    // (2) when load(get) the file 
    reader.onload = (e) => {
      let htmlCollection = e.target.result,
          jsonData = JSON.parse(htmlCollection)

      jsonData.forEach(testcase => {
        let immObj = Immutable.Map(testcase)

        AppActions.addItem(immObj)
      })

    }    
  }
  handleLoadFile (e) {
    let file = e.target.files
    for (let i = 0; i < file.length; i++) {
      this.setupReader(file[i])
    }

    this.refs.loadFile.value = ''
  }
  render () {
    return <input type="file" multiple="true" onChange={this.handleLoadFile} ref="loadFile" />
  }
}