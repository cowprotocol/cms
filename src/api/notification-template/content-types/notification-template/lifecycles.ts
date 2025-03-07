export default {
  async beforeDelete(event) {
    const { where } = event.params;
    const { id } = where;

    try {
      await deleteAssociatedNotifications([id]);
    } catch (error) {
      console.error(`Error in beforeDelete for template ${id}:`, error);
    }
  },

  async beforeDeleteMany(event) {
    const { where } = event.params;
    const { id } = where;

    try {
      // First get all template IDs that will be deleted
      const templatesForDeletion = await strapi.db
        .query("api::notification-template.notification-template")
        .findMany({
          where,
          select: ["id"],
        });

      const templateIds = templatesForDeletion.map((template) => template.id);

      if (templateIds.length > 0) {
        await deleteAssociatedNotifications(templateIds);
      }
    } catch (error) {
      console.error(`Error in beforeDeleteMany for templates:`, error);
    }
  },
};

// Helper function to delete notifications for given template IDs
async function deleteAssociatedNotifications(templateIds: number[]) {
  // Find all notifications associated with these templates
  const notifications = await strapi.db
    .query("api::notification.notification")
    .findMany({
      where: {
        notification_template: {
          id: {
            $in: templateIds,
          },
        },
      },
    });

  if (notifications.length > 0) {
    // Delete all associated notifications
    await strapi.db.query("api::notification.notification").deleteMany({
      where: {
        id: {
          $in: notifications.map((n) => n.id),
        },
      },
    });
    console.log(
      `Deleted ${
        notifications.length
      } notifications associated with template(s) ${templateIds.join(", ")}`
    );
  }
}
