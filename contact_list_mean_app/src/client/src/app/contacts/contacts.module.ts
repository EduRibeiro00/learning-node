import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ContactsComponent } from './contacts.component';
import { ContactService } from '../contact.service';

@NgModule({
  declarations: [
    ContactsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ContactService],
  bootstrap: [ContactsComponent]
})
export class AppModule { }
