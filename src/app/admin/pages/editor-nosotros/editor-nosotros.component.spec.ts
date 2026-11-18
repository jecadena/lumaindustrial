import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorNosotrosComponent } from './editor-nosotros.component';

describe('EditorNosotrosComponent', () => {
  let component: EditorNosotrosComponent;
  let fixture: ComponentFixture<EditorNosotrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorNosotrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorNosotrosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
