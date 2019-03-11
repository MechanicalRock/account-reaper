import { getTimeNow } from './';

export class DateUtil {

  private MILLISECONDS_IN_DAY = 86400000;
  private TODAY = getTimeNow();

  differenceInDays(date: number): number {
    return Math.floor(Math.abs((this.TODAY - date) / this.MILLISECONDS_IN_DAY));
  }

  thirtyDaysFrom(date: number): number {
    return date + this.MILLISECONDS_IN_DAY * 30;
  }

  getDateString(date: number): string {
    return new Date(date).toDateString();
  }

}
