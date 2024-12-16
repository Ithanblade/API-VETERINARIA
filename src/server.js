//Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import routerVeterinarios from './routers/veterinario_routers.js';
import routerPacientes from './routers/paciente_routes.js';


//Inicialización
const app = express()
dotenv.config()

//Configuraciones
app.set('port',process.env.PORT || 3000)
app.use(cors())

//Middlewares 
app.use(express.json())

//Variables globales

//Rutas 
app.get('/',(req,res)=>{
    res.send("Server on")
})

//Rutas para veterinarios
app.use('/api',routerVeterinarios)

//Rutas para pacientes
app.use('/api',routerPacientes)

//Rutas no encontradas
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))


//Exportar la instancia de express por medio de app
export default app