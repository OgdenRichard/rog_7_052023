export default class DropdownListBox {
  constructor(name, color) {
    this.label = name;
    this.color = color;
    this.listboxWrapper = this.buildListboxWrapper();
    this.searchInput = this.buildSearchInput();
    this.buildDropdownHeader();
  }

  buildDropdownHeader = () => {
    const dropdownHeader = document.createElement('div');
    dropdownHeader.className = 'listbox-dropdown__header';
    dropdownHeader.classList.add(`text-bg-${this.color}`);
    this.buildSearchInput();
    dropdownHeader.appendChild(this.searchInput);
    dropdownHeader.appendChild(this.buildHeaderArrow());
  };

  buildSearchInput = () => {
    const searchInput = document.createElement('input');
    searchInput.className = 'listbox-dropdown__input';
    searchInput.classList.add(`text-bg-${this.color}`);
    searchInput.value = `${this.name.charAt(0).toUpperCase()}${this.name.slice(
      1
    )}`;
    searchInput.placeholder = `Rechercher un ${this.name.slice(0, -1)}`;
    return searchInput;
  };

  static buildListboxWrapper = () => {
    const listboxWrapper = document.createElement('div');
    listboxWrapper.className = 'advanced-search__wrapper';
    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.className = 'dropdown-container';
    const listbox = document.createElement('div');
    listbox.className = 'listbox-dropdown';
    dropdownWrapper.appendChild(listbox);
    listboxWrapper.appendChild(dropdownWrapper);
    return listboxWrapper;
  };

  static buildHeaderArrow = () => {
    const arrowContainer = document.createElement('div');
    arrowContainer.className = 'arrow-container';
    arrowContainer.tabIndex = '0';
    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.tabIndex = '0';
    arrowContainer.appendChild(arrow);
    return arrowContainer;
  };
}
