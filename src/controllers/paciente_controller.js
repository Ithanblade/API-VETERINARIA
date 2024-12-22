import mongoose from "mongoose"
import { sendMailToPaciente } from "../config/nodemailer.js"
import Paciente from "../models/Paciente.js"
import generarJWT from "../helpers/CrearJWT.js"

const loginPaciente = async(req,res)=>{
    //Paso 1 - Tomar datos del request
    const {email,password} = req.body

    //Paso 2 - Validar datos
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const pacienteBDD = await Paciente.findOne({email})
    if(!pacienteBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarPassword = await pacienteBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    
    //Paso 3 - Interactuar con BDD
    const token = generarJWT(pacienteBDD._id,"paciente")
    const {nombre,propietario,email:emailP,celular,convencional,_id} = pacienteBDD
    res.status(200).json({
        token,
        nombre,
        propietario,
        emailP,
        celular,
        convencional,
        _id
    })
}

const perfilPaciente = (req,res)=>{
    //Paso 1 - Tomar datos del request
    //Paso 2 - Validar datos
    //Paso 3 - Interactuar con BDD
    delete req.pacienteBDD.ingreso
    delete req.pacienteBDD.sintomas
    delete req.pacienteBDD.salida
    delete req.pacienteBDD.estado
    delete req.pacienteBDD.veterinario
    delete req.pacienteBDD.createdAt
    delete req.pacienteBDD.updatedAt
    delete req.pacienteBDD.__v
    res.status(200).json(req.pacienteBDD)
}

const listarPacientes = async(req,res)=>{
    //Paso 1 - Tomar datos del request
    //Paso 2 - Validar datos
    //Paso 3 - Interactuar con BDD
    const pacientes = await Paciente.find({estado:true}).where('veterinario').equals(req.veterinarioBDD).select("-salida -createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(pacientes)
}

const detallePaciente = async(req,res)=>{
    //Paso 1 - Tomar datos del request
    const {id} = req.params

    //Paso 2 - Validar datos
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})

    //Paso 3 - Interactuar con BDD
    const paciente = await Paciente.findById(id).select("-createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(paciente)
}

const registrarPaciente = async(req,res)=>{
    //Paso 1 - Tomar datos del request
    const {email} = req.body
    
    //Paso 2 - Validar datos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Paciente.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})

    //Paso 3 - Interactuar con BDD
    const nuevoPaciente = new Paciente(req.body)
    const password = Math.random().toString(36).slice(2)
    nuevoPaciente.password = await nuevoPaciente.encrypPassword("vet"+password)
    await sendMailToPaciente(email,"vet"+password)
    
    nuevoPaciente.veterinario=req.veterinarioBDD._id
    await nuevoPaciente.save()
    res.status(200).json({msg:"Registro exitoso del paciente y correo enviado al dueño"})

}

const actualizarPaciente = async(req,res)=>{
    //Paso 1 - Tomar datos del request
    const {id} = req.params

    //Paso 2 - Validar datos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});

    //Paso 3 - Interactuar con BDD
    await Paciente.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({msg:"Actualización exitosa del paciente"})
}

const eliminarPaciente = async(req,res)=>{
    //Paso 1 - Tomar datos del request
    const {id} = req.params

    //Paso 2 - Validar datos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})

    const {salida} = req.body

    //Paso 3 - Interactuar con BDD
    await Paciente.findByIdAndUpdate(req.params.id,{salida:Date.parse(salida),estado:false})
    res.status(200).json({msg:"Fecha de salida del paciente registrado exitosamente"})
}

export {
    loginPaciente,
    perfilPaciente,
    listarPacientes,
    detallePaciente,
    registrarPaciente,
    actualizarPaciente,
    eliminarPaciente
}