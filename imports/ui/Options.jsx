import React from 'react';

export default class Options extends React.Component {

  render() {
    const options = this.props.options.map((option, key) => {
      const onClick = () => {
        option.onClick(option.value);
      };
      return (
        <a key={key} className="options__option" onClick={onClick}>{option.name}</a>
      );
    });
    return (
      <div className="options">
        {options}
      </div>
    );
  }

}

Options.propTypes = {
  options: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};
