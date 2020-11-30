const mongoose = require('mongoose');

/** File schema */
const FILE = (module.exports = mongoose.model(
  'File',
  mongoose.Schema({
    /** Content of file in base64 format */
    base64: {
      type: String,
      required: true
    },

    /** Name of file (e.q.: example.jpg) */
    name: {
      type: String,
      required: true
    },

    /** Size of file in bytes */
    size: {
      type: Number,
      required: true
    },
    
    /** Type of file (e.q.: image/png) */
    type: {
      type: String,
      required: true
    },
  })
));

/** Get files */
module.exports.getFiles = (callback, limit) => {
  FILE.find({ type: process.env.FILES_FILE.split(',') }, callback).limit(limit);
};

/** Get images */
module.exports.getImages = (callback, limit) => {
  FILE.find({ type: process.env.FILES_IMAGE.split(',') }, callback).limit(limit);
};

/** Get file by _id */
module.exports.getFileById = (_id, callback) => {
  FILE.findOne({ _id }, callback);
};

/** Delete file */
module.exports.deleteFile = (_id, callback) => {
  FILE.deleteOne({ _id }, callback);
};

/** Add file */
module.exports.addFile = (file, callback) => {
  if (!file._id) {
    file._id = new mongoose.mongo.ObjectID();
  }
  FILE.create(file, callback);
};
