(function($) {
  function Spinner(rootElement) {
    var element = $("<div />")
      .addClass("epax-spinner")
      .hide();
    if (rootElement) $(rootElement).append(element);
    this.render = function() {
      element.show();
    };

    this.remove = function() {
      element.hide();
    };

    this.toggle = function(show) {
      if (show) this.render();
      else this.remove();
    };
  }

  function LoadingBar(rootElement) {
    var element = $("<div />")
      .addClass("epax-loading-bar")
      .append($("<div />").addClass("epax-loading-bar-inner"))
      .append($("<span />").text("10%"))
      .hide();
    if (rootElement) $(rootElement).append(element);
    this.render = function() {
      element.show();
    };

    this.remove = function() {
      element.hide();
    };

    this.toggle = function(show) {
      if (show) this.render();
      else this.remove();
    };

    this.setValue = function(value) {
      element.find(".epax-loading-bar-inner").css("width", value + "%");
      element.find("span").text(Math.round(value) + "%");
    };
  }

  function Notice(rootElement) {}

  window.Spinner = Spinner;
  window.LoadingBar = LoadingBar;
  window.Notice = Notice;
})(jQuery);
