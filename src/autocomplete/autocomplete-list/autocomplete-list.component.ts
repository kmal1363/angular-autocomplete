import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {AutocompleteOption} from '../models/option';

@Component({
    selector: 'autocomplete-list',
    templateUrl: 'autocomplete-list.component.html'
})
export class AutocompleteListComponent implements AfterViewInit {
    private _displayedItems: AutocompleteOption[] = [];
    private _hoveredIndex: number;

    public counter = {
        filtered: 0,
        displayed: 0,
    };

    constructor() {}

    @Output() select: EventEmitter<AutocompleteOption> = new EventEmitter<AutocompleteOption>();
    @Output() hoveredIndexChange: EventEmitter<number> = new EventEmitter<number>();

    @Input() showNotFound: boolean;

    @Input()
    set hoveredIndex(newIndex: number) {
        this._hoveredIndex = newIndex;
        this._scrollToHovered();
    }

    get hoveredIndex() {
        return this._hoveredIndex;
    }

    @Input()
    set filteredItems(items: AutocompleteOption[]) {
        this.counter.filtered = items.length;
    }

    @Input()
    set displayedItems(items: AutocompleteOption[]) {
        this._displayedItems = items;
        this.counter.displayed = this._displayedItems.length;
    }

    get displayedItems() {
        return this._displayedItems;
    }

    @ViewChild('autocompleteScroll') autocompleteScrollElRef: ElementRef;

    public ngAfterViewInit() {
        this._scrollToHovered();
    }

    public onMouseover(itemIndex: number) {
        this.hoveredIndexChange.emit(itemIndex);
    }

    public selectItem(selectedItem: AutocompleteOption) {
        this.select.emit(selectedItem);
    }

    private _scrollToHovered() {
        const listEl: Element = this.autocompleteScrollElRef.nativeElement;
        const listItemsEls: NodeListOf<Element> = listEl.querySelectorAll('.autocomplete-item');

        if (listItemsEls.length === 0) {
            return;
        }

        const itemHeight = listItemsEls[0].clientHeight;
        const listHeight = listEl.clientHeight;
        const hoveredPosition = this.hoveredIndex * itemHeight;
        const listTopPosition = listEl.scrollTop;
        const listBottomPosition = listEl.scrollTop + listHeight;

        if (hoveredPosition >= listBottomPosition) {
            listEl.scrollTop = listTopPosition + hoveredPosition - listBottomPosition + itemHeight;
        } else if (hoveredPosition < listTopPosition) {
            listEl.scrollTop = hoveredPosition;
        }
    }
}
