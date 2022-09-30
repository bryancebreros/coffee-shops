import { createApi } from 'unsplash-js';

const serverApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});


const getListOfCoffeeStorePhotos = async() => {
    const photos = await serverApi.search.getPhotos({
        query: "coffee shop",
        page:1,
        perPage: 30,
    });
    const unsplashResults = photos.response.results
    return unsplashResults.map((result) => result.urls["small"])
}
const getUrlForCoffeeStores = (latlong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&;;=${latlong}&limit=${limit}`
}
export const fetchCoffeeStores = async () => {
    const photos = await getListOfCoffeeStorePhotos()

    const options = {
        method: 'GET', 
        headers: {
            Accept: 'application/json',
            Authorization: process.env.FOURSQUARE_API_KEY,
        },
      };
    
    const response = await fetch(getUrlForCoffeeStores(
        "43.649900206482973%2C-9.38448035304708", 
        "coffee", 
        6
        ), 
        options
    );
    const data = await response.json()
    return data.results.map((result,idx) => {
        return {
            id: result.fsq_id,
            name: result.name,
            address: result.location.formatted_address,
            street: result.location.cross_street,
            imgUrl: photos[idx]
        }
    })
      // .catch(err => console.error(err));
}