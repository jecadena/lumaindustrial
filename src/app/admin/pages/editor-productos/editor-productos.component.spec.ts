import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorProductosComponent } from './editor-productos.component';

describe('EditorProductosComponent', () => {
  let component: EditorProductosComponent;
  let fixture: ComponentFixture<EditorProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorProductosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
