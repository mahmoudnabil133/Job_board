/** Cross-page navbar badge sync (alerts + unread DMs) without prop drilling. */

export const NAV_BADGES_EVENT = 'nav-badges-update';

export type NavBadgesDetail =
  | { mode: 'refetch-alerts' }
  | { mode: 'refetch-messages' }
  | { mode: 'refetch-both' }
  | { mode: 'delta-alerts'; delta: number }
  | { mode: 'delta-messages'; delta: number }
  /** "New message" notification dismissed — lower both badges optimistically. */
  | { mode: 'message-notification-read' }
  /** Conversation opened / marked read — lower message badge by cleared count. */
  | { mode: 'conversation-read'; clearedUnread: number };

export function emitNavBadgesUpdate(detail: NavBadgesDetail): void {
  window.dispatchEvent(new CustomEvent(NAV_BADGES_EVENT, { detail }));
}

export function isMessageNotification(n: { title?: string }): boolean {
  return n.title?.trim().toLowerCase() === 'new message';
}
