import React from "react";
import { weekday, zeroPad } from "../../../lib/util.js";
import { Link } from "react-router"
import Tag from '../Tag';

export default class Activities extends React.Component {

  render() {
    const activityNodes = this.props.activities.map((activity) => {
      const distance = activity.getKms();
      const date = activity.getDate();
      const minutes = parseInt(activity.getElapsedTime() / 60);
      const seconds = parseInt(activity.getElapsedTime()) % 60;
      const speed = activity.getSpeed();
      const tags = activity.tags.map((tag) => {
        return (
          <Tag name={tag} key={tag} />
        );
      });

      return (
        <li className="activities__wrap" key={activity._id}>
          <Link to={"/activity/" + encodeURIComponent(activity.activity_id)}>
            <div className="activities__item">
              <div className="activities__values">
                <div className="activities__value">
                  <div className="activities__number">{distance.toFixed(2)}</div>
                  <div className="activities__unit">km</div>
                </div>
                <div className="activities__value">
                  <div className="activities__number">{minutes}:{zeroPad(seconds, 2)}</div>
                  <div className="activities__unit">mm:ss</div>
                </div>
                <div className="activities__value">
                  <div className="activities__number">{speed.toFixed(2)}</div>
                  <div className="activities__unit">km/h</div>
                </div>
              </div>
              <div className="activities__date text-center">
                {date.getHours()}:{zeroPad(date.getMinutes(), 2)} -&nbsp;
                {weekday[date.getDay()]} -&nbsp;
                {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
              </div>
              <div className="activities__tags">
                {tags}
              </div>
            </div>
          </Link>
        </li>
      );
    });
    return (
      <ul className="activities">
        {activityNodes}
      </ul>
    );
  }

}
