import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

//import { generateGUID } from '../src/utils/utils';
//import IdpProxy from '../GoogleIdpProxyStub.idp';
import {getAssertion, validateAssertion} from '../tests-helper';

chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

let assertion;

describe('getAssertion', function() {

  it('should get a new assertion', function(done) {
    this.timeout(5000);

    expect(getAssertion().then((result)=>{
      assertion = result.assertion;
    }))
    .to.be.fulfilled
    .and.notify(done);
   });

   it('should validate assertion', function(done) {
    
    expect(
      validateAssertion(assertion)
      
    ).to.be.fulfilled
    .and.notify(done);
   });
 
});
