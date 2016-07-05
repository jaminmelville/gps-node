class Filters extends React.Component {

  constructor (props, context) {
    super(props, context)
    var includeTags = JSON.parse(localStorage.getItem('includeTags'))
    var excludeTags = JSON.parse(localStorage.getItem('excludeTags'))
    this.params = {
      start: new Date(this.localStorage('startDate', '2016-01-01')).getTime() / 1000,
      end: new Date(this.localStorage('endDate', '2016-12-31')).getTime() / 1000,
      includeTags: includeTags ? includeTags : [],
      excludeTags: excludeTags ? excludeTags : [],
      min: parseInt(this.localStorage('minDistance', '0')),
      max: parseInt(this.localStorage('maxDistance', '43000'))
    }
    this.updateList = this.updateList.bind(this)
    this.createTags = this.createTags.bind(this)
    this.onStartDateChange = this.onStartDateChange.bind(this)
    this.onEndDateChange = this.onEndDateChange.bind(this)
  }

  localStorage(key, defaultValue) {
    var value = localStorage.getItem(key) ? localStorage.getItem(key) : defaultValue
    localStorage.setItem(key, value)
    return value
  }

  onStartDateChange(event) {
    localStorage.setItem('startDate', event.target.value)
    this.params.start = new Date(event.target.value).getTime() / 1000
  }

  onEndDateChange(event) {
    localStorage.setItem('endDate', event.target.value)
    this.params.end = new Date(event.target.value).getTime() / 1000
  }

  updateList() {
    this.params.min = $('#minSlider').val()
    localStorage.setItem('minDistance', this.params.min)
    this.params.max = $('#maxSlider').val()
    localStorage.setItem('maxDistance', this.params.max)
    this.props.onChange(this.params)
  }

  componentDidMount() {
    this.updateList()
    $('#filters-reveal').on('open.zf.reveal', () => {
      setTimeout(() => {
        new Foundation.Slider($('.filters .slider'), {
          initialStart: this.params.min,
          initialEnd: this.params.max,
          end: 43000
        })
      }, 1000)
    })
    $('#filters-reveal').on('closed.zf.reveal', () => {
      this.updateList()
      $('.filters .slider').foundation('destroy')
    })
    $('#filters-reveal [data-close]').on('click', () => {
      $('#filters-reveal').foundation('close')
    })
  }

  createTags(tagType, title) {
    var createdTags = this.props.tags.map((tag, key) => {
      var tags = this.params[tagType]
      var onTagChange = () => {
        if (tags.indexOf(tag.id) > -1) {
          tags.splice(tags.indexOf(tag.id), 1)
        }
        else {
          tags.push(tag.id)
        }
        localStorage.setItem(tagType, JSON.stringify(tags))
        this.params[tagType] = tags
      }

      var checked = tags.indexOf(parseInt(tag.id)) > -1
      return (
        <div className='columns large-4 medium-6 small-6' key={key}>
          <span className="switch tiny">
            <input className="switch-input" id={tagType + tag.name} type="checkbox" name={tagType + tag.name} onChange={onTagChange} defaultChecked={checked} />
            <label className="switch-paddle" htmlFor={tagType + tag.name}></label>
          </span>
          <span className="filters__tag-name">{tag.name}</span>
        </div>
      )
    })
    return (
      <div className='columns large-6 medium-6 small-12'>
        <h5>{title}</h5>
        <div className='row'>
          {createdTags}
        </div>
      </div>
    )
  }

  render() {
    var start = localStorage.getItem('startDate')
    var end = localStorage.getItem('endDate')
    return (
      <div id='filters-reveal' className='filters reveal large' data-reveal data-animation-in="fade-in" data-animation-out="fade-out" >
        <button className="close-button" type="button" data-close aria-label="Close reveal">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4>Date range</h4>
        <div className="filters__date row">
          <div className="columns large-6 medium-6 small-12">
            Start Date: <input type="date" onChange={this.onStartDateChange} defaultValue={start} />
          </div>
          <div className="columns large-6 medium-6 small-12">
            End Date: <input type="date" onChange={this.onEndDateChange} defaultValue={end} />
          </div>
        </div>
        <h4>Distance range</h4>
        <div className='row'>
          <div className='columns small-6'>
            min: <input id='minSlider' defaultValue={this.params.min} type="number" />
          </div>
          <div className='columns small-6'>
            max: <input id='maxSlider' defaultValue={this.params.max} type="number" />
          </div>
        </div>
        <div className="slider">
          <span className="slider-handle" data-slider-handle role="slider" tabIndex="1" aria-controls="minSlider"></span>
          <span className="slider-fill" data-slider-fill></span>
          <span className="slider-handle" data-slider-handle role="slider" tabIndex="1" aria-controls="maxSlider"></span>
        </div>
        <h4>Tags</h4>
        <div>
          {this.createTags('includeTags', 'Include')}
          {this.createTags('excludeTags', 'Exclude')}
        </div>
      </div>
    )
  }

}
