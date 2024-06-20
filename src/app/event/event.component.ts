import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

interface Event {
  id: number;
  Title: string;
  Location: string;
  Date: string;
  Description: string;
}

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatPaginatorModule, MatTableModule],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, AfterViewInit {
  eventForm: FormGroup;
  eventList: Event[] = [];
  dataSource = new MatTableDataSource<Event>();
  isNew: boolean;
  displayedColumns: string[] = ['action', 'Title', 'Date', 'Location'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router : Router) {
    this.eventForm = new FormGroup({
      id: new FormControl(null),
      Title: new FormControl('', Validators.required),
      Location: new FormControl('', Validators.required),
      Date: new FormControl('', Validators.required),
      Description: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadEvents(): void {
    const entries = localStorage.getItem('Entries');
    this.eventList = entries ? JSON.parse(entries) : [];
    this.dataSource.data = this.eventList;
    console.log(this.eventList);
  }

  addEvent(): void {
    this.isNew = true;
    this.eventForm.reset();
    this.openModal();
  }

  openModal(): void {
    const modalID = document.getElementById('modalId');
    if (modalID) {
      modalID.style.display = 'block';
    }
  }

  closeModal(): void {
    const modalID = document.getElementById('modalId');
    if (modalID) {
      modalID.style.display = 'none';
    }
  }

  submitForm(): void {
    if (this.eventForm.invalid) {
      this.markFormGroupTouched(this.eventForm);
      alert('Please fill out all required fields.');
      return;
    }

    if (this.isNew) {
      this.addNewEvent();
    } else {
      this.updateEvent();
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  addNewEvent(): void {
    const newEvent: Event = {
      ...this.eventForm.value,
      id: this.eventList.length ? this.eventList[this.eventList.length - 1].id + 1 : 1
    };

    this.eventList.push(newEvent);
    this.saveEvents();
    this.dataSource.data = this.eventList;
    this.eventForm.reset();
    this.closeModal();
  }

  editRow(event: Event): void {
    this.isNew = false;
    this.eventForm.setValue(event);
    this.openModal();
  }

  updateEvent(): void {
    const updatedEvent = this.eventForm.value;
    const index = this.eventList.findIndex(event => event.id === updatedEvent.id);

    if (index !== -1) {
      this.eventList[index] = updatedEvent;
      this.saveEvents();
      this.dataSource.data = this.eventList;
      this.eventForm.reset();
      this.closeModal();
    }
  }

  deleteRow(event: Event): void {
    const index = this.eventList.findIndex(e => e.id === event.id);
    if (index !== -1) {
      this.eventList.splice(index, 1);
      this.saveEvents();
      this.dataSource.data = this.eventList;
    }
  }

  saveEvents(): void {
    localStorage.setItem('Entries', JSON.stringify(this.eventList));
  }

  filter(event: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goto(event){
    console.log(event);
    this.router.navigate([`event/${event.id}`])
  }
}
