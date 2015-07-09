'use strict';

require('dotenv').load();

var _ = require('lodash');
var intercom = require('intercom_init');


exports.findUserAndUpdate = function findUserAndUpdate(query, requiredCompanies, callback) {    
  intercom.getUser(query, function(err, user) {
    if (err) {
      return callback(err);
    }
    exports.updateUserCompanies(user.user_id, user.companies.companies, requiredCompanies, callback);
  }); 
};

exports.updateUserCompanies = function updateUserCompanies(user_id, existingCompanies, requiredCompanies, callback) {
  var companiesToRemove = markCompaniesForRemoval(existingCompanies, requiredCompanies);
  var newCompanies = findNewCompanies(existingCompanies, requiredCompanies);

  intercom.updateUser({
    user_id: user_id,
    companies: companiesToRemove.concat(newCompanies)
  }, callback);
};


function markCompaniesForRemoval(existingCompanies, requiredCompanies) {
  return existingCompanies.map(function(company) {
    var companyObj = { 
      id:company.company_id 
    };
    if (!_.includes(requiredCompanies, company.company_id)) {           
      companyObj.remove = true;
    }
    return companyObj;
  }); 
}

function findNewCompanies(existingCompanies, requiredCompanies) {
  return requiredCompanies            
            .filter(function(company_id) {
              return !_.find(existingCompanies, { company_id:company_id });
            })
            .map(function(company_id) {
              return { id:company_id };
            });
}