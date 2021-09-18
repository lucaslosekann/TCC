//Página principal
import Header from './../components/Header';
import Footer from './../components/Footer';
import styles from '../styles/index.module.scss'
import { useEffect, useState } from 'react';
import config from '../config/config.json'
import axios from 'axios';
export default function Home() {
  const [sunglasses, setSunglasses] = useState([]);
  const [mostPopular, setMostPopular] = useState([]);
  useEffect(async ()=>{
    let res = await axios.get(config.api_url + '/api/product')
    setSunglasses(res.data)

    res = await axios.get(config.api_url + '/api/product')
    setMostPopular(res.data)
  },[])
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.imgContainer}>
        <img src="/undraw_AroundTheWorld.svg" alt="" />
      </div>
      <div className={styles.products}>
        <div>
          <span>Óculos de sol</span>
          <div>
            {sunglasses.map((v,i)=>{
              console.log(v)
              return(
              <span key={v.id}>{v.product}</span>
              )
            })}
          </div>
        </div>
        <div>
          <span>Mais Vendidos</span>
          <div>
          {mostPopular.map((v,i)=>{
              console.log(v)
              return(
              <span key={v.id}>{v.product}</span>
              )
            })}
          </div>
        </div>
      </div>

      <div>
        <div></div>
        <div>
          <div></div>
          <div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>

  )
}
