const getMock = () => {
  const gamepadMock = {
    axes: [0, 0, 0, 0],
    buttons: [
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
      { pressed: false, touched: false, value: 0 },
    ],
    connected: true,
    id: '49b94af4-b07d-11ed-afa1-0242ac120002',
    index: 0,
    mapping: 'standard',
    timestamp: 0,
    vibrationActuator: {
      playEffect: (type, obj) => `${type} - ${obj.duration}`,
    },
  };
  return gamepadMock;
};

export { getMock };
