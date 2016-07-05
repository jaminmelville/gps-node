class Options extends React.Component {

  render() {
    var options = this.props.options.map((option, key) => {
      var onClick = () => {
        option.onClick(option.value)
      }
      return (
        <a key={key} className='button hollow tiny' onClick={onClick}>{option.name}</a>
      )
    })
    return (
      <div className='options small'>
        {options}
      </div>
    )
  }

}
