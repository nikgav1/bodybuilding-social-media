import { Router } from '@vaadin/router';

const routes = [
  {
    path: '/src/spa/',
    component: 'home-page',
    action: async () => {
      await import('../pages/home');
    }
  },
  {
    path: '/src/spa/profile/',
    component: 'profile-page',
    action: async () => {
      await import('../pages/profile');
    }
  },
  {
    path: '(.*)',
    component: 'not-found-page',
    action: async () => {
      await import('../pages/404');
    }
  }
];

export const initRouter = (outlet: HTMLElement) => {
  const router = new Router(outlet);
  router.setRoutes(routes);
  return router;
};