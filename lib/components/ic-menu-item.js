import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'ic-menu-item',

  attributeBindings: [
    'tabindex',
    'role',
    'aria-disabled'
  ],

  role: 'menuitem',

  enabled: true,

  tabindex: -1,

  focused: false,

  'aria-disabled': function() {
    return !this.get('enabled') + ''; // coerce to ensure true || false
  }.property('enabled'),

  click: function(event) {
    var wasKeyboard = !event.clientX && !event.clientY;
    this.get('parentList').close();
    Ember.run.next(this, function() {
      if (wasKeyboard) { this.get('parentList').focusTrigger(); }
      if (this.get('enabled')) {
        this.sendAction('on-select', this);
      } else {
        this.sendAction('on-disabled-select', this);
      }
    });
  },

  keyDown: function(event) {
    if (event.keyCode == 13 || event.keyCode == 32) {
      this.click(event);
    }
  },

  register: function() {
    this.get('parentList').registerItem(this);
  }.on('didInsertElement'),

  deregister: function() {
    this.get('parentList').deregisterItem(this);
  }.on('willDestroyElement'),

  focus: function() {
    this.set('focused', true);
    this.$().focus();
  },

  mouseEnter: function() {
    this.get('parentList').focusItem(this);
  },

  blur: function() {
    this.set('focused', false);
  }

});
