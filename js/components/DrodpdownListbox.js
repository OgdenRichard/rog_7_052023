export default class DropdownListBox {
  constructor(data, name, color) {
    this.data = data;
    this.name = name;
    this.color = color;
    this.searchWrapper = document.getElementById('advanced-search');
    this.listbox = DropdownListBox.buildListBox();
    this.listboxWrapper = this.buildListboxWrapper();
    this.searchInput = this.buildSearchInput();
    this.list = this.buildList();
    this.render();
  }

  render = () => {
    this.listbox.appendChild(this.buildDropdownHeader());
    this.listbox.appendChild(this.list);
    this.populateList();
    this.searchWrapper.appendChild(this.listboxWrapper);
  };

  buildDropdownHeader = () => {
    const dropdownHeader = document.createElement('div');
    dropdownHeader.className = 'listbox-dropdown__header';
    dropdownHeader.classList.add(`text-bg-${this.color}`);
    this.buildSearchInput();
    dropdownHeader.appendChild(this.searchInput);
    dropdownHeader.appendChild(DropdownListBox.buildHeaderArrow());
    return dropdownHeader;
  };

  buildSearchInput = () => {
    const searchInput = document.createElement('input');
    searchInput.className = 'listbox-dropdown__input';
    searchInput.classList.add(`text-bg-${this.color}`);
    searchInput.value = this.setInputValue();
    searchInput.placeholder = `Rechercher un ${this.name.slice(0, -1)}`;
    return searchInput;
  };

  populateList = () => {
    if (this.data.length) {
      this.data.forEach((element) => {
        this.list.appendChild(DropdownListBox.setListElement(element));
      });
    }
  };

  buildList = () => {
    const list = document.createElement('ul');
    list.classList.add('listbox-dropdown__list');
    list.classList.add(`text-bg-${this.color}`);
    return list;
  };

  // TODO : not static en fornction d'un array d'objets
  // TODO : set id from object
  static setListElement = (element) => {
    const listElement = document.createElement('li');
    // listElement.id = `${this.name}-${element.id}`;
    listElement.classList.add('listbox-dropdown__option');
    listElement.tabIndex = '0';
    listElement.innerText = element;
    return listElement;
  };

  buildListboxWrapper = () => {
    const listboxWrapper = document.createElement('div');
    listboxWrapper.className = 'advanced-search__wrapper';
    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.className = 'dropdown-container';
    dropdownWrapper.appendChild(this.listbox);
    listboxWrapper.appendChild(dropdownWrapper);
    return listboxWrapper;
  };

  setInputValue = () =>
    `${this.name.charAt(0).toUpperCase()}${this.name.slice(1)}`;

  static buildListBox = () => {
    const listbox = document.createElement('div');
    listbox.className = 'listbox-dropdown';
    return listbox;
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
