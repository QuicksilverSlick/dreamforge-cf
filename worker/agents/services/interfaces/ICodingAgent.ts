import { FileOutputType, ImageAssetType } from "worker/agents/schemas";
import { BaseSandboxService } from "worker/services/sandbox/BaseSandboxService";
import { PreviewType } from "worker/services/sandbox/sandboxTypes";
import { ProcessedImageAttachment } from "worker/types/image-attachment";

/** A request to generate (or replace) a single image asset on demand. */
export type ImageGenerationRequest = Omit<ImageAssetType, 'url'>;

export abstract class ICodingAgent {
    abstract getSandboxServiceClient(): BaseSandboxService;

    abstract deployToSandbox(files: FileOutputType[], redeploy: boolean, commitMessage?: string): Promise<PreviewType | null>;

    abstract deployToCloudflare(): Promise<{ deploymentUrl?: string; workersUrl?: string } | null>;

    abstract getLogs(reset?: boolean): Promise<string>;

    abstract queueUserRequest(request: string, images?: ProcessedImageAttachment[]): void;

    /**
     * Generate (or replace) a single image asset on demand, store it, merge
     * its public URL into the blueprint manifest, and queue a request so the
     * next phase wires it into the app. Returns the public URL, or null if
     * generation failed.
     */
    abstract queueImageGeneration(request: ImageGenerationRequest): Promise<string | null>;

    /**
     * Bind an image the user UPLOADED (already hosted at a public URL) into
     * the app as an asset — the no-generation counterpart to
     * {@link queueImageGeneration}. Merges the URL into the blueprint manifest
     * and queues a request so the next phase wires it into the app. Returns
     * the public URL, or null if the attachment has none.
     */
    abstract registerUploadedAsset(
        request: Pick<ImageGenerationRequest, 'path' | 'purpose'>,
        image: ProcessedImageAttachment,
    ): Promise<string | null>;
}
