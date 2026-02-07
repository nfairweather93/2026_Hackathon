import { Component, HostListener } from '@angular/core';
import { facultyNames } from '../data/faculty-names';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  query = '';
  matches: string[] = [];
  activeIndex = -1;
  showSuggestions = false;
  errorMessage = '';
  isValid = false;

  private normalize(s?: string | null): string {
    return (s ?? '').toLowerCase().trim();
  }

  isValidName(name: string): boolean {
    const q = this.normalize(name);
    return !!q && facultyNames.some(n => this.normalize(n) === q);
  }

  getMatches(query: string): string[] {
    const q = this.normalize(query);
    if (!q) return [];
    return facultyNames
      .filter(name => this.normalize(name).includes(q))
      .slice(0, 12);
  }

  /* -----------------------------
     Input handlers
  ------------------------------ */

  onInput(value: string): void {
    this.query = value;
    this.matches = this.getMatches(value);
    this.showSuggestions = this.matches.length > 0;
    this.activeIndex = -1;
    this.isValid = this.isValidName(value);
    this.errorMessage = '';
  }

  onFocus(): void {
    this.matches = this.getMatches(this.query);
    this.showSuggestions = this.matches.length > 0;
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.showSuggestions) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = Math.min(
        this.activeIndex + 1,
        this.matches.length - 1
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
    } else if (event.key === 'Enter' && this.activeIndex >= 0) {
      event.preventDefault();
      this.selectName(this.activeIndex);
    } else if (event.key === 'Escape') {
      this.closeSuggestions();
    }
  }

  selectName(index: number): void {
    const name = this.matches[index];
    if (!name) return;
    this.query = name;
    this.isValid = true;
    this.closeSuggestions();
  }

  submit(): void {
    if (!this.isValidName(this.query)) {
      this.isValid = false;
      this.errorMessage = 'Pick a valid faculty name from the list.';
    }
  }

  closeSuggestions(): void {
    this.showSuggestions = false;
    this.activeIndex = -1;
  }

  /* -----------------------------
     Click outside
  ------------------------------ */

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.searchWrap')) {
      this.closeSuggestions();
    }
  }
}
