class Home extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      activities: false
    }
    this.onChange = this.onChange.bind(this)
    this.fetchNewActivities = this.fetchNewActivities.bind(this)
    this.socket = io.connect()
    this.socket.on('attach', this.fetchNewActivities)
    this.fetchNewActivities()
  }

  fetchNewActivities() {
    $.get('/api/new-activities', (activities) => {
      if (activities.length) {
        this.setState({newActivities: activities})
      }
    })
  }

  onChange(params) {
    $.post('/api/activities', params, (activities) => {
      this.setState({activities: activities})
    })
  }

  onThemeChange(theme) {
    setCookie('theme', theme, 365)
    window.location.reload()
  }

  componentDidMount() {
    $(document).foundation()
    $('body').perfectScrollbar()
  }

  render() {
    var newActivities = ''
    if (this.state.newActivities) {
      newActivities = (
        <Section title='New'>
          <Activities activities={this.state.newActivities}/>
        </Section>
      )
    }

    if (this.state.activities) {
      var sections = (
        <div>
          <Section title='Stats'>
            <Stats activities={this.state.activities}/>
          </Section>
          <Section title='Chart'>
            <Chart activities={this.state.activities}/>
          </Section>
          {newActivities}
          <Section title='Activities'>
            <Activities activities={this.state.activities}/>
          </Section>
        </div>
      )
    }
    else {
      var sections = 'loading...'
    }
    var options = [
      {name: 'Pink', value: 'pink', onClick: this.onThemeChange},
      {name: 'Green', value: 'green', onClick: this.onThemeChange},
      {name: 'Blue', value: 'blue', onClick: this.onThemeChange}
    ]
    return (
      <div className='home'>
        <Filters tags={tags} onChange={this.onChange} />
        {sections}
        <Options options={options}/>
      </div>
    )
  }

}


ReactDOM.render(
  <Home />,
  $('#home')[0]
)
