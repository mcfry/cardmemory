module.exports = [
  ['use-babel-config', '.babelrc'],
  //TODO: Check for updates to rescript and remove below when fixed
  {
    jest: config => {
      config.transform['^.+\\.(js|jsx|ts|tsx)$'] = 'babel-jest';
      return config
    }
  }
]