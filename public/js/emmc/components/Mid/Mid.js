import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import AppStore from '../../../stores/app-store.js';

import { Input, Col, Row } from 'react-bootstrap';
import RemoveListItem from './Mid-removeListItem.js';
import TextBox from './Mid-editTextBox.js';
import SelectBox from './Mid-editSelectBox.js';
import FileBox from './Mid-editFileBox.js';

import FileTextBox from './Mid-editFileTextBox.js';
import Immutable from 'immutable';

const styles = {
    base: {
        background: '#C0B57A',
        flex: '3 55%',
        order: '2',
        height: '85vh',
        overflowY: 'scroll',
        textAlign: 'left'
    },
    container: {
        display: '-webkit-flex',
        FlexFlow: 'column nowrap'
    },
    items: {
        flexBasis: '3em'
    },
    testDiv: {
      marginTop: '5px'
    }
}

let ReactMixin = InnerComponent => class extends React.Component {
    constructor (props) {
        super(props);
    }
    render () {
        return (
            <div style={{marginTop: '15px'}}>
                <Col md={1} className='removeListItemStyle'>
                    <RemoveListItem {...this.props} />
                </Col>
                <Col md={11}>
                    <InnerComponent {...this.props} />
                </Col>
            </div>
        )
    }
}

//label
class CaseLabelOnly extends React.Component {
    render () {
        return  (
            <Row>
                <Col md={5}>
                    <Input label={this.props.testcase.get('name')} />
                </Col>
            </Row>
        )
    }
}

//label + n*(textBoxDiv)
class CaseTextBoxOnly extends React.Component {
    render () {
        let textBoxDiv = []
        let { testcase } = this.props

        let textBoxCount = testcase.get('textBox').length
        let textBoxDefaultPlaceholder = testcase.get('textBox')

        for (let i = 0; i < textBoxCount; i++) {
            textBoxDiv.push(
                <Col md={3} key={i}>
                    <TextBox
                        content={testcase.get('textBoxContent')[i]}
                        testcase={testcase}
                        placeholder={textBoxDefaultPlaceholder[i]}
                        refIndex={i}
                    />
                </Col>
            );
        }

        return (
            <Row>
                <Col md={4}>
                    <Input label={testcase.get('name')} />
                </Col>
                {textBoxDiv}
            </Row>
        );
    }
}

//label + n*(selectBoxDiv)
class CaseSelectBoxOnly extends React.Component {
    render () {
        let { testcase } = this.props;

        return (
            <Row>
                <Col md={3}>
                    <Input label={testcase.get('name')} />
                </Col>
                <Col md={3}>
                    <SelectBox
                        content={testcase.get('selectBoxContent')[0]}
                        testcase={testcase}
                        refIndex={0}
                    />
                </Col>
            </Row>
        )
    }
}

//label + n*(fileBoxDiv)
//@Radium
class CaseFileBoxOnly extends React.Component {
    render () {
        let fileBoxDiv = []
        let { testcase } = this.props

        for (let i = 0; i < (testcase.get('fileBox').length); i++) {
            fileBoxDiv.push(
                <Col md={4} key={i}>
                    <FileBox
                        refIndex={i}
                        testcase={testcase}
                    />
                </Col>
            )
        }

        return (
            <Row>
                <Col md={4}>
                    <Input label={testcase.get('name')} />
                </Col>
                {fileBoxDiv}
            </Row>
        )
    }
}

//label + n*(fileTextBoxDiv)
class CaseFileTextBoxOnly extends React.Component {
    render () {
        let fileTextBoxDiv = []

        let { testcase } = this.props

        let fileTextBoxCount = testcase.get('fileBox').length

        for (let i = 0; i < fileTextBoxCount; i++) {
            fileTextBoxDiv.push(
                <Col md={4} key={i}>
                    <FileTextBox
                        content={testcase.get('fileBoxContent')[i]}
                        testcase={testcase}
                        refIndex={i}
                    />
                </Col>
            )
        }

        return (
            <Row>
                <Col md={4}>
                    <Input label={testcase.get('name')} />
                </Col>
                {fileTextBoxDiv}
            </Row>
        )
    }
}

//label + n*(textBoxDiv) + n*(fileBoxDiv)
class CaseMixBox extends React.Component {
    render () {
        let labelMdLength = 3
        let textBoxDiv = [],
            fileBoxDiv = []

        let { testcase } = this.props

        let textBoxCount = testcase.get('textBox').length
        if (textBoxCount >=3 ) {
            labelMdLength = 3
        } else {
            labelMdLength = 4
        }
        let textBoxDefaultPlaceholder = testcase.get('textBox')

        for (let i = 0; i < textBoxCount; i++) {
            textBoxDiv.push(
                <Col md={3} key={i}>
                    <TextBox
                        content={testcase.get('textBoxContent')[i]}
                        testcase={testcase}
                        placeholder={textBoxDefaultPlaceholder[i]}
                        refIndex={i}
                    />
                </Col>
            );
        }

        let fileBoxCount = testcase.get('fileBox').length;

        for (let i = 0; i < fileBoxCount; i++) {
            fileBoxDiv.push(
                <Col md={4} key={i}>
                    <FileBox
                        testcase={testcase}
                        refIndex={i}
                    />
                </Col>
            )
        }

        return (
            <div>
                <Row>
                    <Col md={labelMdLength}>
                        <Input label={testcase.get('name')} />
                    </Col>
                    {textBoxDiv}
                </Row>
                <Row>
                    {fileBoxDiv}
                </Row>
            </div>
        )
    }
}

//label + n*(textBoxDiv) + n*(fileBoxDiv)
//@Radium
class CaseMixBoxLoad extends React.Component {
    render () {
        let textBoxDiv = [],
            fileBoxDiv = []

        let { testcase } = this.props

        let textBoxCount = testcase.get('textBox').length
        let textBoxDefaultPlaceholder = testcase.get('textBox')

        for (let i = 0; i < textBoxCount; i++) {
            textBoxDiv.push(
                <Col md={2} key={i}>
                    <TextBox
                        content={testcase.get('textBoxContent')[i]}
                        testcase={testcase}
                        placeholder={textBoxDefaultPlaceholder[i]}
                        refIndex={i}
                    />
                </Col>
            );
        }

        let fileBoxCount = testcase.get('fileBox').length;

        for (let i = 0; i < fileBoxCount; i++) {
            fileBoxDiv.push(
                <Col md={3} key={i}>
                    <FileTextBox
                        content={testcase.get('fileBoxContent')[i]}
                        testcase={testcase}
                        refIndex={i}
                    />
                </Col>
            );
        }

        return (
            <div>
                <Row>
                    <Col md={5}>
                        <Input label={testcase.get('name')} />
                    </Col>
                    {textBoxDiv}
                </Row>
                <Row>
                    {fileBoxDiv}
                </Row>
            </div>
        )
    }
}

let MCaseLabelOnly = ReactMixin(CaseLabelOnly),
    MCaseTextBoxOnly = ReactMixin(CaseTextBoxOnly),
    MCaseSelectBoxOnly = ReactMixin(CaseSelectBoxOnly),
    MCaseFileBoxOnly = ReactMixin(CaseFileBoxOnly),
    MCaseFileTextBoxOnly = ReactMixin(CaseFileTextBoxOnly),
    MCaseMixBox = ReactMixin(CaseMixBox),
    MCaseMixBoxLoad = ReactMixin(CaseMixBoxLoad);


function testcaseItem () {
    return { items: AppStore.getTestcaseItem() };
}

@Radium
export default class Mid extends React.Component {
    constructor () {
        super();
        this.state = testcaseItem();
    }
    componentWillMount () {
        AppStore.addChangeListener(this._onChange.bind(this));
    }
    _onChange () {
        this.setState(testcaseItem());
    }
    selectItemForm (item) {
        let textBox = item.get('textBox'),
            fileBox = item.get('fileBox'),
            selectBox = item.get('selectBox');

        let strategies = {
            'labelOnly': (item) => {
                return <MCaseLabelOnly
                            key={item.get('timestamp')}
                            testcase={item} />
            },
            'textBoxOnly': (item) => {
                //console.log('TextBoxOnly');
                return <MCaseTextBoxOnly
                            key={item.get('timestamp')}
                            testcase={item} />
            },
            'selectBoxOnly': (item) => {
                //console.log('TextBoxOnly');
                return <MCaseSelectBoxOnly
                            key={item.get('timestamp')}
                            testcase={item} />
            },
            'fileBoxOnly': (item) => {
                return <MCaseFileBoxOnly
                            key={item.get('timestamp')}
                            testcase={item} />
            },
            'mixBox': (item) => {
                //console.log('MixBox');
                return <MCaseMixBox
                            key={item.get('timestamp')}
                            testcase={item} />
            },
            'fileTextBox': (item) => {
                return <MCaseFileTextBoxOnly
                            key={item.get('timestamp')}
                            testcase={item} />
            },
            'mixBoxLoad': (item) => {
                return <MCaseMixBoxLoad
                            key={item.get('timestamp')}
                            testcase={item} />;
            }
        };

        if (typeof textBox === 'undefined' &&
                typeof fileBox === 'undefined' &&
                typeof selectBox === 'undefined') {
            return strategies['labelOnly'](item);
        }

        if (typeof selectBox !== 'undefined' ) {
            return strategies['selectBoxOnly'](item);
        }


        if (typeof fileBox === 'undefined' ) {
            return strategies['textBoxOnly'](item);
        }

        if (typeof textBox === 'undefined' ) {
            let isImmList = Immutable.List.isList( item.get('fileBoxContent'));

            if (isImmList) {
                return strategies['fileBoxOnly'](item)
            } else {
                return strategies['fileTextBox'](item)
            }
        }

        if ( Immutable.List.isList( item.get('fileBoxContent')) ) {
            //console.log ('mixBox mixBox mixBox');
            return strategies['mixBox'](item)
        } else {
            //console.log ('mixBoxLoad mixBoxLoad mixBoxLoad');
            return strategies['mixBoxLoad'](item)
        }

    }
    render () {
        let self = this;

        return (
            <div style={[styles.base]}>
                <div style={[styles.container]}>
                    {this.state.items.map( item => self.selectItemForm(item) )}
                </div>
            </div>
        )
    }
}
