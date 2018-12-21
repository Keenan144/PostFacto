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
const SessionCable = require('./session_cable');

class SessionWebsocket extends React.Component {
  static propTypes = {
    url: types.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {cable: null};
  }

  componentDidMount() {
    this.initialize(this.props);
  }
  
  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  }
  
  initialize(props) {
    const {cable} = this.state;
    const {url} = props;
    if (!cable) {
      this.createCable(url);
    }
  }

  createCable(url) {
    const ActionCable = require('actioncable');
    let cable = ActionCable.createConsumer(url);
    this.setState({cable: cable});
  }

  renderCable() {
    const {cable} = this.state;
    if (cable) {
      return <SessionCable cable={cable}/>;
    }
    return null;
  }

  render() {
    return(
      this.renderCable()
    );
  }
}

module.exports = SessionWebsocket;
