const EventBus = require('./eventbus'); // 通过 git submodule 引入

class Serial {
  constructor() {
    this.queue = [];
    this.results = [];
    this.resolve = undefined;
    this.reject = undefined;
    this.eventBus = new EventBus();
    this.eventBus.on('next', this.readyToNext.bind(this));
    this.eventBus.on('done', this.done.bind(this));
    this.eventBus.on('fail', this.fail.bind(this));
  }

  /**
   * 手动添加任务，支持链式调用
   * @param {Function} task 返回 Promise 的一个函数
   */
  add(task) {
    const wrapTask = () => {
      const ret = task();
      ret.then((data => {
        this.eventBus.emit('next', data);
      }), (error => {
        this.eventBus.emit('fail', error);
      }));
    }
    this.queue.push(wrapTask);
    return this;
  }

  // remove(index) {
  //   this.queue.splice(index, 1);
  // }

  /**
   * 开始任务调度
   */
  begin() {
    return new Promise((resolve, reject) => {
      this.next();
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  readyToNext(data) {
    this.results.push(data);
    this.next();
  }

  next() {
    const task = this.queue.shift();
    if (task) {
      return task();
    } else {
      this.eventBus.emit('done');
    }
  }

  done() {
    this.resolve(this.results);
  }

  fail(error) {
    this.reject(error);
  }
}

module.exports = exports = Serial;