import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service'
import { Contact } from '../contact'

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  providers: [ContactService]
})
export class ContactsComponent implements OnInit {
  contacts: Contact[];
  first_name: String;
  last_name: String;
  age: Number;
  phone_number: String;
  address: String;
  city: String;

  constructor(private contactService : ContactService) { }

  addContact() {
      const newContact = {
        first_name: this.first_name,
        last_name: this.last_name,
        age: this.age,
        phone_number: this.phone_number,
        address: this.address,
        city: this.city
      }

      this.contactService.addContact(newContact).subscribe(response => {
        if (response.contact && response.message == 'The contact has been successfuly added.') {
          this.contacts.push(response.contact);
        }
      })
  }

	deleteContact(id : any) {
		let contacts = this.contacts
		this.contactService.deleteContact(id).subscribe(response => {
      if (response.id && response.message == 'The contact with the specified id was deleted.') {
        for (let i = 0; i < contacts.length; i++) {
          if (contacts[i]._id == id) {
            contacts.splice(i, 1)
          }
        }
      }

		})
	}

  fetchContacts() {
    this.contactService.getContacts().subscribe(response => this.contacts = response.contacts)
  }

  ngOnInit(): void {
    this.fetchContacts();
  }

}
