/**
 * @author Daniel Seifert
 */

const _map = require('lodash/map')
const _reduce = require('lodash/reduce')
const moment = require('moment')
const sqlite = require('sqlite3')

class DB {
    constructor(dbFile) {
        this.context = new sqlite.Database(dbFile)
    }

    createTable(name, fields) {
        fields = Object.assign(fields, {
            create_date: 'DATETIME',
            modify_date: 'DATETIME'
        })

        return new Promise((resolve) => {
            const fieldsString = _map(fields, (value, key) => `${key} ${value}`).join(', ')

            this.context.run(`CREATE TABLE ${name} (${fieldsString})`, (err) => {
                if (err) {
                    // Ignore
                } else {
                    resolve()
                }
            })
        })
    }

    insertToTable(table, data) {
        data = Object.assign(data, {
            create_date: data.create_date || this.getCurrentDateTime(),
            modify_date: null
        })

        return new Promise((resolve, reject) => {
            const fields = _map(data, (value, key) => key).join(', ')

            const binds = _map(data, (value, key) => `$${key}`).join(', ')

            const values = _reduce(data, (map, value, key) => {
                map[`$${key}`] = value
                return map
            }, {})

            this.context.run(`INSERT INTO ${table} (${fields}) VALUES (${binds})`, values, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(this.lastID)
                }
            })
        })
    }

    getCurrentDateTime() {
        return moment.utc().format('YYYY-MM-DD HH:mm:ss')
    }

    /**
     * Returns a time object with milliseconds
     *
     * @returns {{date: String, ms: int}}
     */
    getCurrentDateTimeObj() {
        const now = moment.utc()

        return {
            date: now.format('YYYY-MM-DD HH:mm:ss'),
            ms: now.milliseconds()
        }
    }

    fetchAll(table) {
        return new Promise((resolve, reject) => {
            this.context.all(`SELECT * FROM ${table}`, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    fetchOneByID(table, id) {
        return new Promise((resolve, reject) => {
            this.context.get(`SELECT * FROM ${table} WHERE id = $id`, {
                $id: id
            }, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    fetchManyByField(table, field, value) {
        return new Promise((resolve, reject) => {
            this.context.all(`SELECT * FROM ${table} WHERE ${field} = $value`, {
                $value: value
            }, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    updateOneByID(table, data, id) {
        data = Object.assign(data, {
            modify_date: this.getCurrentDateTime()
        })

        return new Promise((resolve, reject) => {
            const query = _reduce(data, (list, value, key) => {
                list.push(`${key} = $${key}`)
                return list
            }, [])

            const values = _reduce(data, (map, value, key) => {
                map[`$${key}`] = value
                return map
            }, {})

            this.context.run(`UPDATE ${table} SET ${query.join(', ')} WHERE id = $id`, Object.assign(values, {
                $id: id
            }), (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    deleteOneByID(table, id) {
        return new Promise((resolve, reject) => {
            this.context.get(`DELETE FROM ${table} WHERE id = $id`, {
                $id: id
            }, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = new DB('./data.db')
