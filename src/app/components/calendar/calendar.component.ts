import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';


export interface CalendarDate {
  date: string;
  monthName: string;
  monthDay: number;
  weekday: number;
  currentYear: boolean;
}




@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CalendarComponent implements OnInit {


  columns: CalendarDate[][][];

  constructor() { }

  ngOnInit() {
    this.calcCalendar();
  }


  calcCalendar() {

    moment.updateLocale('en', <any> {
      week: {
        dow: 1
      }
    });

    const start = moment().startOf('year').startOf('week');
    const end = moment().endOf('year').endOf('week');


    if (((end.clone().diff(start, 'days') / 7) % 2) !== 0) {
      end.add(8, 'days');
    }



    const rows: CalendarDate[][] = [];
    let row: CalendarDate[] = [];



    const daysTotal = end.diff(start, 'days');

    console.log(daysTotal);

    for (let i = 0; i < daysTotal; i++) {
      const date = start.clone().add(i, 'days');
      row.push({
        date: date.format('D.M.Y'),
        weekday: date.weekday(),
        monthName: date.format('MMM'),
        monthDay: date.date(),
        currentYear: date.format('Y') === moment().format('Y')
      });

      if (date.clone().endOf('week').format('D.M.Y') === date.format('D.M.Y')) {
        rows.push([...row]);
        row = [];
      }
    }

    // rows.push([...row]);

    this.columns = this.chunk(2, rows);


  }


  chunk(chunks, array) {
    const chunkSize = Math.round(array.length / chunks);
    return array.reduce(function(previous, current) {
      let chunk;
      if (previous.length === 0 ||
        previous[previous.length - 1].length === chunkSize) {
        chunk = [];   // 1
        previous.push(chunk);   // 2
      } else {
        chunk = previous[previous.length - 1];   // 3
      }
      chunk.push(current);   // 4
      return previous;   // 5
    }, []);   // 6
  }

}
