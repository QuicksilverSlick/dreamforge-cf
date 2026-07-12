/**
 * Split a batch of picked files into the two upload lanes the app maintains:
 * images (the multimodal base64 path, {@link useImageUpload}) and everything
 * else (the R2 text-extraction path, {@link useAttachmentUpload}). A single
 * "+" control accepts both and routes each file here so the user never has to
 * choose the right button first.
 */
import { isSupportedImageType } from '@/api-types';

/** Extensions the image lane accepts (mirrors SUPPORTED_IMAGE_MIME_TYPES). */
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'heic', 'heif']);

function extensionOf(filename: string): string {
	const dot = filename.lastIndexOf('.');
	return dot > 0 && dot < filename.length - 1 ? filename.slice(dot + 1).toLowerCase() : '';
}

/** True when a picked file should ride the image (multimodal) lane. */
export function isImageFile(file: File): boolean {
	return isSupportedImageType(file.type) || IMAGE_EXTENSIONS.has(extensionOf(file.name));
}

/**
 * Partition picked files into `images` (multimodal lane) and `documents`
 * (text-extraction lane). MIME is preferred; extension is the fallback for
 * browsers that report an empty/wrong type (common for HEIC).
 */
export function partitionAttachmentFiles(files: File[]): {
	images: File[];
	documents: File[];
} {
	const images: File[] = [];
	const documents: File[] = [];
	for (const file of files) {
		(isImageFile(file) ? images : documents).push(file);
	}
	return { images, documents };
}
