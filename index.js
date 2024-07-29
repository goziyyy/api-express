const express = require('express')
const app = express()
const port = 2000
const response = require("./response")
const bodyParser = require('body-parser')
const db = require("./connection")
const cors = require("cors")

app.use(cors())

app.use(bodyParser.json())

app.get("/", (req, res) => {
    response(200, "API ready", "succes", res)
})

app.get("/siswa", (req, res) => {
    const sql = "SELECT * FROM siswa"
    db.query(sql, (err, fields) => {
        if (err) throw err
        response(200, fields, "list siswa", res)
    })
})

app.get("/siswa/:nis", (req, res) => {
    const nis = req.params.nis
    const sql = `SELECT * FROM siswa WHERE nis = ${nis}`
    db.query(sql, (err, fields) => {
        if (err) throw err
        response(200, fields, "get detail siswa", res)
    })
})

app.post("/siswa", (req, res) => {
    const { nama, nis } = req.body 
    console.log(req.body)
    const sql = `INSERT INTO siswa (nama, nis) VALUES ('${nama}', '${nis}')`
    db.query(sql, (err, fields) => {
        if (err) response(500, "invalid", "error", res)
        if (fields?.affectedRows) {
            const data = {
                isSuccess: fields.affectedRows,
                id: fields.insertId,
            }
            response(200, data, `Data masuk ${nama}, ${nis}`,  res)
        } 
    })
})

app.put("/siswa", (req, res) => {
    const { id, nis, nama } = req.body 
    const sql = `UPDATE siswa SET nis = '${nis}', nama = '${nama}' WHERE id = '${id}'`
    db.query(sql, (err, fields) => {
        if (err) response(500, "invalid", "error", res)
        if (fields?.affectedRows) {
            const data = {
                isSuccess: fields.affectedRows,
                message: fields.message,
            }
            response(200, data, `Update data ${nama} Berhasil`, res)
        }else {
            response(404, "no user found", "error", res)
        }
    })
})

app.delete("/siswa", (req, res) => {
    const { nis } = req.body
    const sql = `DELETE FROM siswa WHERE nis = '${nis}'`
    db.query(sql, (err, fields) => {
        if(err) response(500, "invalid", "error", res)
            if(fields.affectedRows) {
                const data = {
                    isDeleted: fields.affectedRows
                }
                response(200, data, `Delete Data Berhasil`, res)
            }else {
                response(404, "User not found", "delete siswa fail", res)
            }
    })
})

app.listen(port, () => {
    console.log(`App Berjalan di Port ${port}`)
})