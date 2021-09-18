import styles from './index.module.scss'
import { FontAwesomeIcon as FAI} from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebookSquare  } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons'

function Footer() {
  return(
    <div className={styles.container}>
      <div>
        <p>
          <a target="_blank" href="https://www.instagram.com/oculosexpress.sc/">
            <FAI className={styles.FAI} icon={faInstagram}/>
            &nbsp;@oculosexpress.sc
          </a>
        </p>
        <p>
        <a target="_blank"  href="mailto:oculosexpress@gmail.com">
          <FAI className={styles.FAI} icon={faEnvelope}/>
            &nbsp;oculosexpress@gmail.com
          </a>
        </p>
        <p>
          <a target="_blank"  href="https://api.whatsapp.com/send?phone=5548985051510">
            <FAI className={styles.FAI} icon={faPhone}/>
            &nbsp;(48) 98505-1510
          </a>
        </p>
        <p>
          <a target="_blank"  href="https://www.facebook.com/oticaexpres/">
            <FAI className={styles.FAI} icon={faFacebookSquare}/>
            &nbsp;@oticaexpres
          </a>
        </p>
      </div> 
    </div>
  )
  } 
export default Footer;