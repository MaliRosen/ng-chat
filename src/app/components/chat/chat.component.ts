import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMessage } from 'src/app/models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() messeges:Array<IMessage> =[];
  @Output() onsendMessege: EventEmitter<string> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    console.log("messeges", this.messeges);
  }
  public sendMessege(newMessege : string){
    console.log("newMessege",newMessege);
    this.onsendMessege.emit(newMessege);
  }
}
