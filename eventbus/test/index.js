const EventBus = require('../index');
const test = require('ava');

test('initial with no listener', t => {
  const eventBus = new EventBus();

  t.is(0, eventBus.listeners.length);
});

test('addEventListener is an alias for on', t => {
  let isEmitted = false;
  const eventBus = new EventBus();
  const foo = () => {
    isEmitted = true;
  }

  eventBus.addListener('fire', foo);
  eventBus.emit('fire');

  t.is(isEmitted, true, '自定义事件触发（使用 addEventListener 监听事件）');
});

test('trigger event when listener exist and receive params', t => {
  let isEmitted = false;
  let params = undefined;
  const eventBus = new EventBus();
  const foo = (...args) => {
    isEmitted = true;
    params = args;
  }

  eventBus.on('fire', foo);
  eventBus.emit('fire', 1, 2, 3);

  t.is(isEmitted, true, '自定义事件触发（监听事件）');
  t.deepEqual(params, [1, 2, 3], '接收正确参数')
});

test('trigger event when listener not exist', t => {
  let isEmitted = false;
  const eventBus = new EventBus();
  eventBus.emit('fire');

  t.is(isEmitted, false, '自定义事件触发（没有监听事件）');
});

test('trigger event with multiple listeners ', t => {
  let fooValue;
  let barValue;
  const eventBus = new EventBus();
  const foo = (...args) => {
    fooValue = args[0];
  }
  const bar = (...args) => {
    barValue = args[0];
  }

  eventBus.on('fire', foo);
  eventBus.on('fire', bar);

  eventBus.emit('fire', 100);

  t.is(fooValue, 100, '同一事件多个监听函数，相继触发');
  t.is(barValue, 100, '同一事件多个监听函数，相继触发');
});

test('trigger event when listen is once', t => {
  let count = 0;
  const eventBus = new EventBus();
  const foo = () => {
    count++;
  }

  eventBus.once('fire', foo);
  eventBus.emit('fire');
  t.is(count, 1, '第一次触发有效');
  eventBus.emit('fire');
  t.is(count, 1, '第二次触发有效');
});

test('trigger event after remove all listeners', t => {
  let count = 0;
  const eventBus = new EventBus();
  const foo = () => {
    count++;
  }

  eventBus.on('fire', foo);
  eventBus.emit('fire');
  t.is(count, 1, '移除监听前事件会触发');
  eventBus.removeAllListeners();
  eventBus.emit('fire');
  t.is(count, 1, '移除监听前事件不会触发');
});