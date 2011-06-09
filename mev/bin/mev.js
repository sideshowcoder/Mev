#!/usr/bin/env node

(function(){
  
  /* Reverse DNS resolver script for command line use
   * Author: Philipp Fehre <philipp.fehre@googlemail.com>
   * 
   * Provide a way to parallely resolve a massive number of Reverse DNS Requests
   * Uses Redis to Store requests as well as results or write to csv file
   * 
   * Usage see mev -h
   *
   * This is part of the iStrukta Project for internet analyzation (http://measr.net/)
   */
  
  var nomnom = require('nomnom'),
      nodrrr = require('nodrrr'),
  		Mev = require('../lib/mev'),
    	Rdns = require('../lib/rdns'),
  	  sys = require('sys'),
  		fs = require('fs');
  
  var opts = [
  	{	
  		name: 'help',
  	  string: '-h',
  		help: 'Show help'
  	},
  	{	
  		name: 'debug',
  		string: '-d',
  		help: 'Debug mode logging everything done'
  	},
  	{
  	  name: 'requests',
  		string: '-r PATH, --requests=PATH',
  		help: 'Requests to run'
  	},
   {
      name: 'module',
      string: '-m MODUL, --module=MODUL',
      help: 'specify module to use currently availible: rdns'
    },
   {
      name: 'output',
      string: '-o FILEOUT, --output=FILEOUT',
      help: 'specify output to file with filename'
    },
   {
      name: 'autoshutdown',
      string: '--autoshutdown',
      help: 'enable mev autoshutdown after last request, this is still really unstable!'
    },
   {
      name: 'growl',
      string: '--growl',
      help: 'turn on growl support'
    },
   {
      name: 'growlhost',
      string: '--growlhost',
      help: 'Host to sent growl notifications to defaults to localhost'
    },
   {
      name: 'growlpass',
      string: '--growlpass',
      help: 'Host remote growl password defaults to empty'
    }
  ]
  
  var options = nomnom.parseArgs(opts)
    
  if (options.requests) {
    if(options.growl){
      // growl enabled so get the config and setup
      var host = options.growlhost || 'localhost',
          app = 'mev',
          all = ['Mev status'],
          def = ['Mev status'],
          pass = options.growlpass || null;
      var growl = new nodrrr.Nodrrr(host, app, all, def, pass);
      growl.register();
    }
    if(options.module == 'rdns') {
      // Using reverse dns module so create and run
      var module = new Rdns('rdns'),
  	    	mev = new Mev(module, options.requests, options.debug, options.stats, options.output);
      if(options.growl) growl.notify('Mev status', 'Mev RDNS resolver', 'RDNS resolver start', 0, false);
      mev.start();
    }
  }  
})()


















