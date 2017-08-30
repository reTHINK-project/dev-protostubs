# dev-protostubs

Hosts the source code and documentation to all protostubs and idp-proxies

## How to install all modules inside each protostub source code

If your protostub or idp-proxy which need to have a third party module dependency you will
need to have a package.json inside it;

```shell
# This will execute npm install for each package.json inside each protostub source code;
npm run install:all
```

## How to develop an Protostub

To develop a protostub you will need have the suffix `<name>.ps.js` in your main file;

*example:* `MyProtoStub.ps.js`

#### Protostub source code

```javascript

class MyProtoStub {

  constructor(runtimeProtoStubURL, bus, config) {

    // You will receive all messages send to the protostub;
    bus.addListener('*', (msg) => {
      console.log('[MyProtoStub] outgoing message: ', msg);
    });

  }

}

export default function activate(url, bus, config) {
  return {
    name: 'MyProtoStub',
    instance: new MyProtoStub(url, bus, config)
  };
}

```

To ensure the toolkit will generate the descriptor with correct information you
should have `<name>.ps.json` file;

*example:* `MyProtoStub.ps.json`

#### Protostub descriptor

```json

{
  "language": "javascript",
  "description": "Protostub to exchange messages with vertx",
  "signature": "",
  "configuration": {
    "url": "wss://msg-node.hysmart.rethink.ptinovacao.pt/localhost/ws"
  },
  "constraints": {
    "node": true
  },
  "interworking": true,
  "objectName": "default"
}

```


## How to develop an IDPProxy

To develop a protostub you will need have the suffix `<name>.idp.js` in your main file;

*example:* `IdpProxyStub.idp.js`

**see:** Protostubs

To ensure the toolkit will generate the descriptor with correct information you
should have `<name>.idp.json` file;

*example:* `IdpProxyStub.idp.json`

```json
{
  "language": "javascript",
  "description": "IDPProxy description",
  "signature": "",
  "configuration": {},
  "constraints": {
    "browser": true
  },
  "interworking": true,
  "objectName": "idp.proxy.com"
}
```
