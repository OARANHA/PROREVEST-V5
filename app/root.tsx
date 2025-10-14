import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router-dom";
import "./app.css";
import { Layout as AppLayout } from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { SEOHead } from "./components/SEOHead";
import ProrevestApp from "./routes/home_prorevest";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { 
    rel: "preconnect", 
    href: "https://fonts.gstatic.com", 
    crossOrigin: "anonymous" 
  },
  {
    rel: "preload",
    href: "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap",
    as: "style"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap"
  }
];

export function Layout() {
  const location = useLocation();

  // Verifica se é a página inicial ou páginas do blog
  const isHomePage = location.pathname === '/';
  const isBlogPage = location.pathname.startsWith('/blog');

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <SEOHead />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {isHomePage ? (
              // Para a página inicial, carregamos diretamente o componente da home
              <ProrevestApp />
            ) : isBlogPage ? (
              // Para as páginas do blog, aplicamos o Layout sem header/footer
              <AppLayout showHeaderFooter={false}>
                <Outlet />
              </AppLayout>
            ) : (
              // Para as demais páginas, incluindo admin, aplicamos o AppLayout normal
              <AppLayout>
                <Outlet />
              </AppLayout>
            )}
          </AuthProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  
  // Para a página inicial, não usamos o Outlet pois o componente já é carregado diretamente
  if (location.pathname === '/') {
    return null;
  }
  
  // Para todas as outras páginas, incluindo admin, usamos o Outlet
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: any }) {
  let message = "Oops!";
  let details = "Ocorreu um erro inesperado.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Erro";
    details =
      error.status === 404
        ? "A página solicitada não foi encontrada."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
