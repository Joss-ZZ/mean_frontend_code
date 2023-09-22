import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomLayoutComponent } from './core/components/layout/custom-layout/custom-layout.component';
import { AuthModule } from './modules/auth/auth.module';
import { Error404Module } from './core/components/errors/error-404/error-404.module';
import { ClienteModule } from './modules/principal/cliente/cliente.module';

const routes: Routes = [
  {
		path: 'auth',
		loadChildren: (): Promise<typeof AuthModule> =>
			import('./modules/auth/auth.module').then((m) => m.AuthModule),
	},
  {
    path: '',
    component: CustomLayoutComponent,
		children: [
			{
				path: '',
				redirectTo: 'principal/cliente',
				pathMatch: 'full',
			},
			{
				path: 'principal/cliente',
				loadChildren: (): Promise<typeof ClienteModule> =>
					import('./modules/principal/cliente/cliente.module').then(
						(m) => m.ClienteModule
					),
			},
			{
				path: '**',
				loadChildren: (): Promise<typeof Error404Module> =>
					import('./core/components/errors/error-404/error-404.module').then((m) => m.Error404Module),
			},
		],
  },
  {
		path: '**',
		loadChildren: (): Promise<typeof Error404Module> =>
			import('./core/components/errors/error-404/error-404.module').then((m) => m.Error404Module),
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
	useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
