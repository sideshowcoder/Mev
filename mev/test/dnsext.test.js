var should = require('should'),
    assert = require('assert'),
		dnsext = require('../lib/dnsext');
		
module.exports = {
	
  'test create channels with nameserver': function(){
    dnsext.initChannelWithNs('8.8.8.8').should.be.a('number');
    dnsext.initChannelWithNs('8.8.4.4').should.be.a('number');
	},
	
	'test create channels without a nameserver': function(){
    dnsext.initChannelWithNs().should.be.a('number');	  
	},
	
	'test getHostByName': function(){
	  var defaultns = dnsext.initChannelWithNs();
	  dnsext.getHostByName(defaultns, 'www.google.de', function(err, domains){
	    assert.isNull(err);
	    domains.should.be.instanceof(Array).and.not.empty;
	  });
	  dnsext.getHostByName(defaultns, '253.in-addr.arpa', function(err, domains){
	    assert.isNotNull(err);
	    assert.isUndefined(domains);
	  });
	  var googlens = dnsext.initChannelWithNs('8.8.8.8');
	  dnsext.getHostByName(googlens, 'www.yahoo.com', function(err, domains){
	    assert.isNull(err);
	    domains.should.be.instanceof(Array).and.not.empty;	    
	  });
	  dnsext.getHostByName(defaultns, '252.in-addr.arpa', function(err, domains){
	    assert.isNotNull(err);
	    assert.isUndefined(domains);
	  });
	},
		
	'test resolveNs': function(){
	  var defaultns = dnsext.initChannelWithNs();
	  dnsext.resolveNs(defaultns, 'net.in.tum.de', function(err, domains){
	    assert.isNull(err);
	    domains.should.be.instanceof(Array).and.not.empty;
	  });
    dnsext.resolveNs(defaultns, '250.in-addr.arpa', function(err, domains){
	    assert.isNotNull(err);
	    assert.isUndefined(domains);
	  });	  
	  var googlens = dnsext.initChannelWithNs('8.8.8.8');
	  dnsext.getHostByName(googlens, 'www.ask.com', function(err, domains){
	    assert.isNull(err);
	    domains.should.be.instanceof(Array).and.not.empty;	    
	  });
    dnsext.resolveNs(googlens, '251.in-addr.arpa', function(err, domains){
	    assert.isNotNull(err);
	    assert.isUndefined(domains);
	  });	  	  
	}
	
}