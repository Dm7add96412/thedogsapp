// define TYPE for all the variables needed to build the INFO  view
type DogInfoProps = {
    image: string
    breed: string
    likes: number
    dislikes: number
    url: string
    handleVotesClick: (breed: string, likes: number, dislikes: number, url: string, votetype: 'LIKE' | 'DISLIKE') => void
  }
  
  const Info: React.FC<DogInfoProps> = ({ image, breed, likes, dislikes, url, handleVotesClick }) => {
    return (
      <div className="Info">
        {image ? <img src={image} alt='dog' height='400'/> : null}
        {breed ? <h2>{breed}</h2> : null}
        <button type="button" onClick={() => handleVotesClick(breed, likes, dislikes, url, 'LIKE')}> LIKE </button>{likes || likes === 0 ? <>{likes}</> : <>no likes?</>}<br></br>
        <button type="button" onClick={() => handleVotesClick(breed, likes, dislikes, url, 'DISLIKE')}> DISLIKE </button> {dislikes || dislikes === 0 ? <>{dislikes}</> : <>no likes?</>}
      </div>
    )
  }
  
  export default Info