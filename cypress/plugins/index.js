module.exports = (on) => {
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') { 
      args.push('--proxy-bypass-list=<-loopback>')
      return args
    }
  })
}