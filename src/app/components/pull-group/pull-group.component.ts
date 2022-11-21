import { Component, Input, OnInit } from '@angular/core';
import { results_initialiser } from 'src/app/initialisers';
import { Result } from 'src/app/interfaces/Result';

@Component({
  selector: 'app-pull-group',
  templateUrl: './pull-group.component.html',
  styleUrls: ['./pull-group.component.css']
})
export class PullGroupComponent implements OnInit {

  @Input() public result: Result | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
