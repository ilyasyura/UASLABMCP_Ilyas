import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  userId: string;
  user: any;

  constructor(
    private authSrv: AuthService,
    private userSrv: UserService,
    private router: Router
  ) {}

  ngOnInit(){
    this.authSrv.userDetails().subscribe(res => {
      console.log(res);
      if(res !== null){
        this.userId = res.uid;
        this.userSrv.getUser(this.userId).subscribe(profile => {
          this.user = profile;
        });
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
