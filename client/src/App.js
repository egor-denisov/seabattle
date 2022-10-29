import React, { useEffect, useState } from 'react';
import './styles/App.scss';
import Header from './components/Header';
import StartPage from './components/pages/StartPage';
import MyModal from './components/UI/MyModal/MyModal'
import ArangePage from './components/pages/ArangePage';
import BattlePage from './components/pages/BattlePage';
import WaitPage from './components/pages/WaitPage';
import GameOverPage from './components/pages/GameOverPage';
import { RandomArangeShips, checkShip, getNearCells } from './utils/methodsOfShips';
import { moveAI } from './utils/ai';
import io from "socket.io-client";
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { useCookies } from "react-cookie";
import MyButton from './components/UI/MyButton/MyButton';
import MySetting from './components/UI/MySetting/MySetting';
const socket = io.connect('http://localhost:5000');
const getRandomNick = () => {return uniqueNamesGenerator({dictionaries: [adjectives, animals],
                                                          style: 'capital'}
)};

const App = () => {
  const [viewModal, setViewModal] = useState({view: false, text: '', buttons: ''});
  const [gameMap, setGameMap] = useState(Array(100).fill(0));
  const [enemyMap, setEnemyMap] = useState(Array(100).fill(0));
  const [hideEnemyMap, setHideEnemyMap] = useState(Array(100).fill(0));
  const [page, setPage] = useState(0);
  const [myID, setMyID] = useState('');
  const [enemyID, setEnemyID] = useState('');
  const [roomID, setRoomID] = useState('');
  const [move, setMove] = useState(false);
  const [gameMode, setGameMode] = useState('AI');
  const [gameSpeed, setGameSpeed] = useState('Fast');
  const [timeToMove, setTimeToMove] = useState(19);
  const [nickname, setNickname] = useState(getRandomNick());
  const [winner, setWinner] = useState(false);
  const [enemyNick, setEnemyNick] = useState('Enemy');
  const [cookies, setCookie, removeCookie] = useCookies(["socketID", "maps", "localGame"]);
  const [woundedShip, setWoundedShip] = useState([]);
  const [darkmode, setDarkmode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [menuActive, setMenuActive] = useState(false);
  const [enemyReconn, setEnemyReconn] = useState(false);
  const newGame = () => {
    setGameMap(Array(100).fill(0));
    setEnemyMap(Array(100).fill(0));
    setEnemyID('');
    setGameMap(RandomArangeShips());
    setRoomID('');
    setMove(false);
    setWinner(false);
    setPage(0);
    setViewModal(false);
    handleRemoveCookies();
  }
  // COOKIES
  const handleRemoveCookies = () => {
    removeCookie(["socketID", "maps", "localGame"]);
  }
  useEffect(() => {
    if(cookies.socketID !== undefined && myID !== ''){
      socket.emit('wasInGame', cookies.socketID.id);
      handleRemoveCookies();
    }
  }, [myID]);
  // SPEED GAME
  useEffect(() => {
    setTimeToMove(gameSpeed === 'Fast' ? 19 : 59);
  }, [gameSpeed]);
  // WIDTH
  const [width, setWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
  });
  // COLOR MODE
  useEffect(() => {
    document.body.style.backgroundColor = darkmode ? "#202020ff" : "#f6f7f9ff";
  }, [darkmode]);
  // TIMER
  const [overTime, setOverTime] = React.useState(false);
  const [time, setTime] = React.useState(5);
  const tick = () => {
      if (overTime){
        if(gameMode === 'AI'){
          gameOver(false);
        }
        return;
      };
      if (time === 0) {
        setOverTime(true);
      } else {
        setTime(time - 1);
      }
  };
  const resetTimer = (t) => {
    setOverTime(false);
    setTime(t);
  };
  useEffect( () => {
    socket.on('changeTimer', (t) => {// ошибка при разделении экрана из-за срабатывания онфокус при шутинге на неактивной странице
      resetTimer(~~(t/1000) + 1);
      setTimeout(() => resetTimer(~~(t/1000)), t%1000);
    });
  }, []);
  useEffect( () => {
    if(cookies.localGame !== undefined){
      const t = cookies.localGame.startTime - Date.now() + cookies.localGame.time*1000;
      if( t > 0 ){
        setGameMode('AI')
        setPage(3);
        setEnemyNick("Computer");
        setMove(true);
        setGameMap(cookies.maps.player);
        setEnemyMap(cookies.maps.enemy);
        setHideEnemyMap(cookies.localGame.hideEnemyMap);
        setTimeToMove(cookies.localGame.time);
        resetTimer(~~(t/1000) + 1);
        setTimeout(() => resetTimer(~~(t/1000)), t%1000);
      }
    }else{
      removeCookie(["socketID", "maps", "localGame"]);
    }
  }, [])
  window.onfocus = () => {
    if(page === 3 && gameMode === 'RP'){
      socket.emit('searchTimer', roomID);
    }else if(page === 3 && gameMode === 'AI'){
      const t = cookies.localGame.startTime - Date.now() + cookies.localGame.time*1000;
      if(t > 0){
        resetTimer(~~(t/1000) + 1);
        setTimeout(() => resetTimer(~~(t/1000)), t%1000);
      }else{
        gameOver(false);
      }
    }
  };
  //
  const userReady = () => {
    if(gameMap.filter(x => x===2).length === 20){
      if(gameMode === 'RP'){
        removeCookie(["socketID", "maps", "localGame"]);
        socket.emit('ready', {gameMap: gameMap, nickname: nickname, timeToMove: timeToMove});
        setPage(2);
      }else{
        setEnemyNick('Computer');
        setPage(3);
        setMove(true);
        resetTimer(timeToMove);
        let temp_map = RandomArangeShips();
        setHideEnemyMap(temp_map);
        setCookie('localGame', {startTime: Date.now(), time: timeToMove, hideEnemyMap: temp_map}, {
          path: "/"
        });
      }
    }else{
      setViewModal({view: true, text: 'Not all ships in field!'})
    }
  }
  const gameOver = (win) => {
    removeCookie(["socketID", "maps", "localGame"]);
    setOverTime(true);
    setWinner(win);
    setPage(4);
    setEnemyReconn(false);
  }
  const exitFromGame = () => {
    socket.emit('exitFromGame');
    newGame();
  }
  const goHome = () => {
    if(page === 3){
      setViewModal({view: true, 
                    text: 'You really want exit the game?', 
                    buttons: <div className='modalButtons'><MyButton onClick={() => exitFromGame()}><p>Yes</p></MyButton>
                                                           <MyButton onClick={() => setViewModal(false)}><p>No</p></MyButton>
                             </div>});
    }else{
      exitFromGame();
    }
  }
  const setCellToMap = (data, map) => {
    const tempMap = [...map];
    Object.keys(data).forEach((cond) => {
      data[cond].forEach(coord => {
        tempMap[coord] = Math.max(cond, tempMap[coord]);
      });
    });
    return [...tempMap];
  }
  const shoot = (coord) => {
    if(gameMode === 'RP'){
      socket.emit('shoot', {id: myID, room: roomID, enemy: enemyID, coord: coord});
    }else if(enemyMap[coord] === 0){
      if(hideEnemyMap[coord] < 2){
        setEnemyMap(setCellToMap({3: [coord]}, enemyMap));
        setMove(false);
        resetTimer(timeToMove);
        let tempMap = [...gameMap];
        let ws = [...woundedShip];
        let c = setInterval(() => {
          let res = moveAI(tempMap, ws);
          ws = res[1];
          setWoundedShip(res[1]);
          tempMap = setCellToMap(res[0], tempMap);
          setGameMap(tempMap);
          if(!(4 in res[0])){
            clearInterval(c);
            resetTimer(timeToMove);
            setMove(true);
          }
          if(tempMap.filter(x => x === 4).length === 20){
            gameOver(false);
            clearInterval(c);
          }
        }, 1000);  
        
      }else if(hideEnemyMap[coord] === 2){
        const ship = checkShip({coord: coord, map: hideEnemyMap});
        let nearCells = [];
        if(!ship.map(cell => cell !== coord ?enemyMap[cell] : 4).includes(0)){
          ship.forEach(cell => {
              nearCells = [...nearCells, ...getNearCells(cell)]
          });
        }
        if(enemyMap.filter(x => x === 4).length === 19){
          gameOver(true);
        }
        setEnemyMap(setCellToMap({3: nearCells,
                                  4: [coord]}, enemyMap))
        resetTimer(timeToMove);
      }
    setCookie('localGame', {startTime: Date.now(), time: timeToMove, hideEnemyMap: hideEnemyMap}, {
      path: "/"
    });
    setCookie('maps', {player: gameMap, enemy: enemyMap}, {
      path: "/"
    });
    }
    
  }
  const generateNickname = () => {
    setNickname(getRandomNick());
  }
  const goToArangeShips = () => {
    if(nickname.length < 3){
      setViewModal({view: true, text: 'Your nickname so short... (Min: 3 symbols)'});
    }else if(nickname.length > 30){
      setViewModal({view: true, text: 'Your nickname so long (Max: 30 symbols)...'});
    }else{
      setGameMap(RandomArangeShips());
      setPage(1);
    }
  }
  useEffect(() => {
    socket.on('yourID', id =>{
      setMyID(id);
    });
    socket.on('enemyDisconnect', () => {
      setViewModal({view: true, text: 'Enemy disconnect...'});
      gameOver(true);
      socket.emit('exitFromGame');
    });
    socket.on('reconnectToRoom', ({move, id, room, enemyID, enemyNick, time, timeToMove}) => {
      setRoomID(room);
      setEnemyID(enemyID);
      setPage(3);
      setEnemyNick(enemyNick);
      setMove(id === move);
      setGameMap(cookies.maps.player);
      setEnemyMap(cookies.maps.enemy);
      setEnemyReconn(false);
      setTimeToMove(timeToMove);
      resetTimer(~~(time/1000) + 1);
      setTimeout(() => resetTimer(~~(time/1000)), time%1000);
      setCookie('socketID', {id: id}, {
        path: "/"
      });
    });
    socket.on('timerToReconnect', () => {
      setEnemyReconn(true);
      setMove(false);
      resetTimer(10);
    })
    socket.on('enemyReconnect', ({room, enemy}) => {
      setEnemyReconn(false);
      setRoomID(room);
      setEnemyID(enemy);
    });
    socket.on('startGame', ({firstMove, id, room, enemyID, enemyNick, timeToMove}) =>{
      setRoomID(room);
      setEnemyID(enemyID);
      setPage(3);
      setEnemyNick(enemyNick);
      setMove(id === firstMove);
      resetTimer(timeToMove);
      setCookie('socketID', {id: id}, {
        path: "/"
      });
    });
    socket.on('gameOver', ({win, status}) => {
      if(status === 'discon'){
        setViewModal({view: true, text: 'Enemy left the game...'});
      }
      gameOver(win);
      removeCookie(["socketID", "maps", "localGame"]);
    });
  }, []);
  useEffect(() => {
    setCookie('maps', {player: gameMap, enemy: enemyMap}, {
      path: "/"
    });
    //Shooting
    socket.on('missShoot', coord => {
      setEnemyMap(setCellToMap({3: [coord]}, enemyMap));
      setMove(false);
      resetTimer(timeToMove);
    })
    socket.on('hitShoot', coord => {
      setEnemyMap(setCellToMap({4: [coord]}, enemyMap));
      resetTimer(timeToMove);
    });
    socket.on('nextGambit', coord => {
      setGameMap(setCellToMap({3: [coord]}, gameMap));
      setMove(true);
      resetTimer(timeToMove);
    });
    socket.on('hit', coord => {
      setGameMap(setCellToMap({4: [coord]}, gameMap))
      resetTimer(timeToMove);
    });
    socket.on('shipBroken', ({nearCells, field, coord}) => {
      if(field){
        setEnemyMap(setCellToMap({3: nearCells,
                                  4: [coord]}, enemyMap));
      }else{  
        setGameMap(setCellToMap({3: nearCells,
                                 4: [coord]}, gameMap));
      }
      resetTimer(timeToMove);
    })
  }, [gameMap, enemyMap, timeToMove]);
  	
  
  const getPage = (page) => {
    if(page === 0){
      return (<StartPage gameMode={gameMode} 
                         setGameMode={setGameMode}
                         gameSpeed={gameSpeed}
                         setGameSpeed={setGameSpeed}
                         nickname={nickname} 
                         setNickname={setNickname}
                         generateNickname={generateNickname}
                         goToArangeShips={goToArangeShips}
                         darkmode={darkmode}/>)
    }else if(page === 1){
      return (<ArangePage setMap={setGameMap} 
                          gameMap={gameMap}
                          setGameMap={setGameMap} 
                          ready={userReady}
                          width={width}
                          shoot={() => {}}/>)
    }else if(page === 2){
      return <WaitPage exitFromGame={exitFromGame}/>
    }else if(page === 3){
      return (<BattlePage gameMap={gameMap} 
                          enemyMap={enemyMap} 
                          shoot={shoot} 
                          move={move}
                          nickname={nickname}
                          enemyNick={enemyNick}
                          time={time}
                          tick={tick}
                          width={width}
                          enemyReconn={enemyReconn}/>)
    }else if(page === 4){
      return <GameOverPage winner={winner} 
                           newGame={newGame}/>
    }
  }
  return (
    <div className={['App', darkmode ? 'darkmode' : ''].join(' ')}>
      <Header goHome={goHome} 
              darkmode={darkmode} 
              changeColorMode={() => setDarkmode(!darkmode)}
              menuActive={menuActive}
              changeMenuActive={() => setMenuActive(!menuActive)}>SeaBattle
      </Header>
      <MyModal visible={viewModal.view} 
               setViewModal={setViewModal} 
               buttons={viewModal.buttons}
               darkmode={darkmode}>{viewModal.text}
      </MyModal>
      <MySetting  goHome={() => {goHome(); setMenuActive(false)}}
                  changeColorMode={() => {setDarkmode(!darkmode); setMenuActive(false)}}
                  darkmode={darkmode}
                  menuActive={menuActive}/>
      
      {getPage(page)}
      <div onClick={() => removeCookie(["socketID", "maps", "localGame"])}>gtgtg</div>
    </div>
  );
}

export default App;
