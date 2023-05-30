export default class DropdownListBox {
  constructor(name, color) {
    this.label = name;
    this.color = color;
    this.buildListboxWrapper();
    this.buildDropdownHeader();
  }

  buildListboxWrapper = () => {
    this.listboxWrapper = document.createElement('div');
    this.listboxWrapper.className = 'advanced-search__wrapper';
    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.className = 'dropdown-container';
    const listbox = document.createElement('div');
    listbox.className = 'listbox-dropdown';
    dropdownWrapper.appendChild(listbox);
    this.listboxWrapper.appendChild(dropdownWrapper);
  };

  buildDropdownHeader = () => {
    this.dropdownHeader = document.createElement('div');
    this.dropdownHeader.className = 'listbox-dropdown__header';
    this.dropdownHeader.classList.add(`text-bg-${this.color}`);
    this.buildSearchInput();
    this.dropdownHeader.appendChild(this.searchInput);
    this.dropdownHeader.appendChild(DropdownListBox.buildHeaderArrow());
  };

  buildSearchInput = () => {
    this.searchInput = document.createElement('input');
    this.searchInput.className = 'listbox-dropdown__input';
    this.searchInput.classList.add(`text-bg-${this.color}`);
    this.searchInput.value = `${this.name
      .charAt(0)
      .toUpperCase()}${this.name.slice(1)}`;
    this.searchInput.placeholder = `Rechercher un ${this.name.slice(0, -1)}`;
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
