
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useStore } from "../store/useChurnStore";

const SUGGESTED_QUESTIONS = [
  "What are the main reasons customers churn?",
  "Suggest retention strategies for a high-risk customer",
  "What does the churn probability mean?",
];

function cleanMarkdown(text = "") {
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&lt;br\s*\/?&gt;/gi, "\n")
    .replace(/\r\n/g, "\n");
}

export default function Chat() {
  const messages = useStore((state) => state.messages); 
  const chatLoading = useStore((state) => state.chatLoading);
  const sendMessage = useStore((state) => state.sendMessage);

  const [input, setInput] = useState("");
  const boxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTo({
        top: boxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, chatLoading]);

  const handleSend = async (text = input) => {
    const question = text.trim();

    if (!question || chatLoading) return;

    setInput("");

    try {
      await sendMessage(question);
    } catch (error) {
      console.error("Failed to send message:", error);
    }

    inputRef.current?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSend();
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-[420px] flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
        <span className="text-xl" aria-hidden="true">
          💬
        </span>
        <div>
          <h1 className="text-lg font-semibold">Ask the AI</h1>
          <p className="text-xs text-slate-400">
            Customer Churn Assistant
          </p>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={boxRef}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:px-4"
      >
        {messages.length === 0 && (
          <div className="mx-auto mt-8 max-w-md text-center">
            <div className="mb-3 text-4xl" aria-hidden="true">
              🤖
            </div>
            <h2 className="text-lg font-semibold">
              How can I help you?
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Ask about churn prediction, customer behavior,
              retention strategies, or your knowledge base.
            </p>
          </div>
        )}

        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id ?? index}
              className={`flex min-w-0 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`min-w-0 max-w-[95%] overflow-hidden rounded-2xl px-3 py-3 text-sm leading-6 sm:max-w-[90%] sm:px-4 ${
                  isUser
                    ? "whitespace-pre-wrap bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                ) : (
                  <div className="ai-response min-w-0 break-words">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h2 className="mb-3 mt-4 text-lg font-bold text-white first:mt-0">
                            {children}
                          </h2>
                        ),
                        h2: ({ children }) => (
                          <h2 className="mb-2 mt-4 text-base font-bold text-white first:mt-0">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="mb-2 mt-3 text-sm font-semibold text-indigo-300">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="my-2 break-words first:mt-0 last:mb-0">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-indigo-300">
                            {children}
                          </strong>
                        ),
                        ul: ({ children }) => (
                          <ul className="my-2 list-disc space-y-1 pl-5 marker:text-indigo-400">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-indigo-400">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="break-words pl-1">
                            {children}
                          </li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="my-3 border-l-2 border-indigo-400 pl-3 text-slate-300">
                            {children}
                          </blockquote>
                        ),
                        hr: () => (
                          <hr className="my-3 border-slate-600" />
                        ),
                        table: ({ children }) => (
                          <div className="my-3 max-w-full overflow-x-auto rounded-lg border border-slate-700">
                            <table className="w-full min-w-[360px] border-collapse text-left text-xs sm:text-sm">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-slate-700 text-white">
                            {children}
                          </thead>
                        ),
                        th: ({ children }) => (
                          <th className="border-b border-slate-600 px-3 py-2 font-semibold">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border-t border-slate-700 px-3 py-2 align-top">
                            {children}
                          </td>
                        ),
                        code: ({ children, className }) => {
                          const isBlock = Boolean(className);

                          return isBlock ? (
                            <code className="block overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs">
                              {children}
                            </code>
                          ) : (
                            <code className="rounded bg-slate-950 px-1 py-0.5 text-indigo-300">
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }) => (
                          <pre className="my-3 max-w-full overflow-x-auto rounded-lg bg-slate-950 p-3">
                            {children}
                          </pre>
                        ),
                        a: ({ children, href }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-300 underline underline-offset-2"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {cleanMarkdown(message.text)}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {chatLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-300">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested questions */}
      <div className="space-y-2 border-t border-slate-800 bg-slate-900 px-3 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SUGGESTED_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              disabled={chatLoading}
              onClick={() => handleSend(question)}
              className="shrink-0 rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:border-indigo-400 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {question}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2"
        >
          <label htmlFor="chat-question" className="sr-only">
            Type your question
          </label>

          <textarea
            ref={inputRef}
            id="chat-question"
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
            placeholder="Type your question..."
            disabled={chatLoading}
            className="max-h-32 min-h-10 flex-1 resize-y rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-indigo-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={chatLoading || !input.trim()}
            aria-label="Send message"
            className="flex h-10 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M22 2 11 13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m22 2-7 20-4-9-9-4 20-7Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-500">
          AI-generated responses may need verification.
        </p>
      </div>
    </div>
  );
}
