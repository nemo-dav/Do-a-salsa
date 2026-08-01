let stock = {};

async function cargarStock(){

    let respuesta = await fetch(
        "http://localhost:3000/stock"
    );

    stock = await respuesta.json();

    mostrarStock();

}



function mostrarStock(){

    let panel = document.getElementById("panel-stock");

    panel.innerHTML="";


    for(let categoria in stock){


        panel.innerHTML += `
        <h2>${categoria.toUpperCase()}</h2>
        `;


        for(let producto in stock[categoria]){


            let item = stock[categoria][producto];


            panel.innerHTML += `

            <div class="stock-card">

            <h2>${item.nombre}</h2>


            <button onclick="cambiarStock('${categoria}','${producto}',-1)">
            ➖
            </button>


            <span class="cantidad">
            ${item.stock}
            </span>


            <button onclick="cambiarStock('${categoria}','${producto}',1)">
            ➕
            </button>


            </div>

            `;

        }

    }

}




async function cambiarStock(categoria,producto,cantidad){


    let respuesta = await fetch(
        "http://localhost:3000/actualizar-stock",
        {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            categoria,
            producto,
            cantidad

        })

    });


    let datos = await respuesta.json();


    console.log("Respuesta servidor:",datos);


    cargarStock();

}




cargarStock();


