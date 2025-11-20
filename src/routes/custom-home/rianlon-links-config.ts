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
		icon: '🏢',
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
		icon: '📁',
		isSystem: true
	},
	{
		id: 'teambition',
		title: 'Teambition',
		url: 'https://www.teambition.com/',
		icon: '👥',
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
