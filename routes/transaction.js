var ObjectId = require('mongoose').Types.ObjectId;
var Q = require('q');

module.exports = function(app) {

  app.post('/transaction/add', function(req, res) {
    var transactionObject = {};
    transactionObject.source = req.body.source;
    transactionObject.destination = req.body.destination;
    transactionObject.amount = req.body.amount;
    if (!transactionObject.source ||
        !transactionObject.destination ||
        !transactionObject.amount) {
      return res.send({success: false, msg: 'Please make sure you have source, destination and amount to be transferred correctly.'})
    }
    transactionObject._id = new ObjectId().toString();
    transactionObject.state = 'initial';
    transactionObject.lastModified = new Date();

    app.get('dbConn').model('Transactions').create(transactionObject).
    then(function() {
      res.send({success: true});
    })
  });

  app.get('/transaction/execute', function(req, res) {
    var transactionModel = app.get('dbConn').model('Transactions');
    var accountsModel = app.get('dbConn').model('Accounts');
    return transactionModel.findOne({state: "initial"}).lean().exec().
    then(function(transactionObject) {
      if (!transactionObject) {
        res.send({success: true, msg: 'All transactions are done.'});
      }
      console.log('Found a transaction to execute');
      return transactionModel.findOneAndUpdate({_id: transactionObject._id, state: 'initial'},
                                     {$set: {state: 'pending'}
                                     }).lean().exec().
      then(function(resultStep1) {
        console.log('Update the amount in the accounts.');
        return Q.all([accountsModel.update({_id: transactionObject.source, pendingTransactions: { $ne: transactionObject._id }},
                             { $inc: { balance: -transactionObject.amount }, $push: { pendingTransactions: transactionObject._id } }).lean().exec(),
                      accountsModel.update({_id: transactionObject.destination, pendingTransactions: { $ne: transactionObject._id }},
                               { $inc: { balance: transactionObject.amount }, $push: { pendingTransactions: transactionObject._id } }).lean().exec()]).
        then(function(resultStep2) {
          console.log('Update the state of the transaction and pull the transaction out of the accounts.')
          return Q.all([transactionModel.update({ _id: transactionObject._id, state: "pending" }, {$set: { state: "applied"}}).lean().exec(),
                        accountsModel.update({ _id: transactionObject.source, pendingTransactions: transactionObject._id },
                                             { $pull: { pendingTransactions: transactionObject._id }}).lean().exec(),
                        accountsModel.update({ _id: transactionObject.destination, pendingTransactions: transactionObject._id },
                                             { $pull: { pendingTransactions: transactionObject._id }}).lean().exec()]).
          then(function(resultStep3) {
            console.log('Finally, set the transaction state to done.')
            return transactionModel.update({ _id: transactionObject._id, state: "applied" },
                                           {$set: { state: "done" }}).lean().exec().
            then(function(finalResult) {
              return res.send({success: true});
            });
          });
        })
      })
    })
  });

  app.get('/transaction/rollback', function(req, res) {
    
  });
};
