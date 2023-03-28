import {useState,useEffect} from "react"
import axios from "axios"
import './App.css'

export interface Breed {
  Dog: {
    id: string,
    name: string,
    url: string
  }[]
}

function App() {
  const [dogs, setDogs] = useState<Breed['Dog']>([])
  const [show, showDogs] = useState<Boolean>(false)
  const [breed, setBreed] = useState<string | null>(null)
  const [image, setImage] = useState<string | null>(null)

  const handleButtonClick = () => {
    showDogs(true)
  }

  useEffect(() => {
    axios
      .get(`https://dog.ceo/api/breeds/list/all`)
      .then(response => {
        const dogsList: Breed['Dog'] = Object.keys(response.data.message).map((breedId) => {
          const breedName = breedId.charAt(0).toUpperCase() + breedId.substring(1)
          return {
            id: breedId,
            name: breedName,
            url: `https://dog.ceo/api/breed/${breedId}/images`
          }
        })
        setDogs(dogsList)
      }) 
    }, [])

  const handleClick = async (name: string, url: string) => {
    setBreed(name)
    console.log(name)
    const respone = await fetch(url)
    const data = await respone.json()
    const pic = data.message[Math.floor(Math.random() * data.message.length)]
    setImage(pic)
    console.log(pic)
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
                <li key={dog.id} onClick={() => handleClick(dog.name, dog.url)}>{dog.name}</li>
               )) : null} 
          </ul>
        </div>
        <div className="Info">
          {image ? 
          <img src={image} alt='dog' height='400'/> : null}
          {breed ? <h2>{breed}</h2> : null}
        </div>
      </div>

    </div>
  )
}

export default App;