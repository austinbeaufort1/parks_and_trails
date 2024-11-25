import './App.css'
import MainTable from './components/Table/Table'

function App() {

  return (
    <>
      <div style={{ display: 'flex'}}>
        {/* add in image later when time allows */}
        {/* <img style={{ position: 'relative', top: '20px', width: '100px', height: '100px', marginRight: '5rem', borderRadius: '20%'}} src='../public/hike.jpg' alt='hiker' /> */}
        <h1 style={{ position: 'relative', top: '10px' }}> Parks and Trails of One Skinny Dude</h1>
      </div>
      <MainTable />
    </>
  )
}

export default App
