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
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {timestamps : true})

eventSchema.pre('update', function (next) {
    const update = this._update.$set || this._update;
    const isSettingFeatured = update.isFeatured;

    if (isSettingFeatured) {
        this.model.updateMany({ _id: { $ne: this._conditions._id } }, { $set: { isFeatured: false } })
            .exec()
            .then(() => next())
            .catch(err => next(err));
    } else {
        next();
    }
});

eventSchema.pre('findOneAndUpdate', function (next) {
    const isSettingFeatured = this._update.isFeatured;

    if (isSettingFeatured) {
        this.model.updateMany({ _id: { $ne: this._conditions._id } }, { $set: { isFeatured: false } })
            .exec()
            .then(() => next())
            .catch(err => next(err));
    } else {
        next();
    }
});


const databaseName = process.env.DATABASE_NAME || "IeeeEvent";
module.exports = new mongoose.model(databaseName, eventSchema);
