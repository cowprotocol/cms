export default [
  {
    method: 'GET',
    path: '/',
    handler: 'myController.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/csv',
    handler: 'myController.csv',
    config: {
      policies: [],
    },
  },
];
