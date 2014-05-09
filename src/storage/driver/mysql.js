var mysql = require('mysql');


var MysqlDriver = function(config) {
	this.config = config;
};

MysqlDriver.prototype.connect = function() {

	this.connection = mysql.createConnection({
		host: this.config.db.host,
		port: this.config.db.port,
		user: this.config.db.user,
		password: this.config.db.pass,
		database: this.config.db.name
	});

	this.connection.connect(function(err) {
		if(err) {
			console.error('error connecting: ' + err.stack);
			return;
		}

		console.log('connected as id ' + this.connection.threadId);
	}.bind(this));

};

MysqlDriver.prototype.persist = function(entity, cb) {

	var entry  = entity.entry;
	console.log(entry);
	var query = this.connection.query('INSERT INTO ' + entity.table + ' SET ?', entry, function(err, result) {
		cb(err);
	});
	console.log(query.sql);

};

module.exports = MysqlDriver;

