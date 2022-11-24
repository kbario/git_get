import { open } from '@tauri-apps/api/dialog';

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { getNameFromPath } from "../../shared/functions/getNameFromPath"
import { Settings } from 'src/app/interfaces/Settings';
import { homeDir } from '@tauri-apps/api/path';

export interface DialogData {
  settings: Settings[]
}

@Component({
  // selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent {

  public settings: Settings[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { this.settings = data.settings ?? [] }

  close(): void {
    this.dialogRef.close(this.settings);
  }

  public getNameFromPath = getNameFromPath

  public add = (id: number, val: string) => {
    console.log()
    this.settings.find((x: Settings) => x.id === id)?.branches.push(val)
  }

  public remove = (id: number, val: string) => {
    const idx = this.settings.findIndex((x: Settings) => x.id === id);
    this.settings[idx].branches = this.settings[idx].branches.filter(y => y !== val)
  }

  public addRepo = async () => {
    // Open a selection dialog for image files
    const selected = await open({
      multiple: true,
      directory: true,
      defaultPath: await homeDir()
    });

    if (Array.isArray(selected)) {
      selected.forEach(x => this.pushPathOnSettings(x))
    } else if (selected === null) {
      // user cancelled the selection
    } else {
      this.pushPathOnSettings(selected);
    }
  }

  public removeRepoSettings = (id: number) => {
    this.settings = this.settings.filter(x => x.id !== id)
  };

  private pushPathOnSettings = (path: string): void => {
    const id = this.settings[this.settings.length - 1]?.id + 1 ?? 0;

    this.settings.push({ id: id, path: path, branches: [] });
  };
}
