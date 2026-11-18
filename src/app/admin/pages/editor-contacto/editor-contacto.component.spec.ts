import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorContactoComponent } from './editor-contacto.component';

describe('EditorContactoComponent', () => {
  let component: EditorContactoComponent;
  let fixture: ComponentFixture<EditorContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorContactoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorContactoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
