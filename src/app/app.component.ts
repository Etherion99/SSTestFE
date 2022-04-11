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
    if(this.editedRowIndex == -1){
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
    }else{
      alert('Termina de editar este registro antes de agregaruno nuevo');
    }    
  }

  public saveHandler({ sender, rowIndex, dataItem, isNew }:any) {
    let valid = true;

    this.columns.forEach(col => {
      if(!this.validateField(col.header, dataItem[col.header], col.dataType, col.format, col.required)){
        alert('Hay un error en el campo ' + col.header);
        valid = false;
      }
    });

    if(valid){
      const id = dataItem.id;
      delete dataItem['id'];

      if(isNew){
        this.api.createTableRow(this.selectedTable._id, { content: dataItem }).subscribe(data => {
          sender.closeRow(rowIndex);
          this.editedRowIndex = -1;
  
          this.selectTable();
        });
      }else{
        this.api.updateTableRow(id, { content: dataItem }).subscribe(data => {
          sender.closeRow(rowIndex);
          this.editedRowIndex = -1;
          
          this.selectTable();
        });
      }
    }
  }

  public editHandler({ sender, rowIndex, dataItem }: any) {
    if(this.editedRowIndex == -1){
      this.closeEditor(sender);

      sender.editRow(rowIndex);
      this.editedRowIndex = rowIndex;
    }else{
      alert('Termina de editar este registro antes de editar uno diferente');
    }    
  }

  public cancelHandler({ sender, rowIndex }:any) {
    this.closeEditor(sender, rowIndex);
    this.editedRowIndex = -1;
  }

  public removeHandler({ dataItem }:any) {
    if (confirm("¿Estás seguro que deseas eliminar este registro?") == true) {
      this.api.removeTableRow(this.selectedTable._id, dataItem.id).subscribe(data => {
        this.selectTable();
      });
    }    
  }

  private closeEditor(grid:any, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);

    this.editedRowIndex = -1;
  }

  private validateField(field:string, value:any, dataType: string, format:string = "", required:boolean): boolean{
    if(required){
      switch(dataType){
        case "Int":
          return !isNaN(value) && value !== "";
        case "String":
          return value !== "";
        case "Date":
          let regEx = /^\d{4}-\d{2}-\d{2}$/;
          return value.match(regEx);
        default:
          return true;
      }
    }else{
      return true;
    }
  }

  public getType(dataType: string): string{
    const dict:any = {
      "Int": "number",
      "String": "text",
      "Date": "date"
    }

    return dict[dataType];
  }
}
