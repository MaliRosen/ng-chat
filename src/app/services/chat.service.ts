import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IChatRoom, IMessage } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private _db :AngularFirestore) { }

  public getRooms():Observable<Array<IChatRoom>>{
     
    return this._db.collection('rooms').snapshotChanges().pipe(map(snaps=>{
      return snaps.map(snap=>{
        const id= snap.payload.doc.id;
        const data: IChatRoom =<IChatRoom> snap.payload.doc.data();
        return <IChatRoom>{
          ...data,
          id
        }
      })
    }))
  }


  public getRoomMesseges(roomId:string):Observable<Array<IMessage>>{
    return this._db.collection('rooms').doc(roomId).collection('messeges').snapshotChanges().pipe(map(messeges=>{
      return messeges.map(messege=>{
        const data:IMessage = <IMessage> messege.payload.doc.data();
        const id:string= messege.payload.doc.id;
        return {
          ...data,
          id
        }
      })
    }))
  }

  public addRoom(roomName:string, userId:string):void{
    this._db.collection('rooms').add({
      roomName,
      createdUserId:userId
    })
  }

  public sendMessage(body:string, userId:string, roomId:string):void{
    this._db.collection('rooms').doc(roomId).collection('messeges').add({
      userId,
      timestamp: new Date().getTime(),
      body
    })
  }                                                                                                                                  
}
