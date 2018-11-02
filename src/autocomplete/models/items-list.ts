export class ItemsList {
    private _items: string[] = [];
    private _hoveredIndex: number = -1;
    private _filteredItems: string[] = [];

    public displayedItems: string[] = [];

    constructor() {
    }

    set items(data: string[]) {
        this._items = data;
        this.filteredItems = data;
    }

    get items() {
        return this._items;
    }

    set filteredItems(data: string[]) {
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
            this.filteredItems = this._items.filter(item => item.includes(searchData));
        } else {
            this.filteredItems = this._items;
        }
        this.setDisplayedItems();
    }

    setDisplayedItems() {
        const _filteredItems = this.filteredItems;
        const displayedCount = _filteredItems.length > 20 ? 20 : _filteredItems.length;

        this.displayedItems = _filteredItems.slice(0, displayedCount);
    }
}
