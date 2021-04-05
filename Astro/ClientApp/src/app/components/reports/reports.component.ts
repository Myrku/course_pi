import { Component, OnInit } from '@angular/core';
import {ReportService} from '../../services/report.service';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CardTypes} from '../../models/Statuses/CardTypes';
import {Post} from '../../models/Post';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(private reportService: ReportService, public spinner: NgxSpinnerService) { }
  private destroyed$ = new ReplaySubject<void>();
  cardType = CardTypes.Report;
  reportedPosts: Post[] = [];

  ngOnInit() {
    this.spinner.show('loadingPage');
    this.getReports();
  }
  getReports() {
    this.reportService.getReports().pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      this.reportedPosts = res;
      this.spinner.hide('loadingPage');
    }, error => this.spinner.hide('loadingPage'));
  }
  onDeleted(id: number) {
    this.reportedPosts = this.reportedPosts.filter(post => post.id !== id);
  }
}
