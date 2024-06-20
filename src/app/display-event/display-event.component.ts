import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-display-event',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './display-event.component.html',
  styleUrl: './display-event.component.css'
})
export class DisplayEventComponent {

  eventId : any;
  eventList : any [];
  displayEvent : any;

  constructor(private route : ActivatedRoute, private location : Location){
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = +params.get('id');
      if (id) {
        this.eventId = id;
      }
    });
  }

  ngOnInit(){
    const entries = localStorage.getItem('Entries');
    this.eventList = entries ? JSON.parse(entries) : [];
    if(this.eventList && this.eventList.length > 0){
      if(this.eventId && this.eventId > 0){
        this.displayEvent = this.eventList.find(res=> res.id == this.eventId);
      }
    }
    console.log(this.displayEvent);
  }

  goBack(): void {
    this.location.back();
  }
}
