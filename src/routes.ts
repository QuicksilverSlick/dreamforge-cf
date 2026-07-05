import type { RouteObject } from 'react-router';
import React from 'react';

import App from './App';
import { AppShell } from './routes/app-shell';
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
import { OrgRoute } from './routes/org-route';
import AdminOverview from './routes/admin/overview';
import AdminUsers from './routes/admin/users';
import AdminUserDetail from './routes/admin/user-detail';
import AdminApps from './routes/admin/apps';
import AdminAudit from './routes/admin/audit';
import AdminBilling from './routes/admin/billing';
import AdminApplications from './routes/admin/applications';
import OrganizationPage from './routes/organization/index';
import InviteAccept from './routes/invite-accept';

const routes = [
	{
		path: '/',
		Component: App,
		children: [
			// Chrome-less, providers-only routes (no sidebar/header).
			{
				path: 'invite/:token',
				Component: InviteAccept,
			},
			// Main app — wrapped in the AppLayout chrome.
			{
				Component: AppShell,
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
						path: 'organization',
						element: React.createElement(OrgRoute, { children: React.createElement(OrganizationPage) }),
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
						path: 'admin/apps',
						element: React.createElement(AdminRoute, { children: React.createElement(AdminApps) }),
					},
					{
						path: 'admin/audit',
						element: React.createElement(AdminRoute, { children: React.createElement(AdminAudit) }),
					},
					{
						path: 'admin/billing',
						element: React.createElement(AdminRoute, { children: React.createElement(AdminBilling) }),
					},
					{
						path: 'admin/applications',
						element: React.createElement(AdminRoute, { children: React.createElement(AdminApplications) }),
					},
				],
			},
		],
	},
] satisfies RouteObject[];

export { routes };
