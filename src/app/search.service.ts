import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient: HttpClient) { }

  public baseUrl = "https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=vlille-realtime";
  public searchResults: any;

  public searchEntries(input): Observable<any>{
    if (input === "") {

      console.log("Champ de recherche vide");

      // Si la saisie est vide, on ne retourne aucun résultat
      return of(null);

    } else {

      // le param q permet une recherche plus élargie (mais parfois moins efficace) à la fois sur les stations et sur les communes
      let params = {q: input}

      return this.httpClient.get(this.baseUrl, {params}).pipe(

      // le param refine.nom permet une recherche sur le terme exact d'une station
      //return this.httpClient.get(this.baseUrl + `&refine.nom=${input}`).pipe(

        map(response => {
          return this.searchResults = response["records"];
        })

      );
    }
  }

}
