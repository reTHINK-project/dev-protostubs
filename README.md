# dev-protostubs

Hosts the source code and documentation to all protostubs, idp-proxies and hyperties.

For more information pls read [this](https://github.com/reTHINK-project/spec/blob/master/README.md).

## The Repository structure

### **SRC** folder

Hold all source code, like hyperty classes and JSON-Schemas. The hyperty class must have the suffix ".hy.js", on the file.

Each hyperty folder could have it's own `package.json`

```shell
# To create the pacakge.json
npm init
```

To use the all modules from [**Service Framework**](https://github.com/reTHINK-project/dev-service-framework/), like, *Syncher* or *Discovery* do:
```shell
# install dependencies
npm install rethink-project/dev-service-framework#develop --save
```

**Example:** Hello.hy.js

**Why?**
Because all the files in folder, could be a possible hyperty, with this suffix, we can distinguish the main hyperty from others files that complement it;


#### Hyperty Source Code

```javascript

// Service Framework
import IdentityManager from 'service-framework/dist/IdentityManager';
import {Discovery} from 'service-framework/dist/Discovery';
import { Syncher } from 'service-framework/dist/Syncher';

/**
 *
 */
class MyHyperty {

  constructor(hypertyURL, bus, configuration) {

    if (!hypertyURL) throw new Error('The hypertyURL is a needed parameter');
    if (!bus) throw new Error('The MiniBus is a needed parameter');
    if (!configuration) throw new Error('The configuration is a needed parameter');

    let syncher = new Syncher(hypertyURL, bus, configuration);

  }

  myMethod() {
    console.log('hello');
  }

}

/**
 * Function will activate the hyperty on the runtime
 * @param  {URL.URL} hypertyURL   url which identifies the hyperty
 * @param  {MiniBus} bus          Minibus used to make the communication between hyperty and runtime;
 * @param  {object} configuration configuration
 */
export default function activate(hypertyURL, bus, configuration) {

  return {
    name: 'MyHyperty',
    instance: new MyHyperty(hypertyURL, bus, configuration)
  };

}
```

#### Hyperty Descriptor

```json
{
  "language": "javascript",
  "signature": "",
  "configuration": {},
  "hypertyType": [
    "chat"
  ],
  "constraints": {
    "browser": true
  },
  "dataObjects": [
    "https://catalogue.%domain%/.well-known/dataschema/Communication"
  ],
  "objectName": "HypertyName"
}
```


### **EXAMPLES** folder

In this folder you have, for each hyperty you develop, the Web side testing.
This is customized with HTML using [Handlebars](http://handlebarsjs.com/) and ES5 javascript;

With this template system you can:

 - avoid the initial html setup, like **&lt;html&gt;, &lt;head&gt;, &lt;body&gt;**, and add only the html tags you need, like **&lt;div&gt;, &lt;p&gt;, &lt;b&gt;** and others.
 - use some extra features like, **variables, {{each}}, {{if}}**, look at [documentation](http://handlebarsjs.com/expressions.html)
 -

**Examples:**
 - hello-world > helloWorld.hbs
 - hyperty-chat > HypertyChat.hbs
 - hyperty-connector > HypertyConnector.hbs

#### **Test** folder

 You can make your own tests to an hyperty, only need create an file with your hyperty name, and suffix the ".spec.js"

 **Example:** Hello.spec.js

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
