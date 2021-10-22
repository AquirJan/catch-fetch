const AnyProxy = require('anyproxy');
const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec;

let rules = {
  summary: 'a rule to hack response',
  *beforeSendRequest(requestDetail) {
    if (requestDetail.url.match(/^https\:\/\/iotsdk.midea.com\/service\/2\/app_log/gi)) {
      const newRequestOptions = requestDetail.requestOptions;
      requestDetail.protocol = 'http';
      newRequestOptions.hostname = '127.0.0.1'
      newRequestOptions.port = '8037';
      newRequestOptions.path = '/abtest_config';
      newRequestOptions.method = 'POST';
      return requestDetail;
    }
  },
  *beforeDealHttpsRequest(requestDetail) { 
    return true;
   }
};
const options = {
  port: 8003,
  rule: rules,
  webInterface: {
    enable: true,
    webPort: 8004
  },
  throttle: 10000,
  dangerouslyIgnoreUnauthorized: true,
  forceProxyHttps: true, //开启https代理
  wsIntercept: true, // 不开启websocket代理
  silent: false
};

AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
  // let users to trust this CA before using proxy
  if (!error) {
    const certDir = require('path').dirname(keyPath);
    console.log('The cert is generated at', certDir);
    const isWin = /^win/.test(process.platform);
    if (isWin) {
      exec('start .', { cwd: certDir });
    } else {
      exec('open .', { cwd: certDir });
    }
  } else {
    console.error('error when generating rootCA', error);
  }
});
console.log(AnyProxy.utils.certMgr.ifRootCAFileExists(),'sssssssssssssss')
const proxyServer = new AnyProxy.ProxyServer(options);

proxyServer.on('ready', () => { console.log('准备完成');});
proxyServer.on('error', (e) => { console.log('失败！！'); });
proxyServer.start();

//when finished
// proxyServer.close();
