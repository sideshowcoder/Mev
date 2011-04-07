/* Reverse DNS measurement module for Mev
 * Author: Philipp Fehre <philipp.fehre@googlemail.com>
 * 
 * Provide a way to parallely resolve a massive number of Reverse DNS Requests
 * Uses Redis to Store requests as well as results
 *
 * This is part of the iStrukta Project for internet analyzation
 * 
 */

var mev = require(__dirname + '/mev')
	,	dnsext = require(__dirname + '/dnsext')
	,	EventEmitter = require('events').EventEmitter
	,	sys = require('sys')

function RDNS(id, timeout) {
	
	// setup
	var self = this
		, _timeout
; self.id = id
	self.channels = {}
  self.channels['default'] = dnsext.initChannelWithNs()
	// Default timeout is 5 sek
;	(timeout) ? _timeout = timeout : _timeout = 5000
	
	
	// ready a given ip to be requested via it's reverse name
	this.arpafy = function(ip) {
		return ip.split('.').reverse().join('.').concat('.in-addr.arpa');
	};
	
	this.finishRes = function(result){
		self.emit('done', result['result']);
	};
	
	// Read input from a file
	this.readInput = function(indata){
		// Parse Data
		var ip, ns; 
		indata.split(',').forEach(
			function(el, idx, ary){
				var e = el.trim();
				(idx == 0) ? ip = e : ns = e;
			});
		if(!ns) {
			ns = undefined;
			nsl = undefined;
		} else {
			nsl = new Array(ns);
		}
		var data = {
			'data': {'ip': ip, 'cns': ns, 'nsl': nsl }};
		self.emit('data', data);
	};
	
	// Generate requests from data 
	this.genReq = function(data){
		var d = data['data']
		  , reqs = [] 
	
		// Create correct request
		if(d['nsl']){
      var iplength = d['ip'].split('.').length
			if(iplength == 4) {
				var data = {
					'data': {
						'ip': d['ip']
					,	'cns' : d['cns']
					,	'nsl': d['nsl']
					,	'reqnsl': false
					,	'ptr': true
					}
				}
				self.emit('request', data)
			} else {
				// Generate request for the next 256 subnets
				for(var i = 0; i<256; i++){
					var data = {
						'data': {
							'ip': d['ip'] + '.' + i
						,	'cns': d['cns']
						,	'nsl': d['nsl']
						}
					}
					self.emit('data', data)
				}
			}
    } else {
			var data = {
        'data': {
          'ip': d['ip']
				,	'reqnsl': true
				,	'ptr': false
				}
			}
			self.emit('request', data)
		}
	};
	
	// Run a given Request
	this.runReq = function(req){
		var _req = req['data']
      , nextreq
		  , channel
      , td
      , nextns

    // Construct the next request to be emitted if the current does not return
    // it is run against the next nameserver in the list if availible 
    try {
      nextns = _req['nsl'][1] 
      if(nextns) { 
        nextreq = {
          'data': {
            'ip': _req['ip']
          , 'cns': nextns
          , 'nsl': _req['nsl'].slice(1)
          , 'reqnsl': _req['reqnsl']
          , 'ptr': _req['ptr']
          }
        }
        td = setTimeout(function(){self.emit('request', nextreq)}, _timeout)
      }
    } catch(err) {
      // No next request can be constructed
    }
				
	;	var passResult = function(err, domains){
			if(!err) {
        if(td) clearTimeout(td)
			;	self.emit('result', { 'req': req, 'res': domains });
			}
		}
		
		var dolookup = function(channel){
			if(_req['ptr']) {
				dnsext.reverse(channel, _req['ip'], passResult);
			} else {
        if(_req['ip'].split('.').length == 4) {
  				dnsext.resolveNs(channel, self.arpafy(_req['ip'].split('.').splice(0, 3).join('.')), passResult)
        } else {
  				dnsext.resolveNs(channel, self.arpafy(_req['ip']), passResult)
        }
			}
		}


		
		if(typeof(self.channels[_req['cns']]) === 'undefined') {
			if(_req['reqnsl'] ) {				
				dolookup(self.channels['default']);
			} else {
				dnsext.getHostByName(self.channels['default'], _req['cns'], function(err, domains){
					if(!err) {
						_req['cns'] = domains[0];
						self.channels[domains[0]] = dnsext.initChannelWithNs(domains[0]);
						dolookup(self.channels[domains[0]]);
					} else {
            // try same request again some time later
            setTimeout(function(){self.emit('request', req)}, _timeout + 10000 * Math.random());
					}
				});
			}
		} else {
			dolookup(self.channels[_req['cns']]);
		}	 
		
	};
	
	// Handle the result returned form a request
	this.handleRes = function(res){
		var _req = res['req']['data']
			,	_res = res['res']
			,	_err = res['error']
				
		if(_req['ptr'] && !_err){
		  self.finishRes({'result': { 'key':_req['ip'], 'value':_res}})
    }
    if(_req['reqnsl'] && !_err){
			var data = {
        'data': {
          'ip': _req['ip']
				,	'cns': _res[0]
				,	'nsl': _res
				,	'reqnsl': false 
				,	'ptr': false
				}
      }
			self.emit('data', data);
		}
	}
}

// Extend EventEmitter
RDNS.prototype = new EventEmitter

// Export
module.exports = RDNS
