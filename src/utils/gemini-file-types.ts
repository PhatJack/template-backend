const SUPPORTED_GEMINI_MIME_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/html",
  "text/xml",
  "application/xml",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
  "audio/wav",
  "audio/mp3",
  "audio/mpeg",
  "audio/aiff",
  "audio/aac",
  "audio/ogg",
  "audio/flac",
  "video/mp4",
  "video/mpeg",
  "video/mov",
  "video/avi",
  "video/x-flv",
  "video/mpg",
  "video/webm",
  "video/wmv",
  "video/3gpp",
]);

export function isSupportedGeminiMimeType(mimeType: string | undefined) {
  return Boolean(mimeType && SUPPORTED_GEMINI_MIME_TYPES.has(mimeType));
}

export function getSupportedGeminiMimeTypes() {
  return [...SUPPORTED_GEMINI_MIME_TYPES];
}
