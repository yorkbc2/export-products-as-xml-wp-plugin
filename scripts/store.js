"use strict";
(function() {
  function Store(initialState) {
    var state = initialState || {},
      subscriptions = [];

    this.getState = function() {
      return state;
    };

    this.setState = function(newState) {
      var oldValue = state;
      state = newState;
      subscriptions.forEach(function(subscription) {
        if (typeof subscription === "function") {
          subscription(newState, oldValue);
        }
      });
    };

    this.setStateWithAssign = function(newStateObject) {
      if (typeof newStateObject === "object") {
        try {
          var newState = Object.assign({}, state, newStateObject);
          this.setState(newState);
        } catch (e) {
          throw e;
        }
      }
    };

    this.subscribe = function(subscription) {
      subscriptions.push(subscription);
    };
  }

  window.Store = Store;
})();
