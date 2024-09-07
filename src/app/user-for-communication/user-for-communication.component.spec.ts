import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserForCommunicationComponent } from './user-for-communication.component';

describe('UserForCommunicationComponent', () => {
  let component: UserForCommunicationComponent;
  let fixture: ComponentFixture<UserForCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserForCommunicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserForCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
