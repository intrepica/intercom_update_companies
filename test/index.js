'use strict';

var expect = require('expect.js');
var sinon = require('sinon');
var proxyquire = require('proxyquire').noPreserveCache();

var mock = sinon.mock;
var stub = sinon.stub;

describe('intercom_update_companies', function(){
  var intercom; 

  function requireApi(intercomInit){    
    var requireStubs = { 
      'intercom_init':intercomInit
    };    
    return proxyquire('../', requireStubs); 
  }

  beforeEach(function() {
    intercom = {
      getUser: function() {},
      updateUser: function() {},
      '@noCallThru': true
    };
  });

  describe('.findUserAndUpdate', function() {
    var userObj, query, companies;    

    beforeEach(function() {
      var company1 = { 
        company_id: 'company 1'
      };
      var company2 = { 
        company_id: 'company 1'
      };
      companies = [ company1, company2 ];
      userObj = { 
        user_id: 'my user id',
        companies:{ companies:companies }
      };    
      query = {
        user_id:'my user id'
      };    
      intercom.updateUser = stub();
      intercom.updateUser.yields(null);
    });

    it('calls callback(err) when intercom getUser fails', function(done) {    
      var error = new Error('Boom!');
      intercom.getUser = stub();
      intercom.getUser.yields(error);
      var api = requireApi(intercom);
      api.findUserAndUpdate(query, [], function(err) {
        expect(err).to.eql(error);
        done();
      });
    }); 

    it('queries the user in Intercom.io', function(done) {        
      intercom.getUser = mock();
      intercom.getUser.withArgs(query).yields(null, userObj);       
      var api = requireApi(intercom);
      api.findUserAndUpdate(query, [], function() {
        intercom.getUser.verify();
        done();     
      });
    });     

    describe('when getUser query is successful', function() {
      var api;

      beforeEach(function() {
        intercom.getUser = stub();
        intercom.getUser.yields(null, userObj);
        api = requireApi(intercom);
        api.updateUserCompanies = mock();
      });

      it('calls updateUserCompanies(user_id, currentUserCompanies, requiredCompanies, callback)', function(done) {        
        api.updateUserCompanies.once().withArgs('my user id', companies, [1,2,3]).yields(null);
        api.findUserAndUpdate(query, [1,2,3], function() {
          api.updateUserCompanies.verify();
          done();     
        });
      });

      it('calls callback(err) when updateUserCompanies fails', function(done) {                 
        var error = new Error('Boom!');
        api.updateUserCompanies.yields(error);
        api.findUserAndUpdate(query, [1,2,3], function(err) {       
          expect(err).to.eql(error);
          done();
        });
      }); 
    });
  });

  describe('.updateUserCompanies', function() {
    var userObj, api, existingCompanies;    

    beforeEach(function() {
      intercom.updateUser = mock();
      api = requireApi(intercom);
      userObj = {
        user_id: 'my user id',
        companies: []
      };      
    });

    it('calls callback(err) when updateUser fails', function(done) {                  
      var error = new Error('Boom!');
      intercom.updateUser.yields(error);
      api.updateUserCompanies('', [], [], function(err) {
        expect(err).to.eql(error);
        done();
      });
    }); 

    describe('removes companies not required', function() {
      var requiredCompanies;

      beforeEach(function() {
        requiredCompanies = [2];
        existingCompanies = [{ company_id:1 }, { company_id:2 }, { company_id:3 }];
      });

      it('calls intercom.updateUser with the companies marked for removal', function(done) {
        userObj.companies = [ { id:1, remove:true }, { id:2 }, { id:3, remove:true } ];
        intercom.updateUser.withArgs(userObj).yields(null);
        api.updateUserCompanies('my user id', existingCompanies, requiredCompanies, function() {
          intercom.updateUser.verify();
          done();
        });         
      });
    });

    describe('appends new companies', function() {
      var requiredCompanies;

      beforeEach(function() {
        requiredCompanies = [2,3];
        existingCompanies = [{ company_id:1 }];
      });

      it('calls intercom.updateUser with the new collection of companies', function(done) {
        userObj.companies = [ { id:1, remove:true }, { id:2 }, { id:3 } ];
        intercom.updateUser.withArgs(userObj).yields(null);       
        api.updateUserCompanies('my user id', existingCompanies, requiredCompanies, function() {
          intercom.updateUser.verify();
          done();
        });
      });
    });
  });

});