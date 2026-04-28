const STORAGE_KEY = "flexitNotifications";
const API_URL = "http://localhost:8081/api/notifications";

function safeParse(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function nextId() {
  return `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function readAllNotifications() {
  return safeParse(localStorage.getItem(STORAGE_KEY));
}

function writeAllNotifications(notifications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

// ✅ Add notification to backend + localStorage
export async function addNotification({
  userId,
  title,
  message,
  type = "info",
  actionUrl = "/notifications",
}) {
  if (!userId) return;

  const notification = {
    userId,
    title,
    message: message || title,
    type,
    actionUrl,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  // Save to backend
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: notification.userId,
        message: notification.message,
        type: notification.type,
      }),
    });
  } catch (error) {
    console.error("Backend notification save failed:", error);
  }

  // Also save to localStorage fallback
  const current = readAllNotifications();

  const next = [
    {
      id: nextId(),
      ...notification,
    },
    ...current,
  ].slice(0, 200);

  writeAllNotifications(next);
}

// ✅ Mark read in localStorage
export function markNotificationAsRead(notificationId, userId) {
  if (!notificationId || !userId) return;

  const next = readAllNotifications().map((item) => {
    if (item.id === notificationId && item.userId === userId) {
      return {
        ...item,
        isRead: true,
      };
    }

    return item;
  });

  writeAllNotifications(next);
}

// ✅ Get localStorage notifications
export function getNotificationsForUser(userId) {
  if (!userId) return [];

  return readAllNotifications()
    .filter((item) => item.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getNotificationCount(userId) {
  return getNotificationsForUser(userId).filter((item) => !item.isRead).length;
}

export function formatNotificationTime(value) {
  const time = new Date(value);
  if (Number.isNaN(time.getTime())) return "Just now";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(time);
}