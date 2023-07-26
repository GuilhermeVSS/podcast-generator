const mongoose = require('mongoose');
require('dotenv').config();

class Database {
  async init() {
    mongoose.connect(
      process.env.STRING_CONNECTION,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
  }

  async close() {
    mongoose.connection.close();
  }
}

module.exports = new Database();