#!/usr/bin/env node

// START WRAPPER
;(function(){

  /* Reverse DNS resolver script for command line use
 * Author: Philipp Fehre <philipp.fehre@googlemail.com>
 * 
 * Provide a way to parallely resolve a massive number of Reverse DNS Requests
 * Uses Redis to Store requests as well as results
 *
 * This is part of the iStrukta Project for internet analyzation
 */

// Get libs for command line parsing and mev
var nomnom = require('nomnom')
	,	Mev = require('../lib/mev')
  ,	Rdns = require('../lib/rdns')

// 	I/O
var	sys = require('sys')
	,	fs = require('fs')

// Specify opts
var opts = [
	{	
		name: 'help'
	, string: '-h'
	,	help: 'Show help'
	}
,	{	
		name: 'debug'
	,	string: '-d'
	,	help: 'Debug mode logging everything done'
	}
,	{
		name: 'stats'
	,	string: '--stat'
	,	help: 'show status'
	},
	{
	  name: 'requests'
	,	string: '-r PATH, --requests=PATH'
	,	help: 'Requests to run'
	}
, {
    name: 'module'
  , string: '-m MODUL, --module=MODUL'
  , help: 'specify module to use currently availible: rdns'
  }
,
  {
    name: 'output'
  , string: '-o FILEOUT, --output=FILEOUT'
  , help: 'specify output to file instead of redis, with filename'
  }
,
  {
    name: 'autoshutdown'
  , string: '--autoshutdown'
  , help: 'enable mev autoshutdown after last request, this is still really unstable!'
  }
]

// Parse opts
var options = nomnom.parseArgs(opts)

// Init
if (options.requests) {
  // Load and run reverse dns
  if (options.module == 'rdns') {
  	var module = new Rdns('rdns')
	    ,	mev = new Mev(module, options.requests, options.debug, options.stats, options.output, options.autoshutdown)
    mev.start()
  }
}

mev.on('shutdown', function(){
  process.exit(0);
});
// END WRAPPER
})()


















