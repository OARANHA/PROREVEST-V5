import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter } from "react-router-server";
import routes from "./app/routes";

export async function render(request: Request, responseStatusCode = 200, responseHeaders = {}) {
  let { query } = createStaticHandler(routes);
  let result = await query(request);

  if (result instanceof Response) {
    return result;
  }

  let router = createStaticRouter(routes);

  let html = renderToString(
    <StaticRouterProvider router={router} />
  );

  return new Response(`<!DOCTYPE html>` + html, {
    status: responseStatusCode,
    headers: {
      "Content-Type": "text/html",
      ...responseHeaders,
    },
  });
}
