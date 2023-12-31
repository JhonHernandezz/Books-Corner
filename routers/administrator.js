import dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2';
import administrator from '../middleware/middlewareAdministrator.js';
import validarId from '../middleware/validarParams.js';
import generarTokenData from '../middleware/tokens/generarTokenData.js';

dotenv.config();
let storageAdministrator = Router();

let con = undefined;
storageAdministrator.use((req, res, next) => {
    let connect = JSON.parse(process.env.MY_CONNECT)
    con = mysql.createPool(connect);
    next();
})

storageAdministrator.get("/", (req, res) => {
    con.query(
        `SELECT * FROM administrator`,

        (error, data, fill) => {
            res.send(data)
        }
    )
})

storageAdministrator.post("/", generarTokenData, administrator, (req, res) => {
    con.query(
        `INSERT INTO administrator SET ?`,
        req.body,

        (error, data, fill) => {
            if (error) {
                console.log(error);
                res.status(400).send("Error al registrar el administrador")
            } else {
                res.send("Administrador registrado con exito")
            }
        }
    )
})

storageAdministrator.put("/:id", generarTokenData, validarId, administrator, (req, res) => {
    con.query(
        `UPDATE administrator SET ? WHERE id_User = ?`,
        [req.body, req.params],

        (error, data, fill) => {
            if (error) {
                console.log(error);
                res.status(400).send("Error al actualizar el registro del administrador")
            } else {
                res.send("Registro actualizado con exito")
            }
        }
    )
})

storageAdministrator.delete("/:id", generarTokenData, validarId, (req, res) => {
    con.query(
        `DELETE FROM administrator WHERE id_User = ?`,
        req.params,

        (error, data, fill) => {
            if (error) {
                console.log(error);
                res.status(400).send("Error al eliminar el registro del administrador")
            } else {
                res.send("Registro eliminado con exito")
            }
        }
    )
})

export default storageAdministrator;