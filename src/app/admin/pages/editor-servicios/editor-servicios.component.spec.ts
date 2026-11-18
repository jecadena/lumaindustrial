import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorServiciosComponent } from './editor-servicios.component';

describe('EditorServiciosComponent', () => {
  let component: EditorServiciosComponent;
  let fixture: ComponentFixture<EditorServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorServiciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorServiciosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
