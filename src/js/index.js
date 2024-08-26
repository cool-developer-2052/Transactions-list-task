const actionBtn = document.querySelector(".transactions__action-btn");
const headerGroup = document.querySelector(".header__group");
const transactionsHeader = document.querySelector(".transactions__header");
const transactionsContent = document.querySelector(".transactions__content");

// Events
actionBtn.addEventListener("click", getAllTransactions);

let toggler = true;
let id;

// APIs
// Get all transactions from API :
let transactions = [];
async function getAllTransactions() {
  try {
    const { data } = await axios.get("http://localhost:3000/transactions");
    transactions = data;
    sortBasedOnDate();
    transactionsView();
  } catch (error) {
    console.log(error.message);
  }
}
// Get all transactions based on search id :
async function filteredTransactions(id) {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/transactions?refId_like=${id}`
    );
    if (data.length > 0) {
      transactions = data;
      transactionItems();
    }
  } catch (error) {
    console.log(error.message);
  }
}
// Get all transactions based on search id and sort price :
async function sortBasedOnPriceTransactions({ id = "", sortPrice }) {
  try {
    const { data } = await axios.get(
      ` http://localhost:3000/transactions?refId_like=${id}&_sort=price&_order=${sortPrice}`
    );
    if (data.length > 0) {
      transactions = data;
      transactionItems();
    }
  } catch (error) {
    console.log(error.message);
  }
}

// View
function transactionsView() {
  transactionsSearchInput();
  transactionsUpdate();
  transactionsInfo();
  transactionItems();
  actionBtn.style.display = "none";
}
function transactionsUpdate() {
  const updateBtn = document.createElement("button");
  updateBtn.classList.add("transactions__update", "btn", "btn--secondary");
  updateBtn.innerText = "بروزرسانی تراکنش ها";

  headerGroup.appendChild(updateBtn);

  // Refresh the page
  updateBtn.addEventListener("click", () => location.reload());
}
function transactionsSearchInput() {
  const transactionsSearchInput = document.createElement("div");
  transactionsSearchInput.classList.add("transactions__search-container");
  transactionsSearchInput.innerHTML = `
        <input
            class="search__input"
            type="search"
            placeholder="جستجوی تراکنش ..." />
        <span class="search__icon">
            <svg class="icon">
              <use xlink:href="/assets/icons/icons.svg#ic-search"></use>
            </svg>
        </span>`;
  transactionsHeader.appendChild(transactionsSearchInput);

  transactionsSearchInput.addEventListener("input", e => {
    const inputValue = e.target.value;
    if (isNaN(inputValue)) console.log("Please enter numbers");
    filteredTransactions(inputValue);
    id = inputValue;
  });
}
function transactionsInfo() {
  const transactionsInfo = document.createElement("div");
  transactionsInfo.classList.add("transactions__info");
  transactionsInfo.innerHTML = `
    <h3 class="info__title">لیست تراکنش های شما</h3>
      <div class="info__table-container">
        <table class="info__table">
          <thead>
            <tr>
              <th>ردیف</th>
              <th>نوع تراکنش</th>
              <th class="info__price">
                <span>مبلغ</span>
                <span>
                  <svg class="icon">
                  <use
                      xlink:href="/assets/icons/icons.svg#ic-chevron"></use>
                  </svg>
                </span>
              </th>
              <th>شماره پیگیری</th>
              <th class="info__date">
                <span>تاریخ تراکنش</span>
                <span>
                  <svg class="icon">
                  <use
                      xlink:href="/assets/icons/icons.svg#ic-chevron"></use>
                  </svg>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>`;
  transactionsContent.appendChild(transactionsInfo);

  const transactionsDate = document.querySelector(".info__date");
  transactionsDate.style.cursor = "pointer";
  transactionsDate.addEventListener("click", () => {
    const icon = document.querySelector(".info__date .icon");
    activeIcon(icon);

    toggler = !toggler;
    sortBasedOnDate();
    transactionItems();
  });

  const transactionsPrice = document.querySelector(".info__price");
  transactionsPrice.style.cursor = "pointer";
  transactionsPrice.addEventListener("click", () => {
    const icon = document.querySelector(".info__price .icon");
    activeIcon(icon);

    toggler = !toggler;
    sortBasedOnPrice();
  });
}
function transactionItems() {
  const tbody = document.querySelector(".info__table tbody");
  tbody.innerHTML = "";
  transactions.forEach((item, index) => {
    tbody.innerHTML += `
          <tr>
            <td>${index + 1}</td>
            <td class="status ${
              item.type.includes("برداشت از حساب")
                ? "status--red"
                : "status--success"
            }">${item.type}</td>
            <td class="price">${item.price}</td>
            <td>${item.refId}</td>
            <td>
            ${new Date(item.date).toLocaleDateString("fa-IR")}
            ساعت
            ${new Date(item.date).toLocaleTimeString("fa-IR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
            </td>
          </tr>`;
  });
}

// Sort based on Date and Sort based on price :
function sortBasedOnDate() {
  if (toggler === true) sortBasedOnLatest();
  if (toggler === false) sortBasedOnEarliest();
}
function sortBasedOnLatest() {
  transactions.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
}
function sortBasedOnEarliest() {
  transactions.sort((a, b) => (new Date(a.date) < new Date(b.date) ? -1 : 1));
}
function sortBasedOnPrice() {
  if (toggler == true) sortBasedOnPriceTransactions({ id, sortPrice: "asc" });
  if (toggler == false) sortBasedOnPriceTransactions({ id, sortPrice: "desc" });
}

function activeIcon(icon) {
  if (icon.classList.contains("active")) {
    icon.classList.remove("active");
  } else {
    icon.classList.add("active");
  }
}
