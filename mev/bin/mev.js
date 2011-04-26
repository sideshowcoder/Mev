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
  , nodrrr = require('nodrrr')
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
	}
,	{
	  name: 'requests'
	,	string: '-r PATH, --requests=PATH'
	,	help: 'Requests to run'
	}
, {
    name: 'module'
  , string: '-m MODUL, --module=MODUL'
  , help: 'specify module to use currently availible: rdns'
  }
, {
    name: 'output'
  , string: '-o FILEOUT, --output=FILEOUT'
  , help: 'specify output to file instead of redis, with filename'
  }
, {
    name: 'dbidx'
  , string: '--idx'
  , help: 'specifiy the redis index to use to save the results'
  }
, {
    name: 'autoshutdown'
  , string: '--autoshutdown'
  , help: 'enable mev autoshutdown after last request, this is still really unstable!'
  }
, {
    name: 'growl'
  , string: '--growl'
  , help: 'turn on growl support'
  }
, {
    name: 'growlhost'
  , string: '--growlhost'
  , help: 'Host to sent growl notifications to defaults to localhost'
  }
, {
    name: 'growlpass'
  , string: '--growlpass'
  , help: 'Host remote growl password defaults to empty'
  }

]

// Parse opts
var options = nomnom.parseArgs(opts)


// Init
if (options.requests) {
  if(options.growl){
    // Growl specs
    var host = options.growlhost || 'localhost'
      , app = 'mev'
      , all = ['Mev status']
      , def = ['Mev status']
      , pass = options.growlpass || null
    // Setup
    var growl = new nodrrr.Nodrrr(host, app, all, def, pass);
    // Register
    growl.register()
  }
  // Load and run reverse dns
  if(options.module == 'rdns') {
    var module = new Rdns('rdns')
	    ,	mev = new Mev(module, options.requests, options.debug, options.stats, options.output, options.dbidx, options.autoshutdown)
    if(options.growl) growl.notify('Mev status', 'Mev RDNS resolver', 'RDNS resolver start', 0, false)
  ; mev.start()
    // Done without auto shutdown
    if(options.growl) growl.notify('Mev status', 'Mev RDNS resolver', 'RDNS resolver done', 0, false)
  ; process.exit(0);
  }
}

mev.on('shutdown', function(){
  // Done using auto shutdown
  if(options.growl) growl.notify('Mev stop', 'Mev RDNS resolver', 'RDNS resolver done', 0, false)
; process.exit(0);
})

// END WRAPPER
})()


















