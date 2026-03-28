self.addEventListener("push", (event) => {
  if (!event.data) return;

  const payload = event.data.json();
  const title = payload?.title || "AETHER";
  const options = {
    body: payload?.body || "You have a new update.",
    data: {
      url: payload?.url || "/dashboard/alerts",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/dashboard/alerts";
  event.waitUntil(clients.openWindow(url));
});
