(function () {
  Polymer({
    publish: {
      params: {},
      'default': false,
      lazy: true,
      reloadView: true,
      redirect: ''
    },
    ready: function () {
      this.elementName = this['element-name'];
      this.loaded = false;
      if (!this.lazy) {
        this.loadView();
      }
    },
    loadView: function (options) {
      this.detachView();
      this.view = document.createElement(this.elementName);
      this.setViewParams(options);
      this.shadowRoot.appendChild(this.view);
      this.loaded = true;
    },
    detachView: function () {
      if (this.view && this.reloadView && [].indexOf.call(this.shadowRoot.children, this.view) !== -1) {
        this.shadowRoot.removeChild(this.view);
      }
    },
    activate: function (options) {
      options = options || {};
      if (this.lazy && (!this.loaded || this.reloadView || options.reload)) {
        this.loadView(options);
      } else {
        this.setViewParams();
      }

      this.hidden = false;
    },
    setViewParams: function () {
      var params = _.extend(this.params, history.state);
      for (var i in params) {
        if (params.hasOwnProperty(i)) {
          this.view[i] = this.params[i];
        }
      }
    },
    hide: function () {
      this.hidden = true;
    }
  });
}());
