import { Component } from '@angular/core';
// tslint:disable-next-line: import-spacing
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from './db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private formBuilder: FormBuilder,
              private dbService: DbService
    ) {}
  loginForm: FormGroup;
  isSubmitted = false;
  loginSuccess = false;
  abc = true;
  public code: any;
  counter = 0;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.createCaptcha();
  }

  get formControls() {
    return this.loginForm.controls;
  }

  login() {
    console.log(this.loginForm.value.email);
    console.log(this.loginForm.value.password);
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.dbService.getConfig()
    .subscribe((data) => {

      for (const user of data)
      {
        if (user.username === this.loginForm.value.email &&
          user.password === this.loginForm.value.password)
          {
            this.loginSuccess = true;
            alert('User Logged in!');
          }
      }

      if (!this.loginSuccess)
      {
        if (sessionStorage.getItem('count'))
            {
              const count = sessionStorage.getItem('count');
              this.counter = ( Number(count) + 1);
              if (this.counter === 3)
              {
                this.validateCaptcha();
              }
              sessionStorage.setItem('count', String(this.counter));
            }
            else
            {
            sessionStorage.setItem('count', '1');
            }
        }

        });
  }



createCaptcha() {
  // clear the contents of captcha div first
  document.getElementById('captcha').innerHTML = '';
  // tslint:disable-next-line: prefer-const
  let charsArray =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*';
  const lengthOtp = 6;
  const captcha = [];
  for (let i = 0; i < lengthOtp; i++) {
    const index = Math.floor(Math.random() * charsArray.length + 1); // get the next character from the array
    if (captcha.indexOf(charsArray[index]) === -1) {
      captcha.push(charsArray[index]);
    }
    else { i--; }
  }
  const canv = document.createElement('canvas');
  canv.id = 'captcha';
  canv.width = 100;
  canv.height = 50;
  const ctx = canv.getContext('2d');
  ctx.font = '25px Georgia';
  ctx.strokeText(captcha.join(''), 0, 30);
  // storing captcha so that can validate you can save it somewhere else according to your specific requirements
  this.code = captcha.join('');
  document.getElementById('captcha').appendChild(canv); // adds the canvas to the body element
}

// tslint:disable-next-line: typedef
validateCaptcha() {
  event.preventDefault();
  debugger;
  if ((document.getElementById('cpatchaTextBox') as HTMLInputElement).value === this.code) {
    alert('Valid Captcha');
  }else{
    alert('Invalid Captcha. try Again');
    this.createCaptcha();
  }
  }
}
