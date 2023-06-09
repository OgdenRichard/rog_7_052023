export default class DropdownListBox {
  /**
   * @constructor
   * @param {Array} data
   * @param {String} name
   * @param {String} color
   */
  constructor(data, name, color, id) {
    this.data = data;
    this.name = name;
    this.color = color;
    this.id = id;
    this.searchWrapper = document.getElementById('advanced-search');
    this.listbox = DropdownListBox.buildListBox();
    this.listboxWrapper = this.buildListboxWrapper();
    this.searchInput = this.buildSearchInput();
    this.list = this.buildList();
    this.render();
  }

  /**
   * Render dropdown in DOM
   * @returns {void}
   */
  render = () => {
    this.listbox.appendChild(this.buildDropdownHeader());
    this.listbox.appendChild(this.list);
    this.populateList();
    this.searchWrapper.appendChild(this.listboxWrapper);
  };

  /**
   * Set listbox header with arrow
   * @returns {HTMLElement}
   */
  buildDropdownHeader = () => {
    const dropdownHeader = document.createElement('div');
    dropdownHeader.className = 'listbox-dropdown__header';
    dropdownHeader.classList.add(`text-bg-${this.color}`);
    this.buildSearchInput();
    dropdownHeader.appendChild(this.searchInput);
    dropdownHeader.appendChild(DropdownListBox.buildHeaderArrow());
    return dropdownHeader;
  };

  /**
   * Set search input for dropdown
   * @returns {HTMLElement}
   */
  buildSearchInput = () => {
    const searchInput = document.createElement('input');
    searchInput.className = 'listbox-dropdown__input';
    searchInput.classList.add(`text-bg-${this.color}`);
    searchInput.value = this.setInputValue();
    searchInput.placeholder = `Rechercher un ${this.name.slice(0, -1)}`;
    return searchInput;
  };

  /**
   * Inject data in list elements
   * @returns {void}
   */
  populateList = () => {
    if (this.data.length) {
      this.data.forEach((element) => {
        this.list.appendChild(this.setListElement(element));
      });
    }
  };

  /**
   * Set list
   * @returns {HTMLElement}
   */
  buildList = () => {
    const list = document.createElement('ul');
    list.id = `${this.id}-list`;
    list.classList.add('listbox-dropdown__list');
    list.classList.add(`text-bg-${this.color}`);
    return list;
  };

  /**
   * Set list element populated with data
   * @returns {HTMLElement}
   */
  setListElement = (element) => {
    const listElement = document.createElement('li');
    listElement.id = `${this.name}-${element.id}`;
    listElement.classList.add('listbox-dropdown__option');
    listElement.tabIndex = '0';
    listElement.innerText = element.name;
    return listElement;
  };

  /**
   * Set wrappers for dropdown
   * @returns {HTMLElement}
   */
  buildListboxWrapper = () => {
    const listboxWrapper = document.createElement('div');
    listboxWrapper.className = 'advanced-search__wrapper';
    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.className = 'dropdown-container';
    dropdownWrapper.appendChild(this.listbox);
    listboxWrapper.appendChild(dropdownWrapper);
    return listboxWrapper;
  };

  /**
   * Set first letter to upper case
   * @returns {String}
   */
  setInputValue = () =>
    `${this.name.charAt(0).toUpperCase()}${this.name.slice(1)}`;

  /**
   * Set listbox element
   * @returns {HTMLElement}
   */
  static buildListBox = () => {
    const listbox = document.createElement('div');
    listbox.className = 'listbox-dropdown';
    return listbox;
  };

  /**
   * Set arrow for listbox header
   * @returns {HTMLElement}
   */
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
