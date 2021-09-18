import TextField from '@material-ui/core/TextField';
import styles from '../styles/login.module.scss'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Button } from '@material-ui/core';

function loginPage(){
    return(
        <div className={styles.container}>
            <Header/>
            <div className={styles.content}>
                <img className={styles.imgUndraw} src='/undraw_Login.svg' />
                <form noValidate autoComplete="off">
                    <div className={styles.title}>Entrar</div>
                        <TextField id="filled-basic" label="Email" variant="filled" />
                        <TextField id="filled-basic" label="Senha" variant="filled" type="password"/>
                        <Button variant="contained" className='sendButton'>Enviar</Button>     
                    <div className={styles.agroup}>
                        <a className={styles.esqueci} href="#">Esqueci minha senha</a>
                        <a className={styles.cadastro} href="#">Não tem senha? <br/>Cadastre-se aqui!</a>
                    </div>
                </form>
            </div>
        <Footer/>
        </div>
    )
}
export default loginPage 