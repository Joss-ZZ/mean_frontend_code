import { Action } from '../enums/action.enum';

export interface MatDialogData<T> {
	title: string;
	subtitle: string;
	action: Action;
	data: T | null;
	buttonClosed?: boolean;
}
