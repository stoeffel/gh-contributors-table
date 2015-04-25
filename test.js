'use strict';
var assert = require('assert');
var ghContributorsTable = require('./');

it('should ', function () {
	assert.strictEqual(ghContributorsTable('unicorns'), 'unicorns & rainbows');
});
