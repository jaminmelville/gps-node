class Tags extends React.Component {

  constructor(props, context) {
    super(props, context)
    var tags = props.tags
    tags.forEach((tag) => {
      tag.checked = false
      props.activity.tags.forEach((activity_tag) => {
        if (tag.id == activity_tag.tag_id) {
          tag.checked = true
        }
      })
    })
    this.state = {tags: tags}
  }

  render() {
    var tagNodes = this.state.tags.map((tag, index) => {
      var onClick = () => {
        var tags = this.state.tags
        tag.checked = !tag.checked
        this.setState({tags: tags}, () => {
          if (tag.checked) {
            $.post('/api/tag/add', {activity_id:this.props.activity.id, tag_id:tag.id})
          }
          else {
            $.post('/api/tag/remove', {activity_id:this.props.activity.id, tag_id:tag.id})
          }
        })
      }

      return (
        <div className='columns large-2 medium-3 small-6 tags__item'  key={index}>
          <span className="switch tiny">
            <input className="switch-input" id={'tag-' + tag.name} type="checkbox" name={'tag-' + tag.name} onChange={onClick} defaultChecked={tag.checked} />
            <label className="switch-paddle" htmlFor={'tag-' + tag.name}></label>
          </span>
          <span className="filters__tag-name">{tag.name}</span>
        </div>
      )
    })
    return (
      <div className="row tags">
        {tagNodes}
      </div>
    )
  }
}
