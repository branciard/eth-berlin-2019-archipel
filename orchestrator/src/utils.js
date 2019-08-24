const throwIfMissing = () => {
    throw Error('Missing parameter');
  };

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


module.exports = {
    throwIfMissing,
    sleep
}
