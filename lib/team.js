//////////////////////////////////////////////////////////////////////
// The team library //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * @param  {string} user  the team member's username
 * @param  {string} fname the team member's first name
 * @param  {string} lname the team member's last name
 * @param  {string} year  the team member's year of college
 * @return {object} { user, fname, lname, year }
 */

var json = require('./about.json');

function member(user, fname, lname, year, about) {
	return {
		user: user,
		fname: fname,
		lname: lname,
		year: year,
		about: about
	};
}

var team = [
	member('nfuller', 'Nathan', 'Fuller', 'senior', json.nfuller.about),
	member('dlaizer', 'Dan', 'Laizer', 'senior', json.dlazier.about),
	member('abradley', 'Adam', 'Bradley', 'junior', json.abradley.about),
	member('cgiang', 'Co', 'Giang', 'unknown', json.cgiang.about),
	member('zhili', 'Zhi', 'Li', 'junior', json.zhili.about),
	member('kfarr', 'Kevin', 'Farr', 'senior', json.kfarr.about)
];

/**
 * @param  {member object} mem	a member object
 * @return {member object}		a copy of member
 */
function copy(mem) {
	return member(mem.user, mem.fname, mem.lname, mem.year, mem.about);
}

/**
 * @param  {array} members an array of member objects
 * @return {array}         a copy of the array of member objects
 */
function copyAll(members) {
	var nmembers = [];
	members.forEach(m => {
		nmembers.push(copy(m));
	});
	return nmembers;
}

/**
 * @param  {boolean} success true if success; false otherwise
 * @param  {string}  message informational message
 * @param  {array} 	 data    array of members
 * @return {object}          result object
 */
function result(success, message, data) {
	return {
		success: success,
		message: message,
		data: data,
		count: data.length
	};
}

/**
 * @param  {string} user the member's username
 * @return {object}      the member object or `null` if not found
 */
function find(user) {
	var found = null;
	for (var i = 0; i < team.length; i++) {
		var m = team[i];
		// if we find the user, copy it and store it
		// in found, then break out of the loop and return
		if (m.user === user) {
			found = copy(m);
			break;
		}
	}
	return found;
}

/**
 * @return {result object}  a result object
 */
function all() {
	var data = copyAll(team);
	// set success equal to true only if data is actually valid
	// this should always be the case, but I just want to be safe :)
	var success = (data !== null || data !== undefined);
	return result(success, 'team members', data);
}

/**
 * @param  {string} user    the username of a team member
 * @return {result object}  a result object
 */
function one(user) {
	if (typeof user !== 'string') {
		return result(false, "One() was passed an argument of type '" + (typeof user) + "' but was expecting a string.", []);
	} else {
		var data = [];
		var found = find(user);
		if (found === null)
			return result(false, 'team member not found', data);
		else {
			data.push(found);
			return result(true, 'team member found', data);
		}
	}
}

// This exports public functions to the outside world.
exports.all = all;
exports.one = one;
