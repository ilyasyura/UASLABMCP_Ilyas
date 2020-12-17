import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private dbPath = '/user';
  userRef: AngularFireList<User> = null;
  constructor(
    private db: AngularFireDatabase
  ) {
    this.userRef = db.list(this.dbPath);
  }

  create(user: User): any{
    return this.userRef.push(user);
  }

  getUser(userid: string){
    return this.db.object('user/' + userid).valueChanges();
  }

  upLatLng(lat: number, lng: number, userId: string){
    this.userRef = this.db.list('/user');
    return this.userRef.update(userId, {
      lat: lat,
      lng: lng
    });
  }

  getAllUser(){
    return this.userRef;
  }
}
