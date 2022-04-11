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
  private editedRowIndex: number = -1;
  private editedItem: any = null;

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
        this.gridData = data['tableData'].map((row:any) => {
          return{
            id: row._id,
            ...row.content
          }
        });

        console.log(this.columns);
        console.log(this.gridData);
      });
    });
  }

  public addHandler({ sender }:any, formInstance: any) {
    formInstance.reset();
    this.closeEditor(sender);

    let row:any = {};

    this.columns.forEach((col:any) => {
      switch(col.dataType){
        case "Int":
          row[col.header] = 0;
          break;
        case "String":
        case "Date":          
          row[col.header] = '';
          break;
      }
      
    });

    sender.addRow(row);
  }

  public saveHandler({ sender, rowIndex, dataItem, isNew }:any) {
    console.log(dataItem)
    this.api.createTableRow(this.selectedTable._id, { content: dataItem }).subscribe(data => {
      sender.closeRow(rowIndex);

      this.editedRowIndex = -1;
      this.editedItem = null;

      this.selectTable();
    });
  }

  public removeHandler({ dataItem }:any) {
    this.api.removeTableRow(this.selectedTable._id, dataItem.id).subscribe(data => {
      this.selectTable();
    });
  }

  /*public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.editedRowIndex = rowIndex;
    this.editedProduct = Object.assign({}, dataItem);

    sender.editRow(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  

  public removeHandler({ dataItem }) {
    this.editService.remove(dataItem);
  }*/

  private closeEditor(grid:any, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);

    this.editedRowIndex = -1;
    this.editedItem = null;
  }
}
