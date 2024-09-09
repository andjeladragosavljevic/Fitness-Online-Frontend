import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorModalComponent } from './advisor-modal.component';

describe('AdvisorModalComponent', () => {
  let component: AdvisorModalComponent;
  let fixture: ComponentFixture<AdvisorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvisorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvisorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
