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

describe('MainDispatcher', () => {
  let subject, Cursor, cursorSpy, retro, retro_archives, router;

  beforeEach(() => {
    Cursor = require('pui-cursor');
    cursorSpy = jasmine.createSpy('callback');
    subject = Dispatcher;

    //dispatch is spied on in spec_helper
    subject.dispatch.and.callThrough();

    //prevent console logs
    spyOn(subject, 'onDispatch');

    router = {
      navigate: function () {
      }
    };
    subject.router = router;
    spyOn(router, 'navigate');

    retro = {
      id: 1,
      name: 'retro name',
      slug: 'retro-name',
      items: [
        {
          id: 2,
          description: 'item 1',
          category: 'happy',
          vote_count: 1,
          done: false
        },
        {
          id: 3,
          description: 'item 3',
          category: 'happy',
          vote_count: 2,
          done: true
        }
      ],
      action_items: [
        {
          id: 1,
          description: 'action item 1',
          done: false
        },
        {
          id: 2,
          description: 'action item 2',
          done: true
        }
      ]
    };

    retro_archives = {
      id: 1,
      name: 'retro name',
      items: [
        {
          id: 2,
          description: 'item 1',
          vote_count: 1,
          done: false,
          archived_at: '2016-07-18T00:00:00.000Z'
        },
        {
          id: 3,
          description: 'item 3',
          vote_count: 2,
          done: true,
          archived_at: '2016-07-20T00:00:00.000Z'
        }
      ],
      action_items: [
        {
          id: 1,
          description: 'archived item 1',
          archived_at: '2016-07-18T00:00:00.000Z'
        },
        {
          id: 2,
          description: 'archived item 2',
          archived_at: '2016-07-20T00:00:00.000Z'
        }
      ]
    };
  });

  describe('setRoute', () => {
    it('calls the router navigate', () => {
      subject.dispatch({type: 'setRoute', data: '/url/path'});
      expect(router.navigate.calls.count()).toEqual(1);
      expect(router.navigate.calls.argsFor(0)).toEqual(['/url/path']);
    });
  });

  describe('retroSuccessfullyCreated', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'retroSuccessfullyCreated', data: {retro: retro}});
    });

    it('redirects to the new retro page', () => {
      expect('setRoute').toHaveBeenDispatchedWith({type: 'setRoute', data: `/retros/${retro.slug}`});
    });

    it('dispatches created retro analytic', () => {
      expect('createdRetroAnalytics').toHaveBeenDispatchedWith({
        type: 'createdRetroAnalytics',
        data: {retroId: retro.id}
      });
    });

    it('empties the error messages', () => {
      expect(cursorSpy).toHaveBeenCalledWith({ errors: {} });
    });
  });

  describe('retroUnsuccessfullyCreated', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
    });

    it('updates the error messages', () => {
      subject.dispatch({
        type: 'retroUnsuccessfullyCreated',
        data: {
          errors: ['Sorry! That URL is already taken.']
        }
      });

      expect(cursorSpy).toHaveBeenCalledWith({
        errors: ['Sorry! That URL is already taken.']
      });
    });
  });

  describe('retroSuccessfullyFetched', () => {
    beforeEach(() => {
      subject.$store = new Cursor({retro: {name: ''}}, cursorSpy);
    });

    it('updates the retro', () => {
      subject.dispatch({type: 'retroSuccessfullyFetched', data: {retro: {name: 'The Retro Name'}}});
      expect(cursorSpy).toHaveBeenCalledWith({retro: {name: 'The Retro Name'}});
    });

    it('dispatches visited retro analytic', () => {
      subject.dispatch({type: 'retroSuccessfullyFetched', data: {retro: retro}});
      expect('visitedRetroAnalytics').toHaveBeenDispatchedWith({
        type: 'visitedRetroAnalytics',
        data: {retroId: retro.id}
      });
    });
  });

  describe('retrosSuccessfullyFetched', () => {
    beforeEach(() => {
      subject.$store = new Cursor({retros: []}, cursorSpy);
    });

    it('updates the retros', () => {
      let data = {retros: [{name: 'The Retro Name', slug: 'the-retro-123'}]};

      subject.dispatch({type: 'retrosSuccessfullyFetched', data: data});
      expect(cursorSpy).toHaveBeenCalledWith(data);
    });
  });

  describe('getRetroSettingsSuccessfullyReceived', () => {
    beforeEach(() => {
      subject.$store = new Cursor({retro: {name: ''}}, cursorSpy);
    });

    it('updates the retro', () => {
      let data = {retro: {name: 'The Retro Name', slug: 'the-retro-123'}};

      subject.dispatch({type: 'getRetroSettingsSuccessfullyReceived', data: data});
      expect(cursorSpy).toHaveBeenCalledWith(data);
    });
  });

  describe('getRetroLoginSuccessfullyReceived', () => {
    beforeEach(() => {
      subject.$store = new Cursor({retro: {name: ''}}, cursorSpy);
    });

    it('updates the retro name', () => {
      subject.dispatch({type: 'retroSuccessfullyFetched', data: {retro: {name: 'The Retro Name'}}});
      expect(cursorSpy).toHaveBeenCalledWith({retro: {name: 'The Retro Name'}});
    });
  });

  describe('retroSettingsSuccessfullyUpdated', () => {
    beforeEach(() => {
      subject.$store = new Cursor({
          retro: {
            name: 'old retro name',
            slug: 'old-retro-slug'
          }
        },
        cursorSpy);

      subject.dispatch({
        type: 'retroSettingsSuccessfullyUpdated',
        data: {
          retro: {
            name: 'new retro name',
            slug: 'new-retro-slug'
          }
        }
      });
    });

    it('updates the retro slug and name, and clears the error message', () => {
      expect(cursorSpy).toHaveBeenCalledWith({
        retro: {
          name: 'new retro name',
          slug: 'new-retro-slug'
        },
        errors: {}
      });
    });

    it('redirects to the retro page url with the new slug', () => {
      expect(router.navigate.calls.count()).toEqual(1);
      expect(router.navigate.calls.argsFor(0)).toEqual(['/retros/new-retro-slug']);
    });
  });

  describe('retroSettingsUnsuccessfullyUpdated', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);

      subject.dispatch({
        type: 'retroSettingsUnsuccessfullyUpdated',
        data: {
          errors: ['Sorry! That URL is already taken.']
        }
      });
    });

    it('updates the error messages', () => {
      expect(cursorSpy).toHaveBeenCalledWith({
        errors: ['Sorry! That URL is already taken.']
      });
    });
  });

  describe('requireRetroLogin', () => {
    it('dispatches a set Route', () => {
      subject.dispatch({type: 'requireRetroLogin', data: {retro_id: 1}});
      expect('setRoute').toHaveBeenDispatchedWith({
        type: 'setRoute',
        data: '/retros/1/login'
      });
    });
  });

  describe('requireRetroRelogin', () => {
    it('dispatches a set Route', () => {
      subject.dispatch({type: 'requireRetroRelogin', data: {retro: {slug: 'retro-slug-1'}}});
      expect('setRoute').toHaveBeenDispatchedWith({
        type: 'setRoute',
        data: '/retros/retro-slug-1/relogin'
      });
    });
  });

  describe('redirectToRetroCreatePage', () => {
    it('dispatches a set Route to new retro page', () => {
      subject.dispatch({type: 'redirectToRetroCreatePage'});
      expect('setRoute').toHaveBeenDispatchedWith({
        type: 'setRoute',
        data: '/retros/new'
      });
    });
  });

  describe('retroSuccessfullyLoggedIn', () => {
    it('dispatches a set Route', () => {
      subject.dispatch({type: 'retroSuccessfullyLoggedIn', data: {retro_id: 1}});
      expect('setRoute').toHaveBeenDispatchedWith({
        type: 'setRoute',
        data: '/retros/1'
      });
    });
  });

  describe('retroItemSuccessfullyCreated', () => {
    beforeEach(() => {
      subject.$store = new Cursor({
        retro: retro
      }, cursorSpy);
      subject.dispatch({
        type: 'retroItemSuccessfullyCreated', data: {
          item: {id: 10, category: 'happy'},
          retroId: retro.id
        }
      });
    });

    it('creates the retro item', () => {
      retro.items.push({id: 10, category: 'happy'});
      expect(cursorSpy).toHaveBeenCalledWith({retro: retro});
    });

    it('dispatches created retro item analytic', () => {
      expect('createdRetroItemAnalytics').toHaveBeenDispatchedWith({
        type: 'createdRetroItemAnalytics',
        data: {retroId: retro.id, category: 'happy'}
      });
    });
  });

  describe('retroItemSuccessfullyDeleted', () => {
    beforeEach(() => {
      subject.$store = new Cursor({
        retro: retro
      }, cursorSpy);
    });

    it('deletes the retro item', () => {
      subject.dispatch({type: 'retroItemSuccessfullyDeleted', data: {retro_id: 1, item: retro.items[0]}});
      expect(cursorSpy.calls.mostRecent().args[0].retro.items).not.toContain(retro.items[0]);
    });
  });

  describe('retroItemSuccessfullyVoted', () => {
    let itemFromApiResponse;
    beforeEach(() => {
      let item = retro.items[0];
      item.vote_count = 50;
      item.updated_at = '2016-10-04T23:19:05.269Z';
      itemFromApiResponse = {
        id: item.id,
        vote_count: 50,
        updated_at: '2016-10-04T23:19:05.269Z'
      };

      subject.$store = new Cursor({
        retro: retro
      }, cursorSpy);
    });

    it('updates the vote count on the retro item', () => {
      subject.dispatch({type: 'retroItemSuccessfullyVoted', data: {retro_id: 1, item: itemFromApiResponse}});
      expect(cursorSpy).toHaveBeenCalledWith({
        retro: retro
      });
    });
  });

  describe('retroItemSuccessfullyDone', () => {
    let item;
    beforeEach(() => {
      retro.highlighted_item_id = 2;
      item = retro.items[0];
      subject.$store = new Cursor({
        retro: retro
      }, cursorSpy);
      subject.dispatch({type: 'retroItemSuccessfullyDone', data: {retroId: 1, item: item}});
    });

    it('updates the item to have attribute done = true', () => {
      item.done = true;
      retro.highlighted_item_id = null;
      expect(cursorSpy).toHaveBeenCalledWith({
        retro: retro
      });
    });

    it('dispatches completed retro item analytic', () => {
      expect('completedRetroItemAnalytics').toHaveBeenDispatchedWith({
        type: 'completedRetroItemAnalytics',
        data: {retroId: retro.id, category: 'happy'}
      });
    });

    it('checks whether all retro items have been marked as done', () => {
      expect('checkAllRetroItemsDone').toHaveBeenDispatched();
    });
  });

  describe('retroItemSuccessfullyUndone', () => {
    let item;

    beforeEach(() => {
      retro.highlighted_item_id = 2;
      item = retro.items[0];
      subject.$store = new Cursor({
        retro: retro
      }, cursorSpy);
      subject.dispatch({type: 'retroItemSuccessfullyUndone', data: {retroId: 1, item: item}});
    });

    it('updates the item to have attribute done = false', () => {
      item.done = false;
      retro.highlighted_item_id = null;
      expect(cursorSpy).toHaveBeenCalledWith({
        retro: retro
      });
    });
  });

  describe('retroItemSuccessfullyHighlighted', () => {
    beforeEach(() => {
      subject.$store = new Cursor({
        retro: retro
      }, cursorSpy);
    });

    it('updates the highlighted retro item', () => {
      retro.highlighted_item_id = 2;
      subject.dispatch({type: 'retroItemSuccessfullyHighlighted', data: {retro: retro}});
      expect(cursorSpy).toHaveBeenCalledWith({
        retro: jasmine.objectContaining({
          highlighted_item_id: 2
        })
      });
    });

    it('initializes countdown timer', () => {
      retro.retro_item_end_time = 123;
      subject.dispatch({type: 'retroItemSuccessfullyHighlighted', data: {retro: retro}});
      expect(cursorSpy).toHaveBeenCalledWith({
        retro: jasmine.objectContaining({
          retro_item_end_time: 123
        })
      });
    });
  });

  describe('retroItemSuccessfullyUnhighlighted', () => {
    beforeEach(() => {
      retro.highlighted_item_id = 2;

      subject.$store = new Cursor({
        retro: retro
      }, cursorSpy);
    });

    it('removes the highlight of the currently highlighted retro item', () => {
      subject.dispatch({type: 'retroItemSuccessfullyUnhighlighted'});
      expect(cursorSpy).toHaveBeenCalledWith({
        retro: jasmine.objectContaining({
          highlighted_item_id: null
        })
      });
    });
  });

  describe('checkAllRetroItemsDone', () => {
    describe('when all retro items are done', () => {
      beforeEach(() => {
        retro.items =[
          {
            id: 1,
            description: 'item 1',
            category: 'happy',
            vote_count: 1,
            done: true
          },
          {
            id: 2,
            description: 'item 2',
            category: 'happy',
            vote_count: 2,
            done: true
          },
          {
            id: 3,
            description: 'item 3',
            category: 'happy',
            vote_count: 3,
            done: true
          }
        ];

        subject.$store = new Cursor({
          retro: retro
        }, cursorSpy);
      });

      it('dispatches showDialog', () => {
        subject.dispatch({type: 'checkAllRetroItemsDone'});
        expect('showDialog').toHaveBeenDispatchedWith({
          type: 'showDialog',
          data: {
            title: 'Archive this retro?',
            message: 'The board will be cleared ready for your next retro and incomplete action items will be carried across.'
          }
        });
      });
    });

    describe('when not all retro items are done', () => {
      beforeEach(() => {
        retro.items = [
          {
            id: 1,
            description: 'item 1',
            category: 'happy',
            vote_count: 1,
            done: true
          },
          {
            id: 2,
            description: 'item 2',
            category: 'happy',
            vote_count: 2,
            done: false
          },
          {
            id: 3,
            description: 'item 3',
            category: 'happy',
            vote_count: 3,
            done: true
          }
        ];

        subject.$store = new Cursor({
          retro: retro
        }, cursorSpy);
      });

      it('does not dispatch showDialog', () => {
        subject.dispatch({type: 'checkAllRetroItemsDone'});
        expect('showDialog').not.toHaveBeenDispatched();
      });
    });
  });

  describe('extendTimerSuccessfullyDone', () => {
    beforeEach(() => {
      retro.retro_item_end_time = null;

      subject.$store = new Cursor({
        retro: retro
      }, cursorSpy);
    });

    it('add more minutes to the timer', () => {
      retro.retro_item_end_time = 321;
      subject.dispatch({type: 'extendTimerSuccessfullyDone', data: {retro: retro}});
      expect(cursorSpy).toHaveBeenCalledWith({
        retro: jasmine.objectContaining({
          retro_item_end_time: 321
        })
      });
    });
  });

  describe('archiveRetroSuccessfullyDone', () => {
    let updated_retro;

    beforeEach(() => {
      updated_retro = {
        id: retro.id,
        name: retro.name,
        items: [],
        action_items: [retro.action_items[0]]
      };

      subject.$store = new Cursor({
        retro: retro
      }, cursorSpy);
      subject.dispatch({type: 'archiveRetroSuccessfullyDone', data: {retro: updated_retro}});
    });

    it('updates the retro', () => {
      retro.retro_item_end_time = 321;
      expect(cursorSpy).toHaveBeenCalledWith({
        retro: updated_retro
      });
    });

    it('dispatches archived retro analytics', () => {
      expect('archivedRetroAnalytics').toHaveBeenDispatchedWith({
        type: 'archivedRetroAnalytics',
        data: {retroId: retro.id}
      });
    });

    it('displays an alert', () => {
      expect('showAlert').toHaveBeenDispatchedWith({
        type: 'showAlert',
        data: {
          message: 'Archived!'
        }
      });
    });
  });

  describe('websocketRetroDataReceived', () => {
    let initialStore;

    beforeEach(() => {
      initialStore = {session: {request_uuid: 'fake-request-uuid-1'}};
      subject.$store = new Cursor(initialStore, cursorSpy);
    });

    describe('when the retro is updated', () => {
      it('updates store with data from socket', () => {
        subject.dispatch({type: 'websocketRetroDataReceived', data: {retro: retro}});
        expect(cursorSpy).toHaveBeenCalledWith({retro: retro, ...initialStore});
      });
    });

    describe('when the command is force_relogin', () => {
      describe('when the command was originated by someone else', () => {
        it('dispatches show alert with a password changed message', () => {
          subject.dispatch({
            type: 'websocketRetroDataReceived',
            data: {
              command: 'force_relogin',
              payload: {
                originator_id: 'fake-request-uuid-2',
                retro: {
                  slug: 'retro-slug-1',
                },
              }
            }
          });

          expect('requireRetroRelogin').toHaveBeenDispatchedWith({
            type: 'requireRetroRelogin',
            data: {
              retro: {
                slug: 'retro-slug-1',
              },
            }
          });
        });
      });

      describe('when the command was originated by me', () => {
        it('does not dispatch show alert', () => {
          subject.dispatch({type: 'websocketRetroDataReceived', data: {command: 'force_relogin',
            payload: {
              originator_id: 'fake-request-uuid-1'
            }}});

          expect('requireRetroRelogin').not.toHaveBeenDispatched();
        });
      });
    });
  });

  describe('websocketSessionDataReceived', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
    });

    it('updates store with data from socket', () => {
      subject.dispatch({type: 'websocketSessionDataReceived', data: {payload: { request_uuid: 'some-request-uuid' }}});
      expect(cursorSpy).toHaveBeenCalledWith({session: {request_uuid: 'some-request-uuid'}});
    });
  });

  describe('doneRetroActionItemSuccessfullyToggled', () => {
    beforeEach(() => {
      subject.$store = new Cursor({
        retro: retro
      }, cursorSpy);
    });

    describe('when action item is marked as done', () => {
      it('dispatches completed retro action item analytic', () => {
        subject.dispatch({type: 'doneRetroActionItemSuccessfullyToggled', data: {action_item: {id: 1, done: true}}});
        expect('doneActionItemAnalytics').toHaveBeenDispatchedWith({
          type: 'doneActionItemAnalytics',
          data: {retroId: retro.id}
        });
      });

      it('updates the store', () => {
        subject.dispatch({type: 'doneRetroActionItemSuccessfullyToggled', data: {action_item: {id: 1, done: true}}});
        expect(cursorSpy.calls.mostRecent().args[0].retro.action_items[0].done).toBeTruthy();
      });
    });

    describe('when action item is marked as undone', () => {
      it('does not dispatch anything', () => {
        subject.dispatch({type: 'doneRetroActionItemSuccessfullyToggled', data: {action_item: {id: 2, done: false}}});
        expect('undoneActionItemAnalytics').toHaveBeenDispatchedWith({
          type: 'undoneActionItemAnalytics',
          data: {retroId: retro.id}
        });
      });

      it('updates the store', () => {
        subject.dispatch({type: 'doneRetroActionItemSuccessfullyToggled', data: {action_item: {id: 1, done: false}}});
        expect(cursorSpy.calls.mostRecent().args[0].retro.action_items[0].done).toBeFalsy();
      });
    });
  });

  describe('retroActionItemSuccessfullyCreated', () => {
    let action_item = {id: 2, description: 'action item 2', done: false};
    beforeEach(() => {
      subject.$store = new Cursor({
        retro: retro
      }, cursorSpy);
      subject.dispatch({type: 'retroActionItemSuccessfullyCreated', data: {action_item: action_item, retroId: 1}});
    });

    it('updates the store with the new retro action item', () => {
      retro.action_items.push(action_item);
      expect(cursorSpy).toHaveBeenCalledWith({retro: retro});
    });

    it('dispatches created retro action item analytic', () => {
      expect('createdActionItemAnalytics').toHaveBeenDispatchedWith({
        type: 'createdActionItemAnalytics',
        data: {retroId: retro.id}
      });
    });
  });

  describe('retroActionItemSuccessfullyDeleted', () => {
    let action_item;

    beforeEach(() => {
      action_item = retro.action_items[0];
      subject.$store = new Cursor({
        retro: retro
      }, cursorSpy);
      subject.dispatch({type: 'retroActionItemSuccessfullyDeleted', data: {action_item: action_item}});
    });

    it('updates the store and removes the retro action item', () => {
      expect(cursorSpy.calls.mostRecent().args[0].retro.action_items).not.toContain(action_item);
    });
  });

  describe('retroActionItemSuccessfullyEdited', () => {
    let action_item;
    beforeEach(() => {
      action_item = retro.action_items[0];
      action_item.description = 'description for action item 1 has been changed';
      subject.$store = new Cursor({
        retro: retro
      }, cursorSpy);
      subject.dispatch({type: 'retroActionItemSuccessfullyEdited', data: {retroId: 1, action_item}});
    });

    it('updates description of the action item', () => {
      action_item.description = 'description for action item 1 has been changed';
      expect(cursorSpy.calls.mostRecent().args[0].retro.action_items).toContain(action_item);
    });
  });

  describe('retroArchiveSuccessfullyFetched', () => {
    beforeEach(() => {
      subject.$store = new Cursor({
        retro_archives: {}
      }, cursorSpy);
      subject.dispatch({type: 'retroArchiveSuccessfullyFetched', data: {retro: retro_archives}});
    });
    it('updates the store with the archived retro items', () => {
      expect(cursorSpy).toHaveBeenCalledWith({retro_archives: retro_archives});
    });
  });

  describe('retroArchivesSuccessfullyFetched', () => {
    beforeEach(() => {
      subject.$store = new Cursor({
        archives: []
      }, cursorSpy);
      subject.dispatch({type: 'retroArchivesSuccessfullyFetched', data: {archives: [{id: 123}]}});
    });
    it('updates the store with the archives', () => {
      expect(cursorSpy).toHaveBeenCalledWith({archives: [{id: 123}]});
    });
  });

  describe('backPressedFromArchives', () => {
    beforeEach(() => {
      subject.dispatch({type: 'backPressedFromArchives', data: {retro_id: '1'}});
    });
    it('sets the route back to the current retro', () => {
      expect('setRoute').toHaveBeenDispatchedWith({type: 'setRoute', data: '/retros/1'});
    });
  });

  describe('backPressedFromPasswordSettings', () => {
    beforeEach(() => {
      subject.dispatch({type: 'backPressedFromPasswordSettings', data: {retro_id: '1'}});
    });
    it('sets the route back to the current retro', () => {
      expect('setRoute').toHaveBeenDispatchedWith({type: 'setRoute', data: '/retros/1/settings'});
    });
  });

  describe('showAlert', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({
        type: 'showAlert', data: {
          message: 'this is a message',
          linkMessage: 'link message',
          linkUrl: 'http://url/'
        }
      });
    });
    it('adds the alert message to the store', () => {
      expect(cursorSpy).toHaveBeenCalledWith({
        alert: {
          message: 'this is a message',
          linkMessage: 'link message',
          linkUrl: 'http://url/'
        }
      });
    });
  });

  describe('hideAlert', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'hideAlert'});
    });
    it('clears the alert message from the store', () => {
      expect(cursorSpy).toHaveBeenCalledWith({alert: null});
    });
  });

  describe('showDialog', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
    });

    it('adds dialog to the store', () => {
      subject.dispatch(
        {
          type: 'showDialog',
          data: {
            title: 'Some title',
            message: 'Some message',
          }
        }
      );

      expect(cursorSpy).toHaveBeenCalledWith({
        dialog: {
          title: 'Some title',
          message: 'Some message',
        }
      });
    });
  });

  describe('hideDialog', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
    });

    it('clears the dialog from the store', () => {
      subject.dispatch({type: 'hideDialog'});

      expect(cursorSpy).toHaveBeenCalledWith({dialog: null});
    });
  });

  describe('retroNotFound', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'retroNotFound'});
    });
    it('updates the store with retro not found', () => {
      expect(cursorSpy).toHaveBeenCalledWith({retro_not_found: true});
    });
  });

  describe('resetRetroNotFound', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'resetRetroNotFound'});
    });
    it('updates the store with retro not found to false', () => {
      expect(cursorSpy).toHaveBeenCalledWith({retro_not_found: false});
    });
  });

  describe('resetNotFound', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'resetNotFound'});
    });
    it('updates the store with not found to false', () => {
      expect(cursorSpy).toHaveBeenCalledWith({not_found: false});
    });
  });

  describe('resetApiServerNotFound', () => {
    it('updates the store with not found to false', () => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'resetApiServerNotFound'});

      expect(cursorSpy).toHaveBeenCalledWith({api_server_not_found: false});
    });
  });

  describe('notFound', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'notFound'});
    });
    it('updates the store with not found', () => {
      expect(cursorSpy).toHaveBeenCalledWith({not_found: true});
    });
  });

  describe('signOut', () => {
    beforeEach(() => {
      spyOn(window.localStorage, 'clear');

      subject.dispatch({type: 'signOut'});
    });

    it('clears local storage', () => {
      expect(window.localStorage.clear).toHaveBeenCalled();
    });

    it('redirects to home page', () => {
      expect('setRoute').toHaveBeenDispatchedWith({type: 'setRoute', data: '/'});
    });
  });

  describe('routeToRetroPasswordSettings', () => {
    beforeEach(() => {
      subject.dispatch({type: 'routeToRetroPasswordSettings', data: { retro_id: '13' }});
    });

    it('routes to the retro password settings page', () => {
      expect('setRoute').toHaveBeenDispatchedWith({type: 'setRoute', data: '/retros/13/settings/password'});
    });
  });

  describe('retroPasswordSuccessfullyUpdated', () => {
    beforeEach(() => {
      spyOn(window.localStorage, 'setItem');
      subject.$store = new Cursor({}, cursorSpy);

      subject.dispatch({ type: 'retroPasswordSuccessfullyUpdated', data: { retro_id: '42', token: 'new-api-token' } });
    });

    it('clears the error messages', () => {
      expect(cursorSpy).toHaveBeenCalledWith({ errors: {} });
    });

    it('updates token in local storage', ()=> {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('apiToken-42', 'new-api-token');
    });
  });

  describe('retroPasswordUnsuccessfullyUpdated', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);

      subject.dispatch({
        type: 'retroPasswordUnsuccessfullyUpdated',
        data: {
          errors: ['Sorry! That password does not match the current one.']
        }
      });
    });

    it('updates the error messages', () => {
      expect(cursorSpy).toHaveBeenCalledWith({
        errors: ['Sorry! That password does not match the current one.']
      });
    });
  });

  describe('clearErrors', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);

      subject.dispatch({ type: 'clearErrors' });
    });

    it('clears the error messages', () => {
      expect(cursorSpy).toHaveBeenCalledWith({ errors: {} });
    });
  });

  describe('apiServerNotFound', () => {
    it('updates the store with api server not found', () => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'apiServerNotFound'});

      expect(cursorSpy).toHaveBeenCalledWith({api_server_not_found: true});
    });
  });

  describe('redirectToRegistration', () => {
    it('redirects to the registration page with the correct url parameters', () => {
      subject.$store = new Cursor({}, cursorSpy);
      subject.dispatch({type: 'redirectToRegistration', data: { access_token: 'the-access-token', email: 'a@a.a', name: 'my full name' }});

      expect('setRoute').toHaveBeenDispatchedWith({type: 'setRoute', data: '/registration/the-access-token/a@a.a/my full name'});
      expect(router.navigate.calls.count()).toEqual(1);
      expect(router.navigate.calls.argsFor(0)).toEqual(['/registration/the-access-token/a@a.a/my full name']);
    });
  });

  describe('setCountryCode', () => {
    beforeEach(() => {
      subject.$store = new Cursor({}, cursorSpy);

      subject.dispatch({
        type: 'setCountryCode',
        data: {
          countryCode: 'anything',
        }
      });
    });

    it('updates the all the flags', () => {
      expect(cursorSpy).toHaveBeenCalledWith({
        countryCode: 'anything',
      });
    });
  });
});
