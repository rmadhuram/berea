import { questionService } from './question.module'
import { socketService } from './socketio.module'
import { WWBAMService } from './wwbam.module'

angular.module('services', [])
  .factory('questionService', questionService)
  .factory('socketService', socketService)
  .factory('wwbamService', WWBAMService)