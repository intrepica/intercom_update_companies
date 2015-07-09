Intercom Update Companies
====================

## Api

### findUserAndUpdate(query, requiredCompanies, callback)

Queries the user in intercom.io and calls `updateUserCompanies` with the users existing company array.

__Arguments__

* `query` - An object containing user_id or email
* `requiredCompanies` - An array of company_ids
* `callback(err)` - A callback which is called when `updateCompanies` has finished. 

__Examples__

```js

	var updateCompanies = require('intercom_update_companies');

	var query = { user_id:'intercom user id' };
	var requiredCompanies = [ company_id1, company_id2 ];

	updateCompanies.findUserAndUpdate(query, requiredCompanies, callback);	

```


### updateUserCompanies(user_id, existingCompanies, requiredCompanies, callback)

Sets the users companies to `existingCompanies`. If the array is empty, it will dissassociate all companies from the user.

__Arguments__

* `user_id` - The user_id in intercom.io
* `requiredCompanies` - An array of company objects { company_id:1 }
* `callback(err)` - A callback which is called when `updateCompanies` has finished. 

__Examples__

```js

	var updateCompanies = require('intercom_update_companies');

	var query = { user_id:'intercom user id' };
	var requiredCompanies = [ {company_id:1} ];

	updateCompanies.updateUserCompanies(user_id, requiredCompanies, callback);	
```


## Setup

```sh
npm install nodeify_lambda
```

