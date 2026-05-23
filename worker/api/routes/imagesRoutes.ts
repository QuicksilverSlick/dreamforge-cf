import { Hono } from 'hono';
import { AppEnv } from '../../types/appenv';
import { ScreenshotsController } from '../controllers/screenshots/controller';
import { adaptController } from '../honoAdapter';
import { setAuthLevel, AuthConfig } from '../../middleware/auth/routeAuth';

export function setupScreenshotRoutes(app: Hono<AppEnv>): void {
  const screenshotsRouter = new Hono<AppEnv>();

  // Publicly serve screenshots (they are non-sensitive previews of generated apps)
  screenshotsRouter.get('/:id/:file', setAuthLevel(AuthConfig.public), adaptController(ScreenshotsController, ScreenshotsController.serveScreenshot));

  app.route('/api/screenshots', screenshotsRouter);

  // Publicly serve AI-generated images stored at R2 key `generated/<key>`.
  // Pairs with the upload code path in `worker/utils/images.ts`
  // (`getPublicUrlForR2Image` emits URLs of the form
  // `https://<CUSTOM_DOMAIN>/api/<r2Key>` where `r2Key` starts with the
  // image type — `generated` for AI-generated images).
  //
  // Two patterns are registered:
  //   - `/:file`           — legacy 1-segment R2 key (`generated/<uuid>.jpeg`)
  //   - `/:id/:file`       — current 2-segment R2 key from the upload code
  //                           (`generated/<id>/<filename>`)
  // Both route to the same controller method, which reads the suffix from the
  // request URL directly and serves from `env.TEMPLATES_BUCKET`.
  const generatedRouter = new Hono<AppEnv>();
  generatedRouter.get('/:file', setAuthLevel(AuthConfig.public), adaptController(ScreenshotsController, ScreenshotsController.serveGeneratedImage));
  generatedRouter.get('/:id/:file', setAuthLevel(AuthConfig.public), adaptController(ScreenshotsController, ScreenshotsController.serveGeneratedImage));
  app.route('/api/generated', generatedRouter);
}
