import React from 'react';

export default function Section(props) {
  return (
    <section className="section" id={props.title.toLowerCase()}>
      <h3 className="section__title">{props.title}</h3>
      <div className="section__content">
        {props.children}
      </div>
    </section>
  );
}
