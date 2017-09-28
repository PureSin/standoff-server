const evts = {
  JoinGame:'JoinGame',
  connect:'connect',
  startGame:'startGame',
  disconnect:'disconnect'
};

(function(){
  const socket = io()
  let connceted = false

  document.getElementById('joinGame').addEventListener('click', function(){
    if(!connected) return
    socket.emit(evts.JoinGame)
  })

  socket.on('startGame', data => {
    console.log('start Game', data)
  })

  socket.on(evts.connect, () => {
    // socket.open()
    connected = true
    console.log('connect')
  })

  socket.on(evts.disconnect, () => {
    connected = false
    socket.open()
  })

})()
