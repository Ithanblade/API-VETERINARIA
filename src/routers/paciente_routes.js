import {Router} from "express";
import { actualizarPaciente, detallePaciente, eliminarPaciente, listarPacientes, loginPaciente, perfilPaciente, registrarPaciente } from "../controllers/paciente_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";
const router = Router();

//Rutas Públicas
router.post('/paciente/login',loginPaciente)
router.post('/paciente/registro',verificarAutenticacion,registrarPaciente)

//Rutas Privadas
router.get('/paciente/perfil',verificarAutenticacion,perfilPaciente)
router.get('/pacientes',verificarAutenticacion,listarPacientes)
router.get('/paciente/:id',verificarAutenticacion,detallePaciente)
router.put('/paciente/actualizar/:id',verificarAutenticacion,actualizarPaciente)
router.delete('/paciente/eliminar/:id',verificarAutenticacion,eliminarPaciente)

export default router
