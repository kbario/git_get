import { Component, Input } from '@angular/core';
import { Result } from 'src/app/interfaces/Result';

@Component({
  selector: 'app-result-container',
  templateUrl: './result-container.component.html',
  styleUrls: ['./result-container.component.css']
})
export class ResultContainerComponent {

  @Input() public result: Result | null = null;
}
