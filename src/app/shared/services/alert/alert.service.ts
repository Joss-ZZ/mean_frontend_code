import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
	ConfirmationConfig,
	ConfirmationResult,
	LoadingConfig,
	SnackBarConfig,
	SnackBarType,
} from './alert.interfaces';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { LoadingComponent } from './loading/loading.component';
import { SnackComponent } from './snack/snack.component';

@Injectable()
export class AlertService {
	constructor(private readonly _matDialog: MatDialog, private readonly _matSnackBar: MatSnackBar) {}

	confirm(
		confirmationConfig: ConfirmationConfig
	): MatDialogRef<ConfirmationComponent, ConfirmationResult> {
		return this._matDialog.open(ConfirmationComponent, {
			data: confirmationConfig,
			// width: '32rem',
			panelClass: 'njc-confirmation-dialog-panel',
		});
	}

	get loading(): {
		show: (loadingConfig?: LoadingConfig) => void;
		hide: () => void;
	} {
		let dialogRef: MatDialogRef<LoadingComponent> | null = null;

		return {
			show: (loadingConfig?): void => {
				dialogRef = this._matDialog.open(LoadingComponent, {
					disableClose: true,
					data: loadingConfig,
					hasBackdrop: loadingConfig?.hasBackdrop ?? true,
				});
			},
			hide: (): void => {
				dialogRef?.close();
				dialogRef = null;
			},
		};
	}

	get snackBar(): {
		error(message: string, duration?: number): void;
		warning(message: string, duration?: number): void;
		info(message: string, duration?: number): void;
		default(config: SnackBarConfig): void;
	} {
		const open = (message: string, type: 'warning' | 'error' | 'info', duration?: number): void => {
			const data: SnackBarType = {
				message,
				type,
				buttonClosed: true,
			};

			this._matSnackBar.openFromComponent(SnackComponent, {
				data,
				panelClass: `njc-alert-${type}`,
				duration,
			});
		};

		return {
			error: (message: string, duration?: number): void => open(message, 'error', duration),
			warning: (message: string, duration?: number): void => open(message, 'warning', duration),
			info: (message: string, duration?: number): void => open(message, 'info', duration),
			default: (config: SnackBarConfig): void => {
				const { message, duration, horizontalPosition } = config;

				const data: SnackBarType = {
					message,
					type: null,
					buttonClosed: config?.buttonClosed ?? true,
				};

				this._matSnackBar.openFromComponent(SnackComponent, {
					data,
					duration,
					horizontalPosition,
				});
			},
		};
	}
}
