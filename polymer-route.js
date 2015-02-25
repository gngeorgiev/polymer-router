(function () {
    Polymer({
        params: {},
        ready: function () {
            this.elementName = this['element-name'];
            this.loaded = false;
            this.lazy = (!!this.lazy || this.lazy === '');
            if (!this.lazy) {
                this.loadView();
            }
        },
        loadView: function (options) {
            this.view = document.createElement(this.elementName);
            this.setViewParams(options);
            this.shadowRoot.appendChild(this.view);
            this.loaded = true;
        },
        activate: function (options) {
            options = options || {};
            if (this.lazy && !this.loaded) {
                this.loadView(options);
            } else {
              this.setViewParams(options);
            }

            this.hidden = false;
        },
        setViewParams: function (options) {
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
