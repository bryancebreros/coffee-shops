import { useEffect, useState, useContext} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Banner from '../components/banner'
import Card from '../components/card'

import { fetchCoffeeStores } from '../lib/coffee-stores'

import useTrackLocation from '../hooks/use-track-location'
import { ACTION_TYPES, StoreContext } from '../store/store-context'

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores()
  
  return {
    props: {
        coffeeStores
    }
    
  }
  
}

export default function Home(props) {
  
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation();
  // const [coffeeStores,setCoffeeStores] = useState("")
  const [coffeeStoresError, setCoffeeStoresError] = useState(null)
  const {dispatch, state} = useContext(StoreContext)

  const {coffeeStores, latLong} = state
  
  useEffect(() => {
    async function setCoffeeStoresByLocation(){
      if(latLong) {
        try{
          // const fetchedCoffeeStores = await fetchCoffeeStores(latLong, 30)
          // console.log({ fetchedCoffeeStores });
          const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`)
          const coffeeStores = await response.json()
          // setCoffeeStores(fetchedCoffeeStores)
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores: coffeeStores
            }
          })
          setCoffeeStoresError("")
        } catch(e) {
          console.error("e", {e});
          setCoffeeStoresError(e.message)
        }
      }
    }
    setCoffeeStoresByLocation()
  }, [dispatch, latLong])
  const handleClick = () => {
    handleTrackLocation();
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
        <Banner buttonText={isFindingLocation ? "Locating..." : "View stores nearby"} onClick={handleClick} />
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        <div className={styles.heroImage}>
          <Image src="/static/gowon-sip.png" alt="" width={500} height={625}></Image>
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
        <div className={styles.sectionWrapper}>
          {props.coffeeStores.length > 0 && (
            <>
              <h2 className={styles.heading2}>Toronto Stores</h2>
              <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card key={coffeeStore.id} name={coffeeStore.name} href={`/coffee-store/${coffeeStore.id}`} imgUrl={coffeeStore.imgUrl ||  "/static/noimage.jpg"}/>
                )
              })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
