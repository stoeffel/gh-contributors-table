'use strict';
var
	GH_URL = 'https://api.github.com/users/',
	compose = require('1-liners/compose'),
	curry2 = require('1-liners/curry2'),
	curry3 = require('1-liners/curry3'),
	map = curry2(require('1-liners/map')),
	reduce = require('1-liners/reduce'),
	reduceFrom = curry3(require('1-liners/reduceFrom')),
	join = curry2(require('1-liners/join')),
	async = require('async'),
	request = require('request');

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

	var createTable = reduce(compose, [
		cb(null),
		function(data) {
			return join('\n')(map(join('|'))(data));
		},
		reduceFrom(function(prev, user) {
			prev[0].push(' [' + user.login + '](' + user.url + ') ');
			prev[1].push(':--:');
			prev[2].push(' [![' + user.login + '](' + user.avatar_url + '&s=80)](' + user.url + ') ');
			return prev;
		})([[], [], []]),
		map(JSON.parse)
	]);

	async.map(users, fetch,
		function(err, results) {
			if (err) cb(err);
			else createTable(results);
		});
};
