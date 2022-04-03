const {userApi, guardarRoommates, guardarGastos} = require("./roommates") 
const {cuentasGastos} = require('./gastosRoommastes')
const url = require('url');
const http = require('http');
const {v4:uuidv4} = require('uuid')
const fs = require('fs');
const moment = require('moment');
const port = 3000;

const server =
http.createServer((req, res)=>{
     const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
     let gastos = gastosJSON.gastos;

    // GET HTML
    if(req.url == "/" && req.method == "GET"){
        res.setHeader("content-type", "text/html");
        const html = fs.readFileSync('index.html', 'utf8')
            res.end(html)
    };

    //POST ROOMMATES
    if(req.url.startsWith("/roommate") && req.method =="POST"){
        userApi()
        .then( async (usuario)=>{
            
            guardarRoommates(usuario);
            res.statusCode = 200;
            res.end(JSON.stringify(usuario));
            
        })
        .catch((err)=>{
            res.statusCode = 500;
            res.end();
           console.log('Error en el registro', err)
        })
    }

    //GET ROOMMATES
    if(req.url.startsWith("/roommates") && req.method == "GET"){
        res.setHeader("Content-Type", "application/json");
        console.log(res.statusCode);
        res.end(fs.readFileSync("roommates.json", "utf8"));
    }


    //GET GASTOS
    if(req.url.startsWith("/gastos") && req.method == "GET"){
        res.setHeader("Content-Type", "application/json");
        res.end(fs.readFileSync("gastos.json", "utf8"));
    }

    //POST GASTOS
    if(req.url.startsWith("/gasto") && req.method == "POST"){
        let body;
        req.on("data", (payload)=>{
            body = JSON.parse(payload);
            //console.log(body)
        });
    
    req.on("end", ()=>{
        nuevoGasto = {
            roommate: body.roommate,
            descripcion: body.descripcion,
            monto: body.monto,
            fecha: moment().format("lll"),
            id: uuidv4().slice(30)
        }
        guardarGastos(nuevoGasto);
        cuentasGastos();
        res.statusCode = 200;
        res.end();
    });
    };

    //PUT GASTO
    if(req.url.startsWith("/gasto") && req.method == "PUT"){
        let body;
        const {id} = url.parse(req.url, true).query;
        req.on("data", (payload)=>{
            body = JSON.parse(payload);
            //console.log(id)
        })

        req.on("end", ()=>{
            gastosJSON.gastos = gastos.map((g)=>{
                if (g.id == id){
                    const updateGasto = {
                        roommate: body.roommate,
                        descripcion: body.descripcion,
                        monto: body.monto,
                        fecha: moment().format("lll"),
                        id: g.id, 
                    }
                    
                    return updateGasto;
                }
                return g;
            });
            
            fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
            cuentasGastos();
            res.statusCode = 200;
            res.end();
        })

};


    //DELETE GASTO
    if(req.url.startsWith("/gasto") && req.method == "DELETE"){
        const {id} = url.parse(req.url, true).query;
        gastosJSON.gastos = gastos.filter((g)=>{
            return g.id !== id;
        })

        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
        cuentasGastos();
        res.statusCode = 200;
        res.end();
    }

}).listen(port, ()=> console.log('Servidor Online, Puerto: '+port));

module.exports = server;
