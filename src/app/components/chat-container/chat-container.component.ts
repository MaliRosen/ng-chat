import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter, Observable, Subscription } from 'rxjs';
import { IChatRoom, IMessage } from 'src/app/models';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { AddRoomComponent } from '../add-room/add-room.component';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit , OnDestroy {

  private subscription: Subscription = new Subscription();
  private userId:string="";
  private roomId:string="";
  public rooms$:Observable<Array<IChatRoom>>
  public messeges$:Observable<Array<IMessage>>
  constructor(
    private chatService: ChatService,
    private auth:AuthService,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    public dialog: MatDialog
    )
    { 
    this.rooms$ = this.chatService.getRooms();
    if(this.activatedRoute.snapshot.url.length>1)
      this.roomId=this.activatedRoute.snapshot.url[1]?.path;
    this.messeges$ = this.chatService.getRoomMesseges(this.roomId);
    console.log("roomId", this.roomId);

    this.subscription.add(
      this.router.events.pipe(filter((data) => data instanceof NavigationEnd))
       .subscribe(data=>{
        const routerEvent:RouterEvent = <RouterEvent>data
        const urlArr = routerEvent.url.split("/");
        if(urlArr.length>2){
          this.messeges$ = this.chatService.getRoomMesseges(urlArr[2]);
        }
        console.log(data);     
      })
    )
    
  }
  public openAddRoomModal(){
    const dialogRef = this.dialog.open(AddRoomComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      this.onAddRoom(result,this.userId)
    });
  }

  public onAddRoom(roomName:string,userId:string){
    this.chatService.addRoom(roomName, userId);
  }
  public sendMessege(newMessege : string){
    if(this.roomId)
    this.chatService.sendMessage(newMessege,this.userId,this.roomId);
  }
  ngOnInit(): void {
    this.subscription.add(this.auth.getUserData().pipe(filter(data=>!!data)).subscribe(user=>{
      this.userId = user.uid;
    }))
    this.subscription.add(
      this.router.events.pipe(filter((data) => data instanceof ActivationEnd))
       .subscribe(data=>{
        console.log("data",data);
        
        const routerEvent= data as ActivationEnd
        this.roomId= routerEvent.snapshot.paramMap.get("roomId") || "";
       }
       ))
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
