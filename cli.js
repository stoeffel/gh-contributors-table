#!/usr/bin/env node

var meow = require('meow');
var create = require('./');
var cli = meow({
    help: [
        'Usage',
        '  gh-contributors-table <conributor> [...contributor] [--cols=4]'
    ].join('\n')
});

create(cli.input, cli.flags.cols || 4, function(err, table) {
	if (err) process.stdout.write(err);
	else process.stdout.write(table);
});

