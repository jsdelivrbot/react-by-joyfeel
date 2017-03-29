import React from 'react';
import Radium from 'radium';

const styles = {
  base: {
    fontSize: 16,
    backgroundColor: "#0074d9",
    color: "#fff",
    border: 0,
    borderRadius: "0.3em",
    padding: "0.4em 1em",
    cursor: "pointer",
    outline: "none",
    width: "220px",

    '@media (min-width: 992px)': {
      padding: "0.6em 1.2em"
    },

    '@media (min-width: 1200px)': {
      padding: "0.8em 1.5em"
    },

    ':hover': {
      backgroundColor: "#0088FF"
    },

    ':focus': {
      backgroundColor: "#0088FF"
    },
    ':active': {
      backgroundColor: "#005299",
      transform: "translateY(2px)",
    }
  }
};

@Radium
export default class TestcaseComponent extends React.Component {
    constructor (props) {
        super(props);
    }
    render (props) {
        return <li style={[styles.base]}>{this.props.content}</li>
    }
}

TestcaseComponent.propTypes = {
    content: React.PropTypes.string.isRequired
};