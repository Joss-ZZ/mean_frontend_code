
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { dialogClose } from 'src/app/shared/utils/dialog-util';


import { mergeDeep } from 'src/@vex/utils/merge-deep';

import { ConfirmationConfig, ConfirmationResult } from '../alert.interfaces';

@Component({
	selector: 'njc-confirmation',
	templateUrl: './confirmation.component.html',
	styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnDestroy {

	// Default cpmfif
	private _confirmationConfig: ConfirmationConfig = {
		icon: {
			show: true,
			name: 'mat:warning',
			color: 'text-red-500 bg-red-100',
		},
		actions: {
			confirm: {
				show: true,
				label: 'ACEPTAR',
				color: 'primary',
			},
			cancel: {
				show: true,
				label: 'CANCELAR',
			},
			close: true,
		},
		dismissible: true,
	};

	config!: ConfirmationConfig;

	private _subscription!: Subscription;

	constructor(
		private readonly _matDialogRef: MatDialogRef<ConfirmationComponent, ConfirmationResult>,
		@Inject(MAT_DIALOG_DATA) public matDialogData: ConfirmationConfig
	) {
		if (this.matDialogData) {
			this.config = mergeDeep(this._confirmationConfig, this.matDialogData);
		} else {
			this.config = { ...this._confirmationConfig };
		}

		if (!this.config.dismissible) this._matDialogRef.disableClose = true;
		else {
			this._subscription = dialogClose(this._matDialogRef, () => this.cancel());
		}
	}

	cancel(): void {
		this._matDialogRef.close('canceled');
	}

	acepted(): void {
		this._matDialogRef.close('acepted');
	}

	ngOnDestroy(): void {
		this._subscription?.unsubscribe();
	}
}
