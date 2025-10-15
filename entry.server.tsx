import { PassThrough } from "node:stream";
import type { EntryContext } from "@react-router/node";
import { renderToPipeableStream } from "react-dom/server";
import { createStaticHandler, createStaticRouter } from "react-router";
import { RouterProvider } from "react-router-dom";
import routes from "./app/routes";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext
) {
  let handler = createStaticHandler(routes);
  let url = new URL(request.url);
  let result = handler.query(url);

  if (result instanceof Response) {
    return result;
  }

  let router = createStaticRouter(result.routes, result.context);

  let stream = renderToPipeableStream(
    <RouterProvider router={router} />,
    {
      bootstrapScripts: entryContext.bootstrapScripts,
      bootstrapModules: entryContext.bootstrapModules,
      onShellReady() {
        responseHeaders.set("Content-Type", "text/html");
      },
    }
  );

  return new Response(stream, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
