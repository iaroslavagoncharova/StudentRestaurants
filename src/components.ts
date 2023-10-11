import {weeklyMenu, Menu} from '../src/interfaces/Menu';
import {Restaurant} from '../src/interfaces/Restaurant';

const restaurantRow = (restaurant: Restaurant) => {
  const {name, address, company} = restaurant;
  const tr = document.createElement('tr');
  const nameCell = document.createElement('td');
  nameCell.innerText = name;
  const addressCell = document.createElement('td');
  addressCell.innerText = address;
  const companyCell = document.createElement('td');
  companyCell.innerText = company;
  tr.appendChild(nameCell);
  tr.appendChild(addressCell);
  tr.appendChild(companyCell);
  return tr;
};

const weekModal = (weeklymenu: weeklyMenu) => {
  let html = `
  <h2>Week menu</h2> <p>Click anywhere to go back</p>`;
      weeklymenu.days.forEach((menu) => {
      const {date} = menu;
      html += `<div>
      <table>
      <h3>${date}</h3>
      <tr>
          <th id="course_label">Course</th>
          <th id="diet_label">Diet</th>
          <th id="price_label">Price</th>`;
      menu.courses.forEach((course) => {
        const {name, diets, price} = course;
        html += ` <table>
        </tr>
              <tr>
                <td id="menu_name">${name}</td>
                <td id="diet_info">${diets ?? ' - '}</td>
                <td id="price">${price ?? ' - '}</td>
              </tr>
              `;})
        })
        html += `</table></div>`
        return html;
  };


const dayModal = (menu: Menu) => {
  let html =`
  <h2>Day Menu</h2> <p>Click anywhere to go back</p>
  <table>
      <tr>
        <th>Course</th>
        <th>Diet</th>
        <th>Price</th>
      </tr>`
  menu.courses.forEach((course) => {
    const {name, diets, price} = course;
   html += `
          <tr>
            <td>${name}</td>
            <td>${diets ?? ' - '}</td>
            <td>${price ?? ' - '}</td>
          </tr>
          `;
  });
  html += '</table></div>';
  return html;
};

const restaurantModal = (restaurant: Restaurant) => {
  const {name, address, city, postalCode, phone, company} = restaurant;
  let html = `
  <i class="fa-solid fa-circle-xmark fa-2xl" id="close"></i>
  <h3>${name}</h3>
    <p>${company}</p>
    <p>${address} ${postalCode} ${city}</p>
    <p>${phone}</p>
    `;
    html += `<button id="weekInfo">Open week menu</button>
  <button id="dayInfo">Open day menu</button>`
    return html
}

const errorModal = (message: string) => {
  const html = `
        <h3>Error</h3>
        <p>${message}</p>
        `;
  return html;
};

export {restaurantRow, weekModal, errorModal, dayModal, restaurantModal};
