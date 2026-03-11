import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should navigate to "introducir-coordenadas" and update content', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a[href="#introducir-coordenadas"]') as HTMLElement;
    link.click();
    fixture.detectChanges();
    const content = compiled.querySelector('#content') as HTMLElement;
    expect(content.innerHTML).toContain('Introducir Coordenadas');
  });

  it('should navigate to "consultar-mapa" and update content', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a[href="#consultar-mapa"]') as HTMLElement;
    link.click();
    fixture.detectChanges();
    const content = compiled.querySelector('#content') as HTMLElement;
    expect(content.innerHTML).toContain('Consultar Mapa');
  });

  it('should navigate to "consultar-mejores-tiempos" and update content', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a[href="#consultar-mejores-tiempos"]') as HTMLElement;
    link.click();
    fixture.detectChanges();
    const content = compiled.querySelector('#content') as HTMLElement;
    expect(content.innerHTML).toContain('Consultar Mejores Tiempos');
  });

  it('should navigate to "extras" and update content', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a[href="#extras"]') as HTMLElement;
    link.click();
    fixture.detectChanges();
    const content = compiled.querySelector('#content') as HTMLElement;
    expect(content.innerHTML).toContain('Extras');
  });
});