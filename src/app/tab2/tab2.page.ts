import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';
import { FriendService } from '../services/friend.service';
import { FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Checkin } from '../services/checkin';
import { CheckinService } from '../services/checkin.service';
import { ToastController } from '@ionic/angular';

declare var google: any;
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  map: any;
  infoWindow: any = new google.maps.InfoWindow();
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  getLoc: any;
  userId: string;
  pos :any = {
    lat: -6.256081,
    lng: 106.618755
  };

  friend: any;
  userData: any;
  friendList= [];
  userFriend = [];
  userList = [];
  length:any;
  hours: any;
  minutes: any;
  seconds: any;
  time: any;
  dd: any;
  mm: any;
  yy: any;

  constructor(
    private db: AngularFireDatabase,
    private authSrv: AuthService,
    private userSrv: UserService,
    private friendSrv: FriendService,
    private router: Router,
    private checkinSrv: CheckinService,
    private toastController: ToastController
  ) {}

  ngOnInit(){
    
  }

  ionViewDidEnter(){
    this.authSrv.userDetails().subscribe(res => {
      if(res != null){
        this.userId = res.uid;
      }else {
        this.router.navigateByUrl('/login');
      }
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const posUser = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log(posUser.lat, posUser.lng, this.userId);
          this.userSrv.upLatLng(posUser.lat, posUser.lng, this.userId);
          const location = new google.maps.LatLng(posUser.lat, posUser.lng);
          const options = {
            center: location,
            zoom: 13,
            disableDefaultUI: true
          };
  
          this.map = new google.maps.Map(this.mapRef.nativeElement, options);
          console.log(posUser);
          this.map.setCenter(posUser);

          this.checkinSrv.getAllCheckin(this.userId).snapshotChanges().pipe(
            map(changes => 
              changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
              )
          ).subscribe(data => {
            this.length = data.length;
          })
  
          const marker = new google.maps.Marker({
            position: posUser,
            map: this.map,
          });

          this.friendSrv.getAllFriend(this.userId).snapshotChanges().pipe(
            map(changes => 
              changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
              )
          ).subscribe(data => {
            this.friend = data;
            this.userFriend = this.friend;
  
            this.userSrv.getAllUser().snapshotChanges().pipe(
              map(changes =>
                changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
                )
            ).subscribe(data => {
              this.userData = data;
              this.userList = this.userData;
              let j = 0;
              for(let i = 0; i < this.userList.length;){
                if(this.userList[i].email == this.userFriend[j].email){
                  this.friendList[j] = this.userData[j];
                  const posFriend = {
                    lat: this.friendList[j].lat,
                    lng: this.friendList[j].lng
                  }
                  const marker = new google.maps.Marker({
                    position: posFriend,
                    map: this.map,
                  });

                  console.log(this.friendList[j]);
                  i=0;
                  j++;
                  if(j == this.userFriend.length){
                    break;
                  }
                }else{
                  i++;
                }
              }
              console.log(this.friendList);
              for(let i = 0; i < this.friendList.length; i++){
                
              }
              //this.compareData(this.friend.length, this.userData.length);
            });
          });

        });
      }
    });
  }
  

  showCurrentLocation(){
    console.log('ilyas ganteng');
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log(pos);
        this.map.setCenter(pos);
      });
    }
  }

  onSubmit(f: NgForm){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position)=>{
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        let date = new Date();
        this.hours = date.getHours();
        this.minutes = date.getMinutes();
        this.seconds = date.getSeconds();
        this.dd = date.getDay();
        this.mm = date.getMonth();
        this.yy = date.getFullYear();
        
        if(this.hours < 10)
        {
          this.hours = '0' + this.hours;
        } 
        if(this.minutes < 10)
        {
          this.minutes = '0' + this.minutes;
        } 
        if(this.seconds < 10)
        {
          this.seconds = '0' + this.seconds;
        }
        this.time = this.dd + '/' + this.mm + '/' + this.yy + ' ' + this.hours + ':' + this.minutes + ':' + this.seconds;

        this.userSrv.upLatLng(pos.lat, pos.lng, this.userId);

        this.checkinSrv.addCheckin(this.userId, f.value.checkin, this.length, this.time);
        this.presentToast(f.value.checkin);
        f.reset();
      });
    }
  }

  async presentToast(location){
    const toast = await this.toastController.create({
      message: 'Check-in at ' + location + ' success!',
      duration: 1500,
      color: "success",
      position: "bottom"
    });
    toast.present();
  }
}
