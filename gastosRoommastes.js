const fs = require('fs')


const cuentasGastos = ()=>{
    let roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
    let roommates = roommatesJSON.roommates;

    const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
    const gastos = gastosJSON.gastos;

    const totalRoommates =  roommates.length;

    roommates.forEach(miembro => {

        miembro.recibe = 0;

        miembro.debe = 0;

    });

    roommates.forEach(r => {

        gastos.forEach(g => {

            if(r.nombre == g.roommate) {
               r.recibe += parseInt(g.monto / totalRoommates);
            } else {
                r.debe -= parseInt(g.monto / totalRoommates);
            };

        });

    });

    fs.writeFileSync('roommates.json', JSON.stringify(roommatesJSON));

};

module.exports = { cuentasGastos };