import styles from "./index.module.scss" 
import Image from 'next/image';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import logo from '../../public/logo_branca_horizontal_semfundo.png';
import Link from 'next/link';
function Header() {
  const isLogged = false;
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.logo}><a href="/">
          <Image className={styles.img} src={logo}/></a>
        </div>
        <div className={styles.search}>
        <form noValidate autoComplete="off">
          <TextField className={styles.search} label="Pesquisar" />
        </form>
        </div>
      </div>
      <div className={styles.right}>
      {
        !isLogged ? (
          <>
            <Link href="/login"><Button className={styles.button} variant="contained">Entrar</Button></Link>
            <Link href="/signup"><Button className={styles.button} variant="contained">Criar conta</Button></Link>
            <Link href=""><Button className={styles.button} variant="contained">Mostruário </Button></Link>
          </>
        ) : (
          <>
            <Button className={styles.button} variant="contained">Mostruário </Button>
            <Button className={styles.button} variant="contained">Minha conta</Button>
          </>
        )
      }

      </div>
    </div>
  );
}

export default Header;