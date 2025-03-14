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

      // Delete the expired and orphaned notifications in batches
      if (expiredNotifications.length > 0) {
        const BATCH_SIZE = 1000;
        let totalDeleted = 0;

        // Process in batches
        for (let i = 0; i < expiredNotifications.length; i += BATCH_SIZE) {
          const batch = expiredNotifications.slice(i, i + BATCH_SIZE);
          await strapi.db.query("api::notification.notification").deleteMany({
            where: {
              id: {
                $in: batch.map((n) => n.id),
              },
            },
          });
          totalDeleted += batch.length;
          console.log(
            `Processed batch: ${i / BATCH_SIZE + 1}, Deleted: ${
              batch.length
            } notifications`
          );
        }

        console.log(
          `Deleted ${totalDeleted} notifications that were over a week past due or orphaned`
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
