import { questionService } from './question.module'
import { socketService } from './socketio.module'

angular.module('services', [])
  .factory('questionService', questionService)
  .factory('socketService', socketService)