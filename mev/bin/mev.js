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
  		fs = require('fs'),
  		net = require('net');
  
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
  		string: '-r INPUT, --requests=INPUT',
  		help: 'Requests to run either as unix or tcp socket to read from'
  	},
    {
      name: 'module',
      string: '-m MODUL, --module=MODUL',
      help: 'specify module to use currently availible: rdns'
    },
    {
      name: 'output',
      string: '-o OUTPUT, --output=OUTPUT',
      help: 'specify output to either tcp or unix socket'
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
    
    // Open input
    var i, o, s;
    s = net.createServer(function(input){
      i = input;
    })
    if(parseFloat(options.requests)) {
      s.listen(parseFloat(options.requests), 'localhost');
    } else {
      try {
        s.listen(options.requests);
      } catch(err) {
        console.log('Path to unix input socket is invalid');
      }
    }
    // Open output
    try {
      o = net.createConnection(options.output);
    } catch(err) {
      console.log('Output socket is invalid');      
    }
    
    if(options.module == 'rdns') {
      // Using reverse dns module so create and run
      var module = new Rdns('rdns'),
  	    	mev = new Mev(module, i, o, options.debug);
      if(options.growl) growl.notify('Mev status', 'Mev RDNS resolver', 'RDNS resolver start', 0, false);
      mev.start();
    }
  }  
  
  mev.on('shutdown', function{
    if(options.growl) growl.notify('Mev status', 'Mev RDNS resolver', 'RDNS resolver done', 0, false);    
  });
  
})()


















