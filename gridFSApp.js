'use strict';

var Busboy = require('busboy');
var express = require('express');
var mongo = require('mongodb');
var Grid = require('gridfs-stream');
var app = express();
var server = app.listen(9002, function() {
  console.log('Server running at http://localhost:9002/gridfs')
});

var db = new mongo.Db('gridfs', new mongo.Server('127.0.0.1', 27017));
var gfs;
db.open(function(err, db) {
  if (err) throw err;
  gfs = Grid(db, mongo);
});

app.post('/gridfs/file', function(req, res) {
  var busboy = new Busboy({ headers : req.headers });
  var fileId = new mongo.ObjectId();

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('got file', filename, mimetype, encoding);
    var writeStream = gfs.createWriteStream({
      _id: fileId,
      filename: filename,
      mode: 'w',
      content_type: mimetype,
    });
    file.pipe(writeStream);
  }).on('finish', function() {
    // show a link to the uploaded file
    res.writeHead(200, {'content-type': 'text/html'});
    res.end('<a href="/gridfs/file/' + fileId.toString() + '">download file</a>');
  });

  req.pipe(busboy);
});

app.get('/gridfs', function(req, res) {
  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/gridfs/file" enctype="multipart/form-data" method="post">'+
    '<input type="file" name="file"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
});

app.get('/gridfs/file/:id', function(req, res) {
  gfs.findOne({ _id: req.params.id }, function (err, file) {
    if (err) return res.status(400).send(err);
    if (!file) return res.status(404).send('');

    res.writeHead(200, {'Content-Type': file.contentType});

    var readstream = gfs.createReadStream({
      filename: file.filename
    });
    readstream.on('data', function(data) {
        res.write(data);
    });
    readstream.on('end', function() {
        res.end();        
    });

    readstream.on("error", function(err) {
      console.log("Got error while processing stream " + err.message);
      res.end();
    });

    readstream.pipe(res);
  });
});
