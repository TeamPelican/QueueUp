// USER LIB

// TODO: Rework this file once data persistence has been implemented.

var nextUID = 0;

function user(name, pass, admin) {
    return {
        name: name,
        pass: pass,
        uid: ++nextUID,
        admin: admin
    };
}

// TEMPORARY UNTIL DATA PERSISTENCE IMPLEMENTED
var db = {
    'nate'  : user('nate', 'etan', true),
};

// Carried over from Nate's IPA03 implementation
function getUsers() {
    var users = [];
    for (var prop in db) {
        var u = db[prop];
        users.push({name: u.name, pass: u.pass, uid: u.uid, admin: u.admin});
    }
    return users;
}

// Carried over from IPA03 starter template
// Returns a user object if the user exists in the db.
// The callback signature is cb(error, userobj), where error is
// undefined if there is no error or a string indicating the error
// that occurred.
exports.lookup = (usr, pass, cb) => {
    if (usr in db) {
        var u = db[usr];
        if (pass == u.pass) {
            cb(undefined, { name: u.name, admin: u.admin });
        }
        else {
            cb('Password is invalid.');
        }
    }
    else {
        cb('User "' + usr + '" does not exist.');
    }
};

// Carried over from Nate's IPA03 implementation
exports.list = (cb) => {
    cb(undefined, getUsers());
};

// Carried over from Nate's IPA03 implementation
exports.add = (u, cb) => {
    if (db.hasOwnProperty(u.name)) {
        cb('Username already exists.', u);
    } else {
        var newUser = user(u.name, u.pass, u.admin);
        db[u.name] = newUser;
        u.uid = newUser.uid;
        cb(undefined, u);
    }
};
