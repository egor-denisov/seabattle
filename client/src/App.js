import React, { useEffect, useState } from 'react';
import './styles/App.scss';
import Header from './components/Header';
import StartPage from './components/pages/StartPage';
import MyModal from './components/UI/MyModal/MyModal'
import ArangePage from './components/pages/ArangePage';
import BattlePage from './components/pages/BattlePage';
import WaitPage from './components/pages/WaitPage';
import GameOverPage from './components/pages/GameOverPage';
import { RandomArangeShips } from './utils/methodsOfShips';
import io from "socket.io-client";
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

const socket = io.connect('http://localhost:5000');
const getRandomNick = () => {return uniqueNamesGenerator({dictionaries: [adjectives, animals],
                                                          style: 'capital'}
)};
const App = () => {
  const [viewModal, setViewModal] = useState({view: false, text: ''});
  const [gameMap, setGameMap] = useState(Array(100).fill(0));
  const [enemyMap, setEnemyMap] = useState(Array(100).fill(0))
  const [page, setPage] = useState(0);
  const [myID, setMyID] = useState('');
  const [enemyID, setEnemyID] = useState('');
  const [roomID, setRoomID] = useState('');
  const [move, setMove] = useState(false);
  const [gameMode, setGameMode] = useState('RP');
  const [nickname, setNickname] = useState(getRandomNick());
  const [winner, setWinner] = useState(false);
  const newGame = () => {
    setGameMap(Array(100).fill(0));
    setEnemyMap(Array(100).fill(0));
    setEnemyID('');
    setGameMap(RandomArangeShips());
    setRoomID('');
    setMove(false);
    setWinner(false);
    setPage(0);
  }
  const userReady = () => {
    if(gameMap.filter(x => x===2).length === 20){
      socket.emit('ready', gameMap);
      setPage(2);
    }else{
      setViewModal({view: true, text: 'Not all ships in field!'})
    }
  }
  const shoot = (coord) => {
    socket.emit('shoot', {id: myID, room: roomID, enemy: enemyID, coord: coord})
  }
  const generateNickname = () => {
    setNickname(getRandomNick());
  }
  const goToArangeShips = () => {
    if(gameMode === 'AI'){
      setViewModal({view: true, text: 'This mode not ready yet...'});
    }else{
      setPage(1);
    }
  }
  useEffect(() => {
    setGameMap(RandomArangeShips());
    socket.on('yourID', id =>{
      setMyID(id);
    });
    socket.on('startGame', ({firstMove, room, enemyID}) =>{
      setRoomID(room);
      setEnemyID(enemyID);
      setPage(3);
      setMove(!(enemyID === firstMove));
    });
    socket.on('gameOver', ({win}) => {
      setWinner(win);
      setPage(4);
    })
  }, [])
  useEffect(() => {
    //Shooting
    const setCeilFromGameMap = (data) => {
      const tempMap = [...gameMap];
      Object.keys(data).forEach((cond) => {
        data[cond].forEach(coord => {
          tempMap[coord] = Math.max(cond, tempMap[coord]);
        });
        
      });
      setGameMap([...tempMap]);
    }
    const setCeilFromEnemyMap = (data) => {
      const tempMap = [...enemyMap];
      Object.keys(data).forEach((cond) => {
        data[cond].forEach(coord => {
          tempMap[coord] = Math.max(cond, tempMap[coord]);
        });
        
      });
      setEnemyMap([...tempMap]);
    }
    socket.on('missShoot', coord => {
      setCeilFromEnemyMap({3: [coord]});
      setMove(false);
    })
    socket.on('hitShoot', coord => {
      setCeilFromEnemyMap({4: [coord]});
    });
    socket.on('nextGambit', coord => {
      setCeilFromGameMap({3: [coord]});
      setMove(true);
    });
    socket.on('hit', coord => {
      setCeilFromGameMap({4: [coord]});
    });
    socket.on('shipBroken', ({nearCeils, field, coord}) => {
      if(field){
        setCeilFromEnemyMap({3: nearCeils,
                             4: [coord]});
      }else{
        setCeilFromGameMap({3: nearCeils,
                            4: [coord]});
      }
    })
  }, [gameMap, enemyMap]);

  const getPage = (page) => {
    if(page === 0){
      return (<StartPage gameMode={gameMode} 
                         setGameMode={setGameMode} 
                         nickname={nickname} 
                         setNickname={setNickname}
                         generateNickname={generateNickname}
                         goToArangeShips={goToArangeShips}/>)
    }else if(page === 1){
      return (<div className='battleMaps'>
              <ArangePage setMap={setGameMap} 
                          gameMap={gameMap} 
                          ready={userReady}/>
              </div>)
    }else if(page === 2){
      return <WaitPage/>
    }else if(page === 3){
      return (<BattlePage gameMap={gameMap} 
                          enemyMap={enemyMap} 
                          shoot={shoot} 
                          move={move}/>)
    }else if(page === 4){
      return <GameOverPage winner={winner} 
                           newGame={newGame}/>
    }
  }
  return (
    <div className="App">
      <Header>SeaBattle</Header>
      <MyModal visible={viewModal.view} setViewModal={setViewModal}>{viewModal.text}</MyModal>
      {getPage(page)}
      
    </div>
  );
}

export default App;
