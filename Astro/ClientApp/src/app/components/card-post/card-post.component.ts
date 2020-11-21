import {Component, Input, OnInit} from '@angular/core';
import {PostInfoCard} from '../../models/PostInfoCard';

@Component({
  selector: 'app-card-post',
  templateUrl: './card-post.component.html',
  styleUrls: ['./card-post.component.css']
})
export class CardPostComponent implements OnInit {

  @Input() data;
  post = new PostInfoCard();
  constructor() { }

  ngOnInit() {
    this.post = this.data;
  }

}
