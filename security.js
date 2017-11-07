/**
 * @author Daniel Seifert
 */

const _reduce = require('lodash/reduce')
const xss = require('xss')

let crypto;
try {
    crypto = require('crypto');
} catch (err) {
    console.log('crypto support is disabled!');
}

class Security {
    xssClean(obj) {
        return _reduce(obj, (map, value, key) => {
            // Check if value is integer
            if (parseInt(value) == value) {
                map[key] = parseInt(value)
            } else {
                map[key] = xss(value)
            }
            return map
        }, {})
    }
}

module.exports = new Security()
