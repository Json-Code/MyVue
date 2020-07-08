let queue = []
let has = {}
import {nextTick} from '../util/next-tick'
function flushSchedularQueue() {
  queue.forEach(watcher => watcher.run())
  queue = []
  has = {}
}
export function queueWatcher(watcher) {
  const id = watcher.id
  if (has[id] == null) {
    queue.push(watcher)
    has[id] = true

    // 微任务和宏任务
    //Vue.$nextTick = promise / mutationObserver / setImmediated / setTimeout
    nextTick(flushSchedularQueue)
  }
}