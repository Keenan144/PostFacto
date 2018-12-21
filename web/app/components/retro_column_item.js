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
const CountdownTimer = require('./countdown_timer');
const RetroItemEditView = require('./retro_item_edit_view');
const Scroll = require('react-scroll');

class RetroColumnItem extends React.Component {
  static propTypes = {
    item: types.object.isRequired,
    retroId: types.string.isRequired,
    highlighted_item_id: types.number,
    retro_item_end_time: types.string,
    archives: types.bool,
    isMobile: types.bool.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isEditing: false
    };
  }

  componentDidUpdate(prevProps) {
    const {item, highlighted_item_id} = prevProps;
    const wasHighlighted = (highlighted_item_id && highlighted_item_id === item.id);
    if (this.isHighlighted() && !wasHighlighted) {
      const id = this.domId();
      const windowH = document.body.getBoundingClientRect().height;
      const itemH = document.getElementById(id).offsetHeight;
      Scroll.scroller.scrollTo(id, {
        offset: -(windowH - itemH) / 2,
        delay: 0,
        smooth: !document.hidden,
        duration: 300
      });
    }
  }

  domId = () => {
    const {item} = this.props;
    return 'retro-item-' + item.id;
  };

  // boolean checkers
  isEnabled() {
    const {item, highlighted_item_id} = this.props;
    return (!highlighted_item_id || highlighted_item_id === item.id);
  }

  isHighlighted() {
    const {item, highlighted_item_id} = this.props;
    return (highlighted_item_id && highlighted_item_id === item.id);
  }

  isDone() {
    const {item} = this.props;
    return item.done;
  }

  // event handlers
  onItemEditClicked(event) {
    event.stopPropagation();
    const {item} = this.props;
    this.setState({isEditing: true, editedText: item.description});
  }

  onItemVoteClicked(event) {
    event.stopPropagation();
    const {item, retroId, archives} = this.props;
    if (this.isEnabled() && !this.isDone() && !archives) {
      Actions.voteRetroItem({item: item, retro_id: retroId});
    }
  }

  onItemClicked() {
    this.toggleHighlight();
  }

  onItemDoneClicked(event) {
    event.stopPropagation();
    const {item, retroId, isMobile} = this.props;
    if (this.isEnabled() && !isMobile) {
      item.done = true;
      Actions.doneRetroItem({item: item, retroId: retroId});
    }
  }

  onItemCancelClicked(event) {
    event.stopPropagation();
    const {item, retroId, isMobile} = this.props;
    if (this.isEnabled() && this.isDone() && !isMobile) {
      item.done = false;
      Actions.undoneRetroItem({item: item, retroId: retroId});
    } else {
      this.toggleHighlight();
    }
  }

  // private methods
  getPrimaryClass() {
    const {item, highlighted_item_id} = this.props;
    const {isEditing} = this.state;
    if (item.id === highlighted_item_id) {
      return ' highlight';
    }
    if (item.done === true) {
      return ' discussed';
    }
    if (highlighted_item_id) {
      return ' lowlight';
    }
    if (isEditing) {
      return ' editing';
    }
    return '';
  }

  toggleHighlight() {
    const {item, retroId, isMobile, archives} = this.props;
    const {isEditing} = this.state;
    if (this.isEnabled() && !isMobile && !archives && !isEditing) {
      if (this.isHighlighted()) {
        Actions.unhighlightRetroItem({retro_id: retroId});
      } else {
        Actions.highlightRetroItem({retro_id: retroId, item: item});
      }
    }
  }

  saveRetroItem(editedText) {
    const {retroId, item} = this.props;
    const {isEditing} = this.state;

    if (isEditing && editedText.trim().length > 0) {
      this.setState({isEditing: false, editedText: ''});
      Actions.updateRetroItem({retro_id: retroId, item: item, description: editedText});
    }
  }

  deleteItem() {
    const {item, retroId} = this.props;
    if (this.isEnabled()) {
      Actions.deleteRetroItem({item: item, retro_id: retroId});
    }
  }

  // render
  renderTimer() {
    const {item, highlighted_item_id, retro_item_end_time, retroId} = this.props;
    if (item.id === highlighted_item_id) {
      return (
        <CountdownTimer endTimestampInMs={Date.parse(retro_item_end_time)} retroId={retroId} />
      );
    }
    return null;
  }

  renderFooter() {
    const {item, highlighted_item_id} = this.props;

    if (item.id === highlighted_item_id) {
      return (
        <div className="item-footer">
          <br />
          <div className="retro-item-cancel" onClick={this.onItemCancelClicked.bind(this)}>Cancel</div>
          <div className="item-done" onClick={this.onItemDoneClicked.bind(this)}>Done</div>
        </div>
      );
    }

    return null;
  }

  renderVote() {
    const {isEditing} = this.state;
    if (isEditing) {
      return null;
    }

    return (
      <div className="item-vote">
        <div className="item-vote-submit" onClick={this.onItemVoteClicked.bind(this)}>
          <div className="vote-icon"><i className="fa fa-heart" aria-hidden="true" /></div>
          <div className="vote-count">{this.props.item.vote_count}</div>
        </div>
      </div>
    );
  }

  renderEdit() {
    const {item, archives, highlighted_item_id} = this.props;
    const {isEditing} = this.state;
    if (archives || isEditing || highlighted_item_id || item.done) {
      return null;
    }

    return (
      <div className="item-edit" onClick={this.onItemEditClicked.bind(this)}>
        <i className="fa fa-pencil"/>
      </div>
    );
  }

  renderDescription() {
    const {item} = this.props;

    return (
      <div className="item-text">
        <button>{item.description}</button>
      </div>
    );
  }

  renderDiscussed() {
    return (
      <div className="item-discussed">
        <i className="fa fa-check"/>
      </div>
    );
  }

  render() {
    const {item} = this.props;
    const {isEditing} = this.state;
    let itemContent;

    if (isEditing) {
      itemContent = (
        <RetroItemEditView
          originalText={item.description}
          deleteItem={this.deleteItem.bind(this)}
          saveItem={this.saveRetroItem.bind(this)}
        />
      );
    } else {
      itemContent = (
        <div className="item-content">
          {this.renderVote()}
          {this.renderDescription()}
          {this.renderTimer()}
          {this.renderFooter()}
          {this.renderEdit()}
          {this.renderDiscussed()}
        </div>
      );
    }
    return (
      <div id={this.domId()} key={item.id} className={'retro-item' + this.getPrimaryClass()} onClick={this.onItemClicked.bind(this)}>
        {itemContent}
      </div>
    );
  }
}

module.exports = RetroColumnItem;
