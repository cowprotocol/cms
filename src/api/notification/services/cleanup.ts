export default {
  async cleanupExpiredNotifications() {
    console.log("Running cleanupExpiredNotifications task");
    try {
      // Calculate date 1 week ago
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Find all notifications with templates due over a week ago
      const expiredNotifications = await strapi.db
        .query("api::notification.notification")
        .findMany({
          where: {
            $or: [
              {
                notification_template: {
                  dueDate: {
                    $lt: oneWeekAgo,
                  },
                },
              },
              {
                notification_template: null,
              },
            ],
          },
        });

      // Delete the expired and orphaned notifications
      if (expiredNotifications.length > 0) {
        await strapi.db.query("api::notification.notification").deleteMany({
          where: {
            id: {
              $in: expiredNotifications.map((n) => n.id),
            },
          },
        });
        console.log(
          `Deleted ${expiredNotifications.length} notifications that were over a week past due or orphaned`
        );
      }
      console.log("Finished cleanupExpiredNotifications task");

      return { success: true, deletedCount: expiredNotifications.length };
    } catch (error) {
      console.error("Error cleaning up notifications:", error);
      return { success: false, error: error.message };
    }
  },
};
