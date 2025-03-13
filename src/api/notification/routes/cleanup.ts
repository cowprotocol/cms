module.exports = {
  routes: [
    {
      method: "POST",
      path: "/notifications/cleanup",
      handler: "cleanup.cleanupExpiredNotifications",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
