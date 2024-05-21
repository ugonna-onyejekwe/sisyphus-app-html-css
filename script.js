// Getting form data from the DOM
const login_btn = document.querySelector(".login_btn");
const email_input_field = document.querySelector(".email_input");
const error_msg = document.querySelector(".err_msg");

// Getting user profile from the DOM
const github_link = document.querySelector(".github_url");
const user_name = document.querySelector(".user_name");
const user_image = document.querySelector(".profile_image");

// Get navbar element from the dom
const close_btn = document.querySelector(".close");
const menu_btn = document.querySelector(".open");
const nav_con = document.querySelector(".navigators_container");
const overlay = document.querySelector(".overlay");

// Get price, Amount & total fields element form the dom
const price_input_field = document.querySelector(".price");
const amount_input_field = document.querySelector(".amount");
const total_con = document.querySelector("#total_con");

// check if user is logged in else redirect
if (window.location.pathname.includes("/home.html")) {
  const isloggedin = JSON.parse(localStorage.getItem("user"));
  isloggedin ? null : window.location.replace("./index.html");
}

// set user infomation after home page is loaded
(function () {
  const data = JSON.parse(localStorage.getItem("user"));
  if (github_link && user_name && user_image) {
    const newname =
      data.name.length > 15 ? data.name.slice(0, 15) + "..." : data.name;
    user_name.textContent = newname;
    user_image.src = data.photo_url;
    if (
      data.github_url === null ||
      data.github_url === undefined ||
      data.github_url === ""
    ) {
      github_link.style.display = "none";
    } else {
      github_link.href = data.github_url;
    }
  }
})();

// store user information in local storage
const set_user_info = (data) => {
  const github_url = data?.accounts?.find((i) =>
    i.domain.includes("github.com")
  );

  console.log("git", github_url?.url);

  const userData = {
    name: data.displayName,
    photo_url: data.photos[0].value,
    github_url: github_url?.url,
  };

  // stringify data
  const stringifydata = JSON.stringify(userData);
  // storing to local storage
  localStorage.setItem("user", stringifydata);

  // redirect user after auth
  window.location.replace("/home.html");
};

// Onclick btn function : to authenticate user
login_btn?.addEventListener("click", async () => {
  const email = email_input_field.value;

  if (email === "") {
    // check if input is empty
    error_msg.textContent = "Email required";
  } else if (email.includes("@") === false) {
    // verify if input has a valid email
    error_msg.textContent = "Email must containe '@'";
  } else {
    error_msg.textContent = "";
    const trimed_email = email.trim().toLowerCase();
    const hash = CryptoJS.SHA256(trimed_email);
    const gravatar_id = hash.toString();

    // fetching user data from gravater
    await fetch(`https://gravatar.com/${gravatar_id}.json`)
      .then((response) => {
        if (!response.ok) {
          return (error_msg.textContent = "User not found");
        }
        return response.json();
      })
      .then((response) => {
        console.log(response.entry[0]);
        set_user_info(response.entry[0]);
      })
      .catch((err) => {
        return console.log(err);
      });
  }
});

// function to close nav bar
const close_nav = () => {
  nav_con.classList.remove("active");
  overlay.classList.remove("active");
};

// open nav bar
menu_btn?.addEventListener("click", () => {
  nav_con.classList.add("active");
  overlay.classList.add("active");
});

// close navbar
close_btn?.addEventListener("click", close_nav);
overlay?.addEventListener("click", close_nav);

// Updating total to buy coin
const updateTotal = () => {
  if (price_input_field.value === "") {
    total_con.textContent = "0.00";
  } else if (amount_input_field.value === "") {
    total_con.textContent = price_input_field.value;
  } else {
    const amount = amount_input_field.value;
    const price = price_input_field.value;
    const total = parseInt(amount) * parseInt(price);
    total_con.textContent = total;
  }
};

price_input_field?.addEventListener("keyup", updateTotal);
amount_input_field?.addEventListener("keyup", updateTotal);
