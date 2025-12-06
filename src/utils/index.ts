export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function greet() {
  const today = new Date();
  const hour = today.getHours();

  if (hour < 12) {
    return `Good Morning ☀️`;
  } else if (hour < 18) {
    return `Good Afternoon 🌤️`;
  } else {
    return `Good Evening 🌑`;
  }
}
