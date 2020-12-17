import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Checkin } from './checkin';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {

  private dbPath = '/checkin';
  checkinRef: AngularFireList<Checkin> = null;
  tmp: any;
  tmpCheckin: any;
  userId: string;

  constructor(
    private db: AngularFireDatabase
  ) {
    this.checkinRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<Checkin> {
    return this.checkinRef;
  }

  getAllCheckin(id: string): AngularFireList<Checkin>{
    this.userId = id;
    this.tmpCheckin = this.db.list(this.dbPath, ref => ref.child(this.userId));
    return this.tmpCheckin;
  }

  addCheckin(userId, position, length, time): any {
    length = length + 1;
    this.tmp = '/location-' + length;
    return this.checkinRef.update(userId + '/' + this.tmp, {
      id: length,
      time: time,
      position: position
    });
  }
}
