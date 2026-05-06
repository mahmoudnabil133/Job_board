import { useEffect, useState } from 'react'
import './App.css'


const Card = ({title, content}: {title: string, content: string})=>{
  const [hasLiked, setHasLiked] = useState(false);
  const [count, setCount] = useState(0);
  // useEffect to log when the like status changes
  useEffect(()=>{
    console.log(`Card ${title} has been ${hasLiked? 'liked' : 'unliked'}`);
  }, [hasLiked, title]);

  // useEffect to log when the card is rendered
  useEffect(()=>{
    console.log(`Card ${title} has been rendered`);
  }, []);

  return (
    <div className="card" onClick={()=>setCount(count+1)}>
      <h2 className='text-xl font-bold '>{title}</h2>
      <p>{content}</p>
      <p>{count || null}</p>
      <button onClick={()=>setHasLiked(!hasLiked)}>
        {hasLiked? '❤️' : '🤍'} 
      </button>
    </div>
  )
}

const App = ()=>{
  return (
    <div className="card-container px-30 py-10">
      {/* <h2>hello react app</h2> */}
      <Card title="Card 1" content="This is the card1"/>
      <Card title="Card 2" content="This is the card2"/>
      <Card title="Card 3" content="This is the card3"/>
    </div>
  )
}
export default App
