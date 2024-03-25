import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-widget-count-with-icon',
  templateUrl: './widget-count-with-icon.component.html',
  styleUrl: './widget-count-with-icon.component.scss',
})
export class WidgetCountWithIconComponent {
  @Input() icon: string;
  @Input() count: number | string = 0;
  @Input() title: string;
  @Input() link: string;
}
