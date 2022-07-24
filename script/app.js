const validMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const itemsToBuy = [
  ["Shoe", 50.99],
  ["Sandals", 24.99],
  ["Socks", 0.99],
  ["Pants", 15.89],
  ["Woolen Scard", 5],
];

var userName, userEmail, creditCardNo, total, donation, grandTotal;
var minDonation = 10;

function agreementSubmit() {
  var termCheck = document.getElementById('termsFlag');
  if (termCheck.checked) {
    createItemList();
    document.querySelectorAll('.itemQuantity').forEach(item => {
      item.addEventListener('change', (e) => {
        calculatePrices();
      })
    })
    window.location.href = "#purchase";
    document.querySelector('#purchase').setAttribute('class', 'subdiv')
  } else {
    alert('Please acknowledge the agreement to continue...');
  }

  return false;
}

function calculatePrices() {

  total = 0;
  document.querySelectorAll('.itemQuantity').forEach(item => {
    var itemNo = parseInt(item.name) - 1;
    var itemQty = parseInt(item.value);

    if (itemQty > 0) {
      total += itemsToBuy[itemNo][1] * itemQty;
    }

  })

  donation = total * 0.1
  donation = (donation < minDonation) ? minDonation : donation;

  console.log("Total" + total);
  console.log("Donation" + donation);
  document.querySelector('#totalPrice').innerHTML = `$${total.toFixed(2)}`;
  document.querySelector('#donation').innerHTML = `$${donation.toFixed(2)}`;
}

function createItemList() {
  var i = 0;
  itemsToBuy.forEach((item) => {
    i++;
    createItem(item, i);
  });
}

function createItem(item, itemNo) {

  var table = document.querySelector("#itemList");
  var itemRow = table.insertRow(itemNo);
  itemRow.setAttribute('class', 'itemsToBuy');
  itemRow.setAttribute('id', `row-${itemNo}`);

  var itemNumber = document.createElement("td");
  itemNumber.innerHTML = itemNo;
  itemNumber.setAttribute("class", "itemNumber");

  var itemName = document.createElement("td");
  itemName.innerHTML = item[0];
  itemName.setAttribute("class", "itemName");

  var itemPrice = document.createElement("td");
  itemPrice.innerHTML = `$${item[1].toFixed(2)}`;
  itemPrice.setAttribute("class", "itemPrice");

  var itemQty = document.createElement("td");
  itemQty.setAttribute("class", "itemQty");
  itemQty.setAttribute("id", `item${itemNo}`);

  var itemQuantity = document.createElement("input");
  itemQuantity.setAttribute('type', 'text');
  itemQuantity.setAttribute('class', 'itemQuantity');
  itemQuantity.setAttribute('size', '4');
  itemQuantity.setAttribute('name', `${itemNo}`);
  itemQty.appendChild(itemQuantity);

  var itemError = document.createElement('td');
  itemError.setAttribute('id', `error-${itemNo}`)

  itemRow.appendChild(itemNumber);
  itemRow.appendChild(itemName);
  itemRow.appendChild(itemPrice);
  itemRow.appendChild(itemQty);
  itemRow.appendChild(itemError);
}

function validateItems() {
  var totalQty = 0
  var errorFlag = false;
  document.querySelectorAll('.itemQuantity').forEach(item => {

    var itemQty = parseInt(item.value);
    if (itemQty >= 0 || item.value == "") {
      document.getElementById(`error-${item.name}`).innerHTML = "";
      document.getElementById(`error-${item.name}`).removeAttribute('class');
    } else {
      document.getElementById(`error-${item.name}`).innerHTML = "Please enter a valid number or leave as blank if not required";
      document.getElementById(`error-${item.name}`).setAttribute('class', 'errorItem');
      errorFlag = true;
    }
    if(itemQty >= 0){
      totalQty += itemQty;
    }
  })
  if (!(totalQty > 0)) {
    document.getElementById(`error-${1}`).innerHTML = "Please add atleast one item to the cart to continue";
    document.getElementById(`error-${1}`).setAttribute('class', 'errorItem');
    errorFlag = true;
  }
  if (!errorFlag) {
    window.location.href = "#info";
    document.querySelector('#info').setAttribute('class', 'subdiv')
  }
  return false
}



function verifyUserInfo() {
  document.getElementById('formErrors').innerHTML = "";
  userName = document.getElementById('userName').value;
  userEmail = document.getElementById('userEmail').value;
  creditCardNo = document.getElementById('cardNo').value;
  var expiryMonth = document.getElementById('cardXpM').value;
  var expiryYear = document.getElementById('cardXpY').value;

  var errorText = "";

  var cardRegEx = /^[\d]{4}[\-][\d]{4}[\-][\d]{4}[\-][\d]{4}$/;
  var expMonthRegEx = /^[A-Z]{3}$/;
  var expYearRegEx = /^[\d]{4}$/;

  if (!cardRegEx.test(creditCardNo)) {
    errorText = "Enter a valid credit card number<br>";
  }

  if (!(expMonthRegEx.test(expiryMonth) && validMonths.indexOf(expiryMonth) > 0)) {
    errorText += "Enter a valid Expiry Month<br>";
  }

  if (!(expYearRegEx.test(expiryYear) && (expiryYear >= 2022))) {
    errorText += "Enter a valid Expiry Year<br>";
  }

  if (errorText > "") {
    document.getElementById('formErrors').innerHTML = errorText;
    document.getElementById('formInputError').style.display = 'block';
  } else {
    document.getElementById('formInputError').style.display = '';
  }

  if (errorText == "") {
    generateReceipt();
    window.location.href = '#receipt';
    document.querySelector('#receipt').setAttribute('class', 'subdiv')
  } else {
    window.location.href = '#formInputError';
    document.querySelector('#formInputError').setAttribute('class', 'hide-div')
  }

  return false;


}

function generateReceipt() {

  var today = new Date();
  var date = today.toISOString().slice(0, 10);

  // Populate the headings...
  document.getElementById('custName').innerHTML += userName;
  document.getElementById('currDate').innerHTML += date;
  document.getElementById('custEmail').innerHTML += userEmail;
  document.getElementById('custCard').innerHTML += 'XXXX-XXXX-XXXX-' + creditCardNo.substr(-4);

  // create the items grid.
  var table = document.getElementById('finalReceipt');
  var i = 0;
  document.querySelectorAll('.itemQuantity').forEach(item => {
    if (parseInt(item.value) > 0) {
      i++;
      table.appendChild(addItemRow(item.name, item.value, i));
    }
  })
  if (i > 0) {
    table.appendChild(addReceiptFooter('Total', total));
    table.appendChild(addReceiptFooter('Donation', donation));
    table.appendChild(addReceiptFooter('Grand Total', total + donation));
  }
}

function addItemRow(item, qty, i) {
  var row = document.createElement('tr');
  var sno = document.createElement('td');
  var itemName = document.createElement('td');
  var itemQty = document.createElement('td');
  var itemPrice = document.createElement('td');
  var itemNo = parseInt(item) - 1;

  sno.innerHTML = i;
  itemName.innerHTML = itemsToBuy[itemNo][0]
  itemQty.innerHTML = qty;
  itemPrice.innerHTML = `$${(itemsToBuy[itemNo][1] * parseInt(qty)).toFixed(2)}`;

  row.appendChild(sno);
  row.appendChild(itemName);
  row.appendChild(itemQty);
  row.appendChild(itemPrice);
  console.log(row);

  return row;
}

function addReceiptFooter(head, amount) {
  var row = document.createElement('tr');
  var heading = document.createElement('td');
  var value = document.createElement('td');
  heading.setAttribute('colspan', 3);

  heading.innerHTML = head;
  value.innerHTML = `$${amount.toFixed(2)}`

  row.appendChild(heading);
  row.appendChild(value);
  row.setAttribute('class', 'receiptFooter');

  return row;
}

function reloadPage() {
  window.location.href = '#mainContainer';
  document.querySelectorAll('.subdiv').forEach(div => {
    div.setAttribute('class', 'subdiv hide-div');
  })
  location.reload();

}