import { NavigationGuardNext, Route, RouteMeta } from 'vue-router';
import usersService from '@/services/users.service';
import Vue from 'vue';

export const usersResolver = async (to: Route, from: Route, next: NavigationGuardNext) => {
  const meta = to.meta as RouteMeta;
  usersService.getUsers().then((users) => {
    meta.users = users;
    next();
  }).catch(() => {
    next();
  });
};

export const userResolver = (to: Route, from: Route, next: NavigationGuardNext) => {
  const meta = to.meta as RouteMeta;
  usersService.getUser(to.params.userId).then((user) => {
    meta.user = user;
    next();
  }).catch(() => {
    Vue.$toast.error('The user was not found');
    next('/users');
  });
};
