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

require('../spec_helper');

describe('RetroCable', () => {
  const RetroCable = require('../../../app/components/retro_cable');

  describe('rendering a RetroCable', () => {
    let retroCableDOM;
    beforeEach(() => {
      const ActionCable = require('actioncable');
      const cable = ActionCable.createConsumer('wss://websocket/url');
      retroCableDOM = ReactDOM.render(<RetroCable cable={cable} retro_id={'retro-slug-123'}/>, root);
    });

    it('should subscribe to the channels', () => {
      const {subscription} = retroCableDOM.state;
      const subscriptionJson = JSON.parse(subscription.identifier);
      expect(subscriptionJson.channel).toEqual('RetrosChannel');
      expect(subscriptionJson.retro_id).toEqual('retro-slug-123');
    });
    
    it('should dispatch updating the store on receiving data', () => {
      let websocketData = {
        retro: {
          id: 1,
          name: 'retro name',
          items: [
            {
              id: 2,
              description: 'item 1',
              vote_count: 1
            },
            {
              id: 3,
              description: 'item 3',
              vote_count: 2
            },
          ]
        }
      };
      retroCableDOM.onReceived(websocketData);
      expect('websocketRetroDataReceived').toHaveBeenDispatchedWith({type: 'websocketRetroDataReceived', data: websocketData});
    });
  });
});
