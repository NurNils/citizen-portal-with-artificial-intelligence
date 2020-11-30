const mongoose = require('mongoose');

/** Training schema */
const TRAINING = (module.exports = mongoose.model(
  'Training',
  mongoose.Schema({
    /** Search term */
    search: {
      type: String,
      required: true,
      min: 3,
      max: 250,
      index: {
        unique: true,
      },
    },

    /** Category (output of neural network) */
    category: {
      type: String,
      required: true,
      enum: ['corona', 'kfz'],
    },

    /** User _id who added the training */
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },

    /** Trained */
    trained: {
      type: Boolean,
      required: true,
    },
  })
));

/** Get all */
module.exports.getAll = (callback, limit) => {
  TRAINING.find(callback).limit(limit);
};

/** Get all count */
module.exports.getAllCount = (callback) => {
  TRAINING.countDocuments(callback);
};

/** Get all not trained searches */
module.exports.getNotTrainedSearches = (callback) => {
  TRAINING.find({ trained: false }, callback);
};

/** Update all not trained searches */
module.exports.updateNotTrainedSearches = (callback) => {
  TRAINING.updateMany({ trained: false }, { trained: true }, {}, callback);
};

/** Get by _id */
module.exports.get = (_id, callback) => {
  TRAINING.findOne({ _id }, callback);
};

/** Get by userId */
module.exports.getByUserId = (userId, callback) => {
  TRAINING.find({ userId }, callback);
};

/** Delete by _id */
module.exports.delete = (_id, callback) => {
  TRAINING.deleteOne({ _id }, callback);
};

/** Add object */
module.exports.add = (data, callback) => {
  if (data._id == null) data._id = new mongoose.mongo.ObjectID();
  TRAINING.create(data, callback);
};

/** Update by _id */
module.exports.updateOne = (_id, data, options, callback) => {
  TRAINING.findOneAndUpdate(
    { _id },
    {
      search: data.search,
      category: data.category,
      userId: data.userId,
      trained: data.trained,
    },
    options,
    callback
  );
};
