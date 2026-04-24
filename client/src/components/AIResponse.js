import React from 'react';

function formatAIContent(text) {
  if (!text) return '';

  // Convert markdown-style formatting to HTML
  let html = text
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Numbered lists
    .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
    // Bullet lists
    .replace(/^[-•]\s(.+)$/gm, '<li>$1</li>')
    // Wrap consecutive li elements
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p>')
    // Single newlines within paragraphs
    .replace(/\n/g, '<br/>');

  return `<p>${html}</p>`;
}

export default function AIResponse({ response }) {
  if (!response) return null;

  if (response.error) {
    return (
      <div className="ai-response" style={{ borderColor: 'rgba(255,118,117,0.3)' }}>
        <div className="ai-response-header" style={{ background: 'rgba(255,118,117,0.1)' }}>
          <div className="ai-badge" style={{ background: 'linear-gradient(135deg, #ff7675, #d63031)' }}>
            ⚠️ Error
          </div>
        </div>
        <div className="ai-response-body">
          <div className="ai-content">
            <p>{response.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-response">
      <div className="ai-response-header">
        <div className="ai-badge">
          🤖 AI Analysis
        </div>
        {response.model && (
          <span className="ai-model">Model: {response.model}</span>
        )}
      </div>
      <div className="ai-response-body">
        <div
          className="ai-content"
          dangerouslySetInnerHTML={{ __html: formatAIContent(response.content) }}
        />
      </div>
      {response.usage && (
        <div className="ai-response-meta">
          <span>Prompt tokens: {response.usage.prompt_tokens}</span>
          <span>Completion tokens: {response.usage.completion_tokens}</span>
          <span>Total tokens: {response.usage.total_tokens}</span>
          {response.id && <span>ID: {response.id}</span>}
        </div>
      )}
    </div>
  );
}
