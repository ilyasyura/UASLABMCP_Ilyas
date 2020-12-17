import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CheckinService } from '../services/checkin.service';
import { UserService } from '../services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  userId: string;
  user: any;
  checkin: any;

  constructor(
    private authSrv: AuthService,
    private userSrv: UserService,
    private router: Router,
    private checkinSrv: CheckinService
  ) {}

  ngOnInit(){
    this.authSrv.userDetails().subscribe(res => {
      console.log(res);
      if(res !== null){
        this.userId = res.uid;
        this.userSrv.getUser(this.userId).subscribe(profile => {
          this.user = profile;
        });

        this.checkinSrv.getAllCheckin(this.userId).snapshotChanges().pipe(
          map(changes => 
            changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
            )
        ).subscribe(data => {
          this.checkin = data;
        })
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }

  logout() {
    this.authSrv.logoutUser()
      .then(res=> {
        console.log(res);
        this.router.navigateByUrl('/login');
      })
      .catch(error => {
        console.log(error);
      });
  }
}
