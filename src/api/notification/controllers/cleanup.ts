export default {
  async cleanupExpiredNotifications(ctx) {
    try {
      const result = await strapi
        .service("api::notification.cleanup")
        .cleanupExpiredNotifications();

      return { data: result };
    } catch (error) {
      ctx.throw(500, error);
    }
  },
};
