import React, { useEffect, useState } from 'react';
import AdminHeader from '../../AdminHeader';
import Auth from '../../../Utils/Auth';
import { FaSpinner } from 'react-icons/fa';
// import formatoRut from '../../../Utils/FormatoRut';
import Swal from 'sweetalert2';
import TablaPacientesAdmin from '../../TablaPacientesAdmin';
import CrearPacienteAdmin from '../../CrearPacienteAdmin';
import CambiarContrasenaPaciente from '../../modals/Admin/CambiarContrasenaPaciente';
import { AlertaLoading } from '../../Alerts';

export default function PacientsAdmin(){

  const [pacients, setPacients] = useState([]);
  const [loadingPacients, setLoadingPacients] = useState(false);
  const [createPacient, setCreatePacient] = useState(false);
  const [changePassword,setChangePassword] = useState(false);
  const [CurrentPacient,setCurrentPacient] = useState(null);

  useEffect(()=>{

    loadData();

    async function loadData(){
      await loadPacients();
    }
  },[]);

  async function loadPacients(){
    setLoadingPacients(true);
    const url = process.env.REACT_APP_API_HOST+'/api/pacients';
    await fetch(url,{
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': Auth.getToken()
      }
    }).then((res)=>{
      Auth.updateToken(res.headers.get('x-auth-token'));
      return res.json();
    }).then((res)=>{
      // console.log({res});
      setLoadingPacients(false);
      if(res.status === 200){
        setPacients(res.pacients);
      }else{
        setPacients([]);
      }
    }).catch((error)=>{console.error({error})})
  }

  async function deletePacient(id){
    const url = process.env.REACT_APP_API_HOST+'/api/pacients/'+id+'/deletePacient';
    await fetch(url,{
      method:'DELETE',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': Auth.getToken()
      }
    }).then((res)=>{
      Auth.updateToken(res.headers.get('x-auth-token'));
      return res.json();
    }).then((res)=>{
      // console.log({res});
      if(res.status === 200){
        loadPacients();
        Swal.fire({
          title:'',
          text:'Paciente '+res.pacient.name+' '+res.pacient.lastName+' eliminado con éxito!',
          icon:'success',
          confirmButtonText:'Ok',
        });
      }else{
        Swal.fire({
          title:'',
          text:'No se pudo eliminar el paciente!',
          icon:'error',
          confirmButtonText:'Ok',
        });
      }
    }).catch((error)=>{console.error({error})})
  }

  async function changeStatePacient(id){
    const url = process.env.REACT_APP_API_HOST+"/api/pacients/"+id+"/changeState";
    let status;
    await fetch(url,{
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': Auth.getToken()
      }
    }).then((res)=>{
      status = res.status;
      Auth.updateToken(res.headers.get('x-auth-token'));
      return res.json();
    }).then((res)=>{
      if(status === 200){
        Swal.fire({
          title:'',
          text:'Paciente '+res.pacient.name+' '+res.pacient.lastName+' '+(res.message=='Pacient Activated'?'activado':'desactivado')+' con éxito!',
          icon:'success',
          confirmButtonText:'Ok',
        }).then(()=>{
          loadPacients();
        });
      }else{
        Swal.fire({
          title:'',
          text:'No se pudo cambiar el estado del paciente!',
          icon:'error',
          confirmButtonText:'Ok',
        });
      }
      // console.log({res});
      // console.log({status});
    }).catch((error)=>{console.error({error})});
  }

  async function ChangePasswordPacient(password,password_confirmation){
    // AlertaLoading.fire();
    Swal.fire({
      title: 'Cargando...',
      onBeforeOpen () {
        Swal.showLoading()
      },
      onAfterClose() {
        Swal.hideLoading()
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    })
    const url = process.env.REACT_APP_API_HOST+"/api/pacients/"+CurrentPacient._id+"/changePassword";
    const body = {
      password:password,
      password_confirmation:password_confirmation
    }
    let status;
    await fetch(url,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': Auth.getToken()
      },
      body:JSON.stringify(body)
    }).then((res)=>{
      status = res.status;
      Auth.updateToken(res.headers.get('x-auth-token'));
      return res.json();
    }).then((res)=>{
      if(status === 200){
        Swal.fire({
          title:'',
          text:'Se ha cambiado la contraseña del paciente '+res.pacient.name+' '+res.pacient.lastName+' con éxito!',
          icon:'success',
          confirmButtonText:'Ok',
        }).then(()=>{
          loadPacients();
          setChangePassword(false);
          setCurrentPacient(null);
        });
      }else{
        Swal.fire({
          title:'',
          text:'No se pudo cambiar la contraseña del paciente!',
          icon:'error',
          confirmButtonText:'Ok',
        });
      }
      // console.log({res});
      // console.log({status});
    }).catch((error)=>{console.error({error})});
  }

  return (
    <div className='flex flex-col w-full min-h-screen bg-gray-900 text-gray-50 text-center'>
      <AdminHeader selected="pacients"/>
      <div className='flex flex-col justify-center sm:flex-row flex-wrap self-center p-8 py-12 w-[800px] md:w-[90%] top-[15%] rounded-xl border-slate-300 border
      shadow-2xl shadow-slate-600 bg-gray-900 mt-32'>
        {
          loadingPacients?
            <div className='w-full text-center flex justify-center my-10'>
              <FaSpinner className='animate-spin text-4xl self-center text-center'/>
            </div>
          :
            createPacient?
              <CrearPacienteAdmin setCreatePacient={setCreatePacient}/>
            :
            changePassword?
              <CambiarContrasenaPaciente ChangePasswordPacient={ChangePasswordPacient} setChangePassword={setChangePassword} CurrentPacient={CurrentPacient}
              setCurrentPacient={setCurrentPacient}/>
              :
              <TablaPacientesAdmin pacients={pacients} deletePacient={deletePacient} setCreatePacient={setCreatePacient} changeStatePacient={changeStatePacient}
              ChangePasswordPacient={ChangePasswordPacient} setChangePassword={setChangePassword} CurrentPacient={CurrentPacient} setCurrentPacient={setCurrentPacient}/>
        }
      </div>
    </div>
  );
}