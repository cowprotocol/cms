export default {
  /**
   * Delete notifications that are over a week past their due date and orphaned notifications daily at midnight
   */
  cleanupExpiredNotifications: {
    task: async ({ strapi }) => {
      await strapi
        .service("api::notification.cleanup")
        .cleanupExpiredNotifications();
    },
    options: {
      rule: "0 0 * * *", // Runs daily at midnight
      tz: "UTC",
    },
  },
};
