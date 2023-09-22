import { Component, Input, OnInit, SimpleChanges, OnChanges, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vex-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss']
})
export class LoadingButtonComponent implements  OnChanges {

  @Input() iconButton: string = '';
  @Input() previousName: string;
  @Input() laterName: string;
  @Input() isLoading: boolean;

  @Output() onClickEvent = new EventEmitter<boolean>();


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isLoading) {
      this.isLoading = changes.isLoading.currentValue;
    }
  }

  buscar() {
    this.onClickEvent.emit(true);
  }
}
