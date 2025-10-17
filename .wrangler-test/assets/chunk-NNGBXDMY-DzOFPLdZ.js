async function* parseSSEStream(stream, signal) {
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	try {
		while (true) {
			if (signal?.aborted) throw new Error("Operation was aborted");
			const { done, value } = await reader.read();
			if (done) break;
			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() || "";
			for (const line of lines) {
				if (line.trim() === "") continue;
				if (line.startsWith("data: ")) {
					const data = line.substring(6);
					if (data === "[DONE]" || data.trim() === "") continue;
					try {
						yield JSON.parse(data);
					} catch (error) {
						console.error("Failed to parse SSE event:", data, error);
					}
				}
			}
		}
		if (buffer.trim() && buffer.startsWith("data: ")) {
			const data = buffer.substring(6);
			if (data !== "[DONE]" && data.trim()) try {
				yield JSON.parse(data);
			} catch (error) {
				console.error("Failed to parse final SSE event:", data, error);
			}
		}
	} finally {
		reader.releaseLock();
	}
}
export { parseSSEStream as t };

//# sourceMappingURL=chunk-NNGBXDMY-DzOFPLdZ.js.map