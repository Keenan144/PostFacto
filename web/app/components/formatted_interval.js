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

class FormattedInterval extends React.Component {

  static propTypes = {
    secondsRemaining: React.PropTypes.number.isRequired
  }

  formatInterval = () => {
    const {secondsRemaining} = this.props;
    let roundedSeconds = secondsRemaining|0;
    if (roundedSeconds < 0) {
      roundedSeconds = 0;
    }
    let minutes = (roundedSeconds / 60)|0;
    let seconds = roundedSeconds % 60;
    let stringSeconds = seconds+'';
    return minutes + ':' + '00'.substr(stringSeconds.length) + stringSeconds;
  };

  render = () => {
    return (
      <div className="formatted-interval">{this.formatInterval()}</div>
    );
  }
}

module.exports = FormattedInterval;