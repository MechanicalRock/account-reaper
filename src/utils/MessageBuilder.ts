import { DateUtil } from "./DateUtil";

export class NotificationMessageBuilder {

  private accountActions = [
    new Action('Un-mark', 'unmark'),
    new Action('Terminate', 'terminate', 'danger')
  ];

  formatMessage(accounts: MarkedAccount[]) {
    const attachments = accounts.map(this.newMarkedAccountAttachment);
    return {
      text: 'The following accounts are scheduled for deletion:',
      attachments
    };
  }

  private newMarkedAccountAttachment = (account: MarkedAccount) => {
    const { name, id, dateMarked } = account;

    const dateUtil = new DateUtil();
    const deletionDate = dateUtil.thirtyDaysFrom(dateMarked);
    const daysLeft = dateUtil.differenceInDays(deletionDate);

    return {
      author_name: id,
      title: name,
      text: `On *${dateUtil.getDateString(deletionDate)}* in _${daysLeft} days_`,
      mrkdwn_in: ['text'],
      color: '#3AA3E3',
      fallback: `${name} (${id}) on ${deletionDate} (${daysLeft})`,
      actions: this.accountActions
    }
  }
}

const confirm = {
  title: 'Are you sure?',
  ok_text: 'Yes',
  dismiss_text: 'No'
};

class Action {

  name = 'action';
  type = 'button';
  style?: string;
  confirm?: object;

  constructor(public text: string, public value: string, style?: string) {
    if (style) {
      this.style = style;
      if (style === 'danger') {
        this.confirm = confirm;
      }
    }
  }
}