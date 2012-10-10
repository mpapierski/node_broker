# node_broker

The aim of this library is to make messaging in node.js as easy as possible by providing idiomatic high-level interface for various "pubsub" providers such as AMQP, Redis, and others.

I am still learning node.js and this module started as a quick hack over a node_amqp which does not support ancient RabbitMQ found in lucid32 that I am still running. I switched to Redis, and while I will find some time to upgrade and have a recent RabbitMQ this library will be able to support Redis, RabbitMQ and others with same interface… There are no tests, you can not install it with npm (yet as I am still figuring this thing out). Pull requests appreciated so I can learn more on this.

# Examples

You can connect to a "broker" service. Subscribe to a channel passing a callback which will be executed for each message in this channel.

	var broker = new Broker();
	broker.subscribe('channel.a', function (channel, message) {
		console.log('got a message on channel.a:', message);
		broker.unsubscribe('channel.a');
	});

# Supported services

* Redis (pubsub)
* RabbitMQ
