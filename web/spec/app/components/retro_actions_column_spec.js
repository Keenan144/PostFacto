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

const RetroActionsColumn = require('../../../app/components/retro_actions_column');
const retroId = 'retro-slug-123';
const retro = {
  id: 123,
  name: 'the retro name',
  video_link: 'http://the/video/link',
  items: [
    {
      id: 1,
      description: 'the happy retro item',
      category: 'happy',
      created_at: '2016-08-18T12:00:00.000Z',
      vote_count: 10
    }
  ],
  action_items: [
    {
      id: 1,
      description: 'action item 1',
      done: true,
      created_at: '2016-08-18T12:01:00.000Z',
    },
    {
      id: 2,
      description: 'action item 2',
      done: false,
      created_at: '2016-08-18T12:02:00.000Z',
    },
    {
      id: 3,
      description: 'action item 3',
      done: false,
      created_at: '2016-08-11T12:03:00.000Z',
    },
    {
      id: 4,
      description: 'action item 4',
      done: false,
      created_at: '2016-08-10T12:04:00.000Z',
    },
    {
      id: 5,
      description: 'action item 5',
      done: false,
      created_at: '2016-07-15T12:05:00.000Z',
    },
    {
      id: 6,
      description: 'action item 6',
      done: false,
      created_at: '2016-07-15T12:06:00.000Z',
    },
    {
      id: 7,
      description: 'action item 7',
      done: false,
      created_at: '2016-07-01T12:07:00.000Z',
    },
  ]
};

describe('RetroActionsColumn Current', () => {
  beforeEach(() => {
    jasmine.clock().mockDate(new Date(2016, 7, 18));
    ReactDOM.render(<RetroActionsColumn retroId={retroId} retro={retro} category="current"/>, root);
  });

  describe('column header', () => {
    it('Has the correct date displayed', () => {
      expect('.retro-action-list-header').toContainText('Today (August 18)');
    });
  });

  describe('when retro has action items', () => {
    it('should render current items in descending order', () => {
      expect($('.retro-action .action-text').length).toEqual(2);
      expect($('.retro-action .action-text')[0].innerHTML).toEqual('action item 2');
      expect($('.retro-action .action-text')[1].innerHTML).toEqual('action item 1');
    });
  });
});

describe('RetroActionsColumn last-week', () => {
  beforeEach(() => {
    jasmine.clock().mockDate(new Date(2016, 7, 18));
  });

  describe('when having multiple action items from different dates', () => {
    beforeEach(() => {
      ReactDOM.render(<RetroActionsColumn retroId={retroId} retro={retro} category="last-week"/>, root);
    });

    it('has the correct date displayed', () => {
      expect('.retro-action-list-header').toContainText('August 11');
    });

    it('should render each item', () => {
      expect($('.retro-action').length).toEqual(1);
    });
  });

  describe('when all action items on the same day', () => {
    let retro_without_older = {
      id: 123,
      name: 'the retro name',
      video_link: 'http://the/video/link',
      items: [
        {
          id: 1,
          description: 'the happy retro item',
          category: 'happy',
          created_at: '2016-08-18T12:00:00.000Z',
          vote_count: 10
        }
      ],
      action_items: [
        {
          id: 1,
          description: 'action item 1',
          done: true,
          created_at: '2016-08-18T12:00:00.000Z',
        },
        {
          id: 2,
          description: 'action item 2',
          done: false,
          created_at: '2016-08-18T12:00:00.000Z',
        },
      ]
    };

    beforeEach(() => {
      jasmine.clock().mockDate(new Date(2016, 7, 18));
      ReactDOM.render(<RetroActionsColumn retroId={retroId} retro={retro_without_older} category="last-week"/>, root);
    });

    it('should render no items', () => {
      expect($('.retro-action').length).toEqual(0);
    });
  });
});

describe('RetroActionsColumn older', () => {
  beforeEach(() => {
    jasmine.clock().mockDate(new Date(2016, 7, 18));
    ReactDOM.render(<RetroActionsColumn retroId={retroId} retro={retro} category="older"/>, root);
  });

  describe('column header', () => {
    it('Has the correct date displayed', () => {
      expect('.retro-action-list-header').toContainText('Older');
    });
  });

  describe('when retro has action items', () => {
    it('should render each item', () => {
      expect($('.retro-action').length).toEqual(4);
    });
  });
});


describe('RetroActionsColumn Current Archive', () => {
  beforeEach(() => {
    jasmine.clock().mockDate(new Date(2016, 7, 18));
    ReactDOM.render(<RetroActionsColumn retroId={retroId} retro={retro} category="current" archives={true}/>, root);
  });

  describe('column header', () => {
    it('Has the correct title displayed', () => {
      expect('.retro-action-list-header').toContainText('Completed action items');
    });
    it('should not have a delete or input', () => {
      expect('.action-delete').toHaveLength(0);
    });
  });
});

describe('RetroActionsColumn last-week Archive', () => {
  beforeEach(() => {
    jasmine.clock().mockDate(new Date(2016, 7, 18));
    ReactDOM.render(<RetroActionsColumn retroId={retroId} retro={retro} category="last-week" archives={true}/>, root);
  });

  it('is empty', () => {
    expect($('.retro-action').length).toEqual(0);
  });
});
