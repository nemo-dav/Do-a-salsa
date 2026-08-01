const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

// ================= STOCK =================

let stock = {

    pizzas:{
        napolitana:{nombre:"NAPOLITANA", stock:15},
        acaballo:{nombre:"A CABALLO", stock:15},
        huevorallado:{nombre:"C/ HUEVO RALLADO", stock:15},
        especial:{nombre:"ESPECIAL", stock:15},
        muzzarella:{nombre:"MUZZA", stock:15},
        fugaza:{nombre:"FUGAZZA", stock:15},
    },


    empanadas:{
        carne:{nombre:"Empanada Carne", stock:60},
        jamonyqueso:{nombre:"Empanada Jamón y Queso", stock:60},
        pollo:{nombre:"Empanada Pollo", stock:60}
    },


    torpedos:{
        clasico:{nombre:"TORPEDOS DE SUPREMAS COMPLETO+ FRITAS", stock:20},
        simple:{nombre:"TORPEDOS DE SUPREMAS SIMPLE+ FRITAS", stock:20},
        completo:{nombre:"2 TORPEDOS GRANDES DE SUPREMAS COMPLETOS+FRITA + 1 PIZZA", stock:20},
        especial:{nombre:"2 TORPEDOS DE SUPREMAS +FRITA 1/2 DE EMPANADAS", stock:20},
    },


    suprema:{
        suprema:{nombre:"SUPREMA XL", stock:20},
        pizanesa:{nombre:"PIZZANESA DE SUPREMA", stock:20},
        napolitana:{nombre:"Suprema Napolitana", stock:20},
        milanesa:{nombre:"MILANESA DE SUPREMAS A LA NAPOLITANA + FRITA", stock:20},
        milanesaNapolitana:{nombre:"MILANESA DE SUPREMA + PAPAS FRITAS", stock:20}
    },


    promo:{
        promo1:{nombre:"Promo 1", stock:10},
        promo2:{nombre:"Promo 2", stock:10},
        promo3:{nombre:"Promo 3", stock:10},
        promo4:{nombre:"Promo 4", stock:10},
    }

};


// ================= SERVIDOR =================

const server = http.createServer(app);


// ================= SOCKET.IO =================

const io = new Server(server,{
    cors:{
        origin:"*"
    }
});


io.on("connection",(socket)=>{

    console.log("Cliente conectado:", socket.id);

    socket.emit(
        "actualizarStock",
        stock
    );

});


// ================= RUTAS =================

app.get("/stock",(req,res)=>{
    res.json(stock);
});


app.post("/comprar",(req,res)=>{

    const {
        categoria,
        producto,
        cantidad
    } = req.body;


    if(!stock[categoria] || !stock[categoria][producto]){
        return res.json({
            error:"Producto no existe"
        });
    }


    if(stock[categoria][producto].stock < cantidad){
        return res.json({
            error:"Sin stock"
        });
    }


    stock[categoria][producto].stock -= cantidad;


    io.emit(
        "actualizarStock",
        stock
    );


    res.json({
        mensaje:"Compra realizada",
        stock
    });

});



app.post("/actualizar-stock",(req,res)=>{

    const {
        categoria,
        producto,
        cantidad
    } = req.body;


    if(!stock[categoria]){
        return res.json({
            error:"Categoría no existe"
        });
    }


    if(!stock[categoria][producto]){
        return res.json({
            error:"Producto no existe"
        });
    }


    stock[categoria][producto].stock += cantidad;


    if(stock[categoria][producto].stock < 0){
        stock[categoria][producto].stock = 0;
    }


    io.emit(
        "actualizarStock",
        stock
    );


    res.json({
        mensaje:"Stock actualizado",
        stock:stock[categoria][producto]
    });

});



app.post("/cambiarStock",(req,res)=>{

    const {
        categoria,
        producto,
        cantidad
    } = req.body;


    if(!stock[categoria] || !stock[categoria][producto]){
        return res.json({
            error:"Producto no existe"
        });
    }


    stock[categoria][producto].stock = cantidad;


    io.emit(
        "actualizarStock",
        stock
    );


    res.json({
        mensaje:"Stock cambiado",
        stock
    });

});



// ================= INICIO =================

const PORT = process.env.PORT || 3000;


server.listen(PORT,()=>{

    console.log(
        `Servidor Doña Salsa funcionando en puerto ${PORT}`
    );

});