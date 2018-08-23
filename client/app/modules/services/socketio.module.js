import io from 'socket.io-client'

export function socketService() {
  'ngInject'

  var socket

  return {
    init: () => {
      socket = io.connect()
      return socket
    },

    getSocket: () => socket
  }
}