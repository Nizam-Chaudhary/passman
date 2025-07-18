/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as OnboardRouteImport } from './routes/_onboard'
import { Route as AuthRouteImport } from './routes/_auth'
import { Route as AuthIndexRouteImport } from './routes/_auth/index'
import { Route as MasterPasswordVerifyRouteImport } from './routes/master-password/verify'
import { Route as MasterPasswordCreateRouteImport } from './routes/master-password/create'
import { Route as OnboardVerifyAccountRouteImport } from './routes/_onboard/verify-account'
import { Route as OnboardSignupRouteImport } from './routes/_onboard/signup'
import { Route as OnboardLoginRouteImport } from './routes/_onboard/login'
import { Route as AuthSettingsRouteImport } from './routes/_auth/settings'
import { Route as MasterPasswordResetTypeRouteImport } from './routes/master-password/reset.$type'
import { Route as OnboardResetPasswordUpdateRouteImport } from './routes/_onboard/reset-password/update'
import { Route as OnboardResetPasswordSendEmailRouteImport } from './routes/_onboard/reset-password/send-email'

const OnboardRoute = OnboardRouteImport.update({
  id: '/_onboard',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthRoute = AuthRouteImport.update({
  id: '/_auth',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthIndexRoute = AuthIndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthRoute,
} as any)
const MasterPasswordVerifyRoute = MasterPasswordVerifyRouteImport.update({
  id: '/master-password/verify',
  path: '/master-password/verify',
  getParentRoute: () => rootRouteImport,
} as any)
const MasterPasswordCreateRoute = MasterPasswordCreateRouteImport.update({
  id: '/master-password/create',
  path: '/master-password/create',
  getParentRoute: () => rootRouteImport,
} as any)
const OnboardVerifyAccountRoute = OnboardVerifyAccountRouteImport.update({
  id: '/verify-account',
  path: '/verify-account',
  getParentRoute: () => OnboardRoute,
} as any)
const OnboardSignupRoute = OnboardSignupRouteImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => OnboardRoute,
} as any)
const OnboardLoginRoute = OnboardLoginRouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => OnboardRoute,
} as any)
const AuthSettingsRoute = AuthSettingsRouteImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => AuthRoute,
} as any)
const MasterPasswordResetTypeRoute = MasterPasswordResetTypeRouteImport.update({
  id: '/master-password/reset/$type',
  path: '/master-password/reset/$type',
  getParentRoute: () => rootRouteImport,
} as any)
const OnboardResetPasswordUpdateRoute =
  OnboardResetPasswordUpdateRouteImport.update({
    id: '/reset-password/update',
    path: '/reset-password/update',
    getParentRoute: () => OnboardRoute,
  } as any)
const OnboardResetPasswordSendEmailRoute =
  OnboardResetPasswordSendEmailRouteImport.update({
    id: '/reset-password/send-email',
    path: '/reset-password/send-email',
    getParentRoute: () => OnboardRoute,
  } as any)

export interface FileRoutesByFullPath {
  '/settings': typeof AuthSettingsRoute
  '/login': typeof OnboardLoginRoute
  '/signup': typeof OnboardSignupRoute
  '/verify-account': typeof OnboardVerifyAccountRoute
  '/master-password/create': typeof MasterPasswordCreateRoute
  '/master-password/verify': typeof MasterPasswordVerifyRoute
  '/': typeof AuthIndexRoute
  '/reset-password/send-email': typeof OnboardResetPasswordSendEmailRoute
  '/reset-password/update': typeof OnboardResetPasswordUpdateRoute
  '/master-password/reset/$type': typeof MasterPasswordResetTypeRoute
}
export interface FileRoutesByTo {
  '/settings': typeof AuthSettingsRoute
  '/login': typeof OnboardLoginRoute
  '/signup': typeof OnboardSignupRoute
  '/verify-account': typeof OnboardVerifyAccountRoute
  '/master-password/create': typeof MasterPasswordCreateRoute
  '/master-password/verify': typeof MasterPasswordVerifyRoute
  '/': typeof AuthIndexRoute
  '/reset-password/send-email': typeof OnboardResetPasswordSendEmailRoute
  '/reset-password/update': typeof OnboardResetPasswordUpdateRoute
  '/master-password/reset/$type': typeof MasterPasswordResetTypeRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/_auth': typeof AuthRouteWithChildren
  '/_onboard': typeof OnboardRouteWithChildren
  '/_auth/settings': typeof AuthSettingsRoute
  '/_onboard/login': typeof OnboardLoginRoute
  '/_onboard/signup': typeof OnboardSignupRoute
  '/_onboard/verify-account': typeof OnboardVerifyAccountRoute
  '/master-password/create': typeof MasterPasswordCreateRoute
  '/master-password/verify': typeof MasterPasswordVerifyRoute
  '/_auth/': typeof AuthIndexRoute
  '/_onboard/reset-password/send-email': typeof OnboardResetPasswordSendEmailRoute
  '/_onboard/reset-password/update': typeof OnboardResetPasswordUpdateRoute
  '/master-password/reset/$type': typeof MasterPasswordResetTypeRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/settings'
    | '/login'
    | '/signup'
    | '/verify-account'
    | '/master-password/create'
    | '/master-password/verify'
    | '/'
    | '/reset-password/send-email'
    | '/reset-password/update'
    | '/master-password/reset/$type'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/settings'
    | '/login'
    | '/signup'
    | '/verify-account'
    | '/master-password/create'
    | '/master-password/verify'
    | '/'
    | '/reset-password/send-email'
    | '/reset-password/update'
    | '/master-password/reset/$type'
  id:
    | '__root__'
    | '/_auth'
    | '/_onboard'
    | '/_auth/settings'
    | '/_onboard/login'
    | '/_onboard/signup'
    | '/_onboard/verify-account'
    | '/master-password/create'
    | '/master-password/verify'
    | '/_auth/'
    | '/_onboard/reset-password/send-email'
    | '/_onboard/reset-password/update'
    | '/master-password/reset/$type'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  AuthRoute: typeof AuthRouteWithChildren
  OnboardRoute: typeof OnboardRouteWithChildren
  MasterPasswordCreateRoute: typeof MasterPasswordCreateRoute
  MasterPasswordVerifyRoute: typeof MasterPasswordVerifyRoute
  MasterPasswordResetTypeRoute: typeof MasterPasswordResetTypeRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_onboard': {
      id: '/_onboard'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof OnboardRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_auth/': {
      id: '/_auth/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthIndexRouteImport
      parentRoute: typeof AuthRoute
    }
    '/master-password/verify': {
      id: '/master-password/verify'
      path: '/master-password/verify'
      fullPath: '/master-password/verify'
      preLoaderRoute: typeof MasterPasswordVerifyRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/master-password/create': {
      id: '/master-password/create'
      path: '/master-password/create'
      fullPath: '/master-password/create'
      preLoaderRoute: typeof MasterPasswordCreateRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_onboard/verify-account': {
      id: '/_onboard/verify-account'
      path: '/verify-account'
      fullPath: '/verify-account'
      preLoaderRoute: typeof OnboardVerifyAccountRouteImport
      parentRoute: typeof OnboardRoute
    }
    '/_onboard/signup': {
      id: '/_onboard/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof OnboardSignupRouteImport
      parentRoute: typeof OnboardRoute
    }
    '/_onboard/login': {
      id: '/_onboard/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof OnboardLoginRouteImport
      parentRoute: typeof OnboardRoute
    }
    '/_auth/settings': {
      id: '/_auth/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof AuthSettingsRouteImport
      parentRoute: typeof AuthRoute
    }
    '/master-password/reset/$type': {
      id: '/master-password/reset/$type'
      path: '/master-password/reset/$type'
      fullPath: '/master-password/reset/$type'
      preLoaderRoute: typeof MasterPasswordResetTypeRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_onboard/reset-password/update': {
      id: '/_onboard/reset-password/update'
      path: '/reset-password/update'
      fullPath: '/reset-password/update'
      preLoaderRoute: typeof OnboardResetPasswordUpdateRouteImport
      parentRoute: typeof OnboardRoute
    }
    '/_onboard/reset-password/send-email': {
      id: '/_onboard/reset-password/send-email'
      path: '/reset-password/send-email'
      fullPath: '/reset-password/send-email'
      preLoaderRoute: typeof OnboardResetPasswordSendEmailRouteImport
      parentRoute: typeof OnboardRoute
    }
  }
}

interface AuthRouteChildren {
  AuthSettingsRoute: typeof AuthSettingsRoute
  AuthIndexRoute: typeof AuthIndexRoute
}

const AuthRouteChildren: AuthRouteChildren = {
  AuthSettingsRoute: AuthSettingsRoute,
  AuthIndexRoute: AuthIndexRoute,
}

const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren)

interface OnboardRouteChildren {
  OnboardLoginRoute: typeof OnboardLoginRoute
  OnboardSignupRoute: typeof OnboardSignupRoute
  OnboardVerifyAccountRoute: typeof OnboardVerifyAccountRoute
  OnboardResetPasswordSendEmailRoute: typeof OnboardResetPasswordSendEmailRoute
  OnboardResetPasswordUpdateRoute: typeof OnboardResetPasswordUpdateRoute
}

const OnboardRouteChildren: OnboardRouteChildren = {
  OnboardLoginRoute: OnboardLoginRoute,
  OnboardSignupRoute: OnboardSignupRoute,
  OnboardVerifyAccountRoute: OnboardVerifyAccountRoute,
  OnboardResetPasswordSendEmailRoute: OnboardResetPasswordSendEmailRoute,
  OnboardResetPasswordUpdateRoute: OnboardResetPasswordUpdateRoute,
}

const OnboardRouteWithChildren =
  OnboardRoute._addFileChildren(OnboardRouteChildren)

const rootRouteChildren: RootRouteChildren = {
  AuthRoute: AuthRouteWithChildren,
  OnboardRoute: OnboardRouteWithChildren,
  MasterPasswordCreateRoute: MasterPasswordCreateRoute,
  MasterPasswordVerifyRoute: MasterPasswordVerifyRoute,
  MasterPasswordResetTypeRoute: MasterPasswordResetTypeRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
