const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: {
        type: String
    },
    summary: {
        type: String
    },
    body: {
        type: String
    },
    images: [{
        type: String
      }],
    date: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String
    },
    eventDate: {
        type: Date
    },
    author: {
        type: String
    },
    admin: {
        type: String
    }
})

const databaseName = process.env.DATABASE_NAME || "IeeeEvents";
module.exports = new mongoose.model(databaseName, eventSchema);
