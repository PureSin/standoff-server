const evts = {
  joinGame:'joinGame',
  connect:'connect',
  startGame:'startGame',
  disconnect:'disconnect'
};

const getElem = elemId => document.getElementById(elemId);
const showElem = (show, elemId) => getElem(elemId).style.display = show ? 'block' : 'none';

(function(){
  const socket = io()
  let connceted = false

  getElem('joinGame').addEventListener('click', function(){
    if(!connected) return
    socket.emit(evts.joinGame)
  })

  socket.on('startGame', data => {
    showElem(true, 'actions')
    showElem(false, 'joinGame')
    console.log('start Game', data)
  })

  socket.on('endGame', data => {
    showElem(false, 'actions')
    showElem(true, 'joinGame')
    console.log('End game', data)
  })

  socket.on(evts.connect, () => {
    // socket.open()
    connected = true
    console.log('connect')
  })

  socket.on(evts.disconnect, () => {
    showElem(false, 'actions')
    showElem(true, 'joinGame')
    connected = false
    socket.open()
  })
})()
