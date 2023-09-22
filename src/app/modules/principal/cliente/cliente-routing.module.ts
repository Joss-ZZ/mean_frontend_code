import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClienteComponent } from './cliente.component';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
	{
		path: '',
		component: ClienteComponent,
		data: { title: 'Clientes' },
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
