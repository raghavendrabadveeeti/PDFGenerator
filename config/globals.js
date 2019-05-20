var reader = require('properties-reader');

let properties = reader('application.properties');

function getRemoteServerURL() {
  return properties.get('ui.application.url');
}

var Globals = {
  'remoteServerURL': getRemoteServerURL
}

module.exports = Globals;



