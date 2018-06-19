import {AutocompleteOption} from './option';

export class ItemsList {
    private _items: AutocompleteOption[] = [];
    private _hoveredIndex: number = -1;
    private _filteredItems: AutocompleteOption[] = [];

    public displayedItems: AutocompleteOption[] = [];
    public useAsSelect: boolean = false;

    constructor() {
    }

    set items(data: AutocompleteOption[]) {
        this._items = data;
        this.useAsSelect = data.length <= 50;
        this.filteredItems = data;
    }

    get items() {
        return this._items;
    }

    set filteredItems(data: AutocompleteOption[]) {
        this._filteredItems = data || [];
        this.setDisplayedItems();
        this.hoverFirst();
    }

    get filteredItems() {
        return this._filteredItems || [];
    }

    set hoveredIndex(newHoveredIndex: number) {
        this._hoveredIndex = newHoveredIndex;
    }

    get hoveredIndex() {
        return this._hoveredIndex;
    }

    get hoveredItem() {
        return this.filteredItems[this._hoveredIndex];
    }

    hoverNextItem() {
        if (this._hoveredIndex + 1 <= this.displayedItems.length - 1) {
            this._hoveredIndex++;
        }
    }

    hoverPrevItem() {
        if (this._hoveredIndex - 1 >= 0) {
            this._hoveredIndex--;
        }
    }

    hoverFirst() {
        this._hoveredIndex = 0;
    }

    filter(filterString: string = '') {
        const searchData = filterString.toLowerCase();
        if (searchData) {
            this.filteredItems = this._items.filter(item => item.id === searchData || item.value.toLowerCase().indexOf(searchData) > -1);
        } else {
            this.filteredItems = this._items;
        }
        this.setDisplayedItems();
    }

    setDisplayedItems() {
        if (this.useAsSelect) {
            this.displayedItems = this.filteredItems;
            return;
        }
        const _filteredItems = this.filteredItems;
        let displayedCount = _filteredItems.length > 20 ? 20 : _filteredItems.length;

        this.displayedItems = _filteredItems.slice(0, displayedCount);
    }
}
