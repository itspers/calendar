import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';


export interface CalendarDate {
  date: string;
  monthName: string;
  monthFullName: string;
  monthDay: number;
  weekday: number;
  currentYear: boolean;
}

interface Weekday {
  weekdayLetter: string;
  weekdayName: string;
}

interface Columns {
  weekdays: Weekday[];
  data: CalendarDate[][][];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CalendarComponent implements OnInit {


  columns: Columns;

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

    // const start = moment().startOf('month').startOf('week');
    const start = moment(new Date(2021, 0, 1)).startOf('month').startOf('week');
    const end = moment(start).add(1, 'years').startOf('month');


    if (((end.clone().diff(start, 'days') / 7) % 2) !== 0) {
      // end.add(8, 'days');
    }
    const rows: CalendarDate[][] = [];
    let row: CalendarDate[] = [];
    const daysTotal = end.diff(start, 'days');
    for (let i = 0; i < daysTotal; i++) {
      const date = start.clone().add(i, 'days');
      row.push({
        date: date.format('D.M.Y'),
        weekday: date.weekday(),
        monthName: date.format('MMM').substring(0, 1),
        monthFullName: date.format('MMMM'),
        monthDay: date.date(),
        currentYear: date.format('Y') === moment().format('Y')
      });

      if (date.clone().endOf('week').format('D.M.Y') === date.format('D.M.Y')) {
        rows.push([...row]);
        row = [];
      }
    }

    const weekdays: Array<Weekday> = Array.apply(null, Array(7)).map(function (_, i): Weekday {
      const weekdayName = moment(i, 'e').startOf('week').isoWeekday(i + 1).format('dddd');
      return {
        weekdayLetter: weekdayName.substr(0, 1),
        weekdayName: weekdayName,
      };
    });
    const columnsData: CalendarDate[][][] = this.chunk(2, rows);
    this.columns = {
      weekdays: weekdays,
      data: columnsData
    };
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
