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
          <th class="course_label">Course</th>
          <th class="diet_label">Diet</th>
          <th class="price_label">Price</th>`;
      menu.courses.forEach((course) => {
        const {name, diets, price} = course;
        html += ` <table>
        </tr>
              <tr>
                <td class="menu_name">${name}</td>
                <td class="diet_info">${diets ?? ' - '}</td>
                <td class="price">${price ?? ' - '}</td>
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
        <th class="course_label">Course</th>
        <th class="diet_label">Diet</th>
        <th class="price_label">Price</th>
      </tr>`
  menu.courses.forEach((course) => {
    const {name, diets, price} = course;
   html += `
          <tr>
            <td class="menu_name">${name}</td>
            <td class="diet_info">${diets ?? ' - '}</td>
            <td class="price">${price ?? ' - '}</td>
          </tr>
          `;
  });
  html += '</table></div>';
  return html;
};

const restaurantModal = (restaurant: Restaurant) => {
  const {_id, name, address, city, postalCode, phone, company} = restaurant;
  let html = `
  <i class="fa-solid fa-circle-xmark fa-2xl" id="close"></i>
  <i class="fa-regular fa-star fa-2xl"  restaurant-id="${_id}" id="fav-btn" style="color: #643843;"></i>
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
