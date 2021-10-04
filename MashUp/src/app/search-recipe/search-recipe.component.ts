import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-search-recipe',
  templateUrl: './search-recipe.component.html',
  styleUrls: ['./search-recipe.component.css']
})
export class SearchRecipeComponent implements OnInit {
  private recipe_id = "7565b01a";
  private recipe_key = "29907d35ce0bcbd57c08a3314800a898";
  private locatiom_id =  "GYH2GXECCNERT51LRAURGRWTSVMYA5HEWNUTERB0OA1MI2V0";
  private location_key = "I2EHPKS1RN55UIXBFUXAVOR3FWZIMIUSZJBZOY0IPID5VTGR";
  private recipeURL = `https://api.edamam.com/search?app_id=${this.recipe_id}&app_key=${this.recipe_key}`;
  private venueURL = `https://api.foursquare.com/v2/venues/search?client_id=${this.locatiom_id}&client_secret=${this.location_key}&v=20180323`;
 
  @ViewChild('recipe') recipes: ElementRef;
  @ViewChild('place') places: ElementRef;
  recipeValue: any;
  placeValue: any;
  venueList = [];
  recipeList = [];

  currentLat: any;
  currentLong: any;
  geolocationPosition: any;

  constructor(private _http: HttpClient) {
  }

  ngOnInit() {

    window.navigator.geolocation.getCurrentPosition(
      position => {
        this.geolocationPosition = position;
        this.currentLat = position.coords.latitude;
        this.currentLong = position.coords.longitude;
      });
  }
  getRecipe(){
    this.recipeValue = this.recipes.nativeElement.value;

    if (this.recipeValue !== null) {
      /**
       * Write code to get recipe
       */
       this.recipeList = [];
       let foodURL = this.recipeURL + '&q='+ this.recipeValue;
       this._http.get(foodURL).subscribe(resp => {
         let recipes = resp["hits"];
         recipes.map(result => {
           let recipe = result['recipe'];
             const resultobj = {
               name : result.recipe.label,
               url:result.recipe.url,
               icon: result.recipe.image
             }
             this.recipeList.push(resultobj);
 
           })
       });
 
    } 
  }

  getPlaces(){
    this.placeValue = this.places.nativeElement.value;
    if(this.recipeValue === ''){
      this.recipeValue = "food"
    }
    if (this.placeValue != null && this.placeValue !== '' && this.recipeValue != null && this.recipeValue !== '') {
      /**
       * Write code to get place
       */
       this.venueList = [];
       let placeURL = this.venueURL + "&query=" + this.recipeValue + '&near='+ this.placeValue;
       this._http.get(placeURL).subscribe(resp => {
         let venues = resp['response']['venues'];
         venues.map(result => {
           const resultobj = {
             name: result.name,
             location : {
               formattedAddress: [result.location.address,result.location.city,result.location.country]
             }
           }
           this.venueList.push(resultobj);
         })
       })
    }
  }

  getVenues() {


    this.getRecipe()

    this.getPlaces()

  }
}
