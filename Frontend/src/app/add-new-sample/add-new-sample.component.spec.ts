import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSampleComponent } from './add-new-sample.component';

describe('AddNewSampleComponent', () => {
  let component: AddNewSampleComponent;
  let fixture: ComponentFixture<AddNewSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewSampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
