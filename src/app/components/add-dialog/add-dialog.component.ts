import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { getNameFromPath } from "../../shared/functions/getNameFromPath"
import { Settings } from 'src/app/interfaces/Settings';

export interface DialogData {
  settings: Settings[]
}

@Component({
  // selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent {

  public settings: Settings[];

  constructor(
    public dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { this.settings = data.settings }

  close(): void {
    this.dialogRef.close(this.settings);
  }

  public getNameFromPath = getNameFromPath

  public remove = (id: number) => {
    this.settings.filter((x: Settings) => x.id === id)[0].branches.push('')
  }

  public add = (id: number, val: string) => {
    this.settings.filter((x: Settings) => x.id === id)[0].branches.push(val)
  }
}
