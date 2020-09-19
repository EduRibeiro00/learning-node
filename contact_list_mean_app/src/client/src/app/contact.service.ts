import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact } from './contact';

@Injectable()
export class ContactService {
  apiUrl = 'http://localhost:3000/api/contacts/';


  constructor(private http: HttpClient) { }

  // retrieving contacts
  getContacts() {
    return this.http.get<Contact[]>(this.apiUrl)
  }

  // add contact method
  addContact(newContact) {
    const headers = {'Content-Type' : 'application/json; charset=utf-8'}
    return this.http.post(this.apiUrl, newContact, { headers })
  }

  // delete contact method
  deleteContact(id) {
    return this.http.delete(this.apiUrl + id)
  }
}
