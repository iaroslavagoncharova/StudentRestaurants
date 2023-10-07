import {pwaInfo} from 'virtual:pwa-info';
import {fetchData} from './functions';
import {UpdateResult} from './interfaces/UpdateResult';
import {UploadResult} from './interfaces/UploadResult';
import {LoginUser, User, CreateUser, UpdateUser} from './interfaces/User';
import {apiUrl, uploadUrl, restaurantUrl, positionOptions} from './variables';
import {registerSW} from 'virtual:pwa-register';
import { errorModal, restaurantModal, restaurantRow } from './components';
import { Restaurant } from './interfaces/Restaurant';
import { Menu } from './interfaces/Menu';

// PWA code
console.log(pwaInfo)

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('onNeedRefresh');
    const update = confirm('New version available. Update?');
    if (update) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('onOfflineReady');
    alert('App is offline ready');
  },
});

// select forms from the DOM
const loginForm = document.querySelector('#login-form');
const profileForm = document.querySelector('#profile-form');
const avatarForm = document.querySelector('#avatar-form');
const registrationForm = document.querySelector('#create-form');


// select inputs from the DOM
const usernameInput = document.querySelector('#username')as HTMLInputElement | null;
const passwordInput = document.querySelector('#password') as HTMLInputElement | null;

const profileUsernameInput = document.querySelector(
  '#profile-username'
) as HTMLInputElement | null;
const profileEmailInput = document.querySelector(
  '#profile-email'
) as HTMLInputElement | null;

const avatarInput = document.querySelector('#avatar') as HTMLInputElement | null;

// select profile elements from the DOM
const usernameTarget = document.querySelector('#username-target');
const emailTarget = document.querySelector('#email-target');
const avatarTarget = document.querySelector('#avatar-target');

// select registration elements

const createUsername = document.querySelector('#create-username') as HTMLInputElement | null;
const createPassword = document.querySelector('#create-password') as HTMLInputElement | null;
const createEmail = document.querySelector('#create-email') as HTMLInputElement | null;

// function to login
const login = async (user: {
  username: string;
  password: string;
}): Promise<LoginUser> => {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  };
  return await fetchData<LoginUser>(apiUrl + '/auth/login', options);
};

// function to register

const create = async (user: {
  username: string;
  password: string;
  email: string;
}): Promise<CreateUser> => {
  const options: RequestInit = {
    method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify(user)
  };
  return await fetchData<CreateUser>(apiUrl + '/users', options);
}

registrationForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  if (!createUsername || !createEmail || !createPassword) {
    return;
  }

  const newName = createUsername.value;
  const newPassword = createPassword.value;
  const newEmail = createEmail.value;

  const registrationData = {
    username: newName,
    password: newPassword,
    email: newEmail,
  };
const registrationResponse = await create(registrationData);
  alert(registrationResponse.message)
})
// function to upload avatar
const uploadAvatar = async (
  image: File,
  token: string,
) : Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('avatar', image);
  const options: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  };
  return await fetchData(apiUrl + '/users/avatar', options);
};

// function to update user data
const updateUserData = async (
  user: UpdateUser,
  token: string,
): Promise<UpdateResult> => {
  const options: RequestInit = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user)
  }
  return await fetchData<UpdateResult>(apiUrl + '/users', options)
};


// function to add userdata (email, username and avatar image) to the
// Profile DOM and Edit Profile Form
const addUserDataToDom = (user: User): void => {
  if (
    !usernameTarget ||
    !emailTarget ||
    !avatarTarget ||
    !profileEmailInput ||
    !profileUsernameInput
  ) {
    return;
  }
  usernameTarget.innerHTML = user.username;
  emailTarget.innerHTML = user.email;
  (avatarTarget as HTMLImageElement).src = uploadUrl + user.avatar;
  profileEmailInput.value = user.email;
  profileUsernameInput.value = user.username;
};

// function to get userdata from API using token
const getUserData = async (token: string): Promise<User> => {
  const options: RequestInit = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  return await fetchData<User>(apiUrl + '/users/token', options)
};

// function to check local storage for token and if it exists fetch
// userdata with getUserData then update the DOM with addUserDataToDom
const checkToken = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }
  const userData = await getUserData(token);
  addUserDataToDom(userData);
};

// call checkToken on page load to check if token exists and update the DOM
checkToken();

// login form event listener

loginForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  if (!usernameInput || !passwordInput) {
    return;
  }
  const user = {
    username: usernameInput.value,
    password: passwordInput.value,
  };
  const loginData = await login(user);
  console.log(loginData);
  alert(loginData.message);
  localStorage.setItem('token', loginData.token);
  addUserDataToDom(loginData.data);
});

// profile form event listener

profileForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  if (!profileUsernameInput || !profileEmailInput) {
    return;
  }

  const user = {
    username: profileUsernameInput.value,
    email: profileEmailInput.value,
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }
  const profileData = await updateUserData(user, token)
  console.log(profileData);
  checkToken();
  alert(profileData.message)
}
)

// avatar form event listener

avatarForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  if (!avatarInput?.files) {
    return;
 }
  const image = avatarInput.files[0];
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }
  const avatarData = await uploadAvatar(image, token);
  console.log(avatarData);
  checkToken();
  alert(avatarData.message)
}
)


// registration modal
const registrationDialog = document.querySelector("#registration_dialog") as HTMLDialogElement;
const registerBtn = document.getElementById("register") as HTMLButtonElement;
const closeRegistrationBtn = document.getElementById("close_registration") as HTMLButtonElement;


const openRegistration = (e: any) => {
  e.preventDefault();
  registrationDialog.showModal();
};

const closeRegistration = (e: any) => {
  e.preventDefault();
  registrationDialog.close();
};

registerBtn.addEventListener("click", openRegistration);
closeRegistrationBtn.addEventListener("click", closeRegistration);

// login modal
const loginDialog = document.getElementById("login_dialog") as HTMLDialogElement;
const loginBtn = document.getElementById("login") as HTMLButtonElement;
const closeloginBtn = document.getElementById("close_login") as HTMLButtonElement;

const openLogin = (e:any) => {
  e.preventDefault();
  loginDialog.showModal();
};

const closeLogin = (e:any) => {
  e.preventDefault();
  loginDialog.close();
};

loginBtn.addEventListener("click", openLogin);
closeloginBtn.addEventListener("click", closeLogin);

// profile modal (with profile info, update profile and upload avatar)

const profileDialog = document.getElementById("profile_dialog") as HTMLDialogElement;
const openprofileBtn = document.getElementById("profile") as HTMLButtonElement;
const closeprofileBtn = document.getElementById("close_profile") as HTMLButtonElement;


const openProfile = (e:any) => {
 e.preventDefault();
  profileDialog.showModal();
};

const closeProfile = (e:any) => {
  e.preventDefault();
  profileDialog.close();
};

openprofileBtn.addEventListener("click", openProfile);
closeprofileBtn.addEventListener("click", closeProfile);

// creating restaurant table

const modal = document.getElementById('info') as HTMLDialogElement;
if (!modal) {
  throw new Error('Modal not found');
}
modal.addEventListener('click', () => {
  modal.close();
});

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const createTable = (restaurants: Restaurant[]) => {
    const table = document.querySelector('table');
    if (!table) {
      throw new Error('Table not found');
    }
    table.innerHTML = '';
    restaurants.forEach((restaurant) => {
      const tr = restaurantRow(restaurant);
      table.appendChild(tr);
      tr.addEventListener('click', async () => {
        try {
          // remove all highlights
          const allHighs = document.querySelectorAll('.highlight');
          allHighs.forEach((high) => {
            high.classList.remove('highlight');
          });
          // add highlight
          tr.classList.add('highlight');
          // add restaurant data to modal
          modal.innerHTML = '';

          // fetch menu
          const menu = await fetchData<Menu>(
            apiUrl + `/restaurants/daily/${restaurant._id}/en`
          );
          console.log(menu);

          const menuHtml = restaurantModal(restaurant, menu);
          modal.insertAdjacentHTML('beforeend', menuHtml);

          modal.showModal();
        } catch (error) {
          modal.innerHTML = errorModal((error as Error).message);
          modal.showModal();
        }
      });
    });
  };

  const error = (err: GeolocationPositionError) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  const success = async (pos: GeolocationPosition) => {
    try {
      const crd = pos.coords;
      const restaurants = await fetchData<Restaurant[]>(apiUrl + '/restaurants');
      console.log(restaurants);
      restaurants.sort((a, b) => {
        const x1 = crd.latitude;
        const y1 = crd.longitude;
        const x2a = a.location.coordinates[1];
        const y2a = a.location.coordinates[0];
        const distanceA = calculateDistance(x1, y1, x2a, y2a);
        const x2b = b.location.coordinates[1];
        const y2b = b.location.coordinates[0];
        const distanceB = calculateDistance(x1, y1, x2b, y2b);
        return distanceA - distanceB;
      });
      createTable(restaurants);


      // filtering by company
      const sodexoBtn = document.querySelector('#sodexo');
      const compassBtn = document.querySelector('#compass');
      const resetBtn = document.querySelector('#reset');


      if (!sodexoBtn || !compassBtn || !resetBtn) {
        throw new Error('Button not found');
      }
      sodexoBtn.addEventListener('click', () => {
        const sodexoRestaurants = restaurants.filter(
          (restaurant) => restaurant.company === 'Sodexo'
        );
        console.log(sodexoRestaurants);
        createTable(sodexoRestaurants);
      });

      compassBtn.addEventListener('click', () => {
        const compassRestaurants = restaurants.filter(
          (restaurant) => restaurant.company === 'Compass Group'
        );
        console.log(compassRestaurants);
        createTable(compassRestaurants);
      });

      resetBtn.addEventListener('click', () => {
        createTable(restaurants);
      });

  const cityButtons = document.querySelectorAll('#cities button');

  cityButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const city = button.id;
      const filteredRestaurants = restaurants.filter(
        (restaurant) => restaurant.city === city
      );
      console.log(filteredRestaurants)
      createTable(filteredRestaurants);
    });
  });

    } catch (error) {
      modal.innerHTML = errorModal((error as Error).message);
      modal.showModal();
    }
  };

  navigator.geolocation.getCurrentPosition(success, error, positionOptions);

