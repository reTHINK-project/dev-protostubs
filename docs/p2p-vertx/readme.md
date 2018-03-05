## P2P Protostub to connect the Browser Runtime to JVM Vertx Runtime

The P2P Vertx Stub is used by the Browser Runtime to directly connect with the Vertx Runtime by using Encrypted Web Sockets including a lib to support Vertx Event BUS on top of the Web Sockets.

![Architecture](p2p-vertx-stub.png)

The Protostub configuration includes:

* `host` the hostname or domain associated to the remote Vertx Runtime.
* `url` vertx Web socket server address
* `streams` an array of JSON Objects defining Vertx Event BUS addresses where the Reporter should set handlers to convert into Vertx Data Objects:
  ```
  {
    stream: <event bus address>,
    resource: <hyperty resource type>,
    id: <stream identifier>,
    name: <stream name>,
    init: <initial data>
  }
  ```

The Stub includes the following components:

**Reporter**

Extends the ContextReporter service framework lib, invokes `ContextReporter.create()` with data defined at `config.streams` and add handlers to vertx event bus to addresses defined at `config.streams.stream` where each received data from the Event BUS is written in the Data Object by calling `contextReporter.setContext(..)`.

**Observer**

Provides a function to subscribe a certain Data Object URL. An event handler is set for the subscribed Data Object changes, to publish them in the Vertx Event BUS using as address the Data Object URL.

**Subscription Manager**

The Subscription Manager has a rethink bus listener for invitations (create messages) targeting addresses for the protostub hostname ie `config.host`. These invitations are forwarded to Vertx Event BUS with callback to handle responses as well as subscription requests. Subscription requests are forwarded into the Message BUS.
