/*
 * Postfacto, a free, open-source and self-hosted retro tool aimed at helping
 * remote teams.
 *
 * Copyright (C) 2016 - Present Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 *
 * it under the terms of the GNU Affero General Public License as
 *
 * published by the Free Software Foundation, either version 3 of the
 *
 * License, or (at your option) any later version.
 *
 *
 *
 * This program is distributed in the hope that it will be useful,
 *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *
 * GNU Affero General Public License for more details.
 *
 *
 *
 * You should have received a copy of the GNU Affero General Public License
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const React = require('react');
const types = React.PropTypes;
const {Actions} = require('p-flux');
const FormattedInterval = require('./formatted_interval');

class CountdownTimer extends React.Component {
  static propTypes = {
    retroId: types.string.isRequired,
    endTimestampInMs: types.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      remainingTimeInMs: 0,
      interval: null
    };
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillReceiveProps() {
    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  getCurrentTimestampInMs = () => {
    return Date.now();
  };

  startTimer = () => {
    clearInterval(this.state.interval);
    this.setState({
      interval: setInterval(this.updateRemainingTime, 500),
      remainingTimeInMs: this.getRemainingTimeInMs()
    });
  };

  getRemainingTimeInMs = () => {
    return Math.max(this.props.endTimestampInMs - this.getCurrentTimestampInMs(), 0);
  };

  updateRemainingTime = () => {
    let remainingTimeInMs = this.getRemainingTimeInMs();
    this.setState({remainingTimeInMs: remainingTimeInMs});
    if (remainingTimeInMs <= 0) {
      clearInterval(this.state.interval);
    }
  };

  onExtendTimerClicked(event) {
    const {retroId} = this.props;
    Actions.extendTimer({retro_id: retroId});
    event.stopPropagation();
  }

  renderTimerInformation() {
    if (this.state.remainingTimeInMs <= 0) {
      return (
        <div>
          <div className="retro-item-timer">
            <div className="retro-item-timer-extend"
                 onClick={this.onExtendTimerClicked.bind(this)}>
              <span className="item-times-up">{"Time's Up!"}</span>
              <br />
              +2 more minutes
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="retro-item-timer">
        <div className="retro-item-timer-clock"><FormattedInterval secondsRemaining={this.state.remainingTimeInMs/1000} /></div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderTimerInformation()}
      </div>
    );
  }
}
module.exports = CountdownTimer;
