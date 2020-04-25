'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var bitcore = require('bitcore-lib');
var BufferWriter = bitcore.encoding.BufferWriter;
var BufferReader = bitcore.encoding.BufferReader;
var BN = bitcore.crypto.BN;

var utils = require('../utils');
var packageInfo = require('../../../package.json');

/**
 * The version message is used on connection creation to advertise
 * the type of node. The remote node will respond with its version, and no
 * communication is possible until both peers have exchanged their versions.
 *
 * @see https://en.bitcoin.it/wiki/Protocol_documentation#version
 * @param {Object=} arg - properties for the version message
 * @param {Buffer=} arg.nonce - a random 8 byte buffer
 * @param {String=} arg.subversion - version of the client
 * @param {BN=} arg.services
 * @param {Date=} arg.timestamp
 * @param {Number=} arg.startHeight
 * @param {Object} options
 * @extends Message
 * @constructor
 */
function VersionMessage(arg, options) {
  /* jshint maxcomplexity: 10 */
  if (!arg) {
    arg = {};
  }
  Message.call(this, options);
  this.command = 'version';
  this.version = arg.version || options.protocolVersion;
  this.nonce = arg.nonce || utils.getNonce();
  this.services = arg.services || new BN(1, 10);
  this.timestamp = arg.timestamp || new Date();
  this.subversion = arg.subversion || '/bitcore:' + packageInfo.version + '/';
  this.startHeight = arg.startHeight || 0;
  this.relay = arg.relay === false ? false : true;
}
inherits(VersionMessage, Message);

VersionMessage.prototype.setPayload = function(payload) {
  //console.log("parse version message =========================ffffffffffffff")
  var parser = new BufferReader(payload);
  this.version = parser.readUInt32LE();
  this.services = parser.readUInt64LEBN();
  this.timestamp = new Date(parser.readUInt64LEBN().toNumber() * 1000);
  this.addrMe = {
    services: parser.readUInt64LEBN(),
    ip: utils.parseIP(parser),
    port: parser.readUInt16BE()
  };  
  var b=parser.readVarintNum();
  if(b<=65){
    var pubkey=parser.read(b)
  }
  var datasign=parser.readVarLengthBuffer();
  this.addrYou = {
    services: parser.readUInt64LEBN(),
    ip: utils.parseIP(parser),
    port: parser.readUInt16BE()
  };
  this.nonce = parser.read(8);
  this.subversion = parser.readVarLengthBuffer().toString();
  this.startHeight = parser.readUInt32LE();
  parser.readUInt32LE();
  
  if(parser.finished()) {
    this.relay = true;
  } else {
    this.relay = !!parser.readUInt8();
  }
  //utils.checkFinished(parser);
};

VersionMessage.prototype.getPayload = function() {
  var bw = new BufferWriter();
  bw.writeUInt32LE(this.version);
  //bw.writeUInt64LEBN(this.services);  0
  bw.writeUInt64LEBN(new BN(0,10));
  var timestampBuffer = new Buffer(Array(8));
  timestampBuffer.writeUInt32LE(Math.round(this.timestamp.getTime() / 1000), 0);
  bw.write(timestampBuffer);

  utils.writeAddr(this.addrMe, bw);
  var pubkey=Buffer.from([4,32,-109,100,7,29,-74,81,64,-61,-79,-121,-24,-19,-43,-5,-101,-85,63,12,82,101,-111,-25,60,-89,-39,-35,60,100,-93,78,-65,-105,71,-57,-101,
  -31,-27,68,75,-12,82,14,108,-61,71,20,-98,-9,-65,-106,2,-17,-20,-24,111,-85,64,-34,-91,-11,91,60,13])
  bw.write(pubkey)
  var dataSign=Buffer.from([48,70,2,33,0,-41,20,22,77,-8,-124,64,-19,-119,118,70,-3,66,-88,-68,28,-86,-71,-48,-52,7,111,6,-24,127,-56,86,-9,126,3,8,4,2,33,0,-91,-118,
  91,-32,50,126,-40,-128,-12,7,-43,-54,-119,-18,55,-3,37,17,-123,-68,-70,73,-45,58,-31,-126,-95,-55,96,-38,79,-66])
  bw.write(dataSign)
  utils.writeAddr(this.addrYou, bw);
  bw.write(this.nonce);
  var subversion="VDS+ 2.3.2"
  bw.writeVarintNum(subversion.length);
  bw.write(new Buffer(subversion, 'UTF-8'));
  bw.writeUInt32LE(this.startHeight);
  bw.writeUInt32LE(0);
  bw.writeUInt8(this.relay);

  return bw.concat();
};

module.exports = VersionMessage;
