export function formatToTimeAgo(date: string): string {
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / (1000 * 60 * 60 * 24));
  const formatter = new Intl.RelativeTimeFormat('ko');

  return formatter.format(diff, 'day');
}
