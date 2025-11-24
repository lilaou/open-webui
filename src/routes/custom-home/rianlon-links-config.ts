/**
 * Rianlon Quick Links Configuration
 *
 * 这个文件包含所有快速链接的配置
 * 在 Open WebUI 升级时，只需要保留这个文件即可
 *
 * 修改日期: 2025-01-19
 */

export interface Link {
	id: string;
	title: string;
	url: string;
	icon: string;
	isSystem?: boolean;
}

/**
 * 系统预设链接（参考 browser-app）
 * 这些链接会在所有用户的快速链接栏中显示
 */
export const systemLinks: Link[] = [
	{
		id: 'oa',
		title: 'OA',
		url: 'https://oa.lal.link/',
		icon: 'https://oa.lal.link/favicon.ico',
		isSystem: true
	},
	{
		id: 'contract',
		title: '合同助手',
		url: '/DocSmart/',
		icon: '🌐',
		isSystem: true
	},
	{
		id: 'translate',
		title: '文档翻译',
		url: '/DocSmart/translate.html',
		icon: '🌍',
		isSystem: true
	},
	{
		id: 'nas',
		title: 'NAS',
		url: 'https://192.168.45.222:5001/',
		icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23FFA000' d='M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'/%3E%3C/svg%3E",
		isSystem: true
	},
	{
		id: 'teambition',
		title: 'Teambition',
		url: 'https://www.teambition.com/',
		icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAASFBMVEVHcEwwq/oTnfcipPgMmfUNm/YyrfwSnPcZovglp/lGt/1Uvf5twvo/s/yQz/u33v1Muv43r/v////Z7v5Ctf0vq/pJuf5XwP+FeTlMAAAAGHRSTlMATJDF6P8Rov///////////////+n/lsUajDyuAAABKklEQVR4AX3KgZbDEBCF4UtCZ6gkNqLv/6Y71IamOfs5DsyPgdLTbMw8aYUb9mEGD4sLbS40RnY2X2Y7zM0t+/98KGZDsj5RWTMqTcU4bAWRhrB1zM4/C++9C7ysK1VWgkeZP9dlWVqxxfVHGBIPCYiJjXzt+/qutvBTLEYmBChmJgm64FrAxKygWXwGYS9H5EJjYkFjEJ0U+5O4mJCYD+a47mdgmMkYln9ZCXIKJvk7wloDecoS5cQxoBaMkNolyuYaUHtWCVN8O2S3oD3rMSHH7mjBIEN9BRyrULcCQteC/hEDgDy8W9BlCWxoXAuO0FmI7P6EZS+BO2VUqRcxuqXPE97s1jlxPix6ccfiZNPm5Ue2Py/JYpT9RcaF/UiyxQ2VX8n79MoK3S+ypCjWxh6gUgAAAABJRU5ErkJggg==',
		isSystem: true
	},
	{
		id: 'models',
		title: '模型管理',
		url: '/workspace/models',
		icon: '🤖',
		isSystem: true
	},
	{
		id: 'prompts',
		title: '提示词库',
		url: '/workspace/prompts',
		icon: '📝',
		isSystem: true
	},
	{
		id: 'knowledge',
		title: '知识库',
		url: '/workspace/knowledge',
		icon: '📚',
		isSystem: true
	},
	{
		id: 'tools',
		title: '工具箱',
		url: '/workspace/tools',
		icon: '🔧',
		isSystem: true
	}
];

/**
 * 从 localStorage 加载用户自定义链接
 */
export function loadUserLinks(): Link[] {
	if (typeof window === 'undefined') return [];

	const saved = localStorage.getItem('customQuickLinks');
	if (saved) {
		try {
			return JSON.parse(saved);
		} catch (e) {
			console.error('Failed to load custom links:', e);
			return [];
		}
	}
	return [];
}

/**
 * 保存用户自定义链接到 localStorage
 */
export function saveUserLinks(links: Link[]): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem('customQuickLinks', JSON.stringify(links));
}

/**
 * 获取所有链接（系统链接 + 用户自定义链接）
 */
export function getAllLinks(): Link[] {
	return [...systemLinks, ...loadUserLinks()];
}
