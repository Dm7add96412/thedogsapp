import {useState,useEffect} from "react"
import axios from "axios"
import './App.css'
import dogService from './services/dogs'
import Info from "./components/Info"

// interface for initial dogs list
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
  const [image, setImage] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [likes, setLikes] = useState<number>(0)
  const [dislikes, setDislikes] = useState<number>(0)
  const [clickCount, setClickcount] = useState<number>(0)

  // show the list of dogs
  const handleButtonClick = () => {
    showDogs(true)
  } 
// fetch dogs already in database and combine the data with the dog.ceo list of all dogs
  useEffect(() => {
    dogService.getAll().then(initialDogs => {
      setDogsDB(initialDogs)
    axios
      .get(`https://dog.ceo/api/breeds/list/all`)
      .then(response => {
        const dogsList: Breed['Dog'] = Object.keys(response.data.message).map((breedId) => {
          const breedName = breedId.charAt(0).toUpperCase() + breedId.substring(1)
          const dbdog = initialDogs.find((dog: { name: string }) => dog.name === breedName)
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

  // handle click/choosing dog breed => set up all proper variables and fetch a random photo of the breed
  const handleClick = async (name: string, url: string, likes: number, dislikes: number) => {
    setClickcount(0)
    setBreed(name)
    setLikes(likes)
    setDislikes(dislikes)
    setUrl(url)
    let response = await fetch(url)
    let data = await response.json()
    let pic = data.message[Math.floor(Math.random() * data.message.length)]
    setImage(pic)
    }

  // handle LIKE/DISLIKE click, update database and frontend listings + limit LIKING to 1 click
  const handleVotesClick = async (name: string, likes: number, dislikes: number, url: string, votetype: 'LIKE' | 'DISLIKE') => {
    if (clickCount < 1) {
      const dogindb = dogsDB.find((dog: {name: string}) => dog.name === name)
      
      // IF breed already in db, update the db ELSE create a new entry to db
      if (dogindb) {
        const idDB = dogindb.id
        const dog = {
          name: dogindb.name,
          likes: votetype === 'LIKE' ? dogindb.likes + 1 : dogindb.likes,
          dislikes: votetype === 'DISLIKE' ? dogindb.dislikes + 1 : dogindb.dislikes,
          url: url
        }
        dogService
          .update(idDB, dog)
          .then(returnedDog => {
            setDogsDB(dogsDB.map(dog => dog.id !== idDB ? dog : returnedDog))
            setDogs(dogs.map(dog => dog.id !== idDB ? dog : returnedDog))
            setLikes(dog.likes)
            setDislikes(dog.dislikes)
          })
      } else {
        const dog = {
          name: name,
          likes: votetype === 'LIKE' ? likes + 1 : likes,
          dislikes: votetype === 'DISLIKE' ? dislikes + 1 : dislikes,
          url: url
        }
        dogService
          .create(dog)
          .then(returnedDog => {
            setDogsDB(dogsDB.concat(returnedDog))
            setDogs(dogs.map(d => d.name !== name ? d : returnedDog))
            setLikes(dog.likes)
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
          {breed ?
            <Info image={image}
            breed={breed}
            likes={likes}
            dislikes={dislikes}
            url={url}
            handleVotesClick={handleVotesClick}/> : null}
        </div>
      </div>
    </div>
  )
}

export default App