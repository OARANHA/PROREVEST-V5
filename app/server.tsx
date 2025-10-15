import "@react-router/node/install";
import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";
import routes from "./routes";

export async function render(request: Request) {
  let handler = createStaticHandler(routes);
  let a = await handler.query(request);

  if (a instanceof Response) {
    return a;
  }

  let router = createStaticRouter(a.routes);

  let html = renderToString(
    <StaticRouterProvider
      router={router}
      context={a.context}
    />
  );

  return new Response("<!DOCTYPE html>" + html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=0",
    },
  });
}
