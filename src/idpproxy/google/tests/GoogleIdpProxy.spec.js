import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

//import { generateGUID } from '../src/utils/utils';
import GoogleIdpProxy from '../IdpProxyStub.idp';
import {getAssertion} from '../idgui';

chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('getAssertion', function() {

  it('should get a new assertion', function(done) {
//    this.timeout(0);

/*    let number = 2;
    let scheme = 'hyperty';
    let info = {
      name: 'test',
      schema: 'hyperty-catalogue://' + domain + '/.well-known/dataschema/hello',
      reporter: [],
      resources: []
    };*/
    expect(getAssertion())
    .to.be.fulfilled
    .and.notify(done);
   });

  it.skip('should create a new data Object address', function(done) {

    let number = 2;
    let scheme = 'comm';
    let info = {
      name: 'dataObjectName',
      schema: 'hyperty-catalogue://' + domain + '/.well-known/dataschema/communication',
      reporter: ['comm://' + domain + '/' + guid],
      resources: ['chat']
    };
    expect(aa.create(domain, number, info, scheme))
    .eventually.to.eql({newAddress: true, address: 'comm://' + domain + '/' + guid})
    .notify(done);
  });


  it.skip('should reuse an hyperty url address based on reuse option', function(done) {

    let number = 1;
    let scheme = 'hyperty';
    let info = {
      name: 'test',
      schema: 'hyperty-catalogue://' + domain + '/.well-known/dataschema/hello',
      reporter: [],
      resources: []
    };

    expect(aa.create(domain, number, info, scheme, true))
    .eventually.to.eql({newAddress: false, address: 'hyperty://' + domain + '/' + guid})
    .notify(done);

  });

  it.skip('should reuse an hyperty url address based on an given url', function(done) {

    let number = 1;
    let scheme = 'hyperty';
    let info = {
      name: 'test',
      schema: 'hyperty-catalogue://' + domain + '/.well-known/dataschema/hello',
      reporter: [],
      resources: []
    };

    expect(aa.create(domain, number, info, scheme, 'hyperty://' + domain + '/' + guid))
    .eventually.to.eql({newAddress: false, address: 'hyperty://' + domain + '/' + guid})
    .notify(done);

  });

});
