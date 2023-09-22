
import { NavigationItem } from 'src/@vex/interfaces/navigation-item.interface';

interface Config {
	callbackPreferences: () => void;
}

export const menuItems = (config: Config): NavigationItem[] => [
	{
		type: 'subheading',
		label: 'Mantenimiento',
		children: [
			{
				type: 'link',
				label: 'Clientes',
				route: '/',
				icon: 'mat:insights',
				routerLinkActiveOptions: { exact: true }
			}
		]
	}
];
