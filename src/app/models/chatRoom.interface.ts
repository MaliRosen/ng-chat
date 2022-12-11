import { IMessage } from "./message.interface";

export interface IChatRoom{
    id:string;
    roomName:string;
    messeges:Array<IMessage>,
    createdUserId:string;
}