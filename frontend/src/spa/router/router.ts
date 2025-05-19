import { Router } from '@vaadin/router';

const routes = [
  {
    path: '/spa/',
    component: 'photo-upload-form',
    action: async () => {
      await import('../pages/home');
    },
  },
  {
    path: '/spa/profile/',
    component: 'profile-page',
    action: async () => {
      await import('../pages/profile');
    },
  },
  {
    path: '/spa/feed/',
    component: 'feed-page',
    action: async () => {
      await import('../pages/feed');
    },
  },
  {
    path: '(.*)',
    component: 'not-found-page',
    action: async () => {
      await import('../pages/404');
    },
  },
];

export const initRouter = (outlet: HTMLElement) => {
  const router = new Router(outlet);
  router.setRoutes(routes);
  return router;
};
