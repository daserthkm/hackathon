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

    hash(text) {
        if (crypto) {
            return crypto.createHmac('sha256', '77a613kj4ek4jfh6as4b28fgm499m4hs7')
                .update(text)
                .digest('hex');
        }
    }
}

module.exports = new Security()
