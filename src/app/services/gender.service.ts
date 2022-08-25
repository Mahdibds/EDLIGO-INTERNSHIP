import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GenderService {
  gender: Array<any>;
  constructor() {
    this.gender = [
      { code: 'M', description: 'Men' },
      { code: 'W', description: 'Women' },
    ];
  }

  rsltgender() {
    return this.gender;
  }
}
