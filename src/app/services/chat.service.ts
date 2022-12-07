import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IChatRoom } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private _db :AngularFirestore) { }

  public getRooms():Observable<Array<IChatRoom>>{
    debugger
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
}
