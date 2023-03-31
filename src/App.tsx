import {useState,useEffect} from "react"
import axios from "axios"
import './App.css'
import dogService from './services/dogs'

export interface Breed {
  Dog: {
    name: string,
    url: string,
    likes: number,
    dislikes: number,
    id: string
  }[]
}

function App() {
  const [dogs, setDogs] = useState<Breed['Dog']>([])
  const [dogsDB, setDogsDB] = useState<Breed['Dog']>([])
  const [show, showDogs] = useState<Boolean>(false)
  const [breed, setBreed] = useState<string>('')
  const [image, setImage] = useState<string | null>(null)
  const [url, setUrl] = useState<string>('')
  const [likes, setLikes] = useState<number>(0)
  const [dislikes, setDislikes] = useState<number>(0)
  const [clickCount, setClickcount] = useState<number>(0)

  const handleButtonClick = () => {
    showDogs(true)
    console.log(dogs)
    console.log(dogsDB)
  } 

  useEffect(() => {
    dogService.getAll().then(initialDogs => {
      setDogsDB(initialDogs)
    axios
      .get(`https://dog.ceo/api/breeds/list/all`)
      .then(response => {
        const dogsList: Breed['Dog'] = Object.keys(response.data.message).map((breedId) => {
          const breedName = breedId.charAt(0).toUpperCase() + breedId.substring(1)
          const dbdog = initialDogs.find((dog: { name: string }) => dog.name === breedName)
    //      console.log(dbdog)
          return {
            name: breedName,
            url: `https://dog.ceo/api/breed/${breedId}/images`,
            likes: dbdog ? dbdog.likes : 0,
            dislikes: dbdog ? dbdog.dislikes : 0,
            id: dbdog ? dbdog.id : null
          }
        })
        setDogs(dogsList) })
      })
    }, [])

  const handleClick = async (name: string, url: string, likes: number, dislikes: number) => {
    console.log(url, name, likes, dislikes)
    console.log(dogs.find(dog => dog.name === name))
    setClickcount(0)
    setBreed(name)
    setLikes(likes)
    setDislikes(dislikes)
    setUrl(url)

    let response = await fetch(url)
    let data = await response.json()
    let pic = data.message[Math.floor(Math.random() * data.message.length)]
    setImage(pic)
   // console.log(name, likes, dislikes, url, pic)
    }

  const handleLikesClick = async (name: string, likes: number, dislikes: number, url: string) => {
    if (clickCount < 1) {
      const dogindb = dogsDB.find((dog: {name: string}) => dog.name === name)
      
      if (dogindb) {
        const idDB = dogindb.id
        const dog = {
     //     name: name,
          likes: dogindb.likes + 1,
          dislikes: dogindb.dislikes,
          url: url
        }
        dogService
          .update(idDB, dog)
          .then(returnedDog => {
            setDogsDB(dogsDB.map(dog => dog.id !== idDB ? dog : returnedDog))
            setDogs(dogs.map(dog => dog.id !== idDB ? dog : returnedDog))
            setLikes(dog.likes)
          })
      } else {
        const dog = {
          name: name,
          likes: likes + 1,
          dislikes: dislikes,
          url: url
        }
        dogService
          .create(dog)
          .then(returnedDog => {
            setDogsDB(dogsDB.concat(returnedDog))
            setDogs(dogs.map(d => d.name !== name ? d : returnedDog))
            setLikes(dog.likes)
          })
      }
      setClickcount(1)
    } else {
      return alert('You can only vote once!')
    }
  }

  const handleDislikesClick = async (name: string, likes: number, dislikes: number, url: string) => {
    if (clickCount < 1) {
      const dogindb = dogsDB.find((dog: {name: string}) => dog.name === name)

      if (dogindb) {
        const idDB = dogindb.id
        const dog = {
    //      name: name,
          likes: dogindb.likes,
          dislikes: dogindb.dislikes + 1,
          url: url
        }
        dogService
          .update(idDB, dog)
          .then(returnedDog => {
            setDogsDB(dogsDB.map(dog => dog.id !== idDB ? dog : returnedDog))
            setDogs(dogs.map(dog => dog.id !== idDB ? dog : returnedDog))
            setDislikes(dog.dislikes)
          })
      } else {
        const dog = {
          name: name,
          likes: likes,
          dislikes: dislikes + 1,
          url: url
        }
        dogService
          .create(dog)
          .then(returnedDog => {
            setDogsDB(dogsDB.concat(returnedDog))
            setDogs(dogs.map(d => d.name !== name ? d : returnedDog))
            setDislikes(dog.dislikes)
          })
      }
      setClickcount(1)
    } else {
      return alert('You can only vote once!')
    }
  }

  return (
    <div className="App">
      <div className="Top">
        <h1>THE DOG APP</h1>
          <button type="button" onClick={handleButtonClick}>Show me the DOGS!</button><br/>
      </div>
      <div className="Bottom">
        <div className="Doglist">
          <ul className="list">
          {show ? 
            dogs.map((dog) => (
                <li key={dog.name} onClick={() => handleClick(dog.name, dog.url, dog.likes, dog.dislikes)}>{dog.name}</li>
               )) : null} 
          </ul>
        </div>
        <div className="Info">
          {image ? 
            <img src={image} alt='dog' height='400'/> : null}
          {breed ? <h2>{breed}</h2> : null}
          <button type="button" onClick={() => handleLikesClick(breed, likes, dislikes, url)}> LIKE </button>{likes || likes === 0 ? <>{likes}</> : <>no likes?</>}<br></br>
          <button type="button" onClick={() => handleDislikesClick(breed, likes, dislikes, url)}> DISLIKE </button> {dislikes || dislikes === 0 ? <>{dislikes}</> : <>no likes?</>}
        </div>
      </div>

    </div>
  )
}

export default App;

/* 
          {image ? 
          <img src={image} alt='dog' height='400'/> : null}
*/