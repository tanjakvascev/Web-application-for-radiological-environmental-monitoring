import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesViewComponent } from './samples-view.component';

describe('SamplesViewComponent', () => {
  let component: SamplesViewComponent;
  let fixture: ComponentFixture<SamplesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplesViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamplesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
