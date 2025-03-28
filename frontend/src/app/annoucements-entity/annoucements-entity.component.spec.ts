import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoucementsEntityComponent } from './annoucements-entity.component';

describe('AnnoucementsEntityComponent', () => {
  let component: AnnoucementsEntityComponent;
  let fixture: ComponentFixture<AnnoucementsEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnoucementsEntityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnoucementsEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
