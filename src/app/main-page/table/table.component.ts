import {Component, Input} from '@angular/core';
import {Hit} from "../../shared/interfaces/hit";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() hits: Array<Hit>
}
