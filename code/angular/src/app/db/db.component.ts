import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-db',
  templateUrl: './db.component.html',
  styleUrls: ['./db.component.css']
})
export class DbComponent {
  resultMessage: string | null = null;

  constructor(private http: HttpClient) {
    CommonModule;
  }

  private baseUrl: string = environment.apiUrl;

  onButtonClick(button: string): void {
    const url = this.baseUrl + '/db';
  
    if (button === 'button1') {
      this.http.post(url, null).subscribe(
        (response) => {
          this.resultMessage = 'Successfully added data to db';
        },
        (error) => {
          this.resultMessage = 'Failed to add data to db';
        }
      );
    } else if (button === 'button2') {
      this.http.delete(url).subscribe(
        (response) => {
          this.resultMessage = 'Successfully deleted data from db';
        },
        (error) => {
          this.resultMessage = 'Failed to delete data from db';
        }
      );
    }
  }  
}
