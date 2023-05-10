"use strict";

const BASE_BACKEND_URL = "http://localhost:4000";

const tableBody = document.querySelector(".table__body");
const tableWrapper = document.querySelector(".table__wrapper");
const searchInput = document.querySelector(".search__input");

const fetchData = async (url, options) => {
  const response = await fetch(url, options);
  return response.json();
};

const debounce = (callback, wait = 400) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

const displayTableData = (companies) => {
  clearTableData();

  if (companies.length === 0) {
    const noData = document.createElement("div");
    noData.classList.add("table__empty");
    noData.innerText = "No company found";
    tableWrapper.appendChild(noData);

    return;
  }

  companies.forEach((company) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table__row");

    Object.values(company).forEach((item, index) => {
      const tableData = document.createElement("td");
      tableData.classList.add("table__data");
      tableData.innerText = item;

      if (index === 1) {
        tableData.classList.add("table__data--bold");
      }

      tableRow.appendChild(tableData);
    });

    tableBody.appendChild(tableRow);
  });
};

const clearTableData = () => {
  tableBody.innerHTML = "";

  const skeleton = tableWrapper.querySelector(".skeleton");
  const error = tableWrapper.querySelector(".table__error");
  const empty = tableWrapper.querySelector(".table__empty");

  if (skeleton) {
    tableWrapper.removeChild(skeleton);
  }
  if (error) {
    tableWrapper.removeChild(error);
  }
  if (empty) {
    tableWrapper.removeChild(empty);
  }
};

const tableLoading = () => {
  clearTableData();
  const skeletonLoading = document.createElement("div");
  skeletonLoading.classList.add("skeleton");
  tableWrapper.appendChild(skeletonLoading);
};

const tableError = () => {
  clearTableData();
  const errorText = document.createElement("div");
  errorText.classList.add("table__error");
  errorText.innerText = "There was an error";
  tableWrapper.appendChild(errorText);
};

const displayDefaultCompanies = async () => {
  try {
    tableLoading();

    const companies = await fetchData(`${BASE_BACKEND_URL}/companies`);
    displayTableData(companies.data);
  } catch (error) {
    tableError();
  }
};

const handleSearchQuery = debounce(async (event) => {
  const searchQuery = event.target.value.trim();

  if (!searchQuery) {
    displayDefaultCompanies();

    return;
  }

  try {
    tableLoading();

    const companies = await fetchData(
      `${BASE_BACKEND_URL}/search?name=${searchQuery}`,
      {
        method: "POST",
      }
    );
    displayTableData(companies);
  } catch (error) {
    tableError();
  }
});

searchInput.addEventListener("input", handleSearchQuery);

displayDefaultCompanies();
