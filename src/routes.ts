import type { RouteObject } from 'react-router';
import React from 'react';

import App from './App';
import Home from './routes/home';
import Chat from './routes/chat/chat';
import Profile from './routes/profile';
import Settings from './routes/settings/index';
import AppsPage from './routes/apps';
import AppView from './routes/app';
import DiscoverPage from './routes/discover';
import ImportPage from './routes/import';
import InterviewPage from './routes/interview';
import { ProtectedRoute } from './routes/protected-route';
import { AdminRoute } from './routes/admin-route';
import AdminOverview from './routes/admin/overview';
import AdminUsers from './routes/admin/users';
import AdminUserDetail from './routes/admin/user-detail';
import AdminAudit from './routes/admin/audit';

const routes = [
	{
		path: '/',
		Component: App,
		children: [
			{
				index: true,
				Component: Home,
			},
			{
				path: 'chat/:chatId',
				Component: Chat,
			},
			{
				path: 'profile',
				element: React.createElement(ProtectedRoute, { children: React.createElement(Profile) }),
			},
			{
				path: 'settings',
				element: React.createElement(ProtectedRoute, { children: React.createElement(Settings) }),
			},
			{
				path: 'apps',
				element: React.createElement(ProtectedRoute, { children: React.createElement(AppsPage) }),
			},
			{
				path: 'app/:id',
				Component: AppView,
			},
			{
				path: 'discover',
				Component: DiscoverPage,
			},
			{
				path: 'import',
				element: React.createElement(ProtectedRoute, { children: React.createElement(ImportPage) }),
			},
			{
				path: 'interview',
				element: React.createElement(ProtectedRoute, { children: React.createElement(InterviewPage) }),
			},
			{
				path: 'admin',
				element: React.createElement(AdminRoute, { children: React.createElement(AdminOverview) }),
			},
			{
				path: 'admin/users',
				element: React.createElement(AdminRoute, { children: React.createElement(AdminUsers) }),
			},
			{
				path: 'admin/users/:id',
				element: React.createElement(AdminRoute, { children: React.createElement(AdminUserDetail) }),
			},
			{
				path: 'admin/audit',
				element: React.createElement(AdminRoute, { children: React.createElement(AdminAudit) }),
			},
		],
	},
] satisfies RouteObject[];

export { routes };
