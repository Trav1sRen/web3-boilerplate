import { routes } from '@/config/routes';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });

export const AppRouter = () => {
  return (
    <Suspense
      fallback={
        /* Loader component for lazy loaded pages */
        <></>
      }
    >
      <ErrorBoundary
        fallback={
          /* Fallback component when error happens */
          <></>
        }
      >
        <RouterProvider router={router} />
      </ErrorBoundary>
    </Suspense>
  );
};
