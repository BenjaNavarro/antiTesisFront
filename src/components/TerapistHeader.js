import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FaDoorOpen, FaDoorClosed } from 'react-icons/fa';
import capitalizeFirstLetter from '../Utils/CapitalizeFirstLetter';
import Auth from '../Utils/Auth';
import Logout from '../Utils/Logout';
import MenuToolTipTerapist from './modals/MenuToolTip/MenuToolTipTerapist';

const TerapistHeader = () => {
  
  const user = JSON.parse(localStorage.getItem('userLoged'));
  const [toggleDoor, setToggleDoor] = useState(false);

  useEffect(()=>{
    // console.log('Terapist Header');
  },[]);

  async function logout(){
    const url = process.env.REACT_APP_API_HOST+'/api/terapists/logout';
    const body = user;
    await fetch(url,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': Auth.getToken()
      },
      body:JSON.stringify(body)
    }).then((res)=>{
      Auth.updateToken(res.token);
      return res.json();
    }).then((res)=>{
      console.log({res});
      Logout.logout();
    }).catch((error)=>{console.error({error})});
  }


  return (
    <div className='backdrop-blur-md w-full h-12 px-16 flex flex-row justify-between fixed top-0 left-0
    hover:shadow hover:shadow-slate-600'>
      <div className='w-32 md:w-1/4 self-center'>
        <Link to={'/perfil'}>
          <label className='text-slate-100 text-left font-bold italic text-sm md:text-lg xl:text-xl cursor-pointer'>        
            Proyecto de Título
          </label>
        </Link>
      </div>
      <div className='hidden md:hidden w-1/2 lg:flex justify-end mr-40 items-center space-x-10'>
        <Link to={'/terapist_calls'}>
          <label className='text-slate-100 cursor-pointer'>
            Mis Llamadas
          </label>
        </Link>
        <Link to={'/pacients'}>
          <label className='text-slate-100 cursor-pointer'>
            Mis Pacientes
          </label>
        </Link>
        <Link to={'/new_call'}>
          <label className='text-slate-100 cursor-pointer'>
            Nuevo Test
          </label>
        </Link>
        <Link to={'/perfil'}>
          <label className='text-slate-100 cursor-pointer'>
            {capitalizeFirstLetter(user.name)+' '+capitalizeFirstLetter(user.lastName)}
          </label>
        </Link>
        <button onMouseEnter={()=>{setToggleDoor(!toggleDoor)}} 
        onMouseLeave={()=>{setToggleDoor(!toggleDoor)}}
        className='flex text-slate-100 cursor-pointer'
        onClick={()=>{logout()}}>
          Cerrar Sesión
          {
            toggleDoor?
              <FaDoorOpen className='self-center text-2xl ml-2'/>
              :
              <FaDoorClosed className='self-center text-2xl ml-2'/>
          }
        </button>
      </div>
      <div className='flex items-center sm:flex sm:items-end md:flex xl:hidden lg:hidden md:items-end sm:self-center md:self-center'>
        <MenuToolTipTerapist/>
      </div> 
    </div>
  )
}

export default TerapistHeader