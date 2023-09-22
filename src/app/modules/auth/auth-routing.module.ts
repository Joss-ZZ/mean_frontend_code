import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { LoginComponent } from './login/login.component';

const routes: VexRoutes = [
	{
		path: 'login',
		data: { title: 'Login' },
		component: LoginComponent
	},
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
