var assert = require('assert'),
    should = require('should'),
    Mev = require('../lib/mev'),
    RDNS = require('../lib/rdns');

module.exports = {
  
  'test arpafy IP address': function(){
    var rdns = new RDNS('rdns');
    rdns.arpafy('1').should.be.a('string').and.eql('1.in-addr.arpa'); 
    rdns.arpafy('1.2').should.be.a('string').and.eql('2.1.in-addr.arpa'); 
    rdns.arpafy('1.2.3').should.be.a('string').and.eql('3.2.1.in-addr.arpa'); 
    rdns.arpafy('1.2.3.4').should.be.a('string').and.eql('4.3.2.1.in-addr.arpa'); 
  },

  'test channel initilization': function(){
    var rdns = new RDNS('rdns');	
    rdns.channels['default'].should.be.a('number');
  },

  'test finish emit done': function(){
    var rdns = new RDNS('rdns'),
        data = { 'result':1 };
    rdns.on('done', function(res){
      res.should.eql(data['result']);
    });
    rdns.finishRes(data);
  },

  'test read input': function(){
    var rdns = new RDNS('rdns');
        outdata = { 'data': {
          'ip': '131.159.20.143', 
          'cns': '8.8.4.4', 
          'nsl': ['8.8.4.4']
        }};

    rdns.on('data', function(data){
      data.should.eql(outdata);
    });

    rdns.readInput('131.159.20.143 , 8.8.4.4');
  },

  'test request generation nameserver incomplete ip': function(){
    var rdns = new RDNS('rdns'),
        indata = { 'data': {
          'ip': '131.159', 
          'cns': '8.8.4.4', 
          'nsl': ['8.8.4.4'], 
        }},
        outdata = { 
          'ip': /131\.159\.(\d{1,3})/,
          'cns': '8.8.4.4', 
          'nsl': ['8.8.4.4'], 
        }

    rdns.on('data', function(data){
      data = data['data'];
      data['ip'].should.match(outdata['ip']);
      data['cns'].should.eql(outdata['cns']);
      data['nsl'].should.eql(outdata['nsl']);
    });

    rdns.genReq(indata); 
  },

  'test request for ptr use passed nameserver': function(){
    var rdns = new RDNS('rdns'),
        indata = { 'data': {
          'ip': '131.159.1', 
          'cns': '8.8.4.4', 
          'nsl': ['8.8.4.4'], 
          'reqnsl': false, 
          'ptr': false, 
          }},
        outdata = { 
          'ip': /131\.159\.(\d{1,3})/,
          'cns': '8.8.4.4', 
          'nsl': ['8.8.4.4'], 
					'reqnsl': false,
					'ptr': true,
					};

    rdns.on('request', function(request){
      request = request['request'];
      request['ip'].should.match(outdata['ip']);
      request['cns'].should.eql(outdata['cns']);
      request['nsl'].should.eql(outdata['nsl']);
      request['reqnsl'].should.eql(outdata['reqnsl']);
      request['ptr'].should.eql(outdata['ptr']);
    });
    
    rdns.genReq(indata);
  
  },

  'test request generation nameserver without another nameserver availible': function(){
    var rdns = new RDNS('rdns'),
        indata = { 'data': {
          'ip': '131.159.20.143', 
          'cns': '8.8.4.4', 
          'nsl': ['8.8.4.4'], 
          'reqnsl': false, 
          'ptr': false, 
          }},
        req = {
          'ip': '131.159.20.143', 
          'cns': '8.8.4.4', 
          'nsl': ['8.8.4.4'], 
					'reqnsl': false,
					'ptr': true };

    rdns.on('request', function(request){
      request = request['data'];
      request['ip'].should.eql(req['ip']);
      request['cns'].should.eql(req['cns']);
      request['nsl'].should.eql(req['nsl']);
      request['reqnsl'].should.eql(req['reqnsl']);
      request['ptr'].should.eql(req['ptr']);
    });

    rdns.genReq(indata); 
    
  },
  
  'test request generation nameserver with another nameserver availible': function(){
    var rdns = new RDNS('rdns'),
        indata = { 'data': {
          'ip': '131.159.20.143', 
          'cns': '8.8.4.4', 
          'nsl': ['8.8.4.4', '8.8.8.8'], 
          }},
        outdata = {
          'ip': '131.159.20.143', 
          'cns': '8.8.8.8', 
          'nsl': ['8.8.4.4', '8.8.8.8'], 
					'reqnsl': false,
					'ptr': true },
        req = {
          'ip': '131.159.20.143', 
          'cns': '8.8.4.4', 
          'nsl': ['8.8.4.4', '8.8.8.8'], 
					'reqnsl': false,
					'ptr': true };

    rdns.on('request', function(request){
      request = request['data'];
      request['ip'].should.eql(req['ip']);
      request['cns'].should.eql(req['cns']);
      request['nsl'].should.eql(req['nsl']);
      request['reqnsl'].should.eql(req['reqnsl']);
      request['ptr'].should.eql(req['ptr']);
    });

    rdns.on('data', function(data){
      data = data['data'];
      data['ip'].should.eql(outdata['ip']);
      data['cns'].should.eql(outdata['cns']);
      data['nsl'].should.eql(outdata['nsl']);
      data['reqnsl'].should.eql(outdata['reqnsl']);
      data['ptr'].should.eql(outdata['ptr']);
    });

    rdns.genReq(indata); 
  },
	
  'test request generation no nameserver': function(){
    var rdns = new RDNS('rdns'),
        indata = { 'data': {
          'ip': '131.159', 
          'reqnsl': false, 
          'ptr': false, 
          }},
				req = { 'data': {
					'ip': '131.159',
					'reqnsl': true,
					'ptr': false,
					}};

    rdns.on('request', function(request){
      request.should.eql(req)
    });
    
    rdns.genReq(indata);
  },

  'test run request pointer': function(){
    var rdns = new RDNS('rdns'),
        request = { 'data': {
          'ip': '131.159.20.143', 
          'cns': '131.159.14.206', 
          'nsl': ['131.159.20.206'], 
					'reqnsl': false,
					'ptr': true,
			  }};

    rdns.on('result', function(result){
      result['req'].should.eql(request);
      result['res'].should.contain('charlie.net.in.tum.de');
    });

    rdns.runReq(request);

  },
  
  'test run request multiple nameservers first one wrong': function(){
    var rdns = new RDNS('rdns'),
        request = { 
          'data': {
            'ip': '127'
          , 'cns': '127.0.0.1'
          , 'nsl': ['127.0.0.1', '8.8.8.8']
		  		,	'reqnsl': true
			  	,	'ptr': false
          }
        }
      , nextreq = { 
          'data': {
            'ip': '127'
          , 'cns': '8.8.8.8'
          , 'nsl': ['8.8.8.8']
		  		,	'reqnsl': true
			  	,	'ptr': false
          }
        }

    rdns.on('request', function(request){
      request.should.eql(nextreq)
    });

    rdns.runReq(request);
  },

  'test run request multiple nameservers cancel timeout on resolve': function(){
    var rdns = new RDNS('rdns')
      , request = { 
          'data': {
            'ip': '131'
          , 'cns': '8.8.8.8'
          , 'nsl': ['8.8.8.8', '8.8.4.4']
		  		,	'reqnsl': true
			  	,	'ptr': false
          }
        }
      , expected = { 
          'req': { 
            'data': { 
              'ip': '131'
            , 'cns': '8.8.8.8'
            , 'nsl': ['8.8.8.8', '8.8.4.4']
            , 'reqnsl': true
            , 'ptr': false 
            } 
          }
      }

    rdns.on('request', function(req){
      //intentionally fails because the timeout should be canceled so this should 
      //be never called
      false.should.be.ok
    });

    rdns.on('result', function(result){
      result['req'].should.eql(expected['req'])
      result['res'].should.contain('y.arin.net', 'u.arin.net')
    });

    rdns.runReq(request);
  },
  
  'test run request nameserver': function(){
    var rdns = new RDNS('rdns'),
        request = { 'data': {
          'ip': '131', 
          'cns': '131.159.14.206', 
          'nsl': ['131.159.20.206'], 
					'reqnsl': true,
					'ptr': false,
					'td': undefined }};

    rdns.on('result', function(result){
      result['req'].should.eql(request);
      result['res'].should.contain('y.arin.net', 'u.arin.net');
    });

    rdns.runReq(request);
  }, 

  'test handle result pointer': function(){
    var rdns = new RDNS('rdns'),
        result = { 
          'req' : {
            'data': {
              'ip': '131.159.20.143', 
              'cns': '131.159.14.206', 
              'nsl': ['131.159.20.206'], 
					    'reqnsl': false,
					    'ptr': true,
					    'td': undefined }},
          'res': ['charlie.net.in.tum.de'] },
        outres = { 'key': '131.159.20.143', 'value': [ 'charlie.net.in.tum.de' ] };

    rdns.on('done', function(res){
      res.should.eql(outres);
    });

    rdns.handleRes(result); 
  },

  'test handle result nameserverlist': function(){
    var rdns = new RDNS('rdns'),
        result = { 
          'req' : {
            'data': {
              'ip': '131.159.20.143', 
              'cns': '131.159.14.206', 
              'nsl': ['131.159.20.206'], 
					    'reqnsl': true,
					    'ptr': false
					   }
          },
          'res': ['y.arin.net', 'u.arin.net'] },
        outdata = { 
          'data': {
            'ip': '131.159.20.143', 
            'cns': 'y.arin.net', 
            'nsl': ['y.arin.net', 'u.arin.net'], 
            'reqnsl': false, 
            'ptr': false
          }
        }

    rdns.on('data', function(data){
      data.should.eql(outdata);
    });
    
    rdns.handleRes(result); 
  },
}
