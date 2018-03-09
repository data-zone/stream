import fetch from 'unfetch';

const TRANSFORM = data => data;

export default class StreamCore {
  engine = {
    http: fetch,
    ws: WebSocket,
  };
  config = {};
  hooks = {};
  times = -1;
  _reconnectionAttempts = 0;

  request(url, options) {
    this.config.url = url;
    this.config.options = options;

    return this;
  }

  get(url, options) {
    this.config.method = 'GET';

    return this.request(url, options);
  }

  post(url, body = {}, headers = {}) {
    this.config.method = 'POST';

    return this.request(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
  }

  put(url, body = {}, headers = {}) {
    this.config.method = 'PUT';

    return this.request(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
  }

  patch(url, body = {}, headers = {}) {
    this.config.method = 'PATCH';

    return this.request(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
  }

  delete(url, body = {}, headers = {}) {
    this.config.method = 'DELETE';

    return this.request(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
  }

  interval(ms) {
    this.config.interval = ms;
    return this;
  }

  times(times) {
    this.times = times;
    return this;
  }

  websocket(websocketURL, websocketOptions = {}) {
    this.config.websocketURL = websocketURL;
    this.config.websocketOptions = websocketOptions;
    return this;
  }

  engine(engine) {
    this.config.engine = { ...this.config.engine, ...engine };
    return this;
  }

  transform(cb = TRANSFORM) {
    this.hooks.transform = cb;
    return this;
  }

  on(cb) {
    this.hooks.on = cb;
    return this;
  }

  once(cb) {
    this.hooks.once = cb;
    return this;
  }

  error(cb) {
    this.hooks.error = cb;
    return this;
  }

  off() {
    clearInterval(this.intervalFn);

    return this;
  }

  connect() {
    const ws = new this.engine.ws(this.config.websocketURL); // eslint-disable-line
    const {
      reconnection = true,
      reconnectionDelay = 10000,
      reconnectionAttempts = Infinity,
    } = this.config.websocketOptions;

    ws.onmessage = this.hooks.on;
    ws.onerror = this.hooks.error;
    ws.onclose = () => {
      this.hooks.close && this.hooks.close();

      if (reconnection === true) {
        setTimeout(() => {
          if (this._reconnectionAttempts < reconnectionAttempts) {
            this.connect();
          }
        }, reconnectionDelay);
      }
    };

    this._reconnectionAttempts += 1;
  }

  flow() {
    const options = {
      method: this.config.method,
      ...this.config.options,
    };

    if (this.config.websocketURL) {
      this.connect(this.config.websocketURL);
    } else if (this.hooks.on) {
      // start right now
      this.engine.http(this.config.url, options)
        .then(this.hooks.on)
        .catch(this.hooks.error);

      if (this.times <= 0) {
        this.intervalFn = setInterval(async () => {
          try {
            const data = await this.engine.http(this.config.url, options);
            this.hooks.on(this.hooks.transform(data));
          } catch (e) {
            this.hooks.error(e);
          }
        }, this.config.interval);
      } else {
        let times = 0;
        this.intervalFn = setInterval(async () => {
          times += 1;
          if (this.times < times) {
            return this.off();
          }

          try {
            const data = await this.engine.http(this.config.url, options);
            this.hooks.on(this.hooks.transform(data));
          } catch (e) {
            this.hooks.error(e);
          }
        }, this.config.interval);
      }
    } else if (this.hooks.once) {
      this.engine.http(this.config.url, options)
        .then(data => this.hooks.once(this.hooks.transform(data)))
        .catch(this.hooks.error);
    } else {
      throw new Error('invalid on / once');
    }
  }

  run() {
    this.flow();

    return this;
  }
}
