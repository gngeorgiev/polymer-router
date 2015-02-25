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
            if (this.view) {
                this.shadowRoot.removeChild(this.view);
            }

            this.view = document.createElement(this.elementName);
            this.setViewParams(options);
            this.shadowRoot.appendChild(this.view);
            this.loaded = true;
        },
        activate: function (options) {
            if (this.lazy && (!this.loaded || this.reloadView || options.reload)) {
                this.loadView(options);
            } else {
              this.setViewParams(options);
            }

            this.hidden = false;
        },
        setViewParams: function (options) {
          options = options || {};
          this.params = _.extend(this.params, options.params);
          for (var i in this.params) {
            if (this.params.hasOwnProperty(i)) {
              this.view[i] = this.params[i];
            }
          }
        },
        hide: function () {
            this.hidden = true;
        }
    });
}());
