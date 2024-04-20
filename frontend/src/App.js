import { Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';


function App() {
  return (
    <div className="App">
      <Route exact path='/' component={Home} />      
      <Route exact path='/chats' component={ChatPage}/>      
    </div>
  );
}

export default App;
