import {Component, HostListener, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {ItemsList} from '../models/items-list';
import {KEYS, DEFAULT_TEXTS} from '../constants';

@Component({
    selector: 'autocomplete',
    templateUrl: 'autocomplete.component.html'
})
export class AutocompleteComponent implements OnInit {
    public itemsList: ItemsList = new ItemsList();
    public searchString: string = '';
    public isOpenItemsList: boolean = false;
    public isSearching: boolean = false;
    private _isCancelHandler = {
        focus: false,
        blur: false
    };
    public loader = {
        isShow: false,
        startTime: 0
    };

    constructor() {}

    @Input() placeholder: string = DEFAULT_TEXTS.placeholder;
    @Input() showNotFound: boolean = false;
    @Input() filterItems: Function;
    @Input() value: string = null;
    @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    set options(options: string[]) {
        this.initItems(options);
    }

    @ViewChild('autocompleteInput') autocompleteInputElRef: ElementRef;

    @HostListener('keydown', ['$event'])
    onKeyDown($event: KeyboardEvent) {
        if (KEYS[$event.which]) {
            switch ($event.which) {
                case KEYS.ArrowDown:
                    this._onArrow($event);
                    break;
                case KEYS.ArrowUp:
                    this._onArrow($event, false);
                    break;
                case KEYS.Enter:
                    this._onEnter($event);
                    break;
                case KEYS.Esc:
                    this._onEsc($event);
                    break;
            }
        }
    }

    public ngOnInit() {
        if (this.value) {
            this.searchString = this.value;
        }

        if (this.filterItems) {
            this.filterItems('').subscribe(data => {
                this.initItems(data);
            });
        }
    }

    public initItems(items: string[]) {
        this.itemsList.items = items;
    }

    public onInputValueChange(newSearchString) {
        if (newSearchString !== this.searchString) {
            this.searchString = newSearchString;
            this._searchStart();
        }
    }

    public onInputBlur() {
        setTimeout(() => {
            if (this._isCancelHandler.blur) {
                this._isCancelHandler.blur = false;
                return;
            }

            this.loader.isShow = false;
            this._searchEnd();

            if (this.searchString !== this.value) {
                this.selectItem(this.searchString);
            }

            this.close();
        }, 200);
    }

    public onClickItem(item: string) {
        this._isCancelHandler.blur = true;
        this._isCancelHandler.focus = true;
        this.selectItem(item);
        this.focusInput();
    }

    public onInputFocus() {
        if (this._isCancelHandler.focus) {
            this._isCancelHandler.focus = false;
            return;
        }

        this.selectInputText();
    }

    private _searchStart() {
        const inputValue = this.searchString;
        this.isSearching = true;

        if (this.filterItems) {
            this.filterItems(inputValue)
                .subscribe(
                    options => {
                        this.itemsList.filteredItems = options;
                        this._searchEnd();
                    },
                    () => this._searchError()
                );
        } else {
            this.itemsList.filter(inputValue);
            this._searchEnd();
        }

        this._showLoader();
    }

    private _searchEnd() {
        this._callAfterLoader(() => {
            this.isSearching = false;
            this._hideLoader();

            this.open();
            this.itemsList.hoverFirst();
        });
    }

    private _searchError() {
        this._callAfterLoader(() => {
            this.isSearching = false;
            this.itemsList.filteredItems = [];
            this.close();
        });
    }

    private _callAfterLoader(functionForCall: Function) {
        const remainingTimeLoader = this.loader.isShow ? 1000 - (new Date().getTime() - this.loader.startTime) : 0;

        if (remainingTimeLoader > 0) {
            setTimeout(() => functionForCall(),  remainingTimeLoader);
        } else {
            functionForCall();
        }
    }

    public changeHoveredIndex(newIndex: number) {
        this.itemsList.hoveredIndex = newIndex;
    }

    public open() {
        this.isOpenItemsList = true;
    }

    public close() {
        this.isOpenItemsList = false;
    }

    public focusInput() {
        this.autocompleteInputElRef.nativeElement.focus();
    }

    public selectInputText() {
        this.autocompleteInputElRef.nativeElement.select();
    }

    public selectItem(selectedItem: string) {
        if (!selectedItem) {
            return;
        }

        this.value = selectedItem;
        this.valueChange.emit(this.value);
        this.searchString = selectedItem;
        this.close();
    }

    private _showLoader() {
        setTimeout(() => {
            if (this.isSearching) {
                this.loader.isShow = true;
                this.loader.startTime = new Date().getTime();
                this.close();
            }
        }, 500);
    }

    private _hideLoader() {
        this.loader.isShow = false;
        this.loader.startTime = 0;
    }

    private _onArrow($event: KeyboardEvent, isDown:boolean = true) {
        if (!this.isOpenItemsList || this.itemsList.displayedItems.length <= 1) {
            return;
        }

        if (isDown) {
            this.itemsList.hoverNextItem();
        } else {
            this.itemsList.hoverPrevItem();
        }

        $event.preventDefault();
        $event.stopPropagation();
    }

    private _onEnter($event: KeyboardEvent) {
        this.selectItem(this.itemsList.hoveredItem);

        $event.preventDefault();
        $event.stopPropagation();
    }

    private _onEsc($event: KeyboardEvent) {
        if (this.isOpenItemsList) {
            this.close();

            $event.preventDefault();
            $event.stopPropagation();
        }
    }
}
