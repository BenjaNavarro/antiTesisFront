import React, { useEffect, useState } from 'react';
import AdminHeader from '../../AdminHeader';
import Auth from '../../../Utils/Auth';
import CrearTerapeutaAdmin from '../../CrearTerapeutaAdmin';
import TablaTerapeutasAdmin from '../../TablaTerapeutasAdmin';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function TerapistsAdmin() {

  const [terapists, setTerapists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [create, setCreate] = useState(false);

  useEffect(()=>{
    async function loadData(){
      await LoadTerapists();
    }

    loadData();
  },[]);

  async function DeleteTerapist(id){
    const url = process.env.REACT_APP_API_HOST+'/api/terapists/'+id+'/deleteTerapist';
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
      console.log({res});
      if(res.status === 200){
        LoadTerapists();
        Swal.fire({
          title:'',
          text:'Terapeuta '+res.terapist.name+' '+res.terapist.lastName+' eliminado con éxito!',
          icon:'success',
          confirmButtonText:'Ok',
        });
      }else{
        Swal.fire({
          title:'',
          text:'No se pudo eliminar el terapeuta!',
          icon:'error',
          confirmButtonText:'Ok',
        });
      }
    }).catch((error)=>{console.error({error})})
  }

  async function LoadTerapists(){
    setLoading(true);
    const url = process.env.REACT_APP_API_HOST+'/api/terapists';
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
      console.log({res});
      setLoading(false);
      if(res.status === 200){
        setTerapists(res.terapists);
      }else{
        setTerapists([]);
      }
    }).catch((error)=>{console.error({error})})
  }

  return (
    <div className='flex flex-col w-full min-h-screen bg-gray-900 text-gray-50 text-center'>
      <AdminHeader/>
      <div className='flex flex-col justify-center sm:flex-row flex-wrap self-center p-8 py-12 absolute w-[800px] md:w-[90%] top-[15%] rounded-xl border-slate-300 border
      shadow-2xl shadow-slate-600 bg-gray-900'>
        {
          loading?
            <div className='w-full text-center flex justify-center my-10'>
              <FaSpinner className='animate-spin text-4xl self-center text-center'/>
            </div>
          :
            create?
              <CrearTerapeutaAdmin setCreate={setCreate}/>
            :
              <TablaTerapeutasAdmin setCreate={setCreate} terapists={terapists} DeleteTerapist={DeleteTerapist}/>
        }
      </div>
    </div>
  )
}