class Activity extends React.Component {

  componentDidMount() {
    $('body').perfectScrollbar()
  }

  render() {
    var sections = [
      <Section title='Stats' key='1'>
        <Stats activity={activity}/>
      </Section>,
      <Section title='Tags' key='2'>
        <Tags tags={tags} activity={activity}/>
      </Section>
    ]
    // The following sections are only available if it's a gps activity.
    if (records.length) {
      sections.push(
        <Section title='Chart' key='3'>
          <Chart/>
        </Section>,
        <Section title='Map' key='4'>
          <Map/>
        </Section>,
        <Section title='Laps' key='5'>
          <Laps records={records}/>
        </Section>,
        <Section title='Notes' key='6'>
          <Notes note={note}/>
        </Section>
      )
    }
    return (
      <div className='activity'>
        {sections}
      </div>
    )
  }

}

ReactDOM.render(
  <Activity />,
  $('#activity')[0]
)
