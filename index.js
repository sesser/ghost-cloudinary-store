'use strict';
var BaseAdapter = require('ghost-storage-base'),
    Promise = require('bluebird'),
    cloudinary = require('cloudinary');


// TODO: Add support for private_cdn
// TODO: Add support for secure_distribution
// TODO: Add support for cname
// TODO: Add support for cdn_subdomain
// http://cloudinary.com/documentation/node_additional_topics#configuration_options

class CloudinaryStorageAdapter extends BaseAdapter {
    constructor(config) {
        super()
        this.config = config || {};
        this.config.secure = this.config.secure || false;
        cloudinary.config(this.config);
    }

    // should never be called
    exists() {
      return new Promise(function(resolve) {
        resolve(true);
      })
    }

    save(image, targetDir) {
        let secure = this.config.secure;
        return new Promise(function(resolve, reject) {
            cloudinary.v2.uploader.upload(image, function(err, result) {
                if (err) reject(err);
                else resolve(secure ? result.secure_url : result.url);
            });
        })
    }

    // should never be called
    serve() {
        return function serveCloudinary(req, res, next) {

            next();
        }
    }

    delete() {
        return Promise.reject('Not Implemented');
    }

    // should never be called
    read() {
        return new Promise(function(resolve) {
            resolve(Buffer.from([]));
        })
    }
}

// function store(config) {
//   this.config = config || {};
//   cloudinary.config(config);
// }

// store.prototype.save = function(image) {
//   var secure = this.config.secure || false;

//   return new Promise(function(resolve) {
//     cloudinary.uploader.upload(image.path, function(result) {
//       resolve(secure ? result.secure_url : result.url);
//     });
//   });
// };

// store.prototype.serve = function() {
//   return function (req, res, next) {
//     next();
//   };
// };

module.exports = CloudinaryStorageAdapter;
