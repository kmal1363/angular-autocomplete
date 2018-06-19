import {Component, HostListener, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {ItemsList} from '../models/items-list';
import {AutocompleteOption} from '../models/option';
import {KEYS, DEFAULT_TEXTS} from '../constants';

@Component({
    selector: 'autocomplete',
    templateUrl: 'autocomplete.component.html'
})
export class AutocompleteComponent implements OnInit {
    public itemsList: ItemsList = new ItemsList();
    public placeholder: string = '';
    public searchString: string = '';
    public isOpenItemsList: boolean = false;
    public useAsSelect: boolean = false;
    public isSearching: boolean = false;
    public isError: boolean = false;
    public refreshText = DEFAULT_TEXTS.refreshText;
    public isShowRefreshOption: boolean = false;
    private _isCancelHandler = {
        focus: false,
        blur: false
    };
    public loader = {
        isShow: false,
        startTime: 0
    };

    constructor() {}

    @Input() filterItems: Function;
    @Input() value: AutocompleteOption = null;
    @Output() valueChange: EventEmitter<AutocompleteOption> = new EventEmitter<AutocompleteOption>();

    @Input()
    set options(options: AutocompleteOption[]) {
        this.initItems(options);
    };

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
            this.searchString = this.value.value;
        }

        if (this.filterItems) {
            this.filterItems('').subscribe(data => {
                this.initItems(data);
            });
        }
    }

    public initItems(items: AutocompleteOption[]) {
        this.itemsList.items = items;

        this.useAsSelect = this.itemsList.useAsSelect;
        this.placeholder = this.useAsSelect ? DEFAULT_TEXTS.placeholderSelect : DEFAULT_TEXTS.placeholder;
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

            this.isSearching = false;
            this.isShowRefreshOption = false;

            if (this.searchString && (!this.value || this.value.value !== this.searchString)) {
                this._trySetValueFromList();
            } else if (!this.searchString && this.value) {
                this._resetValue();
            }

            if (this.useAsSelect) {
                this.itemsList.filteredItems = this.itemsList.items;
            }

            this.close();
        }, 200);
    }

    public onClickItem(item: AutocompleteOption) {
        this._isCancelHandler.blur = true;
        this._isCancelHandler.focus = true;
        this.selectItem(item);
        this.focusInput();
    }

    public onClickArrow() {
        this._isCancelHandler.blur = true;
        this.focusInput();
    }

    public onInputFocus() {
        if (this._isCancelHandler.focus) {
            this._isCancelHandler.focus = false;
            return;
        }

        this.isError = false;
        this.selectInputText();
        this._openListLikeSelect();
    }

    public refresh() {
        this._isCancelHandler.blur = true;
        this._isCancelHandler.focus = true;
        this.isShowRefreshOption = false;
        this._searchStart();
    }

    private _searchStart() {
        const inputValue = this.searchString;
        this.isSearching = true;
        this.isError = false;
        this.isShowRefreshOption = false;

        if (this.itemsList.displayedItems.length === 0) {
            this.close();
        }

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
            this.itemsList.hoverFirst();

            this.isSearching = false;
            this._hideLoader();

            this.open();
        });
    }

    private _searchError() {
        this._callAfterLoader(() => {
            this.isSearching = false;
            this.isShowRefreshOption = true;
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

    private _openListLikeSelect() {
        if (this.itemsList.displayedItems.length > 0 && this.useAsSelect) {
            if (this.value) {
                this.itemsList.hoveredIndex = this.itemsList.displayedItems.findIndex(item => item.id === this.value.id);
            }
            this.open();
        }
    }

    public focusInput() {
        this.autocompleteInputElRef.nativeElement.focus();
    }

    public selectInputText() {
        this.autocompleteInputElRef.nativeElement.select();
    }

    public selectItem(selectedItem: AutocompleteOption) {
        if (!selectedItem) {
            return;
        }

        this.value = selectedItem;
        this.valueChange.emit(this.value);
        this.searchString = selectedItem.value;
        this.close();
    }

    private _showLoader() {
        setTimeout(() => {
            if (this.isSearching) {
                this.loader.isShow = true;
                this.loader.startTime = new Date().getTime();
            }
        }, 500);
    }

    private _hideLoader() {
        this.loader.isShow = false;
        this.loader.startTime = 0;
    }

    private _resetValue() {
        this.value = null;
        this.valueChange.emit(this.value);
    }

    private _trySetValueFromList() {
        if (!this.searchString) {
            return;
        }
        const searchString = this.searchString.toLowerCase();
        const newValue = this.itemsList.displayedItems.find(item => item.value.toLowerCase() === searchString);

        if (this.itemsList.displayedItems.length === 1 && newValue) {
            this.selectItem(newValue);
        } else {
            this._resetValue();
            this.isError = true;
        }
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
