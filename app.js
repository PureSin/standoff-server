const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000
const inProd = process.env.NODE_ENV === 'production'
const players = []
const games = []

const MAX_ROUNDS = 3
const COUNT_DOWN_TIME = 5

const EVENTS = {
  joinGame:'joinGame',
  connect:'connect',
  startGame:'startGame',
  gameEnd:'gameEnd',
  disconnect:'disconnect'
}

class User{
  constructor(id){
    this.id = id
    this.name = ''
    this.room = ''
    this.waiting = false
  }
}

class Game{
  constructor(roomId, players){
    this.roomId = roomId
    this.players = players
    this.timer = 0
    this.round = 0
    this.score = 0
  }

  init(){
    const { players, roomId } = this
    for(let player of players){
      io.sockets.connected[player].join(roomId)
    }
    io.to(roomId).emit(EVENTS.startGame, roomId)
  }


  start() {
    while(!game.isFinished()) {
      startRound()
      // wait for seconds
      endRound()
    }
    end()
  }

  startRound(){
    io.to(roomId).emit(EVENTS.startRound, roomId)

  }

  endRound(){
      this.round++
  }

  isFinished() {
    return this.round == MAX_ROUNDS
  }

  end(){
    for(let player of this.players){
      const activePlayer = players.findIndex(usr => usr.id === player)
      if(activePlayer !== -1){
        players[activePlayer].waiting = false
        players[activePlayer].room  = ''
      }
    }
  }
}

server.listen(port, () => console.log('Server listening at port %d', port))
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {
  const socketId = socket.id
  players.push(new User(socketId))

  console.log('connection!', socket.id, players)

  socket.on(EVENTS.joinGame, data => {
    console.log('join game', data)
    const user = players.find(player => socketId === player.id)
    user.waiting = true

    const pair = players.find(player => socketId !== player.id && !player.room && player.waiting)

    if(pair){
      const roomId = `${pair.id}-${socketId}`
      user.room = roomId
      pair.room = roomId
      const game = new Game(roomId, [ pair.id, socketId ])
      game.init()
      games.push(game)

      game.start()
    }
  })

  socket.on(EVENTS.disconnect,  data => {
    const activeGame = games.findIndex(game => game.players.indexOf(socketId) !== -1)
    if(activeGame !== -1){
      games[activeGame].end()
      games.splice(activeGame, 1)
    }
    const drop  = players.findIndex(player => player.id === socketId)
    if(drop !== -1) players.splice(drop, 1)

    console.log(EVENTS.disconnect, socket.id)
  })

})
