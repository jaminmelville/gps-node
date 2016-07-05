class Section extends React.Component {

  render() {
    return (
      <section className='section' id={this.props.title.toLowerCase()} data-magellan-target={this.props.title.toLowerCase()}>
        <h3 className='section__title'>{this.props.title}</h3>
        <div className='section__content'>
          {this.props.children}
        </div>
      </section>
    )
  }

}
