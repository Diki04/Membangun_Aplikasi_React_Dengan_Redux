import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatRelativeTime(dateString) {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: id });
}

export function truncateText(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export function stripHtml(html) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}
