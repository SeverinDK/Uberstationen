var config = require('../../assets/config'),
	MysqlDriver = require('../../src/storage/driver/mysql');


var Message = function(entry) {

	//Load database
	if(config.db.driver !== 'mysql') {
		throw Error('Unsupported driver ' + config.db.driver);
	}

	this.storage = new MysqlDriver(config);
	this.storage.connect();
	this.entry = entry;
};


Message.prototype.save = function(cb) {
	console.log('SAVE CALLED', this.entry);
	var message = {
		user_id: this.entry.user_id,
		room_id: this.entry.room_id,
		message: this.entry.message
	};

	var entity = {
		table: 'chat_messages',
		entry: message
	};

	this.storage.persist(entity, function(err) {
		cb(err)
	});

};

module.exports = Message;