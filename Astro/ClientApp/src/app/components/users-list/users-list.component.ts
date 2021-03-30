import {Component, OnInit} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {User} from '../../models/User';
import {ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Roles} from '../../models/Statuses/Roles';
import {ActionResultStatus} from '../../models/Statuses/ActionResultStatus';
import {ToastService} from '../../services/toast.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  constructor(private adminService: AdminService, private toastService: ToastService) {
  }
  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>();

  users: User[];
  users$: User[] = [];
  roles = Roles;
  page = 1;
  pageSize = 10;
  ngOnInit() {
    this.adminService.getUsers().pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      this.users = res;
      this.users$ = res;
    });
  }

  searchUser(str): void {
    this.users$ = this.users.filter((elem, i, arr) => {
      return elem.userName.includes(str.target.value);
    });
  }
  clickAddModer(user: User): void {
    this.adminService.addModer(user.id).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if (res === ActionResultStatus.Success) {
        user.roleId = Roles.Moderator;
        this.toastService.show(`Пользователь ${user.userName} успешно стал модератором`,
          { classname: 'bg-success text-light', delay: 10000 });
      } else {
        this.toastService.show(`Ошибка при добавоении модератора ${user.userName}`,
          { classname: 'bg-danger text-light', delay: 15000 });
      }
    });
  }
  clickDeleteModer(user: User): void {
    this.adminService.deleteModer(user.id).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((res) => {
      if (res === ActionResultStatus.Success) {
        user.roleId = Roles.User;
        this.toastService.show(`Пользователь ${user.userName} успешно убран в качестве модератора`,
          { classname: 'bg-success text-light', delay: 5000 });
      } else {
        this.toastService.show(`Ошибка при удалении модератора ${user.userName}`,
          { classname: 'bg-danger text-light', delay: 5000 });
      }
    });
  }
}
