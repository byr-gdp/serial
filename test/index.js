const Serial = require('../index');

const foo = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('foo')
      resolve('foo');
    }, 500);
  });
}

const bar = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('bar')
      resolve('bar');
    }, 1000);
  });
}

const error = () => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      console.log('error');
      reject('error');
    }, 100);
  });
}

const serial = new Serial();

serial.add(foo).add(bar).add(error).begin().then(data => {
  console.log('receive data:');
  console.log(data);
}).catch(error => {
  console.error('receive error:');
  console.error(error);
});;
