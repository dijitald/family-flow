import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { UserService } from '../../shared/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { User } from '../../shared/models/user.model';
import { HouseholdService } from '../../shared/services/household.service';
import { Membership } from '../../shared/models/membership.model';
import { FlexLayoutModule } from 'ngx-flexible-layout';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, CustomMaterialModule, ReactiveFormsModule, FlexLayoutModule],
  providers: [CurrencyPipe]
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  debug: boolean = false;
  profileForm: FormGroup;
  householdForm: FormGroup;
  joinHouseholdForm: FormGroup;
  user: User;
  op: string;
  hid: string;

  constructor(
    private userService: UserService,
    private householdService: HouseholdService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private currencyPipe: CurrencyPipe 
  ) { }

  ngOnInit() {
    this.initForms();

    this.route.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe(params => {
        this.op = params['op']
        this.hid = params['hid'];
        const dbg = params['dbg'];
        if (dbg == 'xoxo') this.debug = true;
      })

    this.userService.currentUser$
      .pipe(takeUntil(this._destroying$))
      .subscribe((newuser) => {
        console.log('userService.currentUser$', newuser);
        if (newuser && newuser.id) {
          this.user = newuser;
          this.profileForm.patchValue({
            email: newuser.email,
            name: newuser.name
          });
          this.profileForm.markAsPristine();
          if (this.op && this.hid && this.op == "join") {
            console.log('join household', this.hid);
            this.add_membership(this.hid, this.user.id);
          }
        }
      });
  }

  initForms() {
    this.profileForm = this.fb.group({
      email: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      name: ['', [Validators.required]]
    });

    this.householdForm = this.fb.group({
      newHouseholdName: ['', [Validators.required]]
    });

    this.joinHouseholdForm = this.fb.group({
      householdId: ['', [Validators.required, Validators.pattern('^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$')]]
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const updatedUser = {
        ...this.user,
        ...this.profileForm.value
      };
      this.userService.updateUser(updatedUser);
    }
  }

  onCancel() {
    // Reset the form to its initial state
    this.profileForm.patchValue({
      email: this.user.email,
      name: this.user.name
    });
    this.profileForm.markAsPristine(); // Mark the form as pristine after resetting
  }

  onCreateHousehold() {
    if (this.householdForm.valid) {
      const newHouseholdName = this.householdForm.get('newHouseholdName');
      this.householdService.create_household(newHouseholdName.value).subscribe({
        next: (household) => {
          console.log('household added [%s : %s]', household.id, household.name);
          this.add_membership(household.id, this.user.id);
          this.householdForm.reset();
          newHouseholdName.setErrors(null);
        },
        error: (error) => {
          console.error('Failed to create household:', error);
        }
      });
    }
  }

  onJoinHousehold() {
    if (this.joinHouseholdForm.valid) {
      const householdId = this.joinHouseholdForm.get('householdId');      
      this.add_membership(householdId.value, this.user.id);
      this.joinHouseholdForm.reset();
      householdId.setErrors(null);
    }
  }

  add_membership(hid: string, uid : string) {
    if (!hid || !uid) {
      console.error('Invalid household or user id');
      return;
    }
    this.userService.addMembership(hid, uid).subscribe({
      next: (membership) => {
        if (membership) {
          console.log('membership added');
          this.user.householdid = hid;
          this.userService.updateUser(this.user);
        }
        else
          console.error('add_membership', 'empty response');
      },
      error: (error) => {
        console.error('Failed to add membership:', error);
      }
    });
  }

  onActivateMembership(member: Membership) {
    console.log('onActivateMembership', member);
    if (!member || !member.householdid) {
      console.error('Invalid household or user id');
      return;
    }
    this.user.householdid = member.householdid;
    this.userService.updateUser(this.user);
    console.log('membership activated');
  }

  onDeleteMembership(member: Membership, event: Event) {
    console.log('onDeleteMembership', member);
    //cancel click event so parent doesn't get it

    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!member || !member.householdid) {
      console.error('Invalid household or user id');
      return;
    }
    this.userService.deleteMembership(this.user.households.find(m => m.householdid === member.householdid)).subscribe({
      next: () => {
        console.log('membership deleted');
      },
      error: (error) => {
        console.error('Failed to delete membership:', error);
      }
    });
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
