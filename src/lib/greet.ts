export function greet(name: string) {
  const today = new Date();
  const hour = today.getHours();

  if (hour < 12) {
    return `Good morning, ${name}! 👋🏽`;
  } else if (hour < 18) {
    return `Good afternoon, ${name}! 👋🏽`;
  } else {
    return `Good evening, ${name}! 👋🏽`;
  }
}
