import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, throwError } from 'rxjs';

import { map, debounceTime, distinctUntilChanged, switchMap, catchError, retry, retryWhen } from 'rxjs/operators';
import { SearchService } from './../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private searchService: SearchService) { }

  public loading: boolean;
  public searchInput = new Subject<string>();
  public searchResults: any;
  public searchForm: FormGroup;
  public errorMessage: string;
  public haveBike: number;

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9]*$')]),
    });

    this.search();
  }

  public search() {
    this.searchInput.pipe(
      map((e: any) => {
        return e.target.value;
      }),
      // Attendre 1 seconde pour laisser le temps à l'utilisateur de taper un mot
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(input => {
        this.loading = true;

        return this.searchService.searchEntries(input);
      }),
      catchError((e) => {
        this.loading = false;
        this.errorMessage = "Une erreur est survenue. Merci de réessayer ultérieurement. ";
        console.log(this.errorMessage);

        return throwError(e);
      })
    ).subscribe(value => {
      this.loading = false;
      this.searchResults = value;
      //console.log(this.searchResults);
      if (this.searchResults.length === 0) this.errorMessage = "Désolé, nous n’avons trouvé aucun résultat correspondant à votre recherche";
      console.log(this.errorMessage);
    });
  }

  ngOnDestroy(): void {
    this.searchInput.unsubscribe();
  }

}
