const mongoose = require('mongoose');
const USER = require('./user');

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

/** Article schema */
const ARTICLE = (module.exports = mongoose.model(
  'Article',
  mongoose.Schema({
    /** User _id who created the article */
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    /** Is article activated? */
    activated: {
      type: Boolean,
      required: true,
    },

    /** Unique article key */
    key: {
      type: String,
      required: true,
      min: 1,
      max: 50,
      index: {
        unique: true,
      },
    },

    /** Article title */
    title: TranslateItem,

    /** Description as markdown */
    description: TranslateItem,

    /** Thumbnail url */
    thumbnail: {
      type: String,
      required: true,
    },

    /** Article categories */
    categories: {
      type: [String],
      required: true,
      enum: ['corona', 'kfz'],
    },
  })
));

/** Get all */
module.exports.getAll = (callback, limit) => {
  ARTICLE.find(callback).limit(limit);
};

/** Get all search */
module.exports.search = (category, callback) => {
  ARTICLE.aggregate(
    [
      {
        $match: {
          activated: true,
          categories: category,
        },
      },
      {
        $lookup: {
          from: USER.collection.name,
          foreignField: '_id',
          localField: 'userId',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      { $sort: { key: -1 } },
    ],
    callback
  );
};

/** Get all count */
module.exports.getAllCount = (callback) => {
  ARTICLE.countDocuments(callback);
};

/** Get by _id */
module.exports.get = (_id, callback) => {
  ARTICLE.findOne({ _id }, callback);
};

/** Get by key */
module.exports.getByKey = (key, callback) => {
  ARTICLE.findOne({ key, activated: true }, callback);
};

/** Get by userId */
module.exports.getByUserId = (userId, callback) => {
  ARTICLE.find({ userId }, callback);
};

/** Get by _id and userId  */
module.exports.getByIdAndUserId = (_id, userId, callback) => {
  ARTICLE.findOne({ _id, userId }, callback);
};

/** Duplicate by _id */
module.exports.duplicateByIdAndUserId = (_id, callback) => {
  ARTICLE.findById(_id).exec((err, doc) => {
    doc._id = mongoose.Types.ObjectId();
    doc.isNew = true;
    doc.key = `${doc.key}-copy`;
    doc.save(callback);
  });
};

/** Delete by _id */
module.exports.delete = (_id, userId, callback) => {
  ARTICLE.deleteOne({ _id, userId }, callback);
};

/** Add object */
module.exports.add = (data, callback) => {
  if (data._id == null) data._id = new mongoose.mongo.ObjectID();
  ARTICLE.create(data, callback);
};

/** Update by _id */
module.exports.updateOne = (_id, userId, data, options, callback) => {
  ARTICLE.findOneAndUpdate(
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
