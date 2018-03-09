# Data Flow Stream

### What & Why ?
* During data visualization develop, especial for data visualization screen, you will found, expect for that the data size is big, what worse is that the data need to be refreshed in some conditions, and it will need handle (transform) data in several steps. As before, I handle the data in `services` model, written with a lot business logic, and it cannot be used for other logic, So, I want to abstract a flow for it.

### How to

```
// 1 create a stream
const stream = new Stream();

// 2 call a http request and handle it
stream
  .get(`API_URL`, { authorization: 'AUTHORIZATION' }) // http method
  .interval(1000) // time interval
  .transform(data => data) // handle data to real data need
  .on(transformedData => { // listen real data, then do some actions
    // @TODO action handler
  })
  .error(err => {
    // @TODO error handler
  })
  .run(); // @IMPORTANT lazy flow, only run will call all the flow.
```

### API

* COMMON
  * **engine(ENGINE: { http: Promise = fetch, ws: Websocket = Websocket} )**: set http/ws engine, default http is fetch, ws is window.Websocket
  * **transform(HANDLER: (data: object) => (realData: object))** : Handle row data to what data you want in `on`
  * **on(HANDLE: (realData: object) => null)**: Spy on real data, then you can handle it for other actions
  * **error(HANDLER: (err: Error) => null)**: Spy on error
  * **run()**: @IMPORTANT lazy flow starter

* HTTP
  * **get(URL: string, HEADERS: object)**: HTTP Method
  * **post(URL: string, BODY: object, HEADERS: object)**: HTTP Method
  * **put(URL: string, BODY: object, HEADERS: object)**: HTTP Method
  * **delete(URL: string, BODY: object, HEADERS: object)**: HTTP Method
  * **interval(MILI_SECONDS: number)**: time interval for request
  * **off()**: clear time interval
  * **once(HANDLE: (realData: object) => null)**: as `on`, `once` will spy on data only once, `it will ignore time interval`

* Websocket
  * **websocket(WEBSOCKET_URL: string, WEBSOCKET_OPTIONS: object)**: webscoket entry
    * WEBSOCKET_OPTIONS: 
      * reconnection = true,
      * reconnectionDelay = 10000,
      * reconnectionAttempts = Infinity,