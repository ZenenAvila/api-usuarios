////////////  Requerimientos ////////////
const { Pool } = require('pg');

const morgan = require('morgan');

const express=require('express');
const { response } = require('express');
const app=express();

const numeros = new RegExp('^[0-9]+$');
const letras = new RegExp('^[A-ZÁÉÍÓÚÑ ]+$', 'i');

////////////  configuracion API ////////////
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

const port=process.env.PORT||5000;

////////////  configuracion database ////////////

const config={
    user: 'ilhzxelc',
    host: 'kashin.db.elephantsql.com',
    database:'ilhzxelc',
    password:'xKyzElRFw7DHX8WZelDW_mVq0zm2i073',
    port:5432,

};
const pool = new Pool(config);

////////////  configuracion endpoint ////////////

app.get('/',(request,response)=>{
    response.json({info:'la API esta en ejecución'});
});

//consultar usuarios
app.get('/api/mostrartodos',(request,response)=>{

    pool.query(`select * from usuarios 
    order by id asc; `,(err,res)=>
    {
        if(err){
            response.json(err.stack);
        }else{
            response.json(res.rows);
        }
    });
});

var mostrar=`select id,nombre,apellidos,password
from usuarios where eliminado=false order by id asc;`;

app.get('/api/mostrar',(request,response)=>{

        pool.query(mostrar,(err,res)=>
        {
            if(err){
                response.json(err.stack);
            }else{
                response.json(res.rows);
            }
        });
});

//insertar usuariosn
app.post('/api/insertar',(request,response)=>{
    if(letras.test(request.body.nombre) & 
    letras.test(request.body.apellidos)){
    pool.query(`insert into usuarios(nombre,apellidos,password)
                values('${request.body.nombre}',
                       '${request.body.apellidos}',
                       '${btoa(request.body.password)}');`
                ,(err,res)=>
        {
            if(err){
                response.json(err.stack);
            }else{
                response.json({"respuesta":"insertado Correctamente"});
            }
        });
    }
    else{
        response.json({"respuesta":"El nombre y apellidos deben contener solo letras "});
    }
});

//eliminar usuarios
app.post('/api/eliminar',(request,response)=>{
    if(numeros.test(request.body.id)){
    pool.query(`update usuarios set eliminado=true 
    where id =${request.body.id}`,(err,res)=>
    {
        if(err){
            response.json(err.stack);
        }else{
            response.json({"respuesta":"eliminado Correctamente"});
        }
    });
    } else{
        response.json({"respuesta":"El id solo debe contener numeros "});
    }
});

//actualizar usuarios
app.post('/api/actualizar',(request,response)=>{
    if(numeros.test(request.body.id)){
    
    if(letras.test(request.body.nombre) & 
    letras.test(request.body.apellidos)){
    pool.query(`update usuarios 
                set nombre='${request.body.nombre}',
                    apellidos='${request.body.apellidos}',
                    password = '${btoa(request.body.password)}'
                    where id=${request.body.id}`,(err,res)=>
    {
        if(err){
            response.json(err.stack);
        }else{
            response.json({"respuesta":"actualizado Correctamente"});
        }
    });
}
else{
    response.json({"respuesta":"El nombre y apellidos deben contener solo letras "});
}
} else{
    response.json({"respuesta":"El id solo debe contener numeros "});
}
});

//Servidor escuchando
app.listen(port,()=>{
    console.log( `API corriendo en el puerto ${port}`);
});