'use strict';
var
	GH_URL = 'https://api.github.com/users/',
	compose = require('1-liners/compose'),
	curry2 = require('1-liners/curry2'),
	curry3 = require('1-liners/curry3'),
	reduce = require('1-liners/reduce'),
	format = require('format-string'),
	async = require('async'),
	List = require('immutable').List,
	request = require('request');

var
	map = curry2(require('1-liners/map')),
	reduceFrom = curry3(require('1-liners/reduceFrom')),
	join = curry2(require('1-liners/join')),
	partition = curry2(require('partition-all')),
	joinNL = join('\n'),
	join2NL = join('\n\n');

function fetch(username, cb) {
	request(getRequestOptions(username), function(err, response, body) {
		if (err) cb(err);
		else cb(null, body);
	});
}

function getRequestOptions(username) {
	return {
		url: GH_URL + username,
		headers: {
			'User-Agent': 'request'
		}
	};
}

module.exports = function(users, cb) {
	cb = curry2(cb);

	var createRow = reduce(compose, [
		function(data) {
			return joinNL(map(join('|'))(data));
		},
		function(arr) {
			return reduceFrom(function(prev, user) {
				prev = prev.set(0, prev.get(0).push(format(' [:login](:html_url) ', user)));
				prev = prev.set(1, prev.get(1).push(':--:'));
				prev = prev.set(2, prev.get(2).push(format(' [![:login](:avatar_url&s=80)](:html_url) ', user)));
				return prev;
			})(List([List(), List(), List()]))(arr);
		}
	]);

	var createTable = reduce(compose, [
		cb(null),
		join2NL,
		map(function(users) {
			return createRow(users);
		}),
		partition(4),
		map(JSON.parse)
	]);

	async.map(users, fetch,
		function(err, results) {
			if (err) cb(err);
			else createTable(results);
		});
};
