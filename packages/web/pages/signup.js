import styles from "../styles/signup.module.scss"
import Header from '../components/Header'
import Footer from '../components/Footer'
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from "@material-ui/core/InputLabel";
import Select from '@material-ui/core/Select';
import { useForm, Controller } from 'react-hook-form'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { signUp } from './../services/api';
function SignUp(){
    const {control, handleSubmit} = useForm();
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [estado, setEstado] = useState("");
    const [cidade, setCidade] = useState("");
    async function handleSignup (data){
        const payload = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            address:{
                street: data.street,
                postalCode: data.postalCode,
                city: cidade,
                number: data.number,
                uf: estado.nome,
                country: 'Brazil'
            }
        }
        const res = await signUp(payload)
    }
    useEffect(async ()=>{
        setEstado("")
        setEstados([])
        const res = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/')
        setEstados(res.data);
    },[])
    useEffect(async ()=>{
        setCidade("")
        setCidades([])
        const res = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.sigla}/distritos?orderBy=nome`)
        setCidades(res.data);
    },[estado])
    return(
        <div className={styles.container}>
        <Header/>
            <div className={styles.content}>
                <img className={styles.image}src="/undraw_Contract.svg"/>
                <form onSubmit={handleSubmit(handleSignup)} className={styles.form}>
                    <div>
                        <div className={styles.dadospessoais}>
                            <div className={styles.title}>Dados pessoais</div>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Email" variant="filled" />}
                            />
                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Senha" variant="filled" type="password"/>}
                            />
                            <Controller
                                name="firstName"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Primeiro Nome" variant="filled" />}
                            />
                            <Controller
                                name="lastName"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField  {...field} label="Sobrenome" variant="filled" />}
                            />
                            <Controller
                                name="phoneNumber"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField  {...field} label="Numero de telefone" variant="filled" />}
                            />
                            <InputLabel id="gender">Genero</InputLabel>
                            <Controller
                                name="gender"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Select {...field} id="gender" labelId="gender">
                                    <MenuItem value={'Masculino'}>{'Masculino'}</MenuItem>
                                    <MenuItem value={'Feminino'}>{'Feminino'}</MenuItem>
                                    <MenuItem value={'Outro'}>{'Outro'}</MenuItem>
                                </Select>}
                            />
  
                        </div>
                        <div className={styles.endereco}>
                            <div className={styles.title}>Endereço</div>

                            <Controller
                                name="street"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Rua" variant="filled" />}
                            />
                            <Controller
                                name="number"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Numero" variant="filled" />}
                            />
                            <Controller
                                name="postalCode"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="CEP" variant="filled"  />}
                            />
                            
                            <InputLabel id="estado">Estado</InputLabel>


                            <Controller
                                name="uf"
                                control={control}
                                defaultValue=""
                                render={({ field }) => 
                                        <Select
                                            {...field}
                                            className={styles.select}
                                            labelId="estado"
                                            id="estado"
                                            value={estado}
                                            onChange={(e)=>setEstado(e.target.value)}
                                        >
                                            {estados.map((v)=>(
                                                <MenuItem key={v.id} value={v}>{v.nome}</MenuItem>
                                            ))}
                                        </Select>}
                            />
                            
                            <InputLabel id="cidade">Cidade</InputLabel>

                            <Controller
                                name="city"
                                control={control}
                                defaultValue=""
                                render={({ field }) => 
                                <Select labelId="cidade" className={styles.select} {...field} 
                                value={cidade}
                                onChange={(e)=>setCidade(e.target.value)}>
                                    {cidades.map((v)=>(
                                        <MenuItem key={v.id} value={v.nome}>{v.nome}</MenuItem>
                                    ))}
                                </Select>}
                            />
                            


                            <Button type="submit" variant="contained" className='sendButton'>Enviar</Button>     
                        </div>
                    </div>
                    
                </form>
            </div>
        <Footer/>
        </div>
    )
}

export default SignUp