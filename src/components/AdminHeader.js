import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaDoorOpen, FaDoorClosed } from 'react-icons/fa';
import capitalizeFirstLetter from '../Utils/CapitalizeFirstLetter';
import Auth from '../Utils/Auth';
import Logout from '../Utils/Logout';
import MenuToolTipAdmin from './modals/MenuToolTip/MenuToolTipAdmin';
import Swal from 'sweetalert2';

const AdminHeader = (props) => {

  const user = JSON.parse(localStorage.getItem('userLoged'));
  const [toggleDoor, setToggleDoor] = useState(false);

  // useEffect(()=>{
  //   console.log({props});
  // },[]);

  async function logout(){
    const url = process.env.REACT_APP_API_HOST+'/api/admins/logout';
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
      // console.log({res});
      Logout.logout();
    }).catch((error)=>{console.error({error})});
  }


  return (
    <div className='backdrop-blur-md w-full h-12 px-16 flex flex-row justify-between fixed top-0 left-0
    hover:shadow hover:shadow-slate-600'>
      <div className='w-32 md:w-1/4 self-center'>
        <Link to={'/'}>
          <label className='text-slate-100 text-left font-bold italic text-sm md:text-lg xl:text-xl cursor-pointer'>        
            Proyecto de Título
          </label>
        </Link>
      </div>
      <div className='hidden md:hidden w-1/2 lg:flex justify-end items-center space-x-10'>
        {/* <Link to={'/sesiones'}>
          <label className={'text-slate-100 cursor-pointer'}>
            Sesiones
          </label>
        </Link> */}
        <Link to={'/pacients'}>
          <label className={'text-slate-100 cursor-pointer hover:border-b-[0.5px] border-slate-100 '+(props.selected === "pacients"?" border-b border-slate-100 font-bold":null)}>
            Pacientes
          </label>
        </Link>
        <Link to={'/terapists'}>
          <label className={'text-slate-100 cursor-pointer hover:border-b-[0.5px] border-slate-100 '+(props.selected === "terapists"?" border-b border-slate-100 font-bold":null)}>
            Terapeutas
          </label>
        </Link>
        <Link to={'/perfil'}>
          <label className={'text-slate-100 cursor-pointer hover:border-b-[0.5px] border-slate-100 '+(props.selected === "perfil"?" border-b border-slate-100 font-bold":null)}>
            {capitalizeFirstLetter(user.name)+' '+capitalizeFirstLetter(user.lastName)}
          </label>
        </Link>
        <button onMouseEnter={()=>{setToggleDoor(!toggleDoor)}} 
        onMouseLeave={()=>{setToggleDoor(!toggleDoor)}}
        onClick={()=>{
          Swal.fire({
            title:'',
            text:'¿Desea Cerrar Sesión?',
            icon:'question',
            confirmButtonText:'Sí',
            showCancelButton:true,
            cancelButtonText:'No'
          }).then((res)=>{
            if(res.isConfirmed){
              logout();
            }
          });
        }}
        className='text-slate-100 cursor-pointer flex hover:border-b-[0.5px] border-slate-100 '>
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
        <MenuToolTipAdmin logout={logout} selected={props.selected}/>
      </div> 
    </div>
  )
}

export default AdminHeader