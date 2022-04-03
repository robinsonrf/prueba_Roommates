const axios = require('axios');
const {v4:uuidv4} = require('uuid');
const fs = require('fs');
const { cuentasGastos } = require('./gastosRoommastes');

const userApi = async ()=>{
    try{
        const {data} = await axios.get("https://randomuser.me/api/");
        const usuario = data.results[0];
        let user = {
            id: uuidv4().slice(30),
            correo: usuario.email,
            nombre: `${usuario.name.first} ${usuario.name.last}`,
            debe: 0,
            recibe: 0,
            total: 0
        }
        //console.log(user)
        return user;

    }catch(err){
    console.log(err);
    throw err;
    }
}

const guardarRoommates = (usuario)=>{
    const roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
    roommatesJSON.roommates.push(usuario);
    fs.writeFileSync("roommates.json", JSON.stringify(roommatesJSON));
    cuentasGastos();
    
}

const guardarGastos = (gastoss)=>{
const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
gastosJSON.gastos.push(gastoss);
fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
}



module.exports = {userApi, guardarRoommates, guardarGastos,}