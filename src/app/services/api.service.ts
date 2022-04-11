import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API = 'http://localhost:3000';

  constructor(private http:HttpClient) { }

  getTables():Observable<any>{
    return this.http.get(this.API+'/table/types/all');
  }

  getColumns(id: string):Observable<any>{
    return this.http.get(this.API+'/table/structures/all/'+id);
  }

  getTableData(id: string):Observable<any>{
    return this.http.get(this.API+'/table/data/all/'+id);
  }

  createTableRow(typeId: string, data:any): Observable<any>{
    return this.http.post(this.API+'/table/data/create/'+typeId, data);
  }

  removeTableRow(typeId: string, id: string): Observable<any>{
    return this.http.delete(this.API+'/table/data/delete/'+typeId+'/'+id);
  }
}
