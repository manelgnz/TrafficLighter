import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroduceCoordinatesComponent } from './introduce-coordinates.component';

describe('IntroduceCoordinatesComponent', () => {
  let component: IntroduceCoordinatesComponent;
  let fixture: ComponentFixture<IntroduceCoordinatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroduceCoordinatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroduceCoordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
