var redis = require('redis');
var events = require('events');

module.exports = Broker;

/**
 * Broker object
 */
function Broker () {
	events.EventEmitter.call(this);
	var self = this;
	// channel -> callback mapping
	self.callbacks = {};
	self.connection = redis.createClient();
	/**
	 * Emit connected event when ready.
	 */
	self.connection.on('ready', function () {
		self.emit('connected', self);
	});
	/**
	 * Subscribed to channel.
	 */
	self.connection.on('subscribe', function (channel, count) {
		console.log('subscribed to', channel, count);
	});
	/**
	 * Unsubscribed from channel.
	 */
	self.connection.on('unsubscribe', function (channel, count) {
		if (channel in self.callbacks) {
			console.log('unsubscribed from', channel);
			delete self.callbacks[channel];
			return;
		}
		console.log('unknown channel', channel);
	});
	/**
	 * Got message. Match a valid callback for channel and execute.
	 */
	self.connection.on('message', function (channel, message) {
		if (channel in self.callbacks) {
			self.callbacks[channel](channel, message);
			return;
		}
		console.log('unknown callback for channel', channel);
	});
}

Broker.super_ = events.EventEmitter;
Broker.prototype = Object.create(events.EventEmitter.prototype, {
	constructor: {
		value: Broker,
		enumerable: false
	}
});

/**
 * Subscribe to a channel with callback.
 * @param channel Channel name (exact name, not wildcard!)
 */
Broker.prototype.subscribe = function(channel, callback) {
	var self = this;
	console.log('subscribing to', channel);
	self.callbacks[channel] = callback;
	self.connection.subscribe(channel);
	return self;
}

/**
 * Unsubscribe from a channel
 * @param channel Channel name (exact name, not wildcard!)
 */
Broker.prototype.unsubscribe = function(channel) {
	var self = this;
	console.log('unsubscribing from', channel);
	self.connection.unsubscribe(channel);
}
