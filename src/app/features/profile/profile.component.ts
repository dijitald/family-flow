import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../shared/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { CustomMaterialModule } from '../../shared/custom-material/custom-material.module';
import { User } from '../../shared/models/user.model';
import { HouseholdService } from '../../shared/services/household.service';
import { MewmbershipService } from '../../shared/services/membership.service';
import { Membership } from '../../shared/models/membership.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, CustomMaterialModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  user: User;
  householdMemberships: Membership[];
  profileForm: FormGroup;
  householdForm: FormGroup;
  joinHouseholdForm: FormGroup;
  debug: boolean = true;

  constructor(
    private userService: UserService,
    private householdService: HouseholdService,
    private membershipService: MewmbershipService,
    private route: ActivatedRoute,
    private fb: FormBuilder 
  ) { }

  ngOnInit() {
    this.initForms();

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
        }
      });
    this.membershipService.households
      .pipe(takeUntil(this._destroying$))
      .subscribe((memberships) => {
        console.log('membershipService.households', memberships);
        if (memberships && memberships.length > 0) {
          this.householdMemberships = memberships;
        }
      });
    this.route.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe(params => {
        const dbg = params['dbg'];
        const op = params['op']
        const hid = params['hid'];

        if (dbg == 'xoxo') this.debug = true;
        if (op && hid && op == "join") {
          this.add_membership(hid, this.user.id);
        }
      })
  }

  initForms() {
    this.profileForm = this.fb.group({
      email: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      name: ['']
    });

    this.householdForm = this.fb.group({
      newHouseholdName: ['']
    });

    this.joinHouseholdForm = this.fb.group({
      householdId: ['', [Validators.pattern('^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$')]]
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
      const newHouseholdName = this.householdForm.get('newHouseholdName').value;
      this.householdService.create_household(newHouseholdName).subscribe({
        next: (household) => {
          console.log('household added [%s : %s]', household.id, household.name);
          this.add_membership(household.id, this.user.id);
          this.householdForm.reset();
        },
        error: (error) => {
          console.error('Failed to create household:', error);
        }
      });
    }
  }

  onJoinHousehold() {
    if (this.joinHouseholdForm.valid) {
      const householdId = this.joinHouseholdForm.get('householdId').value;      
      this.add_membership(householdId, this.user.id);
      this.joinHouseholdForm.reset();
    }
  }

  private add_membership(hid: string, uid : string) {
    if (!hid || !uid) {
      console.error('Invalid household or user id');
      return;
    }
    this.membershipService.addMembership(hid, uid).subscribe({
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

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
