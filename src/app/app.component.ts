import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'SSTestFE';
  tables:any[] = [];
  selectedTable:any = "";
  columns:any[] = [];
  gridData:any[] = [];

  constructor(private api: ApiService){
    this.getTables();
  }

  getTables(){
    this.api.getTables().subscribe(data => {
      this.tables = data['tableTypes'];

      if(this.tables.length > 0){
        this.selectedTable = this.tables[0];
        this.selectTable();
      }      
    })
  }

  selectTable(){
    this.api.getColumns(this.selectedTable._id).subscribe(structures => {
      this.columns = structures['tableStructure'];

      this.api.getTableData(this.selectedTable._id).subscribe(data => {
        this.gridData = data['tableData'].map((row:any) => row.content);

        console.log(this.columns);
        console.log(this.gridData);
      });
    });
  }
}
