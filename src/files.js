const fs = require('fs-extra');

module.exports = {
  waitUntilEmpty: (path) => {
    let time = 0;
    while (fs.readdirSync(path).length > 0) {
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
      time += 1000;
    }
    return time;
  },
};
