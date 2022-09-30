import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Banner from '../components/banner'
import Card from '../components/card'
import coffeeStoresData from '../data/coffee-stores.json'
import { fetchCoffeeStores } from '../lib/coffee-stores'
export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores()
  
  return {
    props: {
        coffeeStores
    }
    
}
  
}

export default function Home(props) {
  console.log(props);
  console.log('hi');
  const handleClick = () => {
    console.log('holaaaa');
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Stores App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Coffee Stores Nearby
        </h1>
        <Banner buttonText='View Stores' onClick={handleClick} />
        <div className={styles.heroImage}>
          <Image src="/static/gowon-sip.png" width={500} height={625}></Image>
        </div>
        {props.coffeeStores.length > 0 && (
          <div>
            <h2 className={styles.heading2}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
            {props.coffeeStores.map((coffeeStore) => {
              return (
                <Card key={coffeeStore.id} name={coffeeStore.name} href={`/coffee-store/${coffeeStore.id}`} imgUrl={coffeeStore.imgUrl ||  "/static/noimage.jpg"}/>
              )
            })}
        </div>
          </div>
        )}
        
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  )
}
