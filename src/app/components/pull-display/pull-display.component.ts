import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pull-display',
  templateUrl: './pull-display.component.html',
  styleUrls: ['./pull-display.component.css']
})
export class PullDisplayComponent {
  import { Component, Input, OnInit } from '@angular/core';
  @Input() action: "checkout" | "pull" | "" = ""; 
  @Input() status: number | null = null;
  @Input() stderr: string = "";
  @Input() stdout: string = "";
}
