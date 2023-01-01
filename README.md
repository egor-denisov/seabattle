
# Sea Battle

A real-time game SeaBattle with the ability to play against other people or the computer.
Built on [React.js](https://reactjs.org/) and [Socket.io](https://socket.io/).

## Timelapse
This project was developed from September `22 to November `22.

## Content
- [Live Demo](https://github.com/egor-denisov/seabattle#live-demo)
- [Final product](https://github.com/egor-denisov/seabattle#final-product)
- [Running the project](https://github.com/egor-denisov/seabattle#running-the-project)
- [About the game](https://github.com/egor-denisov/seabattle#about-the-game)
- [Features](https://github.com/egor-denisov/seabattle#features)
- [Dependencies](https://github.com/egor-denisov/seabattle#dependencies)
- [Credits](https://github.com/egor-denisov/seabattle#credits)

## Live Demo
Live demo is not available at the moment
## Final product
- Startpage lightmode:
![](https://sun9-east.userapi.com/sun9-23/s/v1/ig2/3VWoMe1ZvQJgA0tkF7tpffCN-Gi_kWHBy5JkAgJaBOMH507KWkV87GYnTrRg5_Z0rogZWjuKckvPP9l0fMjgTiDq.jpg?size=1918x930&quality=95&type=album "Start page lightmode")

- Startpage darkmode:
![](https://sun9-north.userapi.com/sun9-80/s/v1/ig2/BasdB0MbfeCsr1KphBKqEqFGHP4z3ar_IsmuIgrtSSfncIkARqar6D-Xl52JsjktJERYcW2Ja0CeJowa-U2xvkaQ.jpg?size=1911x920&quality=95&type=album "Start page darkmode")

- Ships placement page:
![](https://sun9-west.userapi.com/sun9-68/s/v1/ig2/jCUxjO4MKKgyvnHoSCYquzt4esWGZEdtPy4QYKJ4ROlNIE5rz7dyL3FDgiqC3Exc7QF0tX4u3ahTAAfTwpY6mhqn.jpg?size=1914x917&quality=95&type=album "Ships placement page")

- Battle page:
![](https://sun9-east.userapi.com/sun9-25/s/v1/ig2/wneNRVCZIsHxVwyIZEqUxQ8gpdCErEaJ-zUfasAZFAg9LfDTNGeFVboCEOlfmABPI8p3_TeNa_SXJ7Yh4qMFqfWn.jpg?size=1913x923&quality=95&type=album "Battle page")

## Running the project
To run the project go to the downloaded directory. Then run the commands:

```
# Run server-side on 3000 port
# Go to folder server
cd server
# Install missing packages
npm install
# Start index.js
npm start 
```
```
# Run client-side on 5000 port
# Go to folder client
cd client
# Install missing packages
npm install
# Start index.js
npm start
```
Аfter executing these commands, you can go to http://localhost:3000/

## About the game

Each player has a 10x10 board on which the player is able to place 10 ships:

- 1 Linkor, that is 4 tiles long
- 2 Cruisers, that are 3 tiles long
- 3 Destroyers, that are 2 tiles long
- 4 Boats, that are 1 tiles long

Each ship can be placed either horizontally or vertically on the board, and cannot be placed partially off the board.

Each player then takes turns picking a tile on the opposing player’s grid, taking a shot at that tile.

- If the tile contains a ship, the shot is a HIT
- If the tile does not contain a ship, the shot is a MISS.
A ship is sunk if all the tiles for that ship have been marked as a HIT.

The game ends when one player has sunk all of the opposing players ships.

## Features

This paragraph contains some of the features of this project:

- When leaving the page while playing with real people, 10 seconds are given to reconnect the player. At the end of time, defeat will be defended.
- In addition to the random placement of ships, the functionality of dragging ships has been implemented, as well as ship rotation (double-clicked)
- When randomly generating a nickname, a random adjective and animal are taken
- In addition to the ability to choose gamemode, you can choose the speed of the game: Slow(59s for move) and Fast(19s for move)

## Dependencies
- React.js
- Socket.io
- Node.js
- SASS

## Credits
Icons were taken from iconer.app
