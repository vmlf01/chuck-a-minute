const ObjectID = require('mongodb').ObjectID;

module.exports = (config) => (req, res, next) => {
    const factsMinuteCollection = config.db.collection('facts_minute');
    const factsCollection = config.db.collection('facts');
    const id = new ObjectID(req.params.id);

    // update the facts minute counts, but not critical
    config.redis.hincrby('facts_minute', `${req.params.id}.votes`, 1, () => { });
    factsMinuteCollection.update({ _id: id }, { $inc: { votes: 1 } }, () => { });

    // this is the data that gets persisted, so check errors on this one
    factsCollection.update({ _id: id }, { $inc: { votes: 1 } }, (err, result) => {
        if (err) {
            return next(err);
        }

        res.status(201).end();

    });
}
