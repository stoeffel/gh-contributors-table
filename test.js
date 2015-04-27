'use strict';
var assert = require('assert');
var fs = require('fs');
var ghContributorsTable = require('./');

it('should create a table', function (done) {
	fs.readFile('./contributors.md', 'utf8', function (err,data) {
		if (err) {
			return assert.fail();
		}
		ghContributorsTable(['stoeffel', 'stoeffel', 'stoeffel', 'stoeffel', 'stoeffel', 'stoeffel', 'stoeffel'], 4, function(err, table) {
			if (err) {
				return assert.fail();
			}
			assert.strictEqual(table, data);
			done();
		});
	});
});
