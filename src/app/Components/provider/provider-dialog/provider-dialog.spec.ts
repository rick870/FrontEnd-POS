import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderDialog } from './provider-dialog';

describe('ProviderDialog', () => {
  let component: ProviderDialog;
  let fixture: ComponentFixture<ProviderDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
