const mongoose = require('mongoose');

const TranslateItem = {
  cn: { type: String, required: false },
  de: { type: String, required: true },
  en: { type: String, required: true },
  es: { type: String, required: false },
  fr: { type: String, required: false },
  it: { type: String, required: false },
  jp: { type: String, required: false },
  nl: { type: String, required: false },
  pl: { type: String, required: false },
  pt: { type: String, required: false },
  ru: { type: String, required: false },
};

/** Company schema */
const COMPANY = (module.exports = mongoose.model(
  'Company',
  mongoose.Schema({
    /** User _id who created the company */
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },

    /** Is company activated? */
    activated: {
      type: Boolean,
      required: true,
    },

    /** Unique company key */
    key: {
      type: String,
      required: true,
      min: 1,
      max: 50,
      index: {
        unique: true,
      },
    },

    /** Company title */
    title: TranslateItem,

    /** Description as markdown */
    description: TranslateItem,

    /** Thumbnail url */
    thumbnail: {
      type: String,
      required: true,
    },

    /** Company categories */
    categories: {
      type: [String],
      required: true,
      enum: ['corona', 'kfz'],
    },
  })
));

/** Get all */
module.exports.getAll = (callback, limit) => {
  COMPANY.find(callback).limit(limit);
};

/** Get all count */
module.exports.getAllCount = (callback) => {
  COMPANY.countDocuments(callback);
};

/** Get by _id */
module.exports.get = (_id, callback) => {
  COMPANY.findOne({ _id }, callback);
};

/** Get by userId */
module.exports.getByUserId = (userId, callback) => {
  COMPANY.find({ userId }, callback);
};

/** Get by _id and userId  */
module.exports.getByIdAndUserId = (_id, userId, callback) => {
  COMPANY.findOne({ _id, userId }, callback);
};

/** Duplicate by _id */
module.exports.duplicateByIdAndUserId = (_id, callback) => {
  COMPANY.findById(_id).exec((err, doc) => {
    doc._id = mongoose.Types.ObjectId();
    doc.isNew = true;
    doc.key = `${doc.key}-copy`;
    doc.save(callback);
  });
};

/** Delete by _id */
module.exports.delete = (_id, callback) => {
  COMPANY.deleteOne({ _id }, callback);
};

/** Add object */
module.exports.add = (data, callback) => {
  if (data._id == null) data._id = new mongoose.mongo.ObjectID();
  COMPANY.create(data, callback);
};

/** Update by _id */
module.exports.updateOne = (_id, userId, data, options, callback) => {
  COMPANY.findOneAndUpdate(
    { _id },
    {
      activated: data.activated,
      key: data.key,
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail,
      categories: data.categories,
    },
    options,
    callback
  );
};
