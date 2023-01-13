import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router"
import Image from "next/image";
import Head from "next/head"
import Link from "next/link"

import useSWR from "swr"
import cls from "classnames";
import styles from "../../styles/coffee-store.module.css"
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { StoreContext } from "../../store/store-context";
import {isEmpty, fetcher} from "../../utils"
export async function getStaticProps(staticProps) {
    const params = staticProps.params;
    const coffeeStores = await fetchCoffeeStores()
    const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
      return coffeeStore.id.toString() === params.id 
    })
    return {
        props: {
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {}
        }
    }
}

export async function getStaticPaths() {
    const data = await fetchCoffeeStores()
    const coffeeStores = data.json()
    const paths = coffeeStores.map((coffeeStore) => {
        return {
            params: {
                id: coffeeStore.id.toString()
            }
        }
    })
    return {
        paths,
        fallback: true
    }
}

const CoffeeStore = (initialProps) => {
    const router = useRouter()
  
    
    
    
    const id = router.query.id
    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore)

    const {
      state: {coffeeStores},
    } = useContext(StoreContext)
    const handleCreateCoffeeStore = async (coffeeStore) => {
      try {
        const { id, name, voting, imgUrl, street, address } = coffeeStore;
        const response = await fetch("/api/createCoffeeStore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            name,
            voting: 0,
            imgUrl,
            street: street || "",
            address: address || "",
          }),
        });
  
        const dbCoffeeStore = await response.json();
        
      } catch (err) {
        console.error("Error creating coffee store", err);
      }
    };
    useEffect(() => {
      if(isEmpty(initialProps.coffeeStore)){
        if(coffeeStores.length > 0){
          const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
            return coffeeStore.id.toString() === id
          })
          setCoffeeStore(findCoffeeStoreById)
          handleCreateCoffeeStore(findCoffeeStoreById)
        }
      } else {
        handleCreateCoffeeStore(initialProps.coffeeStore)
      }
    }, [id, initialProps.coffeeStore])
    const {
      name = "", 
      address = "", 
      street = "", 
      imgUrl ="",
    } = coffeeStore

    const [votingCount, setVotingCount] = useState(0)

    const {data, error} = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher)

    useEffect(() => {
      if(data && data.length > 0) {
        setCoffeeStore(data[0])
        setVotingCount(data[0].voting)
      }
    }, [data])
    if (router.isFallback){
      return <div>Loading...</div>
    }
    const handleUpvoteButton = async () => {
      try {
        const response = await fetch("/api/favoriteCoffeeStoreById", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          })
        })
        const dbCoffeeStore = await response.json()
        
        if (dbCoffeeStore && dbCoffeeStore.length > 0){
          let count = votingCount + 1
          setVotingCount(count)
        }
      } catch (e){
        console.error("Error upvoting", e)
      }
    }
    

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }
    return (
        <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`TODO coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "/static/noimage.jpg"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt="places icon"
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {street && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{street}</p>
            </div>
          )}
          
          <div className={styles.iconWrapper}>
              <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
              />
              <p className={styles.text}>{votingCount}</p>
          </div>
          
          

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  )
    
}

export default CoffeeStore