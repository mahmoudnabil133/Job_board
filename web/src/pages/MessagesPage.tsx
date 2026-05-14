import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getCandidateApplication,
  getConversationMessages,
  getConversations,
  getEmployerApplication,
  markConversationRead,
  postApplicationMessage,
  postConversationMessage,
} from '../services/jobBoardApi';
import { flattenApiErrors, getApiEnvelopeData, isFetchJsonFailure } from '../lib/api';
import { emitNavBadgesUpdate } from '../lib/navBadges';
import type { ApiApplicationDetail, ApiConversationListItem, ApiMessage } from '../types/api';

export default function MessagesPage() {
  const { token, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = Number(searchParams.get('c') || '0') || null;
  const applicationFromUrl = Number(searchParams.get('application') || '0') || null;

  const [conversations, setConversations] = useState<ApiConversationListItem[]>([]);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [bootstrapApp, setBootstrapApp] = useState<ApiApplicationDetail | null>(null);
  const [bootstrapLoading, setBootstrapLoading] = useState(false);
  const [bootstrapErr, setBootstrapErr] = useState<string | null>(null);

  const conversationsRef = useRef(conversations);
  conversationsRef.current = conversations;

  const loadConversations = useCallback(async () => {
    if (!token) return;
    setLoadingList(true);
    const res = await getConversations(token, 1);
    setLoadingList(false);
    if (isFetchJsonFailure(res)) {
      setError(flattenApiErrors(res.data).join(' ') || 'Could not load conversations.');
      setConversations([]);
      return;
    }
    setError(null);
    setConversations(res.items);
    emitNavBadgesUpdate({ mode: 'refetch-messages' });
  }, [token]);

  const loadMessages = useCallback(
    async (conversationId: number) => {
      if (!token) return;
      setLoadingThread(true);
      const res = await getConversationMessages(token, conversationId, 1);
      setLoadingThread(false);
      if (isFetchJsonFailure(res)) {
        setError(flattenApiErrors(res.data).join(' ') || 'Could not load messages.');
        setMessages([]);
        return;
      }
      setMessages(res.items);
      const clearedUnread =
        conversationsRef.current.find((c) => c.id === conversationId)?.unread_count ?? 0;
      await markConversationRead(token, conversationId);
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unread_count: 0 } : c)),
      );
      if (clearedUnread > 0) {
        emitNavBadgesUpdate({ mode: 'conversation-read', clearedUnread });
      }
    },
    [token],
  );

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (selectedId) void loadMessages(selectedId);
    else setMessages([]);
  }, [selectedId, loadMessages]);

  const conversationForApplication = useMemo(() => {
    if (!applicationFromUrl) return null;
    return conversations.find((c) => c.application_id === applicationFromUrl) ?? null;
  }, [applicationFromUrl, conversations]);

  useEffect(() => {
    if (loadingList || !applicationFromUrl || !conversationForApplication) return;
    if (!searchParams.get('application')) return;
    const cid = conversationForApplication.id;
    const p = new URLSearchParams(searchParams);
    p.delete('application');
    p.set('c', String(cid));
    setSearchParams(p, { replace: true });
  }, [loadingList, applicationFromUrl, conversationForApplication?.id, searchParams, setSearchParams]);

  useEffect(() => {
    if (!token || !user || !applicationFromUrl || loadingList) return;
    if (conversationForApplication) {
      setBootstrapApp(null);
      setBootstrapErr(null);
      setBootstrapLoading(false);
      return;
    }
    if (user.role !== 'employer' && user.role !== 'candidate') {
      setBootstrapApp(null);
      setBootstrapErr('Messaging is only available for candidates and employers.');
      return;
    }
    let cancelled = false;
    setBootstrapLoading(true);
    setBootstrapErr(null);
    void (async () => {
      const res =
        user.role === 'employer'
          ? await getEmployerApplication(token, applicationFromUrl)
          : await getCandidateApplication(token, applicationFromUrl);
      if (cancelled) return;
      setBootstrapLoading(false);
      if (isFetchJsonFailure(res)) {
        setBootstrapApp(null);
        setBootstrapErr(flattenApiErrors(res.data).join(' ') || 'Could not load this application.');
        return;
      }
      setBootstrapApp(res.application);
    })();
    return () => {
      cancelled = true;
    };
  }, [token, user, applicationFromUrl, loadingList, conversationForApplication]);

  const active = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? null,
    [conversations, selectedId],
  );

  const showBootstrapComposer = Boolean(
    applicationFromUrl && !loadingList && !conversationForApplication && user?.role !== 'admin',
  );

  function selectConversation(id: number) {
    const p = new URLSearchParams(searchParams);
    p.delete('application');
    p.set('c', String(id));
    setSearchParams(p);
  }

  async function onSend(e: FormEvent) {
    e.preventDefault();
    if (!token || !body.trim()) return;

    if (selectedId) {
      setSending(true);
      setError(null);
      const res = await postConversationMessage(token, selectedId, body.trim());
      setSending(false);
      if (isFetchJsonFailure(res)) {
        setError(flattenApiErrors(res.data).join(' ') || 'Message not sent.');
        return;
      }
      setBody('');
      void loadMessages(selectedId);
      void loadConversations();
      return;
    }

    if (showBootstrapComposer && applicationFromUrl) {
      setSending(true);
      setError(null);
      const res = await postApplicationMessage(token, applicationFromUrl, body.trim());
      setSending(false);
      if (isFetchJsonFailure(res)) {
        setError(flattenApiErrors(res.data).join(' ') || 'Message not sent.');
        return;
      }
      const msg = getApiEnvelopeData<{ conversation_id?: number }>(res.data);
      let targetCid = msg?.conversation_id;
      setBody('');
      const refreshed = await getConversations(token, 1);
      if (!isFetchJsonFailure(refreshed)) {
        setConversations(refreshed.items);
        emitNavBadgesUpdate({ mode: 'refetch-messages' });
        if (!targetCid) {
          targetCid = refreshed.items.find((c) => c.application_id === applicationFromUrl)?.id;
        }
      } else {
        await loadConversations();
      }
      if (targetCid) {
        const p = new URLSearchParams();
        p.set('c', String(targetCid));
        setSearchParams(p, { replace: true });
        void loadMessages(targetCid);
      }
    }
  }

  const canSend =
    Boolean(body.trim()) &&
    (selectedId || (showBootstrapComposer && applicationFromUrl && !bootstrapLoading && !bootstrapErr));

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-h-[420px]">
          <aside className="md:col-span-2 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            {loadingList ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
                {conversations.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => selectConversation(c.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        c.id === selectedId ? 'bg-sky-50 border-l-4 border-l-brand-red' : ''
                      }`}
                    >
                      <p className="font-semibold text-sm text-gray-900 truncate">{c.job.title}</p>
                      <p className="text-xs text-gray-500 truncate">with {c.other_party.name}</p>
                      {c.unread_count > 0 && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-brand-red text-white px-2 py-0.5 rounded-full">
                          {c.unread_count} new
                        </span>
                      )}
                    </button>
                  </li>
                ))}
                {conversations.length === 0 && (
                  <li className="px-4 py-8 text-sm text-gray-500 text-center">No conversations yet.</li>
                )}
              </ul>
            )}
          </aside>

          <section className="md:col-span-3 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col min-h-[420px]">
            {!selectedId && !showBootstrapComposer && (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm p-6">
                Select a conversation to read and reply.
              </div>
            )}

            {showBootstrapComposer && (
              <>
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="font-bold text-gray-900">
                    {bootstrapApp?.job?.title ?? `Application #${applicationFromUrl}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {bootstrapLoading
                      ? 'Loading application…'
                      : bootstrapErr
                        ? bootstrapErr
                        : 'Start the conversation — your first message opens the thread for both sides.'}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px]">
                  {!bootstrapLoading && !bootstrapErr && (
                    <p className="text-sm text-gray-500 text-center py-8">No messages yet. Send the first one below.</p>
                  )}
                </div>
                {error && <p className="px-4 text-sm text-red-600">{error}</p>}
                <form onSubmit={(e) => void onSend(e)} className="border-t border-gray-100 p-3 flex gap-2">
                  <input
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write a message…"
                    disabled={bootstrapLoading || !!bootstrapErr}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red disabled:bg-gray-50"
                  />
                  <button
                    type="submit"
                    disabled={sending || !canSend}
                    className="bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </>
            )}

            {selectedId && (
              <>
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="font-bold text-gray-900">{active?.job.title ?? 'Conversation'}</p>
                  <p className="text-xs text-gray-500">Application #{active?.application_id}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px]">
                  {loadingThread ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
                    </div>
                  ) : (
                    messages.map((m) => {
                      const mine = user && m.sender.id === user.id;
                      return (
                        <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                              mine ? 'bg-brand-red text-white rounded-br-md' : 'bg-gray-100 text-gray-900 rounded-bl-md'
                            }`}
                          >
                            {!mine && <p className="text-[10px] font-bold opacity-70 mb-1">{m.sender.name}</p>}
                            <p className="whitespace-pre-wrap">{m.body}</p>
                            <p className={`text-[10px] mt-1 ${mine ? 'text-white/70' : 'text-gray-400'}`}>
                              {new Date(m.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {error && <p className="px-4 text-sm text-red-600">{error}</p>}
                <form onSubmit={(e) => void onSend(e)} className="border-t border-gray-100 p-3 flex gap-2">
                  <input
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write a message…"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red"
                  />
                  <button
                    type="submit"
                    disabled={sending || !body.trim()}
                    className="bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
