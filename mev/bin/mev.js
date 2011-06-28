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
  	  string: '-h, --help',
  		help: 'Show help'
  	},
  	{	
  		name: 'debug',
  		string: '-d, --debug',
  		help: 'Debug mode logging everything done'
  	},
    {
      name: 'module',
      string: '-m MODUL, --module=MODUL',
      help: 'specify module to use currently availible: rdns'
    },
    {
      name: 'file',
      string: '-f, --file',
      help: 'specify output and input as a file'
    },    
    {
      name: 'host',
      string: '--host',
      help: 'specify host for tcp socket, defaults to localhost'
    },
  	{
  	  name: 'input',
  		string: '-i INPUT, --input=INPUT',
  		help: 'Input is read form this, if -f is specified this is a file'
  	},
    {
      name: 'output',
      string: '-o OUTPUT, --output=OUTPUT',
      help: 'output is written to this, if -f is given this is a file'
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
  
  var options = nomnom.parseArgs(opts);
  
  // Setup growl  
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
  
  // Setup and start mev
  if(options.input && options.output){
    
    function initMev(ind, outd, flags){
      if(options.module == 'rdns') {
        // Using reverse dns module so create and run
        var module = new Rdns('rdns'),
        	  mev = new Mev(module, ind, outd, flags);
        if(options.growl) growl.notify('Mev status', 'Mev RDNS resolver', 'RDNS resolver start', 0, false);
        mev.init();
      }
    }

    // Setup input / output
    var si;
    if(options.file){
      // Input and output as file 
      flags = { debug: options.debug, file: true },
      initMev(options.input, options.output, flags);
    } else {
      // Open input / output either beeing unix or tcp socket
      si = net.createServer()
      // Input socket
      if(parseFloat(options.input)) {
        si.listen(parseFloat(options.input), 'localhost', function(){
          flags = { debug: options.debug, file: false },
          initMev(options.input, options.output, flags);
        });
      } else {
        try {
          si.listen(options.input, function(){
            flags = { debug: options.debug, file: false },
            initMev(options.input, options.output, flags);
          });
        } catch(err) {
          console.log('Path to unix input socket is invalid');
        }
      }
    }
  } else {
    // Missing needed options printing help
    console.log(nomnom.getUsage());
  } 
  
})()


















