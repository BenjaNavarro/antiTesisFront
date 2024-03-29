import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Header from '../Header';
import formatoRut from '../../Utils/FormatoRut';
import limpiaRut from '../../Utils/LimpiaRut';
import Swal from 'sweetalert2';
import Auth from '../../Utils/Auth';
import jwtDecode from 'jwt-decode';

export default function Login(props) {
    const [rut,setRut] = useState('');
    const [pass,setPass] = useState('');
    const [passCheck,setPassCheck] = useState(false);

    async function login(){
        const url = process.env.REACT_APP_API_HOST+'/api/pacients/login';
        const body = {
        rut:limpiaRut(rut),
        password:pass
        }
        await fetch(url,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                // 'Authorization': Auth.getToken()
            },
            body: JSON.stringify(body)
        }).then((res)=>{
            if(res.status === 200){
                const token = res.headers.get('x-auth-token');
                // console.log({token});
                localStorage.setItem('permisos', JSON.stringify(jwtDecode(token)))
                Auth.updateToken(token);
            }
            // console.log({res});
            return res.json();
        }).then((res)=>{
            // console.log({res});
            if(res.status === 200){
                localStorage.setItem('userLoged',JSON.stringify(res.pacient));
                window.location.href = '/perfil';
            }else if(res.status===400){
                Swal.fire({
                title:'Error!',
                text:'¡Credenciales Inválidas!',
                icon:'error',
                confirmButtonText:'Ok',
                })
            }
        }).catch((error)=>{
            console.log({error});
        });
    }

    return (
        <div className='min-h-screen h-full w-full flex flex-col justify-center bg-gray-900'>
            <Header selected="login"/>
            <div className='flex flex-col self-center p-8 absolute w-[300px] sm:w-[90%] md:w-[90%] lg:w-[85%] xl:w-[75%] top-[25%] rounded-xl border-slate-300 border
            shadow-2xl shadow-slate-600 bg-gray-900'>
                <label className='text-left font-bold text-slate-300 text-xl'>
                Inicio de Sesión</label>
                <div className='flex flex-col w-full lg:w-3/4 justify-center self-center mt-8'>
                    <label htmlFor='rut' className='text-left font-bold text-slate-300'>
                        Rut
                    </label>
                    <input
                    className='bg-gray-900 focus:bg-slate-800 text-slate-300 focus:outline-none
                    rounded-xl border border-slate-300 focus:border-slate-200 w-full p-2 self-center text-center'
                    id='rut' type='text' value={formatoRut(rut)}
                    placeholder='Rut' onChange={(e)=>{setRut(limpiaRut(e.target.value))}}/>
                </div>
                <div className='flex flex-col w-full lg:w-3/4 justify-center self-center mt-4'>
                    <label htmlFor='contrasena' className='text-left font-bold text-slate-300'>
                        Contraseña
                    </label>
                    <label className='w-full'>
                        <input
                        className='bg-gray-900 focus:bg-slate-800 text-slate-300 focus:outline-none
                        rounded-xl border border-slate-100 focus:border-slate-200 w-full p-2 self-center text-center'
                        id='contrasena' type={passCheck?'text':'password'}
                        value={pass} placeholder={passCheck?'Contraseña...':'********'}
                        onChange={(e)=>{setPass(e.target.value)}}/>
                        <div className='absolute top-[50%] sm:top-[52.5%] self-center left-[71%] sm:left-[89%] md:left-[90%] lg:left-[82%] xl:left-[82%] flex items-center leading-5'>
                            <button className='w-10 h-8 text-slate-100 text-xl self-center' title='Visualizar Contraseña'
                            onClick={()=>{setPassCheck(!passCheck)}}>
                                {!passCheck?<FaEye/>:<FaEyeSlash/>}
                            </button>
                        </div>
                    </label>
                </div>
                <div className='flex flex-col w-full justify-end self-center mt-4'>
                    <button onClick={()=>{
                        login();
                    }}
                    className='bg-gray-900 hover:bg-slate-800 text-slate-300
                    rounded-xl border border-slate-300 hover:border-slate-200 w-40 lg:w-1/4 xl:w-1/5 p-2 self-end text-center'>
                        Iniciar Sesión
                    </button>
                    <div className='flex flex-row mt-8'>
                        <label className='text-white mr-2'>¿No tiene cuenta?</label>
                        <Link to='/register'>
                            <label className='text-white font-bold cursor-pointer'>¡Regístrese!</label>
                        </Link>
                        <Link to={"/recuperarContrasena"}>
                            <label className='text-white font-bold cursor-pointer ml-2'>¡Olvidé mi contraseña!</label>
                        </Link>
                        {/* <Link to='/registro_terapeuta'>
                            <label className='text-white font-bold cursor-pointer ml-2'>¡Regístrese Terapeuta!</label>
                        </Link> */}
                    </div>
                </div>
            </div>
        </div>
    )
}