(function() {
  var store = new Store({
      products: [],
      loading: false,
      page: 1,
      maxRequestsCount: 0
    }),
    loadingBar = new LoadingBar(
      document.querySelector("#export-products-as-xml-wrapper .loading-bar")
    ),
    spinner = new Spinner(
      document.querySelector(
        "#export-products-as-xml-wrapper .epax-spinner-wrapper"
      )
    ),
    triggerButton;

  document.addEventListener("DOMContentLoaded", function() {
    triggerButton = document.querySelector("#export");
    triggerButton.addEventListener("click", onTriggerClick, false);
  });

  function onTriggerClick(e) {
    store.setStateWithAssign({ loading: true });

    getMaxRequestsCount(function(response) {
      var result = response.result;
      store.setStateWithAssign({ loading: false, maxRequestsCount: result });
    });
  }

  function getMaxRequestsCount(callback) {
    jQuery
      .post(window.__GLOBAL_VARIABLES__.exportRequestsCountUrl, {
        limit: 100,
        action: window.__GLOBAL_VARIABLES__.exportRequestsCountAction
      })
      .done(function(response) {
        if (typeof callback === "function") {
          try {
            callback(JSON.parse(response));
          } catch (e) {
            throw e;
          }
        }
      });
  }

  function fetchData() {
    var state = store.getState(),
      page = state.page;
    jQuery
      .post(window.__GLOBAL_VARIABLES__.exportUrl, {
        action: window.__GLOBAL_VARIABLES__.exportAction,
        limit: 100,
        page: page
      })
      .done(function(response) {
        var state = store.getState();
        var products = state.products,
          page = state.page,
          max = state.maxRequestsCount;
        jsonFromXML = JSON.parse(xml2json(response, ""));
        store.setStateWithAssign({
          products: products.concat(jsonFromXML),
          page: max !== page ? page + 1 : page
        });
      });
  }

  function downloadFile() {
    var products = store.getState().products;
    var xml = json2xml(
      {
        products: {
          product: products
        }
      },
      ""
    );
    var encoded = '<?xml version="1.0" encoding="UTF-8"?>' + xml,
      trigger = document.createElement("a");

    trigger.setAttribute("href", "data:text/xml;charset=utf-8," + encoded);
    trigger.setAttribute("download", "exported-products.xml");

    document.body.appendChild(trigger);
    trigger.click();
    document.body.removeChild(trigger);
  }

  store.subscribe(function(newState, oldState) {
    if (newState.loading !== oldState.loading) {
      spinner.toggle(newState.loading);
    }

    if (
      (newState.page !== oldState.page &&
        newState.page !== newState.maxRequestsCount) ||
      newState.maxRequestsCount !== oldState.maxRequestsCount
    ) {
      fetchData();
      loadingBar.setValue((newState.page * 100) / newState.maxRequestsCount);
    }

    if (
      newState.maxRequestsCount !== oldState.maxRequestsCount &&
      oldState.maxRequestsCount === 0
    ) {
      loadingBar.render();
      fetchData();
      return;
    }

    if (newState.maxRequestsCount === newState.page) {
      loadingBar.setValue(100);
      downloadFile();
      setTimeout(function() {
        loadingBar.remove();
      }, 1000);
    }
  });
})();
