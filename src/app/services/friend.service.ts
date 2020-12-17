import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Friend } from './friend';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  private dbPath ="/friend";
  friendRef: AngularFireList<Friend> = null;
  tmpFriend: any;
  tmp: any;

  constructor(
    private db: AngularFireDatabase
  ) {
    this.friendRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<Friend>{
    return this.friendRef;
  }

  getAllFriend(userId: string): AngularFireList<Friend>{
    this.tmpFriend = this.db.list(this.dbPath, ref => ref.child(userId));
    return this.tmpFriend;
  }

  newFriend(friendEmail: string, userId: string, count: number): any {
    count = count + 1;
    this.tmp = '/friend-' + count;
    return this.friendRef.update(userId + '/' + this.tmp, {
      email: friendEmail
    });
  }

  deleteFriend(userId: string, friendId: string): Promise <void> {
    return this.friendRef.remove(userId + '/' + friendId);
  }
}
