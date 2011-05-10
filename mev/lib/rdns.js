/* Reverse DNS measurement module for Mev
 * Author: Philipp Fehre <philipp.fehre@googlemail.com>
 * 
 * Provide a way to parallely resolve a massive number of Reverse DNS Requests
 * Uses Redis to Store requests as well as results
 *
 * This is part of the iStrukta Project for internet analyzation
 * 
 */

var mev = require(__dirname + '/mev'),
	  dnsext = require(__dirname + '/dnsext'),
		EventEmitter = require('events').EventEmitter,
		sys = require('sys');

function RDNS(id, timeout) {
	
	var that = this,
	    _timeout;
	    
  that.id = id;
	that.channels = {};
  that.channels['default'] = dnsext.initChannelWithNs();
	// Default timeout is 5 sek
	(timeout) ? _timeout = timeout : _timeout = 5000;
	
	
	// reverse name for given IP address
	that.arpafy = function(ip) {
		return ip.split('.').reverse().join('.').concat('.in-addr.arpa');
	};
	
	// finial
	that.finishRes = function(result){
		that.emit('done', result['result']);
	};
	
	// read input
	that.readInput = function(indata){
		var ip, 
		    ns,
		    data;
		    
		indata.split(',').forEach( function(el, idx, ary){
      var e = el.trim();
      (idx == 0) ? ip = e : ns = e;
		});
		
		if(!ns) {
			ns = undefined;
			nsl = undefined;
		} else {
			nsl = [ns];
		}
		
		data = { ip: ip, cns: ns, nsl: nsl };
		that.emit('data', data);
	};
	
	// Generate requests from data 
	that.genReq = function(data){
		var reqs = [],
		    iplength,
		    d;
	
		// Create correct request
		if(data.nsl){
      iplength = d.ip.split('.').length
			if(iplength == 4) {
				d = {
				  ip: data.ip,
					cns: data.cns,
          nsl: data.nsl,
					reqnsl: false,
					ptr: true
				}
				that.emit('request', d)
			} else {
				// Generate request for the next 256 subnets
				for(var i = 0; i<256; i++){
					d = {
						ip: data.ip + '.' + i,
						cns: data.cns,
						nsl: d.nsl,
						reqnsl: true
					}
					that.emit('data', d)
				}
			}
    } else {
			d = {
			  ip: data.ip,
				reqnsl: true,
				ptr: false
			}
			that.emit('request', d)
		}
	};
	
	// Run a given Request
	that.runReq = function(req){
		var nextreq,
		    channel,
        td,
        nextns,
        passResult;

    // Construct the next request to be emitted if the current does not return
    // it is run against the next nameserver in the list if availible 
    try {
      nextns = req.nsl[1];
      if(nextns) { 
        nextreq = {
          ip: req.ip,
          cns: nextns,
          nsl: req.nsl.slice(1),
          reqnsl: req.reqnsl,
          ptr: req.ptr,
        }
        td = setTimeout(function(){ that.emit('request', nextreq) }, _timeout);
      }
    } catch(err) {
      // No next request can be constructed... done here
    }
				
	  passResult = function(err, domains){
			if(!err) {
        if(td) clearTimeout(td);
			  that.emit('result', { req: req, res: domains });
			}
		};
		
		var dolookup = function(channel){
			if(req.ptr) {
				dnsext.reverse(channel, req.ip, passResult);
			} else {
        if(req.ip.split('.').length == 4) {
  				dnsext.resolveNs(channel, that.arpafy(req.ip.split('.').splice(0, 3).join('.')), passResult)
        } else {
  				dnsext.resolveNs(channel, that.arpafy(req.ip), passResult)
        }
			}
		};


		if(typeof(that.channels[req.cns]) === undefined) {
      // The nameserver is not present yet
			if(req.reqnsl ) {				
        // A nameserver list is to be requested
				dolookup(that.channels.default);
			} else {
        // The nameserver needs to be looked up afterwards the request is run
				dnsext.getHostByName(that.channels.default, req.cns, function(err, domains){
					if(!err) {
						req.cns = domains[0];
						that.channels[domains[0]] = dnsext.initChannelWithNs(domains[0]);
						dolookup(that.channels[domains[0]]);
					}
				});
			}
		} else {
			dolookup(that.channels[req.cns]);
		}	 
	};
	
	// Handle the result returned form a request
	that.handleRes = function(res){
		var req = res.req,
				res = res.res,
			  err = res.error,
			  data;
				
		if(req.ptr && !err){
		  that.finishRes({result: { key:req.ip, value:res}})
    }
    if(req.reqnsl && !err){
			data = {
        ip: req.ip,
			  cns: res[0],
			  nsl: res,
			  reqnsl: false,
			  ptr: false
      }
			that.emit('data', data);
		}
	};
}

// Extend EventEmitter
RDNS.prototype = new EventEmitter

// Export
module.exports = RDNS
