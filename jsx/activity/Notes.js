class Notes extends React.Component {

  constructor (props, context) {
    super(props, context)
    this.timeout = 0,
    this.state = {text: props.note.note}
    this.onChange = this.onChange.bind(this)
  }

  onChange(event) {
    var text = event.target.value
    $('.notes').addClass('notes--busy')
    this.setState({text: text}, () => {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        $.post('/api/note/update', {id:this.props.note.id, text: text})
        $('.notes').removeClass('notes--busy')
      }, 1000)
    })
  }

  render() {
    return (
      <textarea className='notes' onChange={this.onChange} value={this.state.text} />
    )
  }

}
